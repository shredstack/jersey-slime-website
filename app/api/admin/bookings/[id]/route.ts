import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { STUDIO_CONTACT_EMAIL } from '@/lib/email'

const updateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const service = createServiceClient()
  const { error } = await service
    .from('bookings')
    .update({ status: parsed.data.status })
    .eq('id', id)

  if (error) {
    console.error('Booking update error:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }

  // Send confirmation email when booking is confirmed
  if (parsed.data.status === 'confirmed') {
    try {
      const { data: booking } = await service
        .from('bookings')
        .select('guest_count, total_price, notes, slot_id, user_id')
        .eq('id', id)
        .single()

      if (booking) {
        const { data: customerProfile } = await service
          .from('profiles')
          .select('email, full_name')
          .eq('id', booking.user_id)
          .single()

        const { data: slot } = await service
          .from('availability_slots')
          .select('date, start_time, end_time, experience_id')
          .eq('id', booking.slot_id)
          .single()

        let experienceName = 'Slime Experience'
        if (slot) {
          const { data: experience } = await service
            .from('experiences')
            .select('title')
            .eq('id', slot.experience_id)
            .single()
          if (experience) experienceName = experience.title
        }

        if (customerProfile?.email) {
          const resend = new Resend(process.env.RESEND_API_KEY)
          await resend.emails.send({
            from: 'Jersey Slime Studio <noreply@jerseyslimestudio.com>',
            to: [customerProfile.email],
            replyTo: STUDIO_CONTACT_EMAIL,
            subject: 'Your Booking is Confirmed! — Jersey Slime Studio',
            text: [
              `Hi ${customerProfile.full_name},`,
              '',
              `Great news! Your booking has been confirmed.`,
              '',
              `Experience: ${experienceName}`,
              ...(slot
                ? [
                    `Date: ${slot.date}`,
                    `Time: ${slot.start_time} – ${slot.end_time}`,
                  ]
                : []),
              `Guests: ${booking.guest_count}`,
              `Total: $${Number(booking.total_price).toFixed(2)}`,
              '',
              `We can't wait to see you! If you have any questions, just reply to this email.`,
              '',
              '— Jersey Slime Studio',
            ].join('\n'),
          })
        }
      }
    } catch (emailErr) {
      console.error('Booking confirmation email error:', emailErr)
      // Don't fail the status update if the email fails
    }
  }

  return NextResponse.json({ success: true })
}
