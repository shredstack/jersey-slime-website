'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Experience {
  id: string
  title: string
  description: string
  price_per_person: number
  duration_minutes: number
  is_special: boolean
  event_date: string | null
}

interface TimeSlot {
  start_time: string
  end_time: string
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 || 12
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export default function BookPage() {
  return (
    <Suspense fallback={<BookPageSkeleton />}>
      <BookPageInner />
    </Suspense>
  )
}

function BookPageSkeleton() {
  return (
    <main>
      <section className="bg-gradient-to-br from-brand-yellow via-brand-pink to-brand-purple py-24 px-6 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-5xl font-bold sm:text-6xl">Book Your Experience</h1>
          <p className="mt-4 text-lg text-white/90">Loading...</p>
        </div>
      </section>
    </main>
  )
}

function BookPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedId = searchParams.get('experience')

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [selectedExperience, setSelectedExperience] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [guests, setGuests] = useState(1)
  const [notes, setNotes] = useState('')
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingExperiences, setLoadingExperiences] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Load experiences on mount
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('experiences')
      .select('id, title, description, price_per_person, duration_minutes, is_special, event_date')
      .eq('is_active', true)
      .order('is_special')
      .order('sort_order')
      .then(({ data }) => {
        setExperiences(data ?? [])
        setLoadingExperiences(false)

        // Pre-select if URL param provided
        if (preselectedId && data?.some((e) => e.id === preselectedId)) {
          setSelectedExperience(preselectedId)
        }
      })
  }, [preselectedId])

  // Fetch available slots when experience + date + guests change
  useEffect(() => {
    if (!selectedExperience || !selectedDate || guests < 1) {
      setSlots([])
      setSelectedSlot('')
      return
    }

    setLoadingSlots(true)
    setSelectedSlot('')

    fetch(`/api/availability?date=${selectedDate}&experience_id=${selectedExperience}&guest_count=${guests}`)
      .then((res) => res.json())
      .then((data) => {
        setSlots(data.slots ?? [])
        setLoadingSlots(false)
      })
      .catch(() => {
        setSlots([])
        setLoadingSlots(false)
      })
  }, [selectedExperience, selectedDate, guests])

  const selected = experiences.find((e) => e.id === selectedExperience)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!selectedExperience) {
      setError('Please select an experience.')
      return
    }
    if (!selectedSlot) {
      setError('Please select a time slot.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experience_id: selectedExperience,
          date: selectedDate,
          start_time: selectedSlot,
          guest_count: guests,
          notes,
        }),
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
            Pick your experience, choose a date and time, and get ready for some slimy fun!
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
            {/* Step 1: Choose Experience */}
            <div>
              <label className="font-display block text-lg font-bold text-gray-900">
                Choose Your Experience
              </label>
              {loadingExperiences ? (
                <p className="mt-2 text-sm text-gray-500">Loading experiences…</p>
              ) : experiences.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">
                  No experiences available right now. Check back soon!
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {experiences.map((exp) => (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => {
                        setSelectedExperience(exp.id)
                        // If it's a special event with a fixed date, auto-set the date
                        if (exp.is_special && exp.event_date) {
                          setSelectedDate(exp.event_date)
                        }
                      }}
                      className={`w-full text-left rounded-xl border-2 p-4 transition ${
                        selectedExperience === exp.id
                          ? 'border-brand-purple bg-brand-purple/5'
                          : 'border-gray-200 hover:border-brand-purple/50 hover:bg-brand-purple/5'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {exp.title}
                            {exp.is_special && (
                              <span className="ml-2 inline-block rounded-full bg-brand-purple/10 px-2 py-0.5 text-xs font-medium text-brand-purple">
                                Special Event
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">{exp.description}</p>
                        </div>
                        <div className="ml-4 text-right flex-shrink-0">
                          <p className="font-bold text-brand-purple">{formatPrice(exp.price_per_person)}</p>
                          <p className="text-xs text-gray-500">{exp.duration_minutes} min</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Choose Date */}
            {selectedExperience && (
              <div>
                <label
                  htmlFor="date"
                  className="font-display block text-lg font-bold text-gray-900"
                >
                  {selected?.is_special ? 'Event Date' : 'Select a Date'}
                </label>
                {selected?.is_special && selected.event_date ? (
                  <p className="mt-2 text-sm text-gray-600">
                    This event is on{' '}
                    <span className="font-semibold">{selected.event_date}</span>
                  </p>
                ) : (
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                    required
                  />
                )}
              </div>
            )}

            {/* Step 3: Number of Guests */}
            {selectedExperience && selectedDate && (
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
                {selected && (
                  <p className="mt-2 text-sm text-gray-500">
                    Estimated total:{' '}
                    <span className="font-semibold text-brand-purple">
                      {formatPrice(selected.price_per_person * guests)}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Step 4: Choose Time */}
            {selectedExperience && selectedDate && guests >= 1 && (
              <div>
                <label className="font-display block text-lg font-bold text-gray-900">
                  Choose a Time
                </label>
                {loadingSlots && (
                  <p className="mt-2 text-sm text-gray-500">Loading available times…</p>
                )}
                {!loadingSlots && slots.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    No available times for this date. Please try another day.
                  </p>
                )}
                {!loadingSlots && slots.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {slots.map((slot) => (
                      <button
                        key={slot.start_time}
                        type="button"
                        onClick={() => setSelectedSlot(slot.start_time)}
                        className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                          selectedSlot === slot.start_time
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
            )}

            {/* Step 5: Notes */}
            {selectedSlot && (
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
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}

            {/* Submit */}
            {selectedSlot && (
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-gradient-to-r from-brand-pink to-brand-purple py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? 'Confirming…' : 'Confirm Booking'}
              </button>
            )}
          </form>
        </div>
      </section>
    </main>
  )
}
