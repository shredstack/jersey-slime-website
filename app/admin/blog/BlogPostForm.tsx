'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'

type BlogPostFormProps = {
  mode: 'create' | 'edit'
  postId?: string
  defaultValues?: {
    title: string
    slug: string
    excerpt: string
    content: string
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
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-generate slug from title in create mode
  useEffect(() => {
    if (!slugManuallyEdited && mode === 'create') {
      setSlug(slugify(title))
    }
  }, [title, slugManuallyEdited, mode])

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

      {/* Cover Image URL */}
      <div>
        <label htmlFor="cover_image_url" className="block text-sm font-medium text-gray-700 mb-1">
          Cover Image URL
        </label>
        <input
          id="cover_image_url"
          type="url"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
          placeholder="https://…"
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={20}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
          placeholder="Write your blog post content here…"
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
          disabled={submitting}
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
