import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import BlogPostForm from '../../BlogPostForm'

export const metadata: Metadata = {
  title: 'Edit Blog Post',
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, content_format, content_markdown_source, cover_image_url, is_published')
    .eq('id', id)
    .single()

  if (!post) notFound()

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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Blog Post</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <BlogPostForm
          mode="edit"
          postId={post.id}
          defaultValues={{
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            content_format: post.content_format,
            content_markdown_source: post.content_markdown_source,
            cover_image_url: post.cover_image_url,
            is_published: post.is_published,
          }}
        />
      </div>
    </div>
  )
}
