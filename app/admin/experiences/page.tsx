import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import ExperienceActions from './ExperienceActions'
import ExperienceForm from './ExperienceForm'
import PartyPackageActions from './PartyPackageActions'
import PartyPackageForm from './PartyPackageForm'

export const metadata: Metadata = {
  title: 'Manage Experiences',
}

export default async function AdminExperiencesPage() {
  const supabase = createServiceClient()

  const [{ data: experiences }, { data: partyPackages }] = await Promise.all([
    supabase
      .from('experiences')
      .select('*')
      .order('is_special')
      .order('sort_order'),
    supabase
      .from('party_packages')
      .select('*')
      .order('sort_order'),
  ])

  const regular = experiences?.filter((e) => !e.is_special) ?? []
  const special = experiences?.filter((e) => e.is_special) ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Experiences</h1>
        <ExperienceForm />
      </div>

      {/* Regular Experiences */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Standard Experiences</h2>
          <p className="text-sm text-gray-500 mt-1">Available any day the studio is open.</p>
        </div>
        <div className="overflow-x-auto">
          {regular.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Duration</th>
                  <th className="px-6 py-3 font-medium">Price/Person</th>
                  <th className="px-6 py-3 font-medium">Capacity</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {regular.map((exp) => (
                  <tr key={exp.id}>
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-900">{exp.title}</p>
                      <p className="text-xs text-gray-500 max-w-xs truncate">{exp.description}</p>
                    </td>
                    <td className="px-6 py-3 text-gray-700">{exp.duration_minutes} min</td>
                    <td className="px-6 py-3 text-gray-700">{formatPrice(exp.price_per_person)}</td>
                    <td className="px-6 py-3 text-gray-700">{exp.max_capacity}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          exp.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {exp.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <ExperienceActions experience={exp} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-6 py-8 text-sm text-gray-500 text-center">
              No standard experiences yet. Add one above!
            </p>
          )}
        </div>
      </section>

      {/* Special Experiences */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Special Events</h2>
          <p className="text-sm text-gray-500 mt-1">One-off events with specific dates and times.</p>
        </div>
        <div className="overflow-x-auto">
          {special.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Time</th>
                  <th className="px-6 py-3 font-medium">Price/Person</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {special.map((exp) => (
                  <tr key={exp.id}>
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-900">{exp.title}</p>
                      <p className="text-xs text-gray-500 max-w-xs truncate">{exp.description}</p>
                    </td>
                    <td className="px-6 py-3 text-gray-700">{exp.event_date}</td>
                    <td className="px-6 py-3 text-gray-700">
                      {exp.event_start_time?.slice(0, 5)} – {exp.event_end_time?.slice(0, 5)}
                    </td>
                    <td className="px-6 py-3 text-gray-700">{formatPrice(exp.price_per_person)}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          exp.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {exp.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <ExperienceActions experience={exp} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-6 py-8 text-sm text-gray-500 text-center">
              No special events yet.
            </p>
          )}
        </div>
      </section>

      {/* Party Packages */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Party Packages</h2>
            <p className="text-sm text-gray-500 mt-1">Packages shown on the public Parties page.</p>
          </div>
          <PartyPackageForm />
        </div>
        <div className="overflow-x-auto">
          {(partyPackages ?? []).length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Duration</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Max Guests</th>
                  <th className="px-6 py-3 font-medium">Includes</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {partyPackages!.map((pkg) => (
                  <tr key={pkg.id}>
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-900">{pkg.name}</p>
                      <p className="text-xs text-gray-500 max-w-xs truncate">{pkg.description}</p>
                    </td>
                    <td className="px-6 py-3 text-gray-700">{pkg.duration_minutes} min</td>
                    <td className="px-6 py-3 text-gray-700">{formatPrice(pkg.price)}</td>
                    <td className="px-6 py-3 text-gray-700">{pkg.max_guests}</td>
                    <td className="px-6 py-3 text-gray-700">
                      <span className="text-xs">{(pkg.includes as string[] | null)?.length ?? 0} items</span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          pkg.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {pkg.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <PartyPackageActions pkg={pkg as { id: string; name: string; description: string; price: number; max_guests: number; duration_minutes: number; includes: string[] | null; is_active: boolean }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-6 py-8 text-sm text-gray-500 text-center">
              No party packages yet. Add one to get started!
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
