import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'My Bookings',
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  )
}

interface Booking {
  id: string
  guest_count: number
  status: string
  total_price: number
  notes: string | null
  availability_slots: {
    date: string
    start_time: string
    end_time: string
    experiences: {
      name: string
    }
  }
}

function BookingCard({ booking }: { booking: Booking }) {
  const slot = booking.availability_slots
  const dateStr = new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const timeStr = new Date(`2000-01-01T${slot.start_time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{slot.experiences.name}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {dateStr} at {timeStr}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {booking.guest_count} guest{booking.guest_count !== 1 ? 's' : ''}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
    </div>
  )
}

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const today = new Date().toISOString().split('T')[0]

  // Fetch bookings with slot and experience info
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id,
      guest_count,
      status,
      total_price,
      notes,
      availability_slots (
        date,
        start_time,
        end_time,
        experiences (
          name
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allBookings = (bookings ?? []) as unknown as Booking[]

  const upcomingBookings = allBookings.filter(
    (b) => b.availability_slots.date >= today && b.status !== 'cancelled'
  )
  const pastBookings = allBookings.filter(
    (b) => b.availability_slots.date < today || b.status === 'cancelled'
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
                <BookingCard key={booking.id} booking={booking} />
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
                <BookingCard key={booking.id} booking={booking} />
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
