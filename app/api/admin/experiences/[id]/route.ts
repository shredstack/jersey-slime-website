import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const updateSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price_per_person: z.number().min(0).optional(),
    duration_minutes: z.number().int().min(15).optional(),
    max_capacity: z.number().int().min(1).optional(),
    images: z.array(z.string()).optional(),
    is_active: z.boolean().optional(),
    sort_order: z.number().int().optional(),
    is_special: z.boolean().optional(),
    event_date: z.string().nullable().optional(),
    event_start_time: z.string().nullable().optional(),
    event_end_time: z.string().nullable().optional(),
    max_bookings: z.number().int().nullable().optional(),
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('experiences')
      .update(parsed.data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Experience update error:', error)
      return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
    }

    return NextResponse.json({ experience: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const supabase = createServiceClient()

    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Experience delete error:', error)
      return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
