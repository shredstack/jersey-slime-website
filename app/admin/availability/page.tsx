import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manage Availability',
}

const existingSlots = [
  { experience: 'Slime Workshop', date: 'Mar 22, 2026', start: '10:00 AM', end: '11:30 AM', capacity: 8 },
  { experience: 'Glow Slime Party', date: 'Mar 22, 2026', start: '1:00 PM', end: '2:30 PM', capacity: 12 },
  { experience: 'Butter Slime', date: 'Mar 23, 2026', start: '10:00 AM', end: '11:00 AM', capacity: 6 },
  { experience: 'Cloud Slime', date: 'Mar 23, 2026', start: '2:00 PM', end: '3:30 PM', capacity: 10 },
]

export default function AdminAvailabilityPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Availability</h1>

      {/* Add Slot Form */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Time Slot</h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink">
              <option>Slime Workshop</option>
              <option>Glow Slime Party</option>
              <option>Butter Slime</option>
              <option>Cloud Slime</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="time"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 8"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              className="rounded-lg bg-brand-pink px-6 py-2 text-sm font-semibold text-white hover:bg-brand-pink/90 transition-colors"
            >
              Add Slot
            </button>
          </div>
        </form>
      </section>

      {/* Existing Slots */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Existing Slots</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Experience</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Start</th>
                <th className="px-6 py-3 font-medium">End</th>
                <th className="px-6 py-3 font-medium">Capacity</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {existingSlots.map((slot, i) => (
                <tr key={i}>
                  <td className="px-6 py-3 text-gray-900 font-medium">{slot.experience}</td>
                  <td className="px-6 py-3 text-gray-700">{slot.date}</td>
                  <td className="px-6 py-3 text-gray-700">{slot.start}</td>
                  <td className="px-6 py-3 text-gray-700">{slot.end}</td>
                  <td className="px-6 py-3 text-gray-700">{slot.capacity}</td>
                  <td className="px-6 py-3 space-x-2">
                    <button className="text-brand-purple hover:text-brand-pink text-sm font-medium transition-colors">
                      Edit
                    </button>
                    <button className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
