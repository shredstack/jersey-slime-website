import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manage Bookings',
}

const bookings = [
  { customer: 'Jane Smith', experience: 'Slime Workshop', date: 'Mar 20, 2026', guests: 4, status: 'confirmed' },
  { customer: 'Mike Johnson', experience: 'Glow Slime Party', date: 'Mar 22, 2026', guests: 8, status: 'pending' },
  { customer: 'Sara Lee', experience: 'Butter Slime', date: 'Mar 25, 2026', guests: 3, status: 'confirmed' },
  { customer: 'Alex Rivera', experience: 'Slime Workshop', date: 'Mar 28, 2026', guests: 6, status: 'cancelled' },
  { customer: 'Kim Nguyen', experience: 'Cloud Slime', date: 'Apr 1, 2026', guests: 5, status: 'pending' },
]

function statusClass(status: string) {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function AdminBookingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Bookings</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Experience</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Guests</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking, i) => (
                <tr key={i}>
                  <td className="px-6 py-3 text-gray-900 font-medium">{booking.customer}</td>
                  <td className="px-6 py-3 text-gray-700">{booking.experience}</td>
                  <td className="px-6 py-3 text-gray-700">{booking.date}</td>
                  <td className="px-6 py-3 text-gray-700">{booking.guests}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button className="text-brand-purple hover:text-brand-pink text-sm font-medium transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
