'use client'

import { useState, type FormEvent } from 'react'

interface StudioHour {
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  return minutes === 0 ? `${h}:00 ${ampm}` : `${h}:${String(minutes).padStart(2, '0')} ${ampm}`
}

function groupConsecutiveDays(hours: StudioHour[]): string[] {
  const sorted = [...hours].sort((a, b) => {
    // Reorder so Monday (1) comes first: 1,2,3,4,5,6,0
    const orderA = a.day_of_week === 0 ? 7 : a.day_of_week
    const orderB = b.day_of_week === 0 ? 7 : b.day_of_week
    return orderA - orderB
  })

  const lines: string[] = []
  let i = 0

  while (i < sorted.length) {
    const current = sorted[i]
    if (current.is_closed) {
      i++
      continue
    }

    // Find consecutive days with the same hours
    let j = i + 1
    while (
      j < sorted.length &&
      !sorted[j].is_closed &&
      sorted[j].open_time === current.open_time &&
      sorted[j].close_time === current.close_time
    ) {
      j++
    }

    const startDay = DAY_NAMES[current.day_of_week]
    const endDay = DAY_NAMES[sorted[j - 1].day_of_week]
    const timeRange = `${formatTime(current.open_time)} - ${formatTime(current.close_time)}`

    if (j - i === 1) {
      lines.push(`${startDay}: ${timeRange}`)
    } else {
      lines.push(`${startDay} - ${endDay}: ${timeRange}`)
    }

    i = j
  }

  // Add closed days
  const closedDays = sorted.filter((h) => h.is_closed).map((h) => DAY_NAMES[h.day_of_week])
  if (closedDays.length === 1) {
    lines.push(`${closedDays[0]}: Closed`)
  } else if (closedDays.length > 1) {
    lines.push(`${closedDays.join(', ')}: Closed`)
  }

  return lines
}

interface ContactInfo {
  address: string
  phone: string
  email: string
}

export default function ContactForm({
  studioHours,
  contactInfo,
}: {
  studioHours: StudioHour[]
  contactInfo: ContactInfo
}) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Placeholder — form submission logic will be added later
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blue/20 via-brand-teal/10 to-brand-yellow/20 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Get In Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Have a question or want to book a slime party? We&apos;d love to hear from you! Fill
            out the form below or reach out using our contact information.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900">Send Us a Message</h2>
              <p className="mt-2 text-gray-600">
                Fill out the form and we&apos;ll get back to you within 24 hours.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <h3 className="font-display text-lg font-bold text-green-800">
                    Message Sent!
                  </h3>
                  <p className="mt-2 text-green-700">
                    Thank you for reaching out. We&apos;ll get back to you soon!
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', subject: '', message: '' })
                    }}
                    className="mt-4 text-sm font-semibold text-green-700 underline hover:text-green-900"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink/20"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink/20"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, subject: e.target.value }))
                      }
                      className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink/20"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, message: e.target.value }))
                      }
                      className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink/20"
                      placeholder="Tell us what you're thinking..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-brand-pink px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand-purple"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900">Contact Information</h2>
              <p className="mt-2 text-gray-600">
                Reach out through any of the channels below.
              </p>

              <div className="mt-8 space-y-6">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-pink/10">
                    <svg
                      className="h-6 w-6 text-brand-pink"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="mt-1 text-gray-600">{contactInfo.address}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-purple/10">
                    <svg
                      className="h-6 w-6 text-brand-purple"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="mt-1 text-gray-600">{contactInfo.phone}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-teal/10">
                    <svg
                      className="h-6 w-6 text-brand-teal"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="mt-1 text-gray-600">{contactInfo.email}</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-yellow/10">
                    <svg
                      className="h-6 w-6 text-brand-yellow"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Studio Hours</h3>
                    <div className="mt-1 space-y-1 text-gray-600">
                      {groupConsecutiveDays(studioHours).map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-10 flex h-64 items-center justify-center rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <svg
                    className="mx-auto h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                    />
                  </svg>
                  <p className="mt-2 text-sm font-medium text-gray-500">Map coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
