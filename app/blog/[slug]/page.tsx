import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('title, slug, content, excerpt, cover_image_url, published_at')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Jersey Slime Studio 38`,
      description: post.excerpt,
      type: 'article',
      ...(post.cover_image_url ? { images: [post.cover_image_url] } : {}),
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      {/* Back link */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-brand-pink transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>

      <article className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          {/* Header */}
          <header className="text-center">
            {post.published_at && (
              <time className="text-sm text-gray-500">
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            )}
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {post.title}
            </h1>
          </header>

          {/* Cover image */}
          {post.cover_image_url && (
            <div className="relative mt-10 h-64 overflow-hidden rounded-2xl md:h-80">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg mx-auto mt-10 max-w-3xl whitespace-pre-line text-gray-600 leading-relaxed">
            {post.content}
          </div>

          {/* Back link bottom */}
          <div className="mt-12 border-t border-gray-200 pt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-purple"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
