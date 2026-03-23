'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { compressImage } from '@/lib/compress-image'

interface GalleryPhoto {
  id: string
  title: string
  alt_text: string
  image_url: string
  category: string
  sort_order: number
  is_visible: boolean
}

const CATEGORY_OPTIONS = ['studio', 'parties', 'slime', 'events', 'behind-the-scenes']

const emptyForm: Omit<GalleryPhoto, 'id'> = {
  title: '',
  alt_text: '',
  image_url: '',
  category: 'studio',
  sort_order: 0,
  is_visible: true,
}

export default function GalleryManager({ initialPhotos }: { initialPhotos: GalleryPhoto[] }) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bulkUploading, setBulkUploading] = useState(false)
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bulkFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPhotos(initialPhotos)
  }, [initialPhotos])

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
    setError(null)
  }

  function openEdit(photo: GalleryPhoto) {
    setEditingId(photo.id)
    setForm({
      title: photo.title,
      alt_text: photo.alt_text,
      image_url: photo.image_url,
      category: photo.category,
      sort_order: photo.sort_order,
      is_visible: photo.is_visible,
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

  async function uploadImage(file: File): Promise<string | null> {
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('gallery-images')
      .upload(fileName, file, { cacheControl: '31536000', upsert: false })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    const { data: urlData } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(fileName)

    return urlData.publicUrl
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, etc.)')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const processed = file.size > 5 * 1024 * 1024 ? await compressImage(file) : file
      const url = await uploadImage(processed)
      if (url) {
        setForm((prev) => ({ ...prev, image_url: url }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function handleBulkUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (imageFiles.length === 0) {
      setError('No valid image files selected')
      return
    }

    setBulkUploading(true)
    setBulkProgress({ current: 0, total: imageFiles.length })
    setError(null)

    const newPhotos: GalleryPhoto[] = []

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      setBulkProgress({ current: i + 1, total: imageFiles.length })

      try {
        const processed = file.size > 5 * 1024 * 1024 ? await compressImage(file) : file
        const url = await uploadImage(processed)
        if (!url) continue

        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
            alt_text: 'Jersey Slime Studio 38 photo',
            image_url: url,
            category: 'studio',
            sort_order: photos.length + i,
            is_visible: true,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          newPhotos.push(data.photo)
        }
      } catch {
        // Continue with remaining files
      }
    }

    setPhotos((prev) => [...prev, ...newPhotos])
    setBulkUploading(false)
    setBulkProgress({ current: 0, total: 0 })

    if (bulkFileInputRef.current) bulkFileInputRef.current.value = ''
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const url = editingId ? `/api/admin/gallery/${editingId}` : '/api/admin/gallery'
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
      const saved = data.photo as GalleryPhoto

      if (editingId) {
        setPhotos((prev) => prev.map((p) => (p.id === editingId ? saved : p)))
      } else {
        setPhotos((prev) => [...prev, saved])
      }

      closeForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this photo?')) return
    setDeletingId(id)
    setError(null)

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete')
      }
      setPhotos((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleToggleVisibility(photo: GalleryPhoto) {
    try {
      const res = await fetch(`/api/admin/gallery/${photo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: !photo.is_visible }),
      })

      if (res.ok) {
        const data = await res.json()
        setPhotos((prev) => prev.map((p) => (p.id === photo.id ? data.photo : p)))
      }
    } catch {
      setError('Failed to update visibility')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Photo Gallery</h1>
        <div className="flex gap-2">
          <button
            onClick={() => bulkFileInputRef.current?.click()}
            disabled={bulkUploading}
            className="rounded-lg border border-brand-pink px-4 py-2 text-sm font-semibold text-brand-pink hover:bg-brand-pink/5 transition-colors disabled:opacity-50"
          >
            {bulkUploading
              ? `Uploading ${bulkProgress.current}/${bulkProgress.total}...`
              : 'Bulk Upload'}
          </button>
          <input
            ref={bulkFileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleBulkUpload}
            className="hidden"
          />
          <button
            onClick={openAdd}
            className="rounded-lg bg-brand-pink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-pink/90 transition-colors"
          >
            Add Photo
          </button>
        </div>
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
              {editingId ? 'Edit Photo' : 'Add New Photo'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Optional title for this photo"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={form.alt_text}
                  onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
                  placeholder="Describe the image for accessibility"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                {form.image_url ? (
                  <div className="relative inline-block">
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="h-40 w-full rounded-lg object-cover border border-gray-200"
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
                    className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-8 text-sm text-gray-500 hover:border-brand-pink hover:text-brand-pink transition-colors disabled:opacity-50"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.is_visible}
                    onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-brand-pink focus:ring-brand-pink"
                  />
                  Visible on website
                </label>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || uploading || !form.image_url}
                  className="flex-1 rounded-lg bg-brand-pink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-pink/90 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Photo' : 'Add Photo'}
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

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-2">No photos yet.</p>
          <p className="text-sm text-gray-400">
            Add photos individually or use bulk upload to add multiple at once.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`group relative overflow-hidden rounded-xl border shadow-sm ${
                photo.is_visible ? 'border-gray-200' : 'border-orange-200 bg-orange-50/50'
              }`}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={photo.image_url}
                  alt={photo.alt_text || photo.title || 'Gallery photo'}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              {!photo.is_visible && (
                <div className="absolute top-2 left-2">
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                    Hidden
                  </span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className="rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium text-white capitalize">
                  {photo.category.replace(/-/g, ' ')}
                </span>
              </div>
              <div className="p-3">
                {photo.title && (
                  <p className="text-sm font-medium text-gray-900 truncate">{photo.title}</p>
                )}
                <div className="flex gap-1.5 mt-2">
                  <button
                    onClick={() => openEdit(photo)}
                    className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(photo)}
                    className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {photo.is_visible ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    disabled={deletingId === photo.id}
                    className="rounded-lg border border-red-200 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deletingId === photo.id ? '...' : 'Del'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
