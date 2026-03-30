import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import PartiesManager from './PartiesManager'

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
      <PartiesManager inquiries={(inquiries as any) ?? []} />
    </div>
  )
}
