import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Jersey Slime Studio 38 | Utah\'s Premier Slime-Making Experience',
  description:
    'Welcome to Jersey Slime Studio 38! Create your own custom slime, book birthday parties, and shop our handmade slime collection in Utah.',
  openGraph: {
    title: 'Jersey Slime Studio 38 | Utah\'s Premier Slime-Making Experience',
    description:
      'Welcome to Jersey Slime Studio 38! Create your own custom slime, book birthday parties, and shop our handmade slime collection in Utah.',
    type: 'website',
  },
}

const valueProps = [
  {
    emoji: '🎨',
    title: 'Create Your Own Slime',
    description:
      'Choose your colors, scents, and mix-ins to craft a one-of-a-kind slime masterpiece.',
  },
  {
    emoji: '🎉',
    title: 'Birthday Parties',
    description:
      'Celebrate with the ultimate slime party! Packages for every budget and group size.',
  },
  {
    emoji: '🛍️',
    title: 'Shop Our Slime',
    description:
      'Take home our handcrafted slimes — from butter slime to cloud slime and everything in between.',
  },
]

const testimonials = [
  {
    name: 'Sarah M.',
    text: 'My daughter had the best birthday party ever! The staff was amazing and every kid left with the coolest slime creations.',
    rating: 5,
  },
  {
    name: 'Jake T.',
    text: 'Such a fun experience for the whole family. We come back every month to try new slime recipes. Absolutely love this place!',
    rating: 5,
  },
  {
    name: 'Emily R.',
    text: 'The studio is so colorful and welcoming. My kids were entertained for hours and the slime quality is top-notch.',
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-pink via-brand-purple to-brand-blue py-24 px-6 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-5xl font-bold leading-tight sm:text-6xl md:text-7xl">
            <span className="bg-gradient-to-r from-brand-yellow via-brand-teal to-white bg-clip-text text-transparent">
              Welcome to Jersey Slime Studio 38
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 sm:text-xl">
            Utah&rsquo;s most colorful slime-making experience! Stretch your
            creativity, squish your stress away, and take home something truly
            unique.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/book"
              className="rounded-full bg-brand-yellow px-8 py-4 text-lg font-bold text-gray-900 shadow-lg transition hover:scale-105 hover:shadow-xl"
            >
              Book an Experience
            </Link>
            <Link
              href="/slime"
              className="rounded-full border-2 border-white bg-white/10 px-8 py-4 text-lg font-bold text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white/20 hover:shadow-xl"
            >
              Explore Our Slime
            </Link>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-teal/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-brand-yellow/30 blur-3xl" />
      </section>

      {/* Value Props */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            Why You&rsquo;ll Love It Here
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {valueProps.map((prop) => (
              <div
                key={prop.title}
                className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-brand-purple/5 p-8 text-center shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-5xl">{prop.emoji}</span>
                <h3 className="font-display mt-4 text-xl font-bold text-gray-900">
                  {prop.title}
                </h3>
                <p className="mt-3 text-gray-600">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-brand-purple/10 to-brand-pink/10 py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            What Our Guests Say
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl bg-white p-8 shadow-md"
              >
                <div className="mb-3 text-brand-yellow">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="text-gray-700">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-4 font-bold text-gray-900">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-brand-teal via-brand-blue to-brand-purple py-20 px-6 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Ready to Get Slimy?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
            Whether it&rsquo;s a party, a date night, or just a fun afternoon
            &mdash; we&rsquo;ve got the perfect slime experience for you.
          </p>
          <Link
            href="/book"
            className="mt-8 inline-block rounded-full bg-brand-yellow px-10 py-4 text-lg font-bold text-gray-900 shadow-lg transition hover:scale-105 hover:shadow-xl"
          >
            Book Now
          </Link>
        </div>
      </section>
    </main>
  )
}
