import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const SETTING_KEYS = [
  'address_street',
  'address_city',
  'address_state',
  'address_zip',
  'phone',
  'email',
  'instagram_url',
  'tiktok_url',
  'facebook_url',
] as const

const putSchema = z.object({
  address_street: z.string().min(1).max(200),
  address_city: z.string().min(1).max(100),
  address_state: z.string().min(1).max(50),
  address_zip: z.string().min(1).max(20),
  phone: z.string().min(1).max(30),
  email: z.string().email().max(200),
  instagram_url: z.string().url().max(500).or(z.literal('')),
  tiktok_url: z.string().url().max(500).or(z.literal('')),
  facebook_url: z.string().url().max(500).or(z.literal('')),
})

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'admin' ? user : null
}

export async function GET() {
  try {
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', SETTING_KEYS)

    if (error) {
      return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
    }

    const settings: Record<string, string> = {}
    for (const row of data ?? []) {
      const raw = row.value
      if (typeof raw === 'string' && raw.startsWith('"') && raw.endsWith('"')) {
        try { settings[row.key] = JSON.parse(raw) } catch { settings[row.key] = raw }
      } else {
        settings[row.key] = typeof raw === 'string' ? raw : String(raw ?? '')
      }
    }

    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = putSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    const rows = Object.entries(parsed.data).map(([key, value]) => ({
      key,
      value,
    }))

    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })

    if (error) {
      console.error('Site settings update error:', error)
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
