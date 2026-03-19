import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const overrideSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  open_time: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  close_time: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  is_closed: z.boolean(),
  note: z.string().optional(),
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
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('studio_hour_overrides')
      .select('*')
      .gte('date', today)
      .order('date')

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch overrides' }, { status: 500 })
    }

    return NextResponse.json({ overrides: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = overrideSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('studio_hour_overrides')
      .upsert(
        {
          date: parsed.data.date,
          open_time: parsed.data.is_closed ? null : parsed.data.open_time,
          close_time: parsed.data.is_closed ? null : parsed.data.close_time,
          is_closed: parsed.data.is_closed,
          note: parsed.data.note ?? null,
        },
        { onConflict: 'date' }
      )
      .select()
      .single()

    if (error) {
      console.error('Override upsert error:', error)
      return NextResponse.json({ error: 'Failed to create override' }, { status: 500 })
    }

    return NextResponse.json({ override: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
