import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Party Inquiries',
}

const inquiries = [
  { contact: 'Emily Davis', package: 'Birthday Bash', date: 'Apr 10, 2026', guests: 12, status: 'new' },
  { contact: 'Tom Wilson', package: 'Group Event', date: 'Apr 15, 2026', guests: 20, status: 'contacted' },
  { contact: 'Lisa Chen', package: 'Birthday Bash', date: 'Apr 22, 2026', guests: 15, status: 'new' },
  { contact: 'David Park', package: 'Team Building', date: 'May 3, 2026', guests: 25, status: 'booked' },
]

function statusClass(status: string) {
  switch (status) {
    case 'new':
      return 'bg-yellow-100 text-yellow-700'
    case 'contacted':
      return 'bg-blue-100 text-blue-700'
    case 'booked':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function AdminPartiesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Party Inquiries</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Package</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Guests</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inquiries.map((inquiry, i) => (
                <tr key={i}>
                  <td className="px-6 py-3 text-gray-900 font-medium">{inquiry.contact}</td>
                  <td className="px-6 py-3 text-gray-700">{inquiry.package}</td>
                  <td className="px-6 py-3 text-gray-700">{inquiry.date}</td>
                  <td className="px-6 py-3 text-gray-700">{inquiry.guests}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusClass(inquiry.status)}`}>
                      {inquiry.status}
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
