'use client'

import { useState } from 'react'

interface DayHours {
  day_of_week: number
  day_name: string
  open_time: string
  close_time: string
  is_closed: boolean
}

export default function StudioHoursForm({ initialHours }: { initialHours: DayHours[] }) {
  const [hours, setHours] = useState(initialHours)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function updateDay(index: number, field: string, value: string | boolean) {
    setHours((prev) =>
      prev.map((day, i) => (i === index ? { ...day, [field]: value } : day))
    )
  }

  async function handleSave() {
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/admin/studio-hours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          days: hours.map((h) => ({
            day_of_week: h.day_of_week,
            open_time: h.open_time,
            close_time: h.close_time,
            is_closed: h.is_closed,
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }

      setMessage('Studio hours saved successfully!')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to save hours')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Schedule</h2>
      <div className="space-y-3">
        {hours.map((day, i) => (
          <div
            key={day.day_of_week}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-100 px-4 py-3"
          >
            <span className="w-24 text-sm font-medium text-gray-900">{day.day_name}</span>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={day.is_closed}
                onChange={(e) => updateDay(i, 'is_closed', e.target.checked)}
                className="rounded border-gray-300 text-brand-pink focus:ring-brand-pink"
              />
              Closed
            </label>

            {!day.is_closed && (
              <>
                <input
                  type="time"
                  value={day.open_time}
                  onChange={(e) => updateDay(i, 'open_time', e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                />
                <span className="text-sm text-gray-400">to</span>
                <input
                  type="time"
                  value={day.close_time}
                  onChange={(e) => updateDay(i, 'close_time', e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                />
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-brand-pink px-6 py-2 text-sm font-semibold text-white hover:bg-brand-pink/90 transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Hours'}
        </button>
        {message && (
          <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  )
}
