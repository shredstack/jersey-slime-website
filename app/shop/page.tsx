import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shop Our Slime',
  description:
    'Shop handmade slimes from Jersey Slime Studio 38. Browse our Shopify store for butter, cloud, crunchy, clear, and foam slimes shipped right to your door.',
  openGraph: {
    title: 'Shop Our Slime | Jersey Slime Studio 38',
    description:
      'Shop handmade slimes from Jersey Slime Studio 38. Browse our Shopify store for butter, cloud, crunchy, clear, and foam slimes shipped right to your door.',
  },
}

export default function ShopPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-yellow/20 via-brand-pink/10 to-brand-purple/20 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Shop Our Slime
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Take the Jersey Slime Studio 38 experience home! Browse our collection of handmade
            slimes, slime kits, and accessories.
          </p>
        </div>
      </section>

      {/* Shopify CTA */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-3xl bg-gradient-to-br from-brand-pink via-brand-purple to-brand-blue p-1 shadow-lg transition-shadow hover:shadow-2xl"
          >
            <div className="rounded-[1.35rem] bg-white p-8 md:p-12">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-pink/10">
                  <svg
                    className="h-8 w-8 text-brand-pink"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
                <h2 className="font-display text-2xl font-bold text-gray-900 md:text-3xl">
                  Visit Our Shopify Store
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-gray-600">
                  Our full slime collection is available on our Shopify store. Browse dozens of
                  unique slimes, seasonal specials, and slime-making kits — all shipped directly to
                  your door.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-pink px-8 py-3 font-semibold text-white transition-colors group-hover:bg-brand-purple">
                  Shop Now
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="border-t border-gray-200 bg-gray-50 py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <span className="inline-block rounded-full bg-brand-teal/10 px-4 py-1.5 text-sm font-semibold text-brand-teal">
            Coming Soon
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold text-gray-900 md:text-3xl">
            On-Site Shopping Experience
          </h2>
          <p className="mt-4 text-gray-600">
            We&apos;re working on bringing the full shopping experience right here to our website!
            Soon you&apos;ll be able to browse, customize, and order your favorite slimes without
            ever leaving jerseyslimestudio.com. Stay tuned for updates.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { title: 'Browse & Filter', desc: 'Search by texture, color, scent, and more.' },
              { title: 'Custom Slime Builder', desc: 'Design your own slime with our builder tool.' },
              { title: 'Subscription Boxes', desc: 'Monthly slime deliveries straight to your door.' },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-display font-bold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
