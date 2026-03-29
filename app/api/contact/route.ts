import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { getStudioContactEmail, EMAIL_FROM } from '@/lib/email'
import { contactFormAdmin } from '@/lib/email-templates'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = parsed.data

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error: emailError } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [await getStudioContactEmail()],
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: contactFormAdmin(name, email, subject, message),
    })

    if (emailError) {
      console.error('Resend error (contact form):', emailError)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Thank you for reaching out! We will get back to you soon.' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
