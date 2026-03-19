import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getSiteSettings } from '@/lib/site-settings'
import ContactForm from './contact-form'

export const metadata: Metadata = {
  title: 'Get In Touch | Jersey Slime Studio 38',
  description:
    'Contact Jersey Slime Studio 38 in Utah. Reach out for questions about slime parties, walk-in experiences, group events, or custom orders.',
}

export default async function ContactPage() {
  const supabase = await createClient()
  const [{ data: studioHours }, siteSettings] = await Promise.all([
    supabase
      .from('studio_hours')
      .select('day_of_week, open_time, close_time, is_closed')
      .order('day_of_week'),
    getSiteSettings(),
  ])

  return (
    <ContactForm
      studioHours={studioHours ?? []}
      contactInfo={{
        address: `${siteSettings.address_street}, ${siteSettings.address_city}, ${siteSettings.address_state} ${siteSettings.address_zip}`,
        phone: siteSettings.phone,
        email: siteSettings.email,
      }}
    />
  )
}
