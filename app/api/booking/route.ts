import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getAvailableSlots } from '@/lib/availability'

const bookingSchema = z.object({
  experience_id: z.string().uuid('Invalid experience ID'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  guest_count: z.number().int().min(1, 'At least 1 guest is required'),
  notes: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const parsed = bookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { experience_id, date, start_time, guest_count, notes } = parsed.data

    const supabase = await createClient()

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be signed in to create a booking' },
        { status: 401 }
      )
    }

    // Fetch the experience for pricing and duration
    const { data: experience, error: expError } = await supabase
      .from('experiences')
      .select('price_per_person, duration_minutes, is_active')
      .eq('id', experience_id)
      .single()

    if (expError || !experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    if (!experience.is_active) {
      return NextResponse.json({ error: 'This experience is no longer available' }, { status: 400 })
    }

    // Compute end_time from experience duration
    const [h, m] = start_time.split(':').map(Number)
    const endMinutes = h * 60 + m + experience.duration_minutes
    const end_time = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`

    // Verify the requested slot is still available
    const availableSlots = await getAvailableSlots(date, experience_id, supabase)
    const slotIsAvailable = availableSlots.some(
      (slot) => slot.start_time === start_time
    )

    if (!slotIsAvailable) {
      return NextResponse.json(
        { error: 'This time slot is no longer available. Please choose another time.' },
        { status: 409 }
      )
    }

    const total_price = experience.price_per_person * guest_count

    // Insert the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        experience_id,
        booking_date: date,
        start_time,
        end_time,
        guest_count,
        total_price,
        notes: notes ?? null,
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Booking insert error:', bookingError)
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (err) {
    console.error('Booking route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
