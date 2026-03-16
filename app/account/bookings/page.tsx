import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'My Bookings',
}

const upcomingBookings = [
  {
    id: '1',
    experience: 'Slime Making Workshop',
    date: 'March 22, 2026',
    time: '2:00 PM',
    guests: 4,
    status: 'confirmed',
  },
  {
    id: '2',
    experience: 'Glow-in-the-Dark Slime Party',
    date: 'April 5, 2026',
    time: '11:00 AM',
    guests: 8,
    status: 'pending',
  },
]

const pastBookings = [
  {
    id: '3',
    experience: 'Butter Slime Experience',
    date: 'February 10, 2026',
    time: '3:00 PM',
    guests: 3,
    status: 'completed',
  },
]

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

function BookingCard({ booking }: { booking: (typeof upcomingBookings)[0] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{booking.experience}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {booking.date} at {booking.time}
          </p>
          <p className="mt-1 text-sm text-gray-500">{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
    </div>
  )
}

export default function BookingsPage() {
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

      {/* Tabs - rendered server-side, both sections visible with anchors */}
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
