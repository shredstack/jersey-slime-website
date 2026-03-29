import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getStudioContactEmail } from '@/lib/email'
import { getAvailableSlots } from '@/lib/availability'
import { formatTime } from '@/lib/utils'

const cancelSchema = z.object({
  action: z.literal('cancel'),
})

const updateSchema = z.object({
  action: z.literal('update'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  start_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  guest_count: z.number().int().min(1, 'At least 1 guest is required').optional(),
  notes: z.string().optional(),
})

const requestSchema = z.discriminatedUnion('action', [cancelSchema, updateSchema])

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = requestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Fetch the existing booking and verify ownership
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'This booking is already cancelled' },
        { status: 400 }
      )
    }

    // Don't allow changes to past bookings
    if (booking.booking_date) {
      const today = new Date().toISOString().split('T')[0]
      if (booking.booking_date < today) {
        return NextResponse.json(
          { error: 'Cannot modify a past booking' },
          { status: 400 }
        )
      }
    }

    const service = createServiceClient()
    const data = parsed.data

    if (data.action === 'cancel') {
      const { error: updateError } = await service
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id)

      if (updateError) {
        console.error('Cancel booking error:', updateError)
        return NextResponse.json(
          { error: 'Failed to cancel booking' },
          { status: 500 }
        )
      }

      // Send cancellation confirmation email
      try {
        const { data: customerProfile } = await service
          .from('profiles')
          .select('email, full_name')
          .eq('id', user.id)
          .single()

        let experienceName = 'Slime Experience'
        if (booking.experience_id) {
          const { data: experience } = await service
            .from('experiences')
            .select('title')
            .eq('id', booking.experience_id)
            .single()
          if (experience) experienceName = experience.title
        }

        if (customerProfile?.email) {
          const resend = new Resend(process.env.RESEND_API_KEY)
          const { error: emailError } = await resend.emails.send({
            from: 'Jersey Slime Studio <noreply@jerseyslimestudio.com>',
            to: [customerProfile.email],
            replyTo: await getStudioContactEmail(),
            subject: 'Your Booking Has Been Cancelled — Jersey Slime Studio',
            text: [
              `Hi ${customerProfile.full_name},`,
              '',
              'Your booking has been cancelled as requested.',
              '',
              `Experience: ${experienceName}`,
              ...(booking.booking_date
                ? [`Date: ${booking.booking_date}`]
                : []),
              ...(booking.start_time && booking.end_time
                ? [`Time: ${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}`]
                : []),
              `Guests: ${booking.guest_count}`,
              '',
              "If you'd like to rebook or have any questions, please reply to this email.",
              '',
              '— Jersey Slime Studio',
            ].join('\n'),
          })
          if (emailError) {
            console.error('Resend error (booking cancellation):', emailError)
          }
        }
      } catch (emailErr) {
        console.error('Booking cancellation email error:', emailErr)
      }

      return NextResponse.json({ success: true })
    }

    // action === 'update'
    const updates: Record<string, unknown> = {}
    const experienceId = booking.experience_id

    if (!experienceId) {
      return NextResponse.json({ error: 'Booking has no associated experience' }, { status: 400 })
    }

    // Get experience for duration and pricing
    const { data: experience } = await service
      .from('experiences')
      .select('price_per_person, duration_minutes')
      .eq('id', experienceId)
      .single()

    if (!experience) {
      return NextResponse.json({ error: 'Associated experience not found' }, { status: 404 })
    }

    const newDate = data.date ?? booking.booking_date
    const newStartTime = data.start_time ?? booking.start_time
    const newGuestCount = data.guest_count ?? booking.guest_count

    // If date or time changed, verify the new slot is available
    if (data.date || data.start_time) {
      if (newDate && newStartTime) {
        const availableSlots = await getAvailableSlots(newDate, experienceId, supabase)
        const slotIsAvailable = availableSlots.some((s) => s.start_time === newStartTime)

        if (!slotIsAvailable) {
          return NextResponse.json(
            { error: 'This time slot is no longer available.' },
            { status: 409 }
          )
        }

        updates.booking_date = newDate
        updates.start_time = newStartTime

        // Compute new end_time
        const [h, m] = newStartTime.split(':').map(Number)
        const endMinutes = h * 60 + m + experience.duration_minutes
        updates.end_time = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`
      }
    }

    if (data.guest_count !== undefined && data.guest_count !== booking.guest_count) {
      updates.guest_count = data.guest_count
      updates.total_price = experience.price_per_person * data.guest_count
    }

    if (data.notes !== undefined) {
      updates.notes = data.notes || null
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true, message: 'No changes' })
    }

    // Recalculate price if guest count changed
    if (updates.guest_count) {
      updates.total_price = experience.price_per_person * (updates.guest_count as number)
    }

    const { error: updateError } = await service
      .from('bookings')
      .update(updates)
      .eq('id', id)

    if (updateError) {
      console.error('Booking update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Booking update route error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
