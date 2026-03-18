'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'

const packages = [
  {
    name: 'Basic',
    price: '$199',
    duration: '1.5 hours',
    maxGuests: 10,
    includes: [
      '2 slime creations per guest',
      'Basic mix-ins & colors',
      'Dedicated party host',
      'Paper plates & napkins',
      'Party music playlist',
    ],
    color: 'from-brand-teal to-brand-blue',
  },
  {
    name: 'Deluxe',
    price: '$299',
    duration: '2 hours',
    maxGuests: 15,
    includes: [
      '3 slime creations per guest',
      'Premium mix-ins & scents',
      'Dedicated party host',
      'Themed decorations',
      'Party favors for each guest',
      'Photo area setup',
    ],
    color: 'from-brand-pink to-brand-purple',
  },
  {
    name: 'Ultimate',
    price: '$399',
    duration: '2.5 hours',
    maxGuests: 20,
    includes: [
      '4 slime creations per guest',
      'All premium materials',
      'Two dedicated party hosts',
      'Full themed decorations',
      'Custom slime bar station',
      'Party favors & goodie bags',
      'Personalized slime containers',
      'Free group photo session',
    ],
    color: 'from-brand-purple to-brand-pink',
  },
]

export default function PartiesPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    guestCount: '',
    ageRange: '',
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
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-pink via-brand-purple to-brand-blue py-24 px-6 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-5xl font-bold sm:text-6xl">
            Slime Birthday Parties
          </h1>
          <p className="mt-4 text-lg text-white/90">
            The most fun, colorful, and unforgettable birthday party your
            kid will ever have. Guaranteed.
          </p>
        </div>
      </section>

      {/* Party Packages */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            Choose Your Package
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className="flex flex-col rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Header */}
                <div
                  className={`rounded-t-2xl bg-gradient-to-r ${pkg.color} px-6 py-6 text-center text-white`}
                >
                  <h3 className="font-display text-2xl font-bold">
                    {pkg.name}
                  </h3>
                  <p className="mt-1 text-4xl font-extrabold">{pkg.price}</p>
                </div>
                {/* Details */}
                <div className="flex flex-1 flex-col px-6 py-6">
                  <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
                    <span>{pkg.duration}</span>
                    <span>Up to {pkg.maxGuests} guests</span>
                  </div>
                  <ul className="flex-1 space-y-2">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-gray-700">
                        <span className="mt-0.5 text-brand-teal">&#10003;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#inquiry-form"
                    className={`mt-6 block rounded-full bg-gradient-to-r ${pkg.color} py-3 text-center font-bold text-white transition hover:scale-105 hover:shadow-md`}
                  >
                    Inquire Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Party Inquiry Form */}
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
                <option value="basic">Basic — $199</option>
                <option value="deluxe">Deluxe — $299</option>
                <option value="ultimate">Ultimate — $399</option>
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
    </main>
  )
}
