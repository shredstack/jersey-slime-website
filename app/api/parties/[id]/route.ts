import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { STUDIO_CONTACT_EMAIL } from '@/lib/email'

const cancelSchema = z.object({
  action: z.literal('cancel'),
})

const updateSchema = z.object({
  action: z.literal('update'),
  preferred_date: z.string().min(1).optional(),
  guest_count: z.coerce.number().int().min(1).max(30).optional(),
  age_range: z.string().min(1).optional(),
  message: z.string().optional(),
})

const requestSchema = z.discriminatedUnion('action', [cancelSchema, updateSchema])

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
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

  const data = parsed.data

  if (data.action === 'cancel') {
    // Users can cancel inquiries that are not already cancelled or completed
    const service = createServiceClient()

    const { data: inquiry } = await service
      .from('party_inquiries')
      .select('status, contact_name, contact_email, preferred_date, guest_count, age_range, user_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    if (inquiry.status === 'cancelled' || inquiry.status === 'completed') {
      return NextResponse.json(
        { error: `Cannot cancel an inquiry that is already ${inquiry.status}` },
        { status: 400 }
      )
    }

    const { error } = await service
      .from('party_inquiries')
      .update({ status: 'cancelled' })
      .eq('id', id)

    if (error) {
      console.error('Party inquiry cancel error:', error)
      return NextResponse.json({ error: 'Failed to cancel inquiry' }, { status: 500 })
    }

    // Send cancellation confirmation email
    try {
      if (inquiry.contact_email) {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'Jersey Slime Studio <noreply@jerseyslimestudio.com>',
          to: [inquiry.contact_email],
          replyTo: STUDIO_CONTACT_EMAIL,
          subject: 'Your Party Inquiry Has Been Cancelled — Jersey Slime Studio',
          text: [
            `Hi ${inquiry.contact_name},`,
            '',
            `Your party inquiry has been cancelled as requested.`,
            '',
            `Date: ${inquiry.preferred_date}`,
            `Guests: ${inquiry.guest_count}`,
            `Age Range: ${inquiry.age_range}`,
            '',
            `If you'd like to rebook or have any questions, please reply to this email.`,
            '',
            '— Jersey Slime Studio',
          ].join('\n'),
        })
      }
    } catch (emailErr) {
      console.error('Party cancellation email error:', emailErr)
    }

    return NextResponse.json({ success: true })
  }

  // action === 'update'
  const { action: _, ...updates } = data

  // RLS enforces ownership + pending-only constraint; if it doesn't match, update returns 0 rows.
  const { error, count } = await supabase
    .from('party_inquiries')
    .update(updates)
    .eq('id', id)
    .in('status', ['new', 'contacted'])

  if (error) {
    console.error('Party inquiry update error:', error)
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 })
  }

  if (count === 0) {
    return NextResponse.json({ error: 'Not found or not editable' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
