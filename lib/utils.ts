import { type ClassValue, clsx } from 'clsx'

// Lightweight cn helper (no tailwind-merge to keep deps minimal)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents)
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

/**
 * Convert a date + time (HH:MM) in Mountain Time to a UTC timestamp (ms).
 * Handles MST/MDT automatically via Intl.
 */
export function mountainTimeToUTC(date: string, time: string): number {
  const naive = new Date(`${date}T${time}:00Z`)
  const mtParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).formatToParts(naive)
  const get = (type: string) => Number(mtParts.find((p) => p.type === type)?.value)
  const mtEquiv = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  return naive.getTime() + (naive.getTime() - mtEquiv)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
