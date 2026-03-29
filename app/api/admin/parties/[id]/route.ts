import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getStudioContactEmail, EMAIL_FROM } from '@/lib/email'
import { partyConfirmedCustomer, partyCancelledCustomer } from '@/lib/email-templates'

const updateSchema = z.object({
  status: z.enum(['new', 'contacted', 'confirmed', 'completed', 'cancelled']).optional(),
  admin_notes: z.string().optional(),
  total_cost: z.coerce.number().min(0).optional(),
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

  const updates: Record<string, unknown> = {}
  if (parsed.data.status !== undefined) updates.status = parsed.data.status
  if (parsed.data.admin_notes !== undefined) updates.admin_notes = parsed.data.admin_notes
  if (parsed.data.total_cost !== undefined) updates.total_cost = parsed.data.total_cost

  const service = createServiceClient()

  // Check previous status before updating so we only email on actual status changes
  let previousStatus: string | null = null
  if (parsed.data.status === 'confirmed' || parsed.data.status === 'cancelled') {
    const { data: existing } = await service
      .from('party_inquiries')
      .select('status')
      .eq('id', id)
      .single()
    previousStatus = existing?.status ?? null
  }

  const { error } = await service.from('party_inquiries').update(updates).eq('id', id)

  if (error) {
    console.error('Party inquiry update error:', error)
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 })
  }

  // Send email when party is newly confirmed or cancelled
  const isNewConfirmation = parsed.data.status === 'confirmed' && previousStatus !== 'confirmed'
  const isNewCancellation = parsed.data.status === 'cancelled' && previousStatus !== 'cancelled'

  if (isNewConfirmation || isNewCancellation) {
    try {
      const { data: inquiry } = await service
        .from('party_inquiries')
        .select('contact_name, contact_email, preferred_date, guest_count, age_range, total_cost, message')
        .eq('id', id)
        .single()

      if (inquiry?.contact_email) {
        const resend = new Resend(process.env.RESEND_API_KEY)

        const subject = isNewConfirmation
          ? 'Your Party is Confirmed! — Jersey Slime Studio 38'
          : 'Your Party Inquiry Has Been Cancelled — Jersey Slime Studio 38'

        const partyDetails = {
          date: inquiry.preferred_date,
          guests: inquiry.guest_count,
          ageRange: inquiry.age_range,
          totalCost: inquiry.total_cost
            ? `$${Number(inquiry.total_cost).toFixed(2)}`
            : undefined,
        }

        const html = isNewConfirmation
          ? partyConfirmedCustomer(inquiry.contact_name, partyDetails)
          : partyCancelledCustomer(inquiry.contact_name, partyDetails, true)

        const { error: emailError } = await resend.emails.send({
          from: EMAIL_FROM,
          to: [inquiry.contact_email],
          replyTo: await getStudioContactEmail(),
          subject,
          html,
        })
        if (emailError) {
          console.error('Resend error (party status):', emailError)
        }
      }
    } catch (emailErr) {
      console.error('Party status email error:', emailErr)
      // Don't fail the status update if the email fails
    }
  }

  return NextResponse.json({ success: true })
}
