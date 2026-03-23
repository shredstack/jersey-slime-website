import { createServiceClient } from '@/lib/supabase/server'

const FALLBACK_CONTACT_EMAIL = 'hello@jerseyslimestudio.com'

export const EMAIL_FROM = 'Jersey Slime Studio <noreply@jerseyslimestudio.com>'

/**
 * Fetch the studio contact email from site_settings (set by the admin).
 * Falls back to a default if the setting is missing.
 */
export async function getStudioContactEmail(): Promise<string> {
  const service = createServiceClient()
  const { data } = await service
    .from('site_settings')
    .select('value')
    .eq('key', 'email')
    .single()

  if (!data?.value) return FALLBACK_CONTACT_EMAIL

  // Handle values that may have been double-JSON-stringified
  const raw = data.value as string
  if (raw.startsWith('"') && raw.endsWith('"')) {
    try { return JSON.parse(raw) } catch { return raw }
  }
  return raw
}

/**
 * Fetch email addresses for all admin users.
 */
export async function getAdminEmails(): Promise<string[]> {
  const service = createServiceClient()
  const { data } = await service
    .from('profiles')
    .select('email')
    .eq('role', 'admin')

  if (!data) return []
  return data.map((p) => p.email).filter(Boolean) as string[]
}
