import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
}

const stats = [
  { label: 'Total Bookings', value: '142' },
  { label: 'Pending Inquiries', value: '8' },
  { label: 'Active Experiences', value: '6' },
  { label: 'Inventory Items', value: '34' },
]

const recentBookings = [
  { customer: 'Jane Smith', experience: 'Slime Workshop', date: 'Mar 20, 2026', status: 'confirmed' },
  { customer: 'Mike Johnson', experience: 'Glow Slime Party', date: 'Mar 22, 2026', status: 'pending' },
  { customer: 'Sara Lee', experience: 'Butter Slime', date: 'Mar 25, 2026', status: 'confirmed' },
]

const recentInquiries = [
  { contact: 'Emily Davis', package: 'Birthday Bash', date: 'Apr 10, 2026', guests: 12 },
  { contact: 'Tom Wilson', package: 'Group Event', date: 'Apr 15, 2026', guests: 20 },
]

export default function AdminDashboardPage() {
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
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
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
              {recentBookings.map((booking, i) => (
                <tr key={i}>
                  <td className="px-6 py-3 text-gray-900">{booking.customer}</td>
                  <td className="px-6 py-3 text-gray-700">{booking.experience}</td>
                  <td className="px-6 py-3 text-gray-700">{booking.date}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Party Inquiries */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Party Inquiries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Package</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Guests</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentInquiries.map((inquiry, i) => (
                <tr key={i}>
                  <td className="px-6 py-3 text-gray-900">{inquiry.contact}</td>
                  <td className="px-6 py-3 text-gray-700">{inquiry.package}</td>
                  <td className="px-6 py-3 text-gray-700">{inquiry.date}</td>
                  <td className="px-6 py-3 text-gray-700">{inquiry.guests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
