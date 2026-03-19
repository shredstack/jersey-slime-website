import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BookingCardInteractive from './BookingCardInteractive'

export const metadata: Metadata = {
  title: 'My Bookings',
}

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const today = new Date().toISOString().split('T')[0]

  // Fetch bookings with direct experience join (no more availability_slots)
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select(`
      id,
      guest_count,
      status,
      total_price,
      notes,
      booking_date,
      start_time,
      end_time,
      experience_id,
      experience:experiences(title)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (bookingsError) {
    console.error('Bookings fetch error:', bookingsError)
  }

  // Normalize bookings into a flat shape for the client component
  const allBookings = ((bookings ?? []) as any[]).map((b) => ({
    id: b.id as string,
    guest_count: b.guest_count as number,
    status: b.status as string,
    total_price: b.total_price as number,
    notes: b.notes as string | null,
    slot_date: b.booking_date as string | null,
    slot_start_time: b.start_time as string | null,
    slot_end_time: b.end_time as string | null,
    experience_name: (b.experience as { title: string } | null)?.title ?? 'Slime Experience',
  }))

  const upcomingBookings = allBookings.filter(
    (b) => b.slot_date && b.slot_date >= today && b.status !== 'cancelled'
  )
  const pastBookings = allBookings.filter(
    (b) => !b.slot_date || b.slot_date < today || b.status === 'cancelled'
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
        <h1 className="mt-2 text-3xl font-display font-bold text-gray-900">My Bookings</h1>
      </div>

      <div className="space-y-10">
        {/* Upcoming */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h2>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <BookingCardInteractive
                  key={booking.id}
                  booking={booking}
                  isUpcoming={true}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="text-gray-500">
                No upcoming bookings.{' '}
                <Link href="/experiences" className="text-brand-pink hover:underline">
                  Book your first experience!
                </Link>
              </p>
            </div>
          )}
        </section>

        {/* Past */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Past</h2>
          {pastBookings.length > 0 ? (
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <BookingCardInteractive
                  key={booking.id}
                  booking={booking}
                  isUpcoming={false}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="text-gray-500">No past bookings yet.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
