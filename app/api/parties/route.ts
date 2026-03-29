import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getStudioContactEmail, EMAIL_FROM, getAdminEmails } from '@/lib/email'
import { partyInquiryCustomer, partyInquiryAdmin } from '@/lib/email-templates'
import { formatTime } from '@/lib/utils'

const DURATION_LABELS: Record<number, string> = {
  60: '60 minutes (1 hour)',
  90: '90 minutes (1.5 hours)',
  120: '120 minutes (2 hours)',
}

const inquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required').transform((v) => v.replace(/\D/g, '')),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  preferredTime: z.string().regex(/^\d{2}:\d{2}$/, 'Preferred time is required'),
  guestCount: z.coerce.number().int().min(1).max(30),
  ageRange: z.string().min(1, 'Age range is required'),
  durationMinutes: z.coerce.number().int().refine((v) => [60, 90, 120].includes(v), {
    message: 'Duration must be 60, 90, or 120 minutes',
  }),
  selectedPackage: z.string().min(1, 'Package selection is required'),
  message: z.string().default(''),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = inquirySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const {
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      guestCount,
      ageRange,
      durationMinutes,
      selectedPackage,
      message,
    } = parsed.data

    // Attach user_id if the requester is logged in
    const sessionClient = await createClient()
    const { data: { user } } = await sessionClient.auth.getUser()

    const service = createServiceClient()

    // Look up the selected package from the database
    const { data: pkg } = await service
      .from('party_packages')
      .select('name, price')
      .ilike('name', selectedPackage)
      .single()

    const packageLabel = pkg ? `${pkg.name} — $${pkg.price}` : selectedPackage

    const { error: dbError } = await service.from('party_inquiries').insert({
      contact_name: name,
      contact_email: email,
      contact_phone: phone,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      guest_count: guestCount,
      age_range: ageRange,
      duration_minutes: durationMinutes,
      message: message || `Package: ${packageLabel}`,
      ...(user ? { user_id: user.id } : {}),
    })

    if (dbError) {
      console.error('Party inquiry insert error:', dbError)
      return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 })
    }

    // Send email notifications (non-blocking — don't fail the inquiry if emails fail)
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const [studioEmail, adminEmails] = await Promise.all([
        getStudioContactEmail(),
        getAdminEmails(),
      ])
      const durationLabel = DURATION_LABELS[durationMinutes] ?? `${durationMinutes} minutes`
      const formattedTime = formatTime(preferredTime)

      const partyDetails = {
        date: preferredDate,
        time: formattedTime,
        guests: guestCount,
        ageRange,
        duration: durationLabel,
        packageName: packageLabel,
        message: message || undefined,
      }

      // Send confirmation email to the customer
      const { error: customerEmailError } = await resend.emails.send({
        from: EMAIL_FROM,
        to: [email],
        replyTo: studioEmail,
        subject: 'Party Inquiry Received! — Jersey Slime Studio 38',
        html: partyInquiryCustomer(name, partyDetails),
      })
      if (customerEmailError) {
        console.error('Resend error (party inquiry customer):', customerEmailError)
      }

      // Send notification email to all admin users
      const adminRecipients = adminEmails.length > 0 ? adminEmails : [studioEmail]
      const { error: adminEmailError } = await resend.emails.send({
        from: EMAIL_FROM,
        to: adminRecipients,
        replyTo: email,
        subject: `New Party Inquiry from ${name} — Jersey Slime Studio 38`,
        html: partyInquiryAdmin(name, email, phone, partyDetails),
      })
      if (adminEmailError) {
        console.error('Resend error (party inquiry admin):', adminEmailError)
      }
    } catch (emailErr) {
      console.error('Party inquiry email error:', emailErr)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Party inquiry route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
