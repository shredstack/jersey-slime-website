import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const daySchema = z.object({
  day_of_week: z.number().int().min(0).max(6),
  open_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  close_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  is_closed: z.boolean(),
})

const putSchema = z.object({
  days: z.array(daySchema).length(7),
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
      .from('studio_hours')
      .select('*')
      .order('day_of_week')

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch studio hours' }, { status: 500 })
    }

    return NextResponse.json({ hours: data })
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

    for (const day of parsed.data.days) {
      const { error } = await supabase
        .from('studio_hours')
        .upsert(
          {
            day_of_week: day.day_of_week,
            open_time: day.open_time,
            close_time: day.close_time,
            is_closed: day.is_closed,
          },
          { onConflict: 'day_of_week' }
        )

      if (error) {
        console.error('Studio hours upsert error:', error)
        return NextResponse.json({ error: 'Failed to update studio hours' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
