'use client'

import { useState } from 'react'

interface Override {
  id: string
  date: string
  open_time: string | null
  close_time: string | null
  is_closed: boolean
  note: string | null
}

export default function OverridesManager({ initialOverrides }: { initialOverrides: Override[] }) {
  const [overrides, setOverrides] = useState(initialOverrides)
  const [date, setDate] = useState('')
  const [openTime, setOpenTime] = useState('10:00')
  const [closeTime, setCloseTime] = useState('18:00')
  const [isClosed, setIsClosed] = useState(true)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleAdd() {
    if (!date) return
    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/admin/studio-hours/overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          open_time: isClosed ? null : openTime,
          close_time: isClosed ? null : closeTime,
          is_closed: isClosed,
          note: note || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create override')
      }

      const { override } = await res.json()
      setOverrides((prev) => {
        const filtered = prev.filter((o) => o.date !== override.date)
        return [...filtered, override].sort((a, b) => a.date.localeCompare(b.date))
      })
      setDate('')
      setNote('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add override')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/studio-hours/overrides/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setOverrides((prev) => prev.filter((o) => o.id !== id))
      }
    } catch {
      // silently fail
    }
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Date Overrides</h2>
      <p className="text-sm text-gray-500 mb-4">
        Override hours for specific dates (holidays, special hours, closures).
      </p>

      {/* Add form */}
      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 pb-2">
          <input
            type="checkbox"
            checked={isClosed}
            onChange={(e) => setIsClosed(e.target.checked)}
            className="rounded border-gray-300 text-brand-pink focus:ring-brand-pink"
          />
          Closed
        </label>

        {!isClosed && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Open</label>
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Close</label>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Christmas Day"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
          />
        </div>

        <button
          onClick={handleAdd}
          disabled={saving || !date}
          className="rounded-lg bg-brand-pink px-5 py-2 text-sm font-semibold text-white hover:bg-brand-pink/90 transition-colors disabled:opacity-60"
        >
          {saving ? 'Adding…' : 'Add Override'}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {/* Existing overrides */}
      {overrides.length > 0 ? (
        <div className="space-y-2">
          {overrides.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-900">{o.date}</span>
                {o.is_closed ? (
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                    Closed
                  </span>
                ) : (
                  <span className="text-sm text-gray-600">
                    {o.open_time?.slice(0, 5)} – {o.close_time?.slice(0, 5)}
                  </span>
                )}
                {o.note && <span className="text-sm text-gray-400">{o.note}</span>}
              </div>
              <button
                onClick={() => handleDelete(o.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No date overrides set.</p>
      )}
    </section>
  )
}
