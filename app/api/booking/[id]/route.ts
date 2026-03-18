import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types'

type AvailabilitySlot = Database['public']['Tables']['availability_slots']['Row']
type Experience = Database['public']['Tables']['experiences']['Row']

const cancelSchema = z.object({
  action: z.literal('cancel'),
})

const updateSchema = z.object({
  action: z.literal('update'),
  slot_id: z.string().uuid('Invalid slot ID').optional(),
  guest_count: z.number().int().min(1, 'At least 1 guest is required').optional(),
  notes: z.string().optional(),
})

const requestSchema = z.discriminatedUnion('action', [cancelSchema, updateSchema])

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = requestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Fetch the existing booking and verify ownership
    const { data: rawBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*, availability_slots!slot_id(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !rawBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const booking = rawBooking as any

    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'This booking is already cancelled' },
        { status: 400 }
      )
    }

    // Don't allow changes to past bookings
    const slot = booking.availability_slots as AvailabilitySlot | null
    if (slot) {
      const today = new Date().toISOString().split('T')[0]
      if (slot.date < today) {
        return NextResponse.json(
          { error: 'Cannot modify a past booking' },
          { status: 400 }
        )
      }
    }

    const service = createServiceClient()
    const data = parsed.data

    if (data.action === 'cancel') {
      // Cancel the booking and restore spots on the old slot
      const { error: updateError } = await service
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id)

      if (updateError) {
        console.error('Cancel booking error:', updateError)
        return NextResponse.json(
          { error: 'Failed to cancel booking' },
          { status: 500 }
        )
      }

      // Restore spots on the old slot
      if (slot) {
        await service
          .from('availability_slots')
          .update({ spots_remaining: slot.spots_remaining + booking.guest_count })
          .eq('id', slot.id)
      }

      return NextResponse.json({ success: true })
    }

    // action === 'update'
    const updates: Record<string, unknown> = {}
    let newSlot: AvailabilitySlot | null = null

    // If changing the slot (rescheduling)
    if (data.slot_id && data.slot_id !== booking.slot_id) {
      const { data: fetchedSlot, error: slotError } = await service
        .from('availability_slots')
        .select('*')
        .eq('id', data.slot_id)
        .single()

      if (slotError || !fetchedSlot) {
        return NextResponse.json(
          { error: 'New time slot not found' },
          { status: 404 }
        )
      }

      newSlot = fetchedSlot as AvailabilitySlot
      const neededGuests = data.guest_count ?? booking.guest_count

      if (newSlot.spots_remaining < neededGuests) {
        return NextResponse.json(
          { error: 'Not enough spots available for the selected time', available: newSlot.spots_remaining },
          { status: 409 }
        )
      }

      updates.slot_id = data.slot_id

      // Recalculate price based on the new experience
      const { data: experience } = await service
        .from('experiences')
        .select('*')
        .eq('id', newSlot.experience_id)
        .single() as { data: Experience | null; error: unknown }

      if (experience) {
        updates.total_price = experience.price_per_person * neededGuests
      }
    }

    // If changing guest count (without changing slot)
    if (data.guest_count !== undefined && data.guest_count !== booking.guest_count) {
      const targetSlot = newSlot ?? (slot as AvailabilitySlot)
      const spotsDelta = data.guest_count - booking.guest_count

      // If increasing guests on the same slot, check capacity
      if (!newSlot && spotsDelta > 0 && targetSlot.spots_remaining < spotsDelta) {
        return NextResponse.json(
          { error: 'Not enough spots available', available: targetSlot.spots_remaining + booking.guest_count },
          { status: 409 }
        )
      }

      updates.guest_count = data.guest_count

      // Recalculate price if not already done above
      if (!updates.total_price) {
        const expId = targetSlot.experience_id
        const { data: experience } = await service
          .from('experiences')
          .select('*')
          .eq('id', expId)
          .single() as { data: Experience | null; error: unknown }

        if (experience) {
          updates.total_price = experience.price_per_person * data.guest_count
        }
      }
    }

    if (data.notes !== undefined) {
      updates.notes = data.notes || null
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true, message: 'No changes' })
    }

    // Apply the booking update
    const { error: updateError } = await service
      .from('bookings')
      .update(updates)
      .eq('id', id)

    if (updateError) {
      console.error('Booking update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      )
    }

    // Update spots_remaining on slots
    if (newSlot) {
      const neededGuests = (updates.guest_count as number) ?? booking.guest_count
      // Restore spots on old slot
      if (slot) {
        await service
          .from('availability_slots')
          .update({ spots_remaining: slot.spots_remaining + booking.guest_count })
          .eq('id', slot.id)
      }
      // Deduct spots on new slot
      await service
        .from('availability_slots')
        .update({ spots_remaining: newSlot.spots_remaining - neededGuests })
        .eq('id', newSlot.id)
    } else if (updates.guest_count !== undefined) {
      // Same slot, different guest count — adjust spots
      const delta = booking.guest_count - (updates.guest_count as number)
      if (slot) {
        await service
          .from('availability_slots')
          .update({ spots_remaining: slot.spots_remaining + delta })
          .eq('id', slot.id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Booking update route error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
