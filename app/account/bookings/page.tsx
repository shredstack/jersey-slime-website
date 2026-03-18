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

  // Fetch bookings with slot info
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select(`
      id,
      guest_count,
      status,
      total_price,
      notes,
      slot_id,
      availability_slots!slot_id (
        date,
        start_time,
        end_time,
        experience_id
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (bookingsError) {
    console.error('Bookings fetch error:', bookingsError)
  }

  // Fetch experience names in a separate query to avoid PostgREST multi-level join issues
  const experienceIds = Array.from(
    new Set(
      (bookings ?? [])
        .map((b: any) => b.availability_slots?.experience_id)
        .filter(Boolean)
    )
  )
  const experienceMap: Record<string, string> = {}
  if (experienceIds.length > 0) {
    const { data: experiences } = await supabase
      .from('experiences')
      .select('id, title')
      .in('id', experienceIds)
    for (const exp of experiences ?? []) {
      experienceMap[exp.id] = exp.title
    }
  }

  // Normalize bookings into a flat shape for the client component
  const allBookings = ((bookings ?? []) as any[]).map((b) => ({
    id: b.id as string,
    guest_count: b.guest_count as number,
    status: b.status as string,
    total_price: b.total_price as number,
    notes: b.notes as string | null,
    slot_id: b.slot_id as string,
    slot_date: (b.availability_slots?.date as string) ?? null,
    slot_start_time: (b.availability_slots?.start_time as string) ?? null,
    slot_end_time: (b.availability_slots?.end_time as string) ?? null,
    experience_name: b.availability_slots?.experience_id
      ? experienceMap[b.availability_slots.experience_id] ?? 'Slime Experience'
      : 'Slime Experience',
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
