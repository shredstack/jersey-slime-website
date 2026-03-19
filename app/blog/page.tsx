import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Blog & Updates',
  description:
    'Read the latest tips, tutorials, and news from Jersey Slime Studio 38. Learn slime-making techniques, get party ideas, and stay up to date with studio events.',
  openGraph: {
    title: 'Blog & Updates | Jersey Slime Studio 38',
    description:
      'Read the latest tips, tutorials, and news from Jersey Slime Studio 38.',
  },
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, cover_image_url, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-pink/20 via-brand-yellow/10 to-brand-teal/20 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Blog &amp; Updates
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Tips, tutorials, and news from the slime studio. Stay in the loop with everything
            happening at Jersey Slime Studio 38.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          {posts && posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  {/* Cover image */}
                  <div className="relative h-48 bg-brand-pink/10">
                    {post.cover_image_url ? (
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="h-16 w-16 rounded-2xl bg-brand-pink/30" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {post.published_at && (
                      <time className="text-sm text-gray-500">
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    )}
                    <h2 className="mt-2 font-display text-xl font-bold text-gray-900 group-hover:text-brand-pink transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-pink hover:text-brand-purple transition-colors"
                    >
                      Read More
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">
              No blog posts yet. Check back soon!
            </p>
          )}
        </div>
      </section>
    </>
  )
}
