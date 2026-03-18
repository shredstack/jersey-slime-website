import type { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { formatPrice, formatDate, formatTime } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
}

export default async function AdminDashboardPage() {
  const supabase = createServiceClient()

  const [
    { count: totalBookings },
    { count: pendingInquiries },
    { count: activeExperiences },
    { count: inventoryItems },
    { data: recentBookings },
    { data: recentInquiries },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase
      .from('party_inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new'),
    supabase
      .from('experiences')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('slime_inventory')
      .select('*', { count: 'exact', head: true })
      .eq('is_available', true),
    supabase
      .from('bookings')
      .select(
        `id, guest_count, status, created_at,
         profile:profiles(full_name, email),
         slot:availability_slots(date, start_time, experience:experiences(title))`
      )
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('party_inquiries')
      .select(`id, contact_name, preferred_date, guest_count, status, package:party_packages(name)`)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    { label: 'Total Bookings', value: totalBookings ?? 0 },
    { label: 'Pending Inquiries', value: pendingInquiries ?? 0 },
    { label: 'Active Experiences', value: activeExperiences ?? 0 },
    { label: 'Inventory Items', value: inventoryItems ?? 0 },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-brand-purple hover:text-brand-pink transition-colors">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentBookings && recentBookings.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Experience</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentBookings.map((booking) => {
                  const profile = booking.profile as { full_name: string; email: string } | null
                  const slot = booking.slot as {
                    date: string
                    start_time: string
                    experience: { title: string } | null
                  } | null
                  return (
                    <tr key={booking.id}>
                      <td className="px-6 py-3 text-gray-900">{profile?.full_name ?? '—'}</td>
                      <td className="px-6 py-3 text-gray-700">{slot?.experience?.title ?? '—'}</td>
                      <td className="px-6 py-3 text-gray-700">
                        {slot ? `${formatDate(slot.date)} at ${formatTime(slot.start_time)}` : '—'}
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={booking.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <p className="px-6 py-4 text-sm text-gray-500">No bookings yet.</p>
          )}
        </div>
      </section>

      {/* Recent Party Inquiries */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Party Inquiries</h2>
          <Link href="/admin/parties" className="text-sm text-brand-purple hover:text-brand-pink transition-colors">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentInquiries && recentInquiries.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Contact</th>
                  <th className="px-6 py-3 font-medium">Package</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Guests</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentInquiries.map((inquiry) => {
                  const pkg = inquiry.package as { name: string } | null
                  return (
                    <tr key={inquiry.id}>
                      <td className="px-6 py-3 text-gray-900">{inquiry.contact_name}</td>
                      <td className="px-6 py-3 text-gray-700">{pkg?.name ?? '—'}</td>
                      <td className="px-6 py-3 text-gray-700">{formatDate(inquiry.preferred_date)}</td>
                      <td className="px-6 py-3 text-gray-700">{inquiry.guest_count}</td>
                      <td className="px-6 py-3">
                        <InquiryStatusBadge status={inquiry.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <p className="px-6 py-4 text-sm text-gray-500">No party inquiries yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const classes =
    status === 'confirmed'
      ? 'bg-green-100 text-green-700'
      : status === 'cancelled'
        ? 'bg-red-100 text-red-700'
        : 'bg-yellow-100 text-yellow-700'
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${classes}`}>
      {status}
    </span>
  )
}

function InquiryStatusBadge({ status }: { status: string }) {
  const classes =
    status === 'confirmed' || status === 'completed'
      ? 'bg-green-100 text-green-700'
      : status === 'contacted'
        ? 'bg-blue-100 text-blue-700'
        : 'bg-yellow-100 text-yellow-700'
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${classes}`}>
      {status}
    </span>
  )
}
