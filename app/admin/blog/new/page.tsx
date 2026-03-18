import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostForm from '../BlogPostForm'

export const metadata: Metadata = {
  title: 'New Blog Post',
}

export default function NewBlogPostPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Link
          href="/admin/blog"
          className="text-sm text-gray-500 hover:text-brand-purple transition-colors"
        >
          ← Blog Management
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">New Blog Post</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <BlogPostForm mode="create" />
      </div>
    </div>
  )
}
