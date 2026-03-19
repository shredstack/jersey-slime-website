import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate, formatTime } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Experiences | Jersey Slime Studio',
  description:
    "Explore our slime-making experiences at Jersey Slime Studio. From walk-in sessions to private events, there's something for everyone.",
  openGraph: {
    title: 'Experiences | Jersey Slime Studio',
    description:
      "Explore our slime-making experiences at Jersey Slime Studio. From walk-in sessions to private events, there's something for everyone.",
  },
}

export default async function ExperiencesPage() {
  const supabase = await createClient()

  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .eq('is_active', true)
    .eq('is_special', false)
    .order('sort_order')

  const today = new Date().toISOString().split('T')[0]
  const { data: specialEvents } = await supabase
    .from('experiences')
    .select('*')
    .eq('is_active', true)
    .eq('is_special', true)
    .gte('event_date', today)
    .order('event_date')

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
            At Jersey Slime Studio, every visit is an adventure. Our
            experienced staff will guide you through the slime-making process
            step by step — all materials included. Just bring your imagination
            (and maybe an apron)!
          </p>
        </div>
      </section>

      {/* Experience Cards */}
      <section className="bg-gradient-to-b from-white to-brand-purple/5 py-16 px-6">
        <div className="mx-auto max-w-5xl">
          {experiences && experiences.length > 0 ? (
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
                      <span className="text-sm font-medium text-gray-500">Price</span>
                      <span className="text-lg font-bold text-brand-purple">
                        {formatPrice(exp.price_per_person)}/person
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Duration</span>
                      <span className="text-sm font-semibold text-gray-700">
                        {exp.duration_minutes} minutes
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/book?experience=${exp.id}`}
                    className="mt-6 block rounded-full bg-gradient-to-r from-brand-pink to-brand-purple py-3 text-center font-bold text-white transition hover:scale-105 hover:shadow-md"
                  >
                    Book Now
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Check back soon for our upcoming experiences!
            </p>
          )}
        </div>
      </section>

      {/* Special Events */}
      {specialEvents && specialEvents.length > 0 && (
        <section className="bg-gradient-to-b from-brand-purple/5 to-brand-pink/5 py-16 px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              Upcoming Special Events
            </h2>
            <p className="mt-3 text-center text-gray-600">
              Limited-time events you won&rsquo;t want to miss!
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {specialEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col rounded-2xl bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg ring-2 ring-brand-purple/20"
                >
                  <div className="mb-3">
                    <span className="inline-block rounded-full bg-brand-purple/10 px-3 py-1 text-xs font-semibold text-brand-purple">
                      Special Event
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-gray-900">
                    {event.title}
                  </h3>
                  <p className="mt-3 flex-1 text-gray-600">{event.description}</p>
                  <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Date</span>
                      <span className="text-sm font-semibold text-gray-700">
                        {event.event_date ? formatDate(event.event_date) : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Time</span>
                      <span className="text-sm font-semibold text-gray-700">
                        {event.event_start_time ? formatTime(event.event_start_time) : ''} –{' '}
                        {event.event_end_time ? formatTime(event.event_end_time) : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Price</span>
                      <span className="text-lg font-bold text-brand-purple">
                        {formatPrice(event.price_per_person)}/person
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/book?experience=${event.id}`}
                    className="mt-6 block rounded-full bg-gradient-to-r from-brand-purple to-brand-pink py-3 text-center font-bold text-white transition hover:scale-105 hover:shadow-md"
                  >
                    Book This Event
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
