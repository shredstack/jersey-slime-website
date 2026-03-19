import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import StudioCapacityForm from './StudioCapacityForm'
import SiteSettingsForm from './SiteSettingsForm'
import StudioHoursForm from '../availability/StudioHoursForm'
import OverridesManager from '../availability/OverridesManager'

export const metadata: Metadata = {
  title: 'Site Settings',
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default async function AdminSettingsPage() {
  const supabase = createServiceClient()

  const { data: hours } = await supabase
    .from('studio_hours')
    .select('*')
    .order('day_of_week')

  const { data: overrides } = await supabase
    .from('studio_hour_overrides')
    .select('*')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date')

  const fullHours = DAY_NAMES.map((name, i) => {
    const existing = hours?.find((h) => h.day_of_week === i)
    return {
      day_of_week: i,
      day_name: name,
      open_time: existing?.open_time ?? '10:00',
      close_time: existing?.close_time ?? '18:00',
      is_closed: existing?.is_closed ?? true,
    }
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Site Settings</h1>

      <div className="space-y-8 max-w-2xl">
        {/* Studio Capacity */}
        <StudioCapacityForm />
      </div>

      {/* Studio Hours */}
      <div className="max-w-2xl mt-8">
        <StudioHoursForm initialHours={fullHours} />
        <OverridesManager initialOverrides={overrides ?? []} />
      </div>

      {/* Address, Phone, Email, Social Media */}
      <div className="max-w-2xl mt-8">
        <SiteSettingsForm />
      </div>
    </div>
  )
}
