'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ExperienceData {
  id: string
  title: string
  description: string
  price_per_person: number
  duration_minutes: number
  max_capacity: number
  is_active: boolean
  is_special: boolean
  event_date: string | null
  event_start_time: string | null
  event_end_time: string | null
  max_bookings: number | null
}

export default function ExperienceActions({
  experience,
}: {
  experience: ExperienceData
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)

  async function toggleActive() {
    setLoading(true)
    try {
      await fetch(`/api/admin/experiences/${experience.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !experience.is_active }),
      })
      router.refresh()
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this experience?')) return
    setLoading(true)
    try {
      await fetch(`/api/admin/experiences/${experience.id}`, { method: 'DELETE' })
      router.refresh()
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setEditing(true)}
          disabled={loading}
          className="text-sm font-medium text-brand-purple hover:text-brand-pink transition-colors disabled:opacity-50"
        >
          Edit
        </button>
        <button
          onClick={toggleActive}
          disabled={loading}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
        >
          {experience.is_active ? 'Deactivate' : 'Activate'}
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      {editing && (
        <EditExperienceModal
          experience={experience}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false)
            router.refresh()
          }}
        />
      )}
    </>
  )
}

function EditExperienceModal({
  experience,
  onClose,
  onSaved,
}: {
  experience: ExperienceData
  onClose: () => void
  onSaved: () => void
}) {
  const [title, setTitle] = useState(experience.title)
  const [description, setDescription] = useState(experience.description)
  const [pricePerPerson, setPricePerPerson] = useState(String(experience.price_per_person))
  const [durationMinutes, setDurationMinutes] = useState(String(experience.duration_minutes))
  const [maxCapacity, setMaxCapacity] = useState(String(experience.max_capacity))
  const [isSpecial, setIsSpecial] = useState(experience.is_special)
  const [eventDate, setEventDate] = useState(experience.event_date ?? '')
  const [eventStartTime, setEventStartTime] = useState(experience.event_start_time?.slice(0, 5) ?? '')
  const [eventEndTime, setEventEndTime] = useState(experience.event_end_time?.slice(0, 5) ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const body: Record<string, unknown> = {
        title,
        description,
        price_per_person: Number(pricePerPerson),
        duration_minutes: Number(durationMinutes),
        max_capacity: Number(maxCapacity),
        is_special: isSpecial,
      }

      if (isSpecial) {
        body.event_date = eventDate
        body.event_start_time = eventStartTime
        body.event_end_time = eventEndTime
      } else {
        body.event_date = null
        body.event_start_time = null
        body.event_end_time = null
      }

      const res = await fetch(`/api/admin/experiences/${experience.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update experience')
      }

      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Experience</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price/Person ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={pricePerPerson}
                onChange={(e) => setPricePerPerson(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
              <input
                type="number"
                min="15"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
              <input
                type="number"
                min="1"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                required
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={isSpecial}
              onChange={(e) => setIsSpecial(e.target.checked)}
              className="rounded border-gray-300 text-brand-pink focus:ring-brand-pink"
            />
            This is a special event (one-off date/time)
          </label>

          {isSpecial && (
            <div className="grid grid-cols-3 gap-3 rounded-lg border border-brand-pink/20 bg-brand-pink/5 p-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-brand-pink px-6 py-2 text-sm font-semibold text-white hover:bg-brand-pink/90 transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
