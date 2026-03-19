'use client'

import { useState, useEffect } from 'react'

export default function StudioCapacityForm() {
  const [maxGuests, setMaxGuests] = useState(10)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/studio-capacity')
      .then((res) => res.json())
      .then((data) => {
        if (data.max_guests) setMaxGuests(data.max_guests)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/studio-capacity', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ max_guests: maxGuests }),
      })

      if (!res.ok) {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error ?? 'Failed to save' })
      } else {
        setMessage({ type: 'success', text: 'Studio capacity updated' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Studio Capacity</h2>
        <p className="text-sm text-gray-500">Loading…</p>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Studio Capacity</h2>
      <p className="text-sm text-gray-500 mb-4">
        Maximum number of guests allowed in the studio at the same time. Time slots that would
        exceed this limit won&apos;t be shown to customers.
      </p>
      <div className="flex items-center gap-4">
        <input
          type="number"
          min={1}
          max={100}
          value={maxGuests}
          onChange={(e) => setMaxGuests(Number(e.target.value))}
          className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
        />
        <span className="text-sm text-gray-500">guests max</span>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-brand-pink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-pink/90 transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      {message && (
        <p
          className={`mt-3 text-sm ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </p>
      )}
    </section>
  )
}
