'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'

interface PartyPackage {
  id: string
  name: string
  price: number
}

export default function PartyInquiryForm({
  packages,
}: {
  packages: PartyPackage[]
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    guestCount: '',
    ageRange: '',
    durationMinutes: '',
    selectedPackage: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'phone' ? formatPhone(value) : value,
    }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section
      id="inquiry-form"
      className="bg-gradient-to-b from-brand-purple/5 to-brand-pink/5 py-20 px-6"
    >
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          Party Inquiry
        </h2>
        <p className="mt-3 text-center text-gray-600">
          Fill out the form below and we&rsquo;ll get back to you within 24
          hours to plan the perfect party!
        </p>

        {status === 'success' ? (
          <div className="mt-10 rounded-2xl border border-green-100 bg-green-50 p-10 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
              🎉
            </div>
            <h3 className="font-display text-2xl font-bold text-gray-900">
              Inquiry Received!
            </h3>
            <p className="mt-3 text-gray-600">
              Thanks, {formData.name}! We&rsquo;ll reach out to {formData.email} within 24 hours
              to start planning your perfect party.
            </p>
          </div>
        ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-900"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-900"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(801) 555-1234"
              autoComplete="tel"
              inputMode="numeric"
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
              required
            />
          </div>

          {/* Preferred Date */}
          <div>
            <label
              htmlFor="preferredDate"
              className="block text-sm font-semibold text-gray-900"
            >
              Preferred Date
            </label>
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
              required
            />
          </div>

          {/* Preferred Time & Duration */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="preferredTime"
                className="block text-sm font-semibold text-gray-900"
              >
                Preferred Start Time
              </label>
              <input
                type="time"
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                required
              />
            </div>
            <div>
              <label
                htmlFor="durationMinutes"
                className="block text-sm font-semibold text-gray-900"
              >
                Party Duration
              </label>
              <select
                id="durationMinutes"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                required
              >
                <option value="">Select duration</option>
                <option value="60">60 minutes (1 hour)</option>
                <option value="90">90 minutes (1.5 hours)</option>
                <option value="120">120 minutes (2 hours)</option>
              </select>
            </div>
          </div>

          {/* Guest Count & Age Range */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="guestCount"
                className="block text-sm font-semibold text-gray-900"
              >
                Number of Guests
              </label>
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                min={1}
                max={30}
                value={formData.guestCount}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                required
              />
            </div>
            <div>
              <label
                htmlFor="ageRange"
                className="block text-sm font-semibold text-gray-900"
              >
                Age Range
              </label>
              <select
                id="ageRange"
                name="ageRange"
                value={formData.ageRange}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                required
              >
                <option value="">Select age range</option>
                <option value="3-5">3 - 5 years</option>
                <option value="6-8">6 - 8 years</option>
                <option value="9-12">9 - 12 years</option>
                <option value="13+">13+ years</option>
                <option value="mixed">Mixed ages</option>
              </select>
            </div>
          </div>

          {/* Package Selection */}
          <div>
            <label
              htmlFor="selectedPackage"
              className="block text-sm font-semibold text-gray-900"
            >
              Preferred Package
            </label>
            <select
              id="selectedPackage"
              name="selectedPackage"
              value={formData.selectedPackage}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
              required
            >
              <option value="">Select a package</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.name.toLowerCase()}>
                  {pkg.name} — ${pkg.price}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-900"
            >
              Tell Us More
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Theme ideas, special requests, dietary restrictions, etc."
              className="mt-1 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
            />
          </div>

          {/* Error message */}
          {status === 'error' && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full rounded-full bg-gradient-to-r from-brand-pink to-brand-purple py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'submitting' ? 'Submitting…' : 'Submit Party Inquiry'}
          </button>
        </form>
        )}
      </div>
    </section>
  )
}
