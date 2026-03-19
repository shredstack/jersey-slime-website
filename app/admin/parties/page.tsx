import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { formatDate, formatTime } from '@/lib/utils'
import PartyStatusSelect from './PartyStatusSelect'
import PartyTotalCostInput from './PartyTotalCostInput'

export const metadata: Metadata = {
  title: 'Party Inquiries',
}

export default async function AdminPartiesPage() {
  const supabase = createServiceClient()

  const { data: inquiries } = await supabase
    .from('party_inquiries')
    .select(
      `id, contact_name, contact_email, contact_phone, preferred_date, preferred_time,
       guest_count, age_range, duration_minutes, message, status, admin_notes, total_cost, created_at,
       package:party_packages(name)`
    )
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Party Inquiries</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {inquiries && inquiries.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Contact</th>
                  <th className="px-6 py-3 font-medium">Package</th>
                  <th className="px-6 py-3 font-medium">Preferred Date/Time</th>
                  <th className="px-6 py-3 font-medium">Duration</th>
                  <th className="px-6 py-3 font-medium">Guests</th>
                  <th className="px-6 py-3 font-medium">Ages</th>
                  <th className="px-6 py-3 font-medium">Total Cost</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map((inquiry) => {
                  const pkg = inquiry.package as { name: string } | null
                  return (
                    <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <p className="font-medium text-gray-900">{inquiry.contact_name}</p>
                        <p className="text-xs text-gray-500">{inquiry.contact_email}</p>
                        {inquiry.contact_phone && (
                          <p className="text-xs text-gray-500">{inquiry.contact_phone}</p>
                        )}
                      </td>
                      <td className="px-6 py-3 text-gray-700">{pkg?.name ?? '—'}</td>
                      <td className="px-6 py-3 text-gray-700">
                        <p>{formatDate(inquiry.preferred_date)}</p>
                        {inquiry.preferred_time && (
                          <p className="text-xs text-gray-500">
                            {formatTime(inquiry.preferred_time)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        {inquiry.duration_minutes ? `${inquiry.duration_minutes} min` : '—'}
                      </td>
                      <td className="px-6 py-3 text-gray-700">{inquiry.guest_count}</td>
                      <td className="px-6 py-3 text-gray-700">{inquiry.age_range}</td>
                      <td className="px-6 py-3">
                        <PartyTotalCostInput
                          inquiryId={inquiry.id}
                          currentCost={(inquiry.total_cost as number | null) ?? null}
                        />
                      </td>
                      <td className="px-6 py-3">
                        <PartyStatusSelect
                          inquiryId={inquiry.id}
                          currentStatus={
                            inquiry.status as 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled'
                          }
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <p className="px-6 py-8 text-sm text-gray-500 text-center">No party inquiries yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
