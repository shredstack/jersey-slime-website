import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types'

type DbClient = SupabaseClient<Database>

interface TimeSlot {
  start_time: string
  end_time: string
}

/**
 * Convert a "HH:MM" or "HH:MM:SS" time string to minutes since midnight.
 */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/**
 * Convert minutes since midnight back to "HH:MM" string.
 */
function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

/**
 * Check if two time intervals overlap.
 * Intervals are [startA, endA) and [startB, endB) in minutes.
 */
function intervalsOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return startA < endB && startB < endA
}

interface BlockedInterval {
  start: number // minutes since midnight
  end: number
  guest_count: number // 0 for hard blocks (special events, parties)
}

/**
 * Get available booking time slots for a given date and experience.
 *
 * Returns an array of { start_time, end_time } strings representing
 * bookable windows computed from studio hours minus all blockers.
 */
export async function getAvailableSlots(
  date: string,
  experienceId: string,
  supabase: DbClient,
  guestCount: number = 1
): Promise<TimeSlot[]> {
  // 1. Determine studio hours for this date
  const studioHours = await getStudioHoursForDate(date, supabase)
  if (!studioHours) return []

  const { openMinutes, closeMinutes } = studioHours

  // 2. Get the experience details
  const { data: experience } = await supabase
    .from('experiences')
    .select('duration_minutes, max_capacity, is_special')
    .eq('id', experienceId)
    .single()

  if (!experience) return []

  const duration = experience.duration_minutes

  // 3. Get studio capacity
  const { data: capacitySetting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'studio_capacity')
    .single()

  const studioCapacity = (capacitySetting?.value as { max_guests?: number })?.max_guests ?? 10

  // 4. Fetch all blockers for this date
  const blockers = await getBlockersForDate(date, supabase)

  // 5. Generate candidate slots in 30-minute increments
  const SLOT_INCREMENT = 30
  const candidates: TimeSlot[] = []

  for (let start = openMinutes; start + duration <= closeMinutes; start += SLOT_INCREMENT) {
    candidates.push({
      start_time: minutesToTime(start),
      end_time: minutesToTime(start + duration),
    })
  }

  // 6. Filter candidates against blockers
  const available: TimeSlot[] = []

  for (const candidate of candidates) {
    const candStart = timeToMinutes(candidate.start_time)
    const candEnd = timeToMinutes(candidate.end_time)

    // Check hard blocks (special events, confirmed parties)
    const hasHardBlock = blockers.some(
      (b) =>
        b.guest_count === 0 &&
        intervalsOverlap(candStart, candEnd, b.start, b.end)
    )
    if (hasHardBlock) continue

    // Check studio-wide capacity: sum guest_count of all overlapping bookings
    const overlappingGuests = blockers
      .filter(
        (b) =>
          b.guest_count > 0 &&
          intervalsOverlap(candStart, candEnd, b.start, b.end)
      )
      .reduce((sum, b) => sum + b.guest_count, 0)

    if (overlappingGuests + guestCount > studioCapacity) continue

    available.push(candidate)
  }

  return available
}

/**
 * Get the open/close times for a specific date, checking overrides first.
 */
async function getStudioHoursForDate(
  date: string,
  supabase: DbClient
): Promise<{ openMinutes: number; closeMinutes: number } | null> {
  // Check for a date-specific override first
  const { data: override } = await supabase
    .from('studio_hour_overrides')
    .select('open_time, close_time, is_closed')
    .eq('date', date)
    .single()

  if (override) {
    if (override.is_closed || !override.open_time || !override.close_time) return null
    return {
      openMinutes: timeToMinutes(override.open_time),
      closeMinutes: timeToMinutes(override.close_time),
    }
  }

  // Fall back to regular studio hours for the day of week
  const dayOfWeek = new Date(date + 'T00:00:00').getDay()

  const { data: hours } = await supabase
    .from('studio_hours')
    .select('open_time, close_time, is_closed')
    .eq('day_of_week', dayOfWeek)
    .single()

  if (!hours || hours.is_closed) return null

  return {
    openMinutes: timeToMinutes(hours.open_time),
    closeMinutes: timeToMinutes(hours.close_time),
  }
}

/**
 * Collect all time-blocking entries for a given date.
 */
async function getBlockersForDate(
  date: string,
  supabase: DbClient
): Promise<BlockedInterval[]> {
  const blockers: BlockedInterval[] = []

  // A) Confirmed/pending bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('start_time, end_time, guest_count')
    .eq('booking_date', date)
    .in('status', ['pending', 'confirmed'])

  if (bookings) {
    for (const b of bookings) {
      if (b.start_time && b.end_time) {
        blockers.push({
          start: timeToMinutes(b.start_time),
          end: timeToMinutes(b.end_time),
          guest_count: b.guest_count,
        })
      }
    }
  }

  // B) Confirmed parties with a set time
  const { data: parties } = await supabase
    .from('party_inquiries')
    .select('preferred_time, duration_minutes, guest_count')
    .eq('preferred_date', date)
    .eq('status', 'confirmed')
    .not('preferred_time', 'is', null)
    .not('duration_minutes', 'is', null)

  if (parties) {
    for (const p of parties) {
      if (p.preferred_time && p.duration_minutes) {
        const start = timeToMinutes(p.preferred_time)
        blockers.push({
          start,
          end: start + p.duration_minutes,
          guest_count: 0, // hard block — parties take the whole studio
        })
      }
    }
  }

  // C) Special experiences on this date
  const { data: specials } = await supabase
    .from('experiences')
    .select('event_start_time, event_end_time')
    .eq('is_special', true)
    .eq('is_active', true)
    .eq('event_date', date)

  if (specials) {
    for (const s of specials) {
      if (s.event_start_time && s.event_end_time) {
        blockers.push({
          start: timeToMinutes(s.event_start_time),
          end: timeToMinutes(s.event_end_time),
          guest_count: 0, // hard block
        })
      }
    }
  }

  return blockers
}
