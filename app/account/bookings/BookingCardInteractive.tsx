'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

interface AvailabilitySlot {
  id: string
  start_time: string
  end_time: string
  spots_remaining: number
}

interface BookingData {
  id: string
  guest_count: number
  status: string
  total_price: number
  notes: string | null
  slot_id: string
  slot_date: string | null
  slot_start_time: string | null
  slot_end_time: string | null
  experience_name: string
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

function formatDateDisplay(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  )
}

/* ───────────────── Cancel Confirmation Dialog ───────────────── */

function CancelDialog({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 z-50 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border-none bg-white p-0 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">Cancel Booking</h3>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Keep Booking
          </Button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </div>
      </div>
    </dialog>
  )
}

/* ───────────────── Edit Booking Sheet ───────────────── */

function EditSheet({
  open,
  onClose,
  booking,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  booking: BookingData
  onSaved: () => void
}) {
  const [selectedDate, setSelectedDate] = useState(booking.slot_date ?? '')
  const [selectedSlotId, setSelectedSlotId] = useState(booking.slot_id)
  const [guests, setGuests] = useState(booking.guest_count)
  const [notes, setNotes] = useState(booking.notes ?? '')
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const sheetRef = useRef<HTMLDialogElement>(null)

  // Reset form when opening
  useEffect(() => {
    if (open) {
      setSelectedDate(booking.slot_date ?? '')
      setSelectedSlotId(booking.slot_id)
      setGuests(booking.guest_count)
      setNotes(booking.notes ?? '')
      setError('')
    }
  }, [open, booking])

  useEffect(() => {
    const dialog = sheetRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Fetch slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setSlots([])
      return
    }

    setLoadingSlots(true)
    const supabase = createClient()
    supabase
      .from('availability_slots')
      .select('id, start_time, end_time, spots_remaining')
      .eq('date', selectedDate)
      .gt('spots_remaining', 0)
      .order('start_time')
      .then(({ data }) => {
        let allSlots = data ?? []

        // If viewing the same date as the current booking, include the current slot
        // even if it shows 0 remaining (because the user already has those spots)
        if (selectedDate === booking.slot_date) {
          const currentSlotExists = allSlots.some((s) => s.id === booking.slot_id)
          if (!currentSlotExists && booking.slot_id) {
            // The current slot might show 0 remaining, add it back with the user's spots
            allSlots = [
              {
                id: booking.slot_id,
                start_time: booking.slot_start_time ?? '',
                end_time: booking.slot_end_time ?? '',
                spots_remaining: booking.guest_count,
              },
              ...allSlots,
            ].sort((a, b) => a.start_time.localeCompare(b.start_time))
          }
        }

        setSlots(allSlots)
        setLoadingSlots(false)

        // If changing date, clear slot selection (unless it's the original date)
        if (selectedDate !== booking.slot_date) {
          setSelectedSlotId('')
        }
      })
  }, [selectedDate, booking.slot_date, booking.slot_id, booking.slot_start_time, booking.slot_end_time, booking.guest_count])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!selectedSlotId) {
      setError('Please select a time slot.')
      return
    }

    if (guests < 1) {
      setError('At least 1 guest is required.')
      return
    }

    // Check if anything actually changed
    const slotChanged = selectedSlotId !== booking.slot_id
    const guestsChanged = guests !== booking.guest_count
    const notesChanged = notes !== (booking.notes ?? '')

    if (!slotChanged && !guestsChanged && !notesChanged) {
      onClose()
      return
    }

    setSubmitting(true)

    try {
      const payload: Record<string, unknown> = { action: 'update' }
      if (slotChanged) payload.slot_id = selectedSlotId
      if (guestsChanged) payload.guest_count = guests
      if (notesChanged) payload.notes = notes

      const res = await fetch(`/api/booking/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      onSaved()
    } catch {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <dialog
      ref={sheetRef}
      onClose={onClose}
      className="fixed inset-0 z-50 m-0 h-full w-full max-w-none border-none bg-transparent p-0 backdrop:bg-black/40 backdrop:backdrop-blur-sm sm:m-auto sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-lg sm:rounded-2xl"
    >
      <div className="flex h-full flex-col bg-white sm:max-h-[90vh] sm:rounded-2xl sm:shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Booking</h3>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5">
          <div className="space-y-6">
            {/* Date */}
            <div>
              <label htmlFor="edit-date" className="block text-sm font-semibold text-gray-900">
                Date
              </label>
              <input
                type="date"
                id="edit-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={today}
                className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                required
              />
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-sm font-semibold text-gray-900">Time</label>
              {!selectedDate && (
                <p className="mt-1.5 text-sm text-gray-500">Select a date to see times</p>
              )}
              {selectedDate && loadingSlots && (
                <p className="mt-1.5 text-sm text-gray-500">Loading times...</p>
              )}
              {selectedDate && !loadingSlots && slots.length === 0 && (
                <p className="mt-1.5 text-sm text-gray-500">No available slots for this date.</p>
              )}
              {selectedDate && !loadingSlots && slots.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition ${
                        selectedSlotId === slot.id
                          ? 'border-purple-500 bg-purple-500 text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {formatTime(slot.start_time)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Guest Count */}
            <div>
              <label htmlFor="edit-guests" className="block text-sm font-semibold text-gray-900">
                Number of Guests
              </label>
              <input
                type="number"
                id="edit-guests"
                min={1}
                max={20}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="edit-notes" className="block text-sm font-semibold text-gray-900">
                Special Requests
              </label>
              <textarea
                id="edit-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergies, accessibility needs, etc."
                className="mt-1.5 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={onClose}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

/* ───────────────── Main Booking Card ───────────────── */

export default function BookingCardInteractive({
  booking,
  isUpcoming,
}: {
  booking: BookingData
  isUpcoming: boolean
}) {
  const router = useRouter()
  const [showCancel, setShowCancel] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const dateStr = booking.slot_date
    ? formatDateDisplay(booking.slot_date)
    : 'Date unavailable'
  const timeStr = booking.slot_start_time
    ? formatTime(booking.slot_start_time)
    : ''

  const canModify =
    isUpcoming && booking.status !== 'cancelled' && booking.status !== 'completed'

  async function handleCancel() {
    setCancelling(true)
    try {
      const res = await fetch(`/api/booking/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      })

      if (res.ok) {
        setShowCancel(false)
        router.refresh()
      }
    } catch {
      // Error handling is minimal — the dialog stays open for retry
    } finally {
      setCancelling(false)
    }
  }

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900">{booking.experience_name}</h3>
            <p className="mt-1 text-sm text-gray-600">
              {dateStr}
              {timeStr ? ` at ${timeStr}` : ''}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {booking.guest_count} guest{booking.guest_count !== 1 ? 's' : ''}
            </p>
            {booking.notes && (
              <p className="mt-2 text-sm text-gray-400 italic">
                &ldquo;{booking.notes}&rdquo;
              </p>
            )}
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {canModify && (
          <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowEdit(true)}
              className="flex-1 sm:flex-none"
            >
              Edit Booking
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCancel(true)}
              className="flex-1 text-red-500 hover:bg-red-50 hover:text-red-600 sm:flex-none"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <CancelDialog
        open={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={handleCancel}
        loading={cancelling}
      />

      <EditSheet
        open={showEdit}
        onClose={() => setShowEdit(false)}
        booking={booking}
        onSaved={() => {
          setShowEdit(false)
          router.refresh()
        }}
      />
    </>
  )
}
