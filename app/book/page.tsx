'use client'

import { useState } from 'react'

// Metadata must be exported from a separate file for client components,
// but for now we set the title via the layout or a head component.
// In production, move metadata to a layout.tsx or use generateMetadata in a server wrapper.

const timeSlots = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
]

export default function BookPage() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [guests, setGuests] = useState(1)
  const [notes, setNotes] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Supabase integration will come later
    alert('Booking submitted! We will confirm your reservation soon.')
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-yellow via-brand-pink to-brand-purple py-24 px-6 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-5xl font-bold sm:text-6xl">
            Book Your Experience
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Pick a date, choose a time, and get ready for some slimy fun!
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-2xl">
          <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg"
          >
            {/* Date Picker */}
            <div>
              <label
                htmlFor="date"
                className="font-display block text-lg font-bold text-gray-900"
              >
                Select a Date
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                required
              />
            </div>

            {/* Time Slots */}
            <div>
              <label className="font-display block text-lg font-bold text-gray-900">
                Choose a Time Slot
              </label>
              {!selectedDate && (
                <p className="mt-2 text-sm text-gray-500">
                  Select a date to see available time slots
                </p>
              )}
              {selectedDate && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                        selectedTime === slot
                          ? 'border-brand-purple bg-brand-purple text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-brand-purple/50 hover:bg-brand-purple/5'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Number of Guests */}
            <div>
              <label
                htmlFor="guests"
                className="font-display block text-lg font-bold text-gray-900"
              >
                Number of Guests
              </label>
              <input
                type="number"
                id="guests"
                min={1}
                max={20}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="font-display block text-lg font-bold text-gray-900"
              >
                Special Requests or Notes
              </label>
              <textarea
                id="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything we should know? Allergies, accessibility needs, etc."
                className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-brand-pink to-brand-purple py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
