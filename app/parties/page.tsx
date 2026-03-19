import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import PartyInquiryForm from './PartyInquiryForm'

export const metadata: Metadata = {
  title: 'Birthday Parties | Jersey Slime Studio',
  description:
    'Book a slime birthday party at Jersey Slime Studio in Utah. Choose from multiple party packages with slime creations, party hosts, and more.',
}

const GRADIENT_COLORS = [
  'from-brand-teal to-brand-blue',
  'from-brand-pink to-brand-purple',
  'from-brand-purple to-brand-pink',
  'from-brand-blue to-brand-teal',
  'from-brand-pink to-brand-blue',
]

function formatDuration(minutes: number): string {
  const hours = minutes / 60
  if (hours === Math.floor(hours)) return `${hours} hour${hours > 1 ? 's' : ''}`
  return `${hours} hours`
}

export default async function PartiesPage() {
  const supabase = createServiceClient()

  const { data: packages } = await supabase
    .from('party_packages')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  const activePackages = packages ?? []

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-pink via-brand-purple to-brand-blue py-24 px-6 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-5xl font-bold sm:text-6xl">
            Slime Birthday Parties
          </h1>
          <p className="mt-4 text-lg text-white/90">
            The most fun, colorful, and unforgettable birthday party your
            kid will ever have. Guaranteed.
          </p>
        </div>
      </section>

      {/* Party Packages */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            Choose Your Package
          </h2>
          {activePackages.length > 0 ? (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {activePackages.map((pkg, i) => {
                const color = GRADIENT_COLORS[i % GRADIENT_COLORS.length]
                const includes = (pkg.includes as string[] | null) ?? []
                return (
                  <div
                    key={pkg.id}
                    className="flex flex-col rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Header */}
                    <div
                      className={`rounded-t-2xl bg-gradient-to-r ${color} px-6 py-6 text-center text-white`}
                    >
                      <h3 className="font-display text-2xl font-bold">
                        {pkg.name}
                      </h3>
                      <p className="mt-1 text-4xl font-extrabold">{formatPrice(pkg.price)}</p>
                    </div>
                    {/* Details */}
                    <div className="flex flex-1 flex-col px-6 py-6">
                      <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
                        <span>{formatDuration(pkg.duration_minutes)}</span>
                        <span>Up to {pkg.max_guests} guests</span>
                      </div>
                      {includes.length > 0 && (
                        <ul className="flex-1 space-y-2">
                          {includes.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-gray-700">
                              <span className="mt-0.5 text-brand-teal">&#10003;</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <a
                        href="#inquiry-form"
                        className={`mt-6 block rounded-full bg-gradient-to-r ${color} py-3 text-center font-bold text-white transition hover:scale-105 hover:shadow-md`}
                      >
                        Inquire Now
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="mt-12 text-center text-gray-500">
              Party packages are coming soon! Please contact us for more details.
            </p>
          )}
        </div>
      </section>

      {/* Party Inquiry Form */}
      <PartyInquiryForm
        packages={activePackages.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
        }))}
      />
    </main>
  )
}
