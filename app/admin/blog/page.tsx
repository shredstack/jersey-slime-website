import type { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import DeletePostButton from './DeletePostButton'

export const metadata: Metadata = {
  title: 'Blog Management',
}

export default async function AdminBlogPage() {
  const supabase = createServiceClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, is_published, published_at, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-lg bg-brand-pink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-pink/90 transition-colors"
        >
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {posts && posts.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Slug</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Published</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-gray-900 font-medium max-w-xs truncate">
                      {post.title}
                    </td>
                    <td className="px-6 py-3 text-gray-500 font-mono text-xs">{post.slug}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          post.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {post.is_published ? 'published' : 'draft'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-6 py-3 space-x-3">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="text-brand-purple hover:text-brand-pink text-sm font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <DeletePostButton postId={post.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-6 py-8 text-sm text-gray-500 text-center">
              No blog posts yet.{' '}
              <Link href="/admin/blog/new" className="text-brand-purple hover:text-brand-pink">
                Create your first post
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
