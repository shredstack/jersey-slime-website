import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const galleryPhotoSchema = z.object({
  title: z.string().default(''),
  alt_text: z.string().default(''),
  image_url: z.string().min(1, 'Image is required'),
  category: z.string().default('studio'),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
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
      .from('gallery_photos')
      .select('*')
      .order('sort_order')
      .order('created_at')

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch gallery photos' }, { status: 500 })
    }

    return NextResponse.json({ photos: data })
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
    const parsed = galleryPhotoSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('gallery_photos')
      .insert(parsed.data)
      .select()
      .single()

    if (error) {
      console.error('Gallery insert error:', error)
      return NextResponse.json({ error: 'Failed to create gallery photo' }, { status: 500 })
    }

    return NextResponse.json({ photo: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
