import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { formatPrice, formatDate, formatTime } from '@/lib/utils'
import BookingStatusSelect from './BookingStatusSelect'

export const metadata: Metadata = {
  title: 'Manage Bookings',
}

export default async function AdminBookingsPage() {
  const supabase = createServiceClient()

  const { data: bookings } = await supabase
    .from('bookings')
    .select(
      `id, guest_count, total_price, status, notes, created_at,
       profile:profiles(full_name, email, phone),
       slot:availability_slots(date, start_time, end_time, experience:experiences(title))`
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
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => {
                  const profile = booking.profile as {
                    full_name: string
                    email: string
                    phone: string | null
                  } | null
                  const slot = booking.slot as {
                    date: string
                    start_time: string
                    end_time: string
                    experience: { title: string } | null
                  } | null
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <p className="font-medium text-gray-900">{profile?.full_name ?? '—'}</p>
                        <p className="text-xs text-gray-500">{profile?.email ?? ''}</p>
                      </td>
                      <td className="px-6 py-3 text-gray-700">{slot?.experience?.title ?? '—'}</td>
                      <td className="px-6 py-3 text-gray-700">
                        {slot ? (
                          <>
                            <p>{formatDate(slot.date)}</p>
                            <p className="text-xs text-gray-500">
                              {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                            </p>
                          </>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-6 py-3 text-gray-700">{booking.guest_count}</td>
                      <td className="px-6 py-3 text-gray-700">{formatPrice(booking.total_price)}</td>
                      <td className="px-6 py-3">
                        <BookingStatusSelect
                          bookingId={booking.id}
                          currentStatus={booking.status as 'pending' | 'confirmed' | 'cancelled'}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <p className="px-6 py-8 text-sm text-gray-500 text-center">No bookings yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
