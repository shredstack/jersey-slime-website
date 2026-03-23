'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { compressImage } from '@/lib/compress-image'
import ContentEditor from '@/components/admin/ContentEditor'

type BlogPostFormProps = {
  mode: 'create' | 'edit'
  postId?: string
  defaultValues?: {
    title: string
    slug: string
    excerpt: string
    content: string
    content_format?: string
    content_markdown_source?: string | null
    cover_image_url: string
    is_published: boolean
  }
}

export default function BlogPostForm({ mode, postId, defaultValues }: BlogPostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(defaultValues?.title ?? '')
  const [slug, setSlug] = useState(defaultValues?.slug ?? '')
  const [excerpt, setExcerpt] = useState(defaultValues?.excerpt ?? '')
  const [content, setContent] = useState(defaultValues?.content ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState(defaultValues?.cover_image_url ?? '')
  const [isPublished, setIsPublished] = useState(defaultValues?.is_published ?? false)
  const [contentFormat, setContentFormat] = useState(defaultValues?.content_format ?? 'html')
  const [markdownSource, setMarkdownSource] = useState<string | null>(defaultValues?.content_markdown_source ?? null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit')

  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-generate slug from title in create mode
  useEffect(() => {
    if (!slugManuallyEdited && mode === 'create') {
      setSlug(slugify(title))
    }
  }, [title, slugManuallyEdited, mode])

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
      let fileToUpload = file

      if (file.size > 4.5 * 1024 * 1024) {
        setUploadStatus(`Compressing image (${(file.size / 1024 / 1024).toFixed(1)}MB)…`)
        fileToUpload = await compressImage(file)
        setUploadStatus('Uploading…')
      } else {
        setUploadStatus('Uploading…')
      }

      const supabase = createClient()
      const ext = fileToUpload.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, fileToUpload, { cacheControl: '31536000', upsert: false })

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`)
        return
      }

      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)

      setCoverImageUrl(urlData.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? `Upload failed: ${err.message}` : 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setUploadStatus(null)
    }
  }

  const handleInlineImageUpload = useCallback(async (file: File): Promise<string> => {
    if (!file.type.startsWith('image/')) throw new Error('Please select an image file (JPG, PNG, WebP, etc.)')

    let fileToUpload = file
    if (file.size > 4.5 * 1024 * 1024) {
      fileToUpload = await compressImage(file)
    }

    const supabase = createClient()
    const ext = fileToUpload.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(fileName, fileToUpload, { cacheControl: '31536000', upsert: false })

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName)

    return urlData.publicUrl
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const url = mode === 'create' ? '/api/admin/blog' : `/api/admin/blog/${postId}`
      const method = mode === 'create' ? 'POST' : 'PATCH'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          content_format: markdownSource ? 'markdown' : 'html',
          content_markdown_source: markdownSource,
          cover_image_url: coverImageUrl,
          is_published: isPublished,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
        return
      }

      router.push('/admin/blog')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
          placeholder="5 Tips for Making the Perfect Slime"
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug <span className="text-red-500">*</span>
          <span className="ml-1 font-normal text-gray-400 text-xs">(URL-friendly, auto-generated from title)</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 whitespace-nowrap">/blog/</span>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugManuallyEdited(true)
            }}
            required
            pattern="^[a-z0-9-]+$"
            title="Lowercase letters, numbers, and hyphens only"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
          Excerpt <span className="text-red-500">*</span>
          <span className="ml-1 font-normal text-gray-400 text-xs">(shown in blog listings)</span>
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple resize-none"
          placeholder="A short summary of the post…"
        />
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cover Image
        </label>

        {coverImageUrl ? (
          <div className="space-y-3">
            <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImageUrl}
                alt="Cover preview"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setCoverImageUrl('')
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Remove image
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                fileInputRef.current?.click()
              }
            }}
            role="button"
            tabIndex={0}
            className="flex flex-col items-center justify-center w-full max-w-md h-40 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-brand-purple hover:bg-gray-100 transition-colors"
          >
            {uploading ? (
              <div className="text-center">
                <svg className="w-6 h-6 text-brand-purple animate-spin mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm text-gray-500">{uploadStatus ?? 'Uploading…'}</p>
              </div>
            ) : (
              <>
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
                </svg>
                <p className="text-sm text-gray-500">Click to upload an image</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WebP — large images auto-compressed</p>
              </>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content <span className="text-red-500">*</span>
        </label>
        <ContentEditor
          value={content}
          onChange={setContent}
          markdownSource={markdownSource}
          onMarkdownSourceChange={setMarkdownSource}
          initialMode={
            defaultValues?.content_format === 'markdown'
              ? 'markdown'
              : defaultValues?.content_format === 'plaintext'
                ? 'html'
                : 'visual'
          }
          onImageUpload={handleInlineImageUpload}
          placeholder="Start writing your blog post..."
        />
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={isPublished}
          onClick={() => setIsPublished((v) => !v)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 ${
            isPublished ? 'bg-brand-purple' : 'bg-gray-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              isPublished ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {isPublished ? 'Published' : 'Draft'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="rounded-lg bg-brand-pink px-5 py-2 text-sm font-semibold text-white hover:bg-brand-pink/90 transition-colors disabled:opacity-50"
        >
          {submitting
            ? mode === 'create'
              ? 'Creating…'
              : 'Saving…'
            : mode === 'create'
              ? 'Create Post'
              : 'Save Changes'}
        </button>
        <a
          href="/admin/blog"
          className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
