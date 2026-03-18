import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const updateSchema = z.object({
  preferred_date: z.string().min(1).optional(),
  guest_count: z.coerce.number().int().min(1).max(30).optional(),
  age_range: z.string().min(1).optional(),
  message: z.string().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
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

  // RLS enforces ownership + pending-only constraint; if it doesn't match, update returns 0 rows.
  const { error, count } = await supabase
    .from('party_inquiries')
    .update(parsed.data)
    .eq('id', id)
    .in('status', ['new', 'contacted'])

  if (error) {
    console.error('Party inquiry update error:', error)
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 })
  }

  if (count === 0) {
    return NextResponse.json({ error: 'Not found or not editable' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
