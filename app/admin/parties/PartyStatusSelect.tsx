'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type InquiryStatus = 'new' | 'contacted' | 'confirmed' | 'completed'

export default function PartyStatusSelect({
  inquiryId,
  currentStatus,
}: {
  inquiryId: string
  currentStatus: InquiryStatus
}) {
  const [status, setStatus] = useState<InquiryStatus>(currentStatus)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as InquiryStatus
    setSaving(true)
    setStatus(newStatus)
    try {
      await fetch(`/api/admin/parties/${inquiryId}`, {
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
    status === 'confirmed' || status === 'completed'
      ? 'text-green-700 bg-green-50 border-green-200'
      : status === 'contacted'
        ? 'text-blue-700 bg-blue-50 border-blue-200'
        : 'text-yellow-700 bg-yellow-50 border-yellow-200'

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={saving}
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium border capitalize cursor-pointer disabled:opacity-50 ${colorClass}`}
    >
      <option value="new">new</option>
      <option value="contacted">contacted</option>
      <option value="confirmed">confirmed</option>
      <option value="completed">completed</option>
    </select>
  )
}
