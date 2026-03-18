import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only')
    .optional(),
  content: z.string().min(1, 'Content is required').optional(),
  excerpt: z.string().min(1, 'Excerpt is required').optional(),
  cover_image_url: z.string().optional(),
  is_published: z.boolean().optional(),
})

async function getAdminUser() {
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
  if (profile?.role !== 'admin') return null

  return user
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const parsed = updatePostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const updates: Record<string, unknown> = { ...parsed.data }

  // Set published_at when publishing for the first time
  if (parsed.data.is_published === true) {
    const service = createServiceClient()
    const { data: existing } = await service
      .from('blog_posts')
      .select('published_at')
      .eq('id', id)
      .single()
    if (!existing?.published_at) {
      updates.published_at = new Date().toISOString()
    }
  }

  const service = createServiceClient()
  const { data: post, error } = await service
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      )
    }
    console.error('Blog update error:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }

  return NextResponse.json({ post })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const service = createServiceClient()
  const { error } = await service.from('blog_posts').delete().eq('id', id)

  if (error) {
    console.error('Blog delete error:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
