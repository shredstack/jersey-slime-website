import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAvailableSlots } from '@/lib/availability'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const experienceId = searchParams.get('experience_id')
    const guestCountParam = searchParams.get('guest_count')

    if (!date || !experienceId) {
      return NextResponse.json(
        { error: 'Missing required parameters: date and experience_id' },
        { status: 400 }
      )
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    const guestCount = guestCountParam ? Math.max(1, parseInt(guestCountParam, 10) || 1) : 1

    const supabase = await createClient()
    const slots = await getAvailableSlots(date, experienceId, supabase, guestCount)

    return NextResponse.json({ slots })
  } catch (err) {
    console.error('Availability route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
