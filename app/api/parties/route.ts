import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { STUDIO_CONTACT_EMAIL } from '@/lib/email'

const inquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required').transform((v) => v.replace(/\D/g, '')),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  guestCount: z.coerce.number().int().min(1).max(30),
  ageRange: z.string().min(1, 'Age range is required'),
  selectedPackage: z.enum(['basic', 'deluxe', 'ultimate']),
  message: z.string().default(''),
})


const PACKAGE_LABELS: Record<string, string> = {
  basic: 'Basic — $199',
  deluxe: 'Deluxe — $299',
  ultimate: 'Ultimate — $399',
}

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

    const { name, email, phone, preferredDate, guestCount, ageRange, selectedPackage, message } =
      parsed.data

    // Attach user_id if the requester is logged in
    const sessionClient = await createClient()
    const { data: { user } } = await sessionClient.auth.getUser()

    const service = createServiceClient()
    const { error: dbError } = await service.from('party_inquiries').insert({
      contact_name: name,
      contact_email: email,
      contact_phone: phone,
      preferred_date: preferredDate,
      guest_count: guestCount,
      age_range: ageRange,
      message: message || `Package: ${PACKAGE_LABELS[selectedPackage]}`,
      ...(user ? { user_id: user.id } : {}),
    })

    if (dbError) {
      console.error('Party inquiry insert error:', dbError)
      return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Jersey Slime Studio <noreply@jerseyslimestudio.com>',
      to: [STUDIO_CONTACT_EMAIL],
      replyTo: email,
      subject: `New Party Inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Preferred Date: ${preferredDate}`,
        `Guests: ${guestCount}`,
        `Age Range: ${ageRange}`,
        `Package: ${PACKAGE_LABELS[selectedPackage]}`,
        `\nMessage:\n${message || '(none)'}`,
      ].join('\n'),
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Party inquiry route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
