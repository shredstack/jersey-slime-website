'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AvailabilitySlot {
  id: string
  start_time: string
  end_time: string
  spots_remaining: number
}

function formatTime(time: string) {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function BookPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlotId, setSelectedSlotId] = useState('')
  const [guests, setGuests] = useState(1)
  const [notes, setNotes] = useState('')
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!selectedDate) {
      setSlots([])
      setSelectedSlotId('')
      return
    }

    setLoadingSlots(true)
    setSelectedSlotId('')

    const supabase = createClient()
    supabase
      .from('availability_slots')
      .select('id, start_time, end_time, spots_remaining')
      .eq('date', selectedDate)
      .gt('spots_remaining', 0)
      .order('start_time')
      .then(({ data }) => {
        setSlots(data ?? [])
        setLoadingSlots(false)
      })
  }, [selectedDate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!selectedSlotId) {
      setError('Please select a time slot.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot_id: selectedSlotId, guest_count: guests, notes }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      router.push('/account/bookings')
    } catch {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
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
                min={new Date().toISOString().split('T')[0]}
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
              {selectedDate && loadingSlots && (
                <p className="mt-2 text-sm text-gray-500">Loading available times…</p>
              )}
              {selectedDate && !loadingSlots && slots.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  No available slots for this date. Please try another day.
                </p>
              )}
              {selectedDate && !loadingSlots && slots.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                        selectedSlotId === slot.id
                          ? 'border-brand-purple bg-brand-purple text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-brand-purple/50 hover:bg-brand-purple/5'
                      }`}
                    >
                      {formatTime(slot.start_time)}
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

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-gradient-to-r from-brand-pink to-brand-purple py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? 'Confirming…' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
