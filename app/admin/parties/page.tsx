import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import PartyTableBody from './PartyTableBody'

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
              <PartyTableBody inquiries={inquiries as any} />
            </table>
          ) : (
            <p className="px-6 py-8 text-sm text-gray-500 text-center">No party inquiries yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
