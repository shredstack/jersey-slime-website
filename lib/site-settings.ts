import { createClient } from '@/lib/supabase/server'

export interface SiteSettings {
  address_street: string
  address_city: string
  address_state: string
  address_zip: string
  phone: string
  email: string
  instagram_url: string
  tiktok_url: string
  facebook_url: string
}

const DEFAULTS: SiteSettings = {
  address_street: '123 Slime Street, Suite 38',
  address_city: 'Salt Lake City',
  address_state: 'UT',
  address_zip: '84101',
  phone: '(801) 555-0138',
  email: 'hello@jerseyslimestudio.com',
  instagram_url: 'https://instagram.com/jerseyslimestudio38',
  tiktok_url: 'https://tiktok.com/@jerseyslimestudio38',
  facebook_url: 'https://facebook.com/jerseyslimestudio38',
}

const SETTING_KEYS = Object.keys(DEFAULTS) as (keyof SiteSettings)[]

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', SETTING_KEYS)

  const settings = { ...DEFAULTS }

  for (const row of data ?? []) {
    const key = row.key as keyof SiteSettings
    if (key in settings) {
      const raw = row.value
      // Handle values that may have been double-JSON-stringified (stored with wrapping quotes)
      if (typeof raw === 'string' && raw.startsWith('"') && raw.endsWith('"')) {
        try { settings[key] = JSON.parse(raw) } catch { settings[key] = raw }
      } else {
        settings[key] = typeof raw === 'string' ? raw : String(raw ?? '')
      }
    }
  }

  return settings
}
