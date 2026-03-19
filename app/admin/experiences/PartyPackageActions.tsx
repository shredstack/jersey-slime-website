'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface PartyPackageData {
  id: string
  name: string
  description: string
  price: number
  max_guests: number
  duration_minutes: number
  includes: string[] | null
  is_active: boolean
}

export default function PartyPackageActions({
  pkg,
}: {
  pkg: PartyPackageData
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)

  async function toggleActive() {
    setLoading(true)
    try {
      await fetch(`/api/admin/party-packages/${pkg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !pkg.is_active }),
      })
      router.refresh()
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this party package?')) return
    setLoading(true)
    try {
      await fetch(`/api/admin/party-packages/${pkg.id}`, { method: 'DELETE' })
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
          {pkg.is_active ? 'Deactivate' : 'Activate'}
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
        <EditPartyPackageModal
          pkg={pkg}
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

function EditPartyPackageModal({
  pkg,
  onClose,
  onSaved,
}: {
  pkg: PartyPackageData
  onClose: () => void
  onSaved: () => void
}) {
  const [name, setName] = useState(pkg.name)
  const [description, setDescription] = useState(pkg.description)
  const [price, setPrice] = useState(String(pkg.price))
  const [maxGuests, setMaxGuests] = useState(String(pkg.max_guests))
  const [durationMinutes, setDurationMinutes] = useState(String(pkg.duration_minutes))
  const [includes, setIncludes] = useState((pkg.includes ?? []).join('\n'))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const includesArray = includes
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)

      const res = await fetch(`/api/admin/party-packages/${pkg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          max_guests: Number(maxGuests),
          duration_minutes: Number(durationMinutes),
          includes: includesArray,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update party package')
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
        <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Party Package</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
              <input
                type="number"
                min="1"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What&apos;s Included (one item per line)
            </label>
            <textarea
              value={includes}
              onChange={(e) => setIncludes(e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
            />
          </div>
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
            className="rounded-lg bg-brand-purple px-6 py-2 text-sm font-semibold text-white hover:bg-brand-purple/90 transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
