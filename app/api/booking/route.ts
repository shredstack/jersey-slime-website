import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types'

type AvailabilitySlot = Database['public']['Tables']['availability_slots']['Row']
type Experience = Database['public']['Tables']['experiences']['Row']

const bookingSchema = z.object({
  slot_id: z.string().uuid('Invalid slot ID'),
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

    const { slot_id, guest_count, notes } = parsed.data

    const supabase = createClient()

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

    // Fetch the slot with its associated experience to get pricing
    const { data: slot, error: slotError } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('id', slot_id)
      .single() as { data: AvailabilitySlot | null; error: unknown }

    if (slotError || !slot) {
      return NextResponse.json(
        { error: 'Availability slot not found' },
        { status: 404 }
      )
    }

    if (slot.spots_remaining < guest_count) {
      return NextResponse.json(
        {
          error: 'Not enough spots available',
          available: slot.spots_remaining,
        },
        { status: 409 }
      )
    }

    // Fetch the experience to get the price
    const { data: experience, error: experienceError } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', slot.experience_id)
      .single() as { data: Experience | null; error: unknown }

    if (experienceError || !experience) {
      return NextResponse.json(
        { error: 'Associated experience not found' },
        { status: 404 }
      )
    }

    const total_price = experience.price_per_person * guest_count

    // Insert the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        slot_id,
        guest_count,
        total_price,
        notes: notes ?? null,
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Booking insert error:', bookingError)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    // Decrement spots_remaining on the slot
    const { error: updateError } = await supabase
      .from('availability_slots')
      .update({ spots_remaining: slot.spots_remaining - guest_count })
      .eq('id', slot_id)

    if (updateError) {
      console.error('Slot update error:', updateError)
      // Booking was created but slot wasn't updated -- log for manual resolution
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (err) {
    console.error('Booking route error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
