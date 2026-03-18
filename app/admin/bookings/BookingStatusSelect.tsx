'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export default function BookingStatusSelect({
  bookingId,
  currentStatus,
}: {
  bookingId: string
  currentStatus: BookingStatus
}) {
  const [status, setStatus] = useState<BookingStatus>(currentStatus)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as BookingStatus
    setSaving(true)
    setStatus(newStatus)
    try {
      await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const colorClass =
    status === 'confirmed'
      ? 'text-green-700 bg-green-50 border-green-200'
      : status === 'cancelled'
        ? 'text-red-700 bg-red-50 border-red-200'
        : 'text-yellow-700 bg-yellow-50 border-yellow-200'

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={saving}
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium border capitalize cursor-pointer disabled:opacity-50 ${colorClass}`}
    >
      <option value="pending">pending</option>
      <option value="confirmed">confirmed</option>
      <option value="cancelled">cancelled</option>
    </select>
  )
}
