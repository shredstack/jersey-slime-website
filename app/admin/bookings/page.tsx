import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import BookingTableBody from './BookingTableBody'

export const metadata: Metadata = {
  title: 'Manage Bookings',
}

export default async function AdminBookingsPage() {
  const supabase = createServiceClient()

  const { data: bookings } = await supabase
    .from('bookings')
    .select(
      `id, guest_count, total_price, status, notes, booking_date, start_time, end_time, created_at,
       profile:profiles(full_name, email, phone),
       experience:experiences(title)`
    )
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Bookings</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {bookings && bookings.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Experience</th>
                  <th className="px-6 py-3 font-medium">Date &amp; Time</th>
                  <th className="px-6 py-3 font-medium">Guests</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <BookingTableBody bookings={bookings as any} />
            </table>
          ) : (
            <p className="px-6 py-8 text-sm text-gray-500 text-center">No bookings yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
