import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const putSchema = z.object({
  max_guests: z.number().int().min(1).max(100),
})

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
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
      .select('value')
      .eq('key', 'studio_capacity')
      .single()

    if (error) {
      return NextResponse.json({ max_guests: 10 })
    }

    const max_guests = (data?.value as { max_guests?: number })?.max_guests ?? 10
    return NextResponse.json({ max_guests })
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
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        {
          key: 'studio_capacity',
          value: { max_guests: parsed.data.max_guests },
        },
        { onConflict: 'key' }
      )

    if (error) {
      console.error('Studio capacity update error:', error)
      return NextResponse.json({ error: 'Failed to update studio capacity' }, { status: 500 })
    }

    return NextResponse.json({ success: true, max_guests: parsed.data.max_guests })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
