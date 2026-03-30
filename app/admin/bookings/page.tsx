import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import BookingsManager from './BookingsManager'

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
      <BookingsManager bookings={(bookings as any) ?? []} />
    </div>
  )
}
