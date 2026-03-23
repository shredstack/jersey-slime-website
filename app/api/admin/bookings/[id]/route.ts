import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getStudioContactEmail } from '@/lib/email'
import { formatTime } from '@/lib/utils'

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

  // Send email notification on status change
  if (parsed.data.status === 'confirmed' || parsed.data.status === 'cancelled') {
    try {
      const { data: booking } = await service
        .from('bookings')
        .select('guest_count, total_price, notes, booking_date, start_time, end_time, experience_id, user_id')
        .eq('id', id)
        .single()

      if (booking) {
        const { data: customerProfile } = await service
          .from('profiles')
          .select('email, full_name')
          .eq('id', booking.user_id)
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
          const isConfirmed = parsed.data.status === 'confirmed'

          const subject = isConfirmed
            ? 'Your Booking is Confirmed! — Jersey Slime Studio'
            : 'Your Booking Has Been Cancelled — Jersey Slime Studio'

          const bodyLines = isConfirmed
            ? [
                `Hi ${customerProfile.full_name},`,
                '',
                'Great news! Your booking has been confirmed.',
                '',
                `Experience: ${experienceName}`,
                ...(booking.booking_date ? [`Date: ${booking.booking_date}`] : []),
                ...(booking.start_time && booking.end_time
                  ? [`Time: ${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}`]
                  : []),
                `Guests: ${booking.guest_count}`,
                `Total: $${Number(booking.total_price).toFixed(2)}`,
                '',
                "We can't wait to see you! If you have any questions, just reply to this email.",
                '',
                '— Jersey Slime Studio',
              ]
            : [
                `Hi ${customerProfile.full_name},`,
                '',
                "We're sorry to let you know that your booking has been cancelled.",
                '',
                `Experience: ${experienceName}`,
                ...(booking.booking_date ? [`Date: ${booking.booking_date}`] : []),
                ...(booking.start_time && booking.end_time
                  ? [`Time: ${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}`]
                  : []),
                `Guests: ${booking.guest_count}`,
                '',
                'If you have any questions or would like to rebook, please reply to this email.',
                '',
                '— Jersey Slime Studio',
              ]

          await resend.emails.send({
            from: 'Jersey Slime Studio <noreply@jerseyslimestudio.com>',
            to: [customerProfile.email],
            replyTo: await getStudioContactEmail(),
            subject,
            text: bodyLines.join('\n'),
          })
        }
      }
    } catch (emailErr) {
      console.error('Booking status email error:', emailErr)
    }
  }

  return NextResponse.json({ success: true })
}
