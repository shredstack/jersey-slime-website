import type { Metadata } from 'next'
import Link from 'next/link'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

// Placeholder post data keyed by slug
const posts: Record<
  string,
  { title: string; date: string; author: string; colorHex: string }
> = {
  '5-tips-for-perfect-butter-slime': {
    title: '5 Tips for Making the Perfect Butter Slime at Home',
    date: 'March 10, 2026',
    author: 'Jersey Slime Studio 38 Team',
    colorHex: '#FDE047',
  },
  'ultimate-slime-party-guide': {
    title: 'The Ultimate Guide to Hosting a Slime Birthday Party',
    date: 'February 24, 2026',
    author: 'Jersey Slime Studio 38 Team',
    colorHex: '#FF6B9D',
  },
  'why-slime-is-great-for-kids': {
    title: "Why Slime Making Is Great for Kids' Development",
    date: 'February 10, 2026',
    author: 'Jersey Slime Studio 38 Team',
    colorHex: '#C084FC',
  },
}

function formatSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = posts[slug]
  const title = post?.title ?? formatSlug(slug)

  return {
    title,
    description: `Read "${title}" on the Jersey Slime Studio 38 blog. Tips, tutorials, and news from Utah's favorite slime studio.`,
    openGraph: {
      title: `${title} | Jersey Slime Studio 38`,
      description: `Read "${title}" on the Jersey Slime Studio 38 blog.`,
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = posts[slug]

  const title = post?.title ?? formatSlug(slug)
  const date = post?.date ?? 'January 1, 2026'
  const author = post?.author ?? 'Jersey Slime Studio 38 Team'
  const colorHex = post?.colorHex ?? '#C084FC'

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
            <time className="text-sm text-gray-500">{date}</time>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-gray-600">
              By <span className="font-medium text-gray-900">{author}</span>
            </p>
          </header>

          {/* Cover image placeholder */}
          <div
            className="mt-10 flex h-64 items-center justify-center rounded-2xl md:h-80"
            style={{ backgroundColor: colorHex + '30' }}
          >
            <div
              className="h-20 w-20 rounded-2xl"
              style={{ backgroundColor: colorHex }}
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg mx-auto mt-10 max-w-3xl">
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-gray-900">
              Getting Started
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit
              voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
              illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
              quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-gray-900">
              Tips and Tricks
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
              voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
              occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
              mollitia animi, id est laborum et dolorum fuga.
            </p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>Start with high-quality PVA glue for the best results</li>
              <li>Always add activator slowly — you can add more but cannot take it back</li>
              <li>Store your slime in an airtight container to keep it fresh</li>
              <li>Experiment with different add-ins like foam beads, glitter, and clay</li>
              <li>Knead your slime thoroughly for the smoothest texture</li>
            </ul>

            <h2 className="mt-10 font-display text-2xl font-bold text-gray-900">
              Final Thoughts
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum
              soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat
              facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus
              autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et
              voluptates repudiandae sint et molestiae non recusandae.
            </p>
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
