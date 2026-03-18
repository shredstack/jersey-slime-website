import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EventCardInteractive, { type InquiryData } from './EventCardInteractive'

export const metadata: Metadata = {
  title: 'My Events',
}

function EmptyState({ message, cta }: { message: string; cta?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <p className="text-gray-500">
        {message}{cta ? <> {cta}</> : null}
      </p>
    </div>
  )
}

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const today = new Date().toISOString().split('T')[0]

  // RLS handles visibility (user_id match OR email match), no explicit filter needed.
  const { data: inquiries, error } = await supabase
    .from('party_inquiries')
    .select('id, status, preferred_date, guest_count, age_range, message, total_cost, created_at')
    .order('preferred_date', { ascending: true })

  if (error) {
    console.error('Events fetch error:', error)
  }

  const all = (inquiries ?? []) as InquiryData[]

  const pending = all.filter((i) => i.status === 'new' || i.status === 'contacted')
  const confirmed = all.filter((i) => i.status === 'confirmed' && i.preferred_date >= today)
  const past = all.filter(
    (i) => i.status === 'completed' || (i.status === 'confirmed' && i.preferred_date < today)
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/account"
          className="text-sm text-brand-purple hover:text-brand-pink transition-colors"
        >
          &larr; Back to Account
        </Link>
        <h1 className="mt-2 text-3xl font-display font-bold text-gray-900">My Events</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your party inquiries and upcoming events.
        </p>
      </div>

      <div className="space-y-10">
        {/* Pending Inquiries */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Inquiries</h2>
          {pending.length > 0 ? (
            <div className="space-y-4">
              {pending.map((inquiry) => (
                <EventCardInteractive key={inquiry.id} inquiry={inquiry} editable={true} />
              ))}
            </div>
          ) : (
            <EmptyState
              message="No pending inquiries."
              cta={
                <Link href="/parties#inquiry-form" className="text-brand-pink hover:underline">
                  Submit a party inquiry!
                </Link>
              }
            />
          )}
        </section>

        {/* Confirmed Events */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Confirmed Events</h2>
          <p className="text-sm text-gray-500 mb-4">
            Your upcoming confirmed parties, including the total cost due.
          </p>
          {confirmed.length > 0 ? (
            <div className="space-y-4">
              {confirmed.map((inquiry) => (
                <EventCardInteractive key={inquiry.id} inquiry={inquiry} editable={false} />
              ))}
            </div>
          ) : (
            <EmptyState message="No confirmed events yet. We'll confirm your inquiry within 24 hours." />
          )}
        </section>

        {/* Past Events */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Events</h2>
          {past.length > 0 ? (
            <div className="space-y-4">
              {past.map((inquiry) => (
                <EventCardInteractive key={inquiry.id} inquiry={inquiry} editable={false} />
              ))}
            </div>
          ) : (
            <EmptyState message="No past events yet." />
          )}
        </section>
      </div>
    </div>
  )
}
