import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Experiences | Jersey Slime Studio 38',
  description:
    'Explore our slime-making experiences at Jersey Slime Studio 38. From walk-in sessions to private events, there\'s something for everyone.',
  openGraph: {
    title: 'Experiences | Jersey Slime Studio 38',
    description:
      'Explore our slime-making experiences at Jersey Slime Studio 38. From walk-in sessions to private events, there\'s something for everyone.',
  },
}

// In production these would come from Supabase
const experiences = [
  {
    id: 'basic-slime',
    title: 'Basic Slime Session',
    description:
      'Perfect for first-timers! Choose from our base recipes, pick your colors and mix-ins, and create two custom slimes to take home. Great for kids ages 5 and up.',
    price: '$25',
    duration: '45 minutes',
  },
  {
    id: 'deluxe-slime',
    title: 'Deluxe Slime Experience',
    description:
      'Level up your slime game! Includes premium add-ins like foam beads, glitter, and scented oils. Create three custom slimes plus a bonus surprise container.',
    price: '$40',
    duration: '60 minutes',
  },
  {
    id: 'slime-masterclass',
    title: 'Slime Masterclass',
    description:
      'For the ultimate slime fan! Learn advanced techniques like butter slime, cloud slime, and jiggly slime. Includes all premium materials and five take-home containers.',
    price: '$60',
    duration: '90 minutes',
  },
]

export default function ExperiencesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-teal via-brand-blue to-brand-purple py-24 px-6 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-5xl font-bold sm:text-6xl">
            Our Experiences
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Whether you&rsquo;re a slime newbie or a seasoned pro, we have the
            perfect hands-on experience waiting for you.
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-gray-700">
            At Jersey Slime Studio 38, every visit is an adventure. Our
            experienced staff will guide you through the slime-making process
            step by step — all materials included. Just bring your imagination
            (and maybe an apron)!
          </p>
        </div>
      </section>

      {/* Experience Cards */}
      <section className="bg-gradient-to-b from-white to-brand-purple/5 py-16 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="flex flex-col rounded-2xl bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="font-display text-xl font-bold text-gray-900">
                  {exp.title}
                </h3>
                <p className="mt-3 flex-1 text-gray-600">{exp.description}</p>
                <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Price
                    </span>
                    <span className="text-lg font-bold text-brand-purple">
                      {exp.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Duration
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {exp.duration}
                    </span>
                  </div>
                </div>
                <Link
                  href="/book"
                  className="mt-6 block rounded-full bg-gradient-to-r from-brand-pink to-brand-purple py-3 text-center font-bold text-white transition hover:scale-105 hover:shadow-md"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
