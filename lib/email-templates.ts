/**
 * Branded HTML email templates for Jersey Slime Studio 38.
 *
 * Design: pink-to-purple gradient header, white card body, teal footer.
 * Matches the website's playful, colorful brand identity.
 */

const BRAND = {
  pink: '#FF6B9D',
  purple: '#C084FC',
  teal: '#5EEAD4',
  yellow: '#FDE047',
  blue: '#7DD3FC',
  dark: '#171717',
  muted: '#737373',
  light: '#F5F5F5',
  white: '#FFFFFF',
  bgPage: '#fdf4ff',
} as const

// ── Layout shell ──────────────────────────────────────────────────────────────

function layout(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:${BRAND.bgPage};font-family:'Segoe UI',system-ui,-apple-system,sans-serif;-webkit-text-size-adjust:100%;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;background:${BRAND.white};border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,${BRAND.pink},${BRAND.purple});padding:32px 24px;text-align:center;">
            <div style="font-size:40px;margin-bottom:6px;">🧪</div>
            <p style="margin:0;color:${BRAND.white};font-size:22px;font-weight:700;letter-spacing:-0.3px;">Jersey Slime Studio 38</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 28px;">
            ${body}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:${BRAND.teal};padding:16px 24px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#065f46;font-weight:500;">Jersey Slime Studio 38 · Utah's favorite slime experience</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:${BRAND.dark};letter-spacing:-0.3px;">${text}</h1>`
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;color:${BRAND.dark};line-height:1.6;">${text}</p>`
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 12px;font-size:14px;color:${BRAND.muted};font-weight:500;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:8px 12px;font-size:14px;color:${BRAND.dark};font-weight:600;">${value}</td>
  </tr>`
}

function detailsTable(rows: [string, string][]): string {
  const inner = rows.map(([l, v]) => detailRow(l, v)).join('')
  return `<table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;background:${BRAND.light};border-radius:12px;margin:0 0 20px;overflow:hidden;">
    ${inner}
  </table>`
}

function signoff(): string {
  return `<p style="margin:20px 0 0;font-size:14px;color:${BRAND.muted};line-height:1.5;">With love and slime,<br/><strong style="color:${BRAND.dark};">The Jersey Slime Studio 38 Team</strong></p>`
}

function ctaButton(text: string, note?: string): string {
  const btn = `<div style="text-align:center;margin:24px 0 8px;">
    <span style="display:inline-block;background:linear-gradient(135deg,${BRAND.pink},${BRAND.purple});color:${BRAND.white};font-size:15px;font-weight:600;padding:14px 32px;border-radius:50px;">${text}</span>
  </div>`
  if (!note) return btn
  return btn + `<p style="margin:0 0 16px;font-size:12px;color:${BRAND.muted};text-align:center;">${note}</p>`
}

// ── Booking emails ────────────────────────────────────────────────────────────

interface BookingDetails {
  experienceName: string
  date: string
  time: string
  guests: number
  price?: string
  notes?: string
}

export function bookingReceivedCustomer(name: string, details: BookingDetails): string {
  const rows: [string, string][] = [
    ['Experience', details.experienceName],
    ['Date', details.date],
    ['Time', details.time],
    ['Guests', String(details.guests)],
  ]
  if (details.price) rows.push(['Est. Total', details.price])
  if (details.notes) rows.push(['Notes', details.notes])

  return layout([
    heading('Booking Received! 🎉'),
    paragraph(`Hi ${name},`),
    paragraph("Thanks for booking with us! We've received your reservation and it's pending confirmation. We'll send you another email once it's all set."),
    detailsTable(rows),
    paragraph("Questions? Just reply to this email — we're happy to help!"),
    signoff(),
  ].join(''))
}

export function bookingReceivedAdmin(customerName: string, customerEmail: string | undefined, details: BookingDetails): string {
  const rows: [string, string][] = [
    ['Customer', customerEmail ? `${customerName} (${customerEmail})` : customerName],
    ['Experience', details.experienceName],
    ['Date', details.date],
    ['Time', details.time],
    ['Guests', String(details.guests)],
  ]
  if (details.price) rows.push(['Est. Total', details.price])
  if (details.notes) rows.push(['Notes', details.notes])

  return layout([
    heading('New Booking Submitted'),
    paragraph('A new booking has been submitted and is pending confirmation.'),
    detailsTable(rows),
    ctaButton('Review in Admin Dashboard', 'Log in to confirm or manage this booking.'),
    signoff(),
  ].join(''))
}

export function bookingConfirmedCustomer(name: string, details: BookingDetails): string {
  const rows: [string, string][] = [
    ['Experience', details.experienceName],
    ['Date', details.date],
    ['Time', details.time],
    ['Guests', String(details.guests)],
  ]
  if (details.price) rows.push(['Total', details.price])
  rows.push(['Location', 'The Shops at South Town — bottom floor, south end'])

  return layout([
    heading("You're All Set! ✨"),
    paragraph(`Hi ${name},`),
    paragraph(`Thank you for booking your reservation with Jersey Slime Studio 38, located at The Shops at South Town. Your slime experience is officially confirmed!`),
    paragraph(`We look forward to welcoming you as our guest while you create your own custom slime kit inspired by the magic of the Northern Lights. During your visit, you'll choose your favorite slime textures, charms, and mix-ins to design a one-of-a-kind slime creation.`),
    paragraph(`Our goal is to make your visit a fun and memorable experience filled with creativity, color, and a little bit of slime magic.`),
    detailsTable(rows),
    paragraph("If you have any questions before your visit, please feel free to reply to this email or contact us at 801-718-3530."),
    paragraph("We can't wait to see what slime you create!"),
    `<p style="margin:20px 0 0;font-size:14px;color:${BRAND.muted};line-height:1.5;">Warmly,<br/><strong style="color:${BRAND.dark};">Jersey Slime Studio 38</strong></p>`,
  ].join(''))
}

export function bookingCancelledCustomer(name: string, details: BookingDetails, byAdmin: boolean): string {
  const rows: [string, string][] = [
    ['Experience', details.experienceName],
  ]
  if (details.date) rows.push(['Date', details.date])
  if (details.time) rows.push(['Time', details.time])
  rows.push(['Guests', String(details.guests)])

  const intro = byAdmin
    ? "We're sorry to let you know that your booking has been cancelled."
    : 'Your booking has been cancelled as requested.'

  return layout([
    heading('Booking Cancelled'),
    paragraph(`Hi ${name},`),
    paragraph(intro),
    detailsTable(rows),
    paragraph("If you'd like to rebook or have any questions, just reply to this email."),
    signoff(),
  ].join(''))
}

// ── Party emails ──────────────────────────────────────────────────────────────

interface PartyDetails {
  date: string
  time?: string
  guests: number
  ageRange: string
  duration?: string
  packageName?: string
  totalCost?: string
  message?: string
}

export function partyInquiryCustomer(name: string, details: PartyDetails): string {
  const rows: [string, string][] = [
    ['Preferred Date', details.date],
  ]
  if (details.time) rows.push(['Preferred Time', details.time])
  rows.push(['Guests', String(details.guests)])
  rows.push(['Age Range', details.ageRange])
  if (details.duration) rows.push(['Duration', details.duration])
  if (details.packageName) rows.push(['Package', details.packageName])

  return layout([
    heading('Party Inquiry Received! 🎈'),
    paragraph(`Hi ${name},`),
    paragraph("Thanks for reaching out about hosting a party with us! We've received your inquiry and our team will be in touch soon to finalize the details."),
    detailsTable(rows),
    paragraph("Questions in the meantime? Just reply to this email!"),
    signoff(),
  ].join(''))
}

export function partyInquiryAdmin(name: string, email: string, phone: string, details: PartyDetails): string {
  const rows: [string, string][] = [
    ['Contact', `${name} (${email})`],
    ['Phone', phone],
    ['Preferred Date', details.date],
  ]
  if (details.time) rows.push(['Preferred Time', details.time])
  rows.push(['Guests', String(details.guests)])
  rows.push(['Age Range', details.ageRange])
  if (details.duration) rows.push(['Duration', details.duration])
  if (details.packageName) rows.push(['Package', details.packageName])
  if (details.message) rows.push(['Message', details.message])

  return layout([
    heading('New Party Inquiry'),
    paragraph(`A new party inquiry has been submitted by ${name}.`),
    detailsTable(rows),
    ctaButton('Review in Admin Dashboard', 'Log in to follow up on this inquiry.'),
    signoff(),
  ].join(''))
}

export function partyConfirmedCustomer(name: string, details: PartyDetails): string {
  const rows: [string, string][] = [
    ['Date', details.date],
    ['Guests', String(details.guests)],
    ['Age Range', details.ageRange],
  ]
  if (details.totalCost) rows.push(['Total Cost', details.totalCost])

  return layout([
    heading("Party Confirmed! 🎉"),
    paragraph(`Hi ${name},`),
    paragraph("Great news — your party is officially confirmed! We can't wait to celebrate with you and create some amazing slime memories."),
    detailsTable(rows),
    paragraph("If you have any questions, just reply to this email."),
    signoff(),
  ].join(''))
}

export function partyCancelledCustomer(name: string, details: PartyDetails, byAdmin: boolean): string {
  const rows: [string, string][] = [
    ['Date', details.date],
    ['Guests', String(details.guests)],
    ['Age Range', details.ageRange],
  ]

  const intro = byAdmin
    ? "We're sorry to let you know that your party inquiry has been cancelled."
    : 'Your party inquiry has been cancelled as requested.'

  return layout([
    heading('Party Inquiry Cancelled'),
    paragraph(`Hi ${name},`),
    paragraph(intro),
    detailsTable(rows),
    paragraph("If you have any questions or would like to rebook, please reply to this email."),
    signoff(),
  ].join(''))
}

// ── Contact form ──────────────────────────────────────────────────────────────

export function contactFormAdmin(name: string, email: string, subject: string, message: string): string {
  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Subject', subject],
  ]

  return layout([
    heading('New Contact Form Message'),
    paragraph(`${name} sent a message via the contact form.`),
    detailsTable(rows),
    `<div style="background:${BRAND.light};border-radius:12px;padding:16px;margin:0 0 20px;">
      <p style="margin:0;font-size:14px;color:${BRAND.dark};line-height:1.6;white-space:pre-wrap;">${message}</p>
    </div>`,
    paragraph(`Reply directly to <strong>${email}</strong> to respond.`),
    signoff(),
  ].join(''))
}
