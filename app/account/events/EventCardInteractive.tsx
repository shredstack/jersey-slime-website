'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

const STATUS_LABELS: Record<string, string> = {
  new: 'Inquiry Received',
  contacted: 'In Review',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-yellow-100 text-yellow-700',
  contacted: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
}

export interface InquiryData {
  id: string
  status: string
  preferred_date: string
  guest_count: number
  age_range: string
  message: string
  total_cost: number | null
}

function formatDateDisplay(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount)
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

/* ───────────────── Edit Sheet ───────────────── */

function EditSheet({
  open,
  onClose,
  inquiry,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  inquiry: InquiryData
  onSaved: () => void
}) {
  const [preferredDate, setPreferredDate] = useState(inquiry.preferred_date)
  const [guestCount, setGuestCount] = useState(inquiry.guest_count)
  const [ageRange, setAgeRange] = useState(inquiry.age_range)
  const [message, setMessage] = useState(inquiry.message)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const sheetRef = useRef<HTMLDialogElement>(null)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (open) {
      setPreferredDate(inquiry.preferred_date)
      setGuestCount(inquiry.guest_count)
      setAgeRange(inquiry.age_range)
      setMessage(inquiry.message)
      setError('')
    }
  }, [open, inquiry])

  useEffect(() => {
    const dialog = sheetRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const unchanged =
      preferredDate === inquiry.preferred_date &&
      guestCount === inquiry.guest_count &&
      ageRange === inquiry.age_range &&
      message === inquiry.message

    if (unchanged) {
      onClose()
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/parties/${inquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', preferred_date: preferredDate, guest_count: guestCount, age_range: ageRange, message }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      onSaved()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <dialog
      ref={sheetRef}
      onClose={onClose}
      className="fixed inset-0 z-50 m-0 h-full w-full max-w-none border-none bg-transparent p-0 backdrop:bg-black/40 backdrop:backdrop-blur-sm sm:m-auto sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-lg sm:rounded-2xl"
    >
      <div className="flex h-full flex-col bg-white sm:max-h-[90vh] sm:rounded-2xl sm:shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Inquiry</h3>
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
          <div className="space-y-5">
            {/* Preferred Date */}
            <div>
              <label htmlFor="edit-date" className="block text-sm font-semibold text-gray-900">
                Preferred Date
              </label>
              <input
                type="date"
                id="edit-date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                min={today}
                className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                required
              />
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
                max={30}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                required
              />
            </div>

            {/* Age Range */}
            <div>
              <label htmlFor="edit-age" className="block text-sm font-semibold text-gray-900">
                Age Range
              </label>
              <select
                id="edit-age"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                required
              >
                <option value="3-5">3 – 5 years</option>
                <option value="6-8">6 – 8 years</option>
                <option value="9-12">9 – 12 years</option>
                <option value="13+">13+ years</option>
                <option value="mixed">Mixed ages</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="edit-message" className="block text-sm font-semibold text-gray-900">
                Additional Notes
              </label>
              <textarea
                id="edit-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Theme ideas, special requests, dietary restrictions, etc."
                className="mt-1.5 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <Button type="button" variant="ghost" size="lg" onClick={onClose} disabled={submitting} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="lg" disabled={submitting} className="flex-1">
              {submitting ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

/* ───────────────── Main Card ───────────────── */

export default function EventCardInteractive({
  inquiry,
  editable,
}: {
  inquiry: InquiryData
  editable: boolean
}) {
  const router = useRouter()
  const [showEdit, setShowEdit] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const canCancel = !['cancelled', 'completed'].includes(inquiry.status)

  const packageMatch = inquiry.message.match(/Package:\s*(Basic|Deluxe|Ultimate)/i)
  const packageLabel = packageMatch ? `${packageMatch[1]} Party` : null

  async function handleCancel() {
    if (!confirm('Are you sure you want to cancel this party inquiry?')) return

    setCancelling(true)
    try {
      const res = await fetch(`/api/parties/${inquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      })

      if (res.ok) {
        router.refresh()
      }
    } finally {
      setCancelling(false)
    }
  }

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900">
              {packageLabel ?? 'Party Inquiry'}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Preferred date: {formatDateDisplay(inquiry.preferred_date)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {inquiry.guest_count} guest{inquiry.guest_count !== 1 ? 's' : ''} &middot; Ages {inquiry.age_range}
            </p>
            {inquiry.total_cost !== null && (
              <p className="mt-3 text-base font-semibold text-brand-purple">
                Total: {formatCurrency(inquiry.total_cost)}
              </p>
            )}
          </div>
          <StatusBadge status={inquiry.status} />
        </div>

        {(editable || canCancel) && (
          <div className="mt-4 flex gap-3 border-t border-gray-100 pt-4">
            {editable && (
              <Button variant="secondary" size="sm" onClick={() => setShowEdit(true)}>
                Edit Inquiry
              </Button>
            )}
            {canCancel && (
              <Button variant="ghost" size="sm" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? 'Cancelling…' : 'Cancel Inquiry'}
              </Button>
            )}
          </div>
        )}
      </div>

      {editable && (
        <EditSheet
          open={showEdit}
          onClose={() => setShowEdit(false)}
          inquiry={inquiry}
          onSaved={() => {
            setShowEdit(false)
            router.refresh()
          }}
        />
      )}
    </>
  )
}
