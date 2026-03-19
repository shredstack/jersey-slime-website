'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SlimeItem {
  id: string
  name: string
  description: string
  texture_type: string
  color: string
  image_url: string
  is_available: boolean
  sort_order: number
}

const TEXTURE_OPTIONS = ['cloud', 'butter', 'clear', 'crunchy', 'glossy', 'jelly', 'avalanche', 'fluffy', 'foam']

const emptyForm: Omit<SlimeItem, 'id'> = {
  name: '',
  description: '',
  texture_type: '',
  color: '',
  image_url: '',
  is_available: true,
  sort_order: 0,
}

export default function InventoryManager({ initialInventory }: { initialInventory: SlimeItem[] }) {
  const [inventory, setInventory] = useState<SlimeItem[]>(initialInventory)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInventory(initialInventory)
  }, [initialInventory])

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
    setError(null)
  }

  function openEdit(item: SlimeItem) {
    setEditingId(item.id)
    setForm({
      name: item.name,
      description: item.description,
      texture_type: item.texture_type,
      color: item.color,
      image_url: item.image_url,
      is_available: item.is_available,
      sort_order: item.sort_order,
    })
    setShowForm(true)
    setError(null)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, etc.)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('slime-images')
        .upload(fileName, file, { cacheControl: '31536000', upsert: false })

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`)
        return
      }

      const { data: urlData } = supabase.storage
        .from('slime-images')
        .getPublicUrl(fileName)

      setForm((prev) => ({ ...prev, image_url: urlData.publicUrl }))
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const url = editingId ? `/api/admin/inventory/${editingId}` : '/api/admin/inventory'
      const method = editingId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }

      const data = await res.json()
      const saved = data.slime as SlimeItem

      if (editingId) {
        setInventory((prev) => prev.map((item) => (item.id === editingId ? saved : item)))
      } else {
        setInventory((prev) => [...prev, saved])
      }

      closeForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this slime?')) return
    setDeletingId(id)
    setError(null)

    try {
      const res = await fetch(`/api/admin/inventory/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete')
      }
      setInventory((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Slime Inventory</h1>
        <button
          onClick={openAdd}
          className="rounded-lg bg-brand-pink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-pink/90 transition-colors"
        >
          Add New Slime
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingId ? 'Edit Slime' : 'Add New Slime'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Texture Type</label>
                  <select
                    required
                    value={form.texture_type}
                    onChange={(e) => setForm({ ...form, texture_type: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
                  >
                    <option value="">Select texture</option>
                    {TEXTURE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pink, #FF6B9D"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                {form.image_url ? (
                  <div className="relative inline-block">
                    <img
                      src={form.image_url}
                      alt="Slime preview"
                      className="h-32 w-32 rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ ...form, image_url: '' })
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600"
                    >
                      x
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500 hover:border-brand-pink hover:text-brand-pink transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Click to upload image'}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.is_available}
                      onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-brand-pink focus:ring-brand-pink"
                    />
                    Available
                  </label>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 rounded-lg bg-brand-pink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-pink/90 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Slime' : 'Add Slime'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Grid */}
      {inventory.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-500">No slime items yet. Add your first slime!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start gap-3">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full flex-shrink-0 bg-brand-pink/20 flex items-center justify-center text-brand-pink text-xs font-bold">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 capitalize">{item.texture_type} &middot; {item.color}</p>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                      item.is_available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="flex-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {deletingId === item.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
