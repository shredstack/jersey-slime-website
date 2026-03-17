import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manage Experiences',
}

const experiences = [
  { id: '1', name: 'Slime Making Workshop', duration: '90 min', price: '$35', capacity: 8, active: true },
  { id: '2', name: 'Glow-in-the-Dark Slime Party', duration: '120 min', price: '$45', capacity: 12, active: true },
  { id: '3', name: 'Butter Slime Experience', duration: '60 min', price: '$28', capacity: 6, active: true },
  { id: '4', name: 'Cloud Slime Session', duration: '75 min', price: '$32', capacity: 10, active: false },
  { id: '5', name: 'Sensory Slime for Toddlers', duration: '45 min', price: '$22', capacity: 8, active: true },
]

export default function AdminExperiencesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Experiences</h1>
        <button className="rounded-lg bg-brand-pink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-pink/90 transition-colors">
          Add Experience
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Capacity</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {experiences.map((exp) => (
                <tr key={exp.id}>
                  <td className="px-6 py-3 text-gray-900 font-medium">{exp.name}</td>
                  <td className="px-6 py-3 text-gray-700">{exp.duration}</td>
                  <td className="px-6 py-3 text-gray-700">{exp.price}</td>
                  <td className="px-6 py-3 text-gray-700">{exp.capacity}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        exp.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {exp.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-3 space-x-2">
                    <button className="text-brand-purple hover:text-brand-pink text-sm font-medium transition-colors">
                      Edit
                    </button>
                    <button className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                      {exp.active ? 'Deactivate' : 'Activate'}
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
