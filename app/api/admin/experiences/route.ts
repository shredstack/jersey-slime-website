import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const experienceSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    price_per_person: z.number().min(0),
    duration_minutes: z.number().int().min(15),
    max_capacity: z.number().int().min(1),
    images: z.array(z.string()).default([]),
    is_active: z.boolean().default(true),
    sort_order: z.number().int().default(0),
    is_special: z.boolean().default(false),
    event_date: z.string().nullable().default(null),
    event_start_time: z.string().nullable().default(null),
    event_end_time: z.string().nullable().default(null),
    max_bookings: z.number().int().nullable().default(null),
  })
  .refine(
    (data) => {
      if (data.is_special) {
        return data.event_date && data.event_start_time && data.event_end_time
      }
      return true
    },
    { message: 'Special experiences require event date, start time, and end time' }
  )

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
      .from('experiences')
      .select('*')
      .order('is_special')
      .order('sort_order')

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 })
    }

    return NextResponse.json({ experiences: data })
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
    const parsed = experienceSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('experiences')
      .insert(parsed.data)
      .select()
      .single()

    if (error) {
      console.error('Experience insert error:', error)
      return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
    }

    return NextResponse.json({ experience: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
