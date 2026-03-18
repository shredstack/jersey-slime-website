import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const updateSchema = z.object({
  status: z.enum(['new', 'contacted', 'confirmed', 'completed']).optional(),
  admin_notes: z.string().optional(),
  total_cost: z.coerce.number().min(0).optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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

  const updates: Record<string, unknown> = {}
  if (parsed.data.status !== undefined) updates.status = parsed.data.status
  if (parsed.data.admin_notes !== undefined) updates.admin_notes = parsed.data.admin_notes
  if (parsed.data.total_cost !== undefined) updates.total_cost = parsed.data.total_cost

  const service = createServiceClient()
  const { error } = await service.from('party_inquiries').update(updates).eq('id', id)

  if (error) {
    console.error('Party inquiry update error:', error)
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
