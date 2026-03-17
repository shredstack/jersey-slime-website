import type { Metadata } from 'next'
import Link from 'next/link'

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

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  colorHex: string
}

const blogPosts: BlogPost[] = [
  {
    slug: '5-tips-for-perfect-butter-slime',
    title: '5 Tips for Making the Perfect Butter Slime at Home',
    excerpt:
      'Butter slime is one of our most popular textures — and for good reason! Learn the secrets our slime artists use to get that silky smooth, spreadable consistency every time.',
    date: 'March 10, 2026',
    colorHex: '#FDE047',
  },
  {
    slug: 'ultimate-slime-party-guide',
    title: 'The Ultimate Guide to Hosting a Slime Birthday Party',
    excerpt:
      'Planning a slime-themed birthday party? From invitations to party favors, here is everything you need to know to throw the most memorable slime party in Utah.',
    date: 'February 24, 2026',
    colorHex: '#FF6B9D',
  },
  {
    slug: 'why-slime-is-great-for-kids',
    title: 'Why Slime Making Is Great for Kids\' Development',
    excerpt:
      'Slime isn\'t just fun — it\'s educational! Discover how making slime helps kids develop fine motor skills, learn basic chemistry, and express creativity.',
    date: 'February 10, 2026',
    colorHex: '#C084FC',
  },
]

export default function BlogPage() {
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                {/* Cover image placeholder */}
                <div
                  className="flex h-48 items-center justify-center"
                  style={{ backgroundColor: post.colorHex + '30' }}
                >
                  <div
                    className="h-16 w-16 rounded-2xl"
                    style={{ backgroundColor: post.colorHex }}
                  />
                </div>

                <div className="p-6">
                  <time className="text-sm text-gray-500">{post.date}</time>
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
        </div>
      </section>
    </>
  )
}
