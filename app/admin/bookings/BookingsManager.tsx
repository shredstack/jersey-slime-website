'use client'

import { useMemo, useState } from 'react'
import { formatPrice, formatDate, formatTime } from '@/lib/utils'
import BookingStatusSelect from './BookingStatusSelect'
import { Fragment } from 'react'

type Booking = {
  id: string
  guest_count: number
  total_price: number
  status: string
  notes: string | null
  booking_date: string | null
  start_time: string | null
  end_time: string | null
  created_at: string
  profile: { full_name: string; email: string; phone: string | null } | null
  experience: { title: string } | null
}

type StatusFilter = 'active' | 'cancelled' | 'all'
type TimeFilter = 'upcoming' | 'past' | 'all'
type SortOrder = 'date-asc' | 'date-desc'

function getToday(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function getNext14Days(): Date[] {
  const days: Date[] = []
  const now = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
    days.push(d)
  }
  return days
}

function toDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function shortDay(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}

function shortMonth(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short' })
}

export default function BookingsManager({ bookings }: { bookings: Booking[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('upcoming')
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('date-asc')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const today = getToday()
  const next14Days = useMemo(() => getNext14Days(), [])

  // Count bookings per day for calendar strip (only active bookings)
  const bookingsPerDay = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const b of bookings) {
      if (b.booking_date && (b.status === 'pending' || b.status === 'confirmed')) {
        counts[b.booking_date] = (counts[b.booking_date] || 0) + 1
      }
    }
    return counts
  }, [bookings])

  const filtered = useMemo(() => {
    let result = [...bookings]

    // Status filter
    if (statusFilter === 'active') {
      result = result.filter((b) => b.status === 'pending' || b.status === 'confirmed')
    } else if (statusFilter === 'cancelled') {
      result = result.filter((b) => b.status === 'cancelled')
    }

    // Time filter
    if (timeFilter === 'upcoming') {
      result = result.filter((b) => !b.booking_date || b.booking_date >= today)
    } else if (timeFilter === 'past') {
      result = result.filter((b) => b.booking_date && b.booking_date < today)
    }

    // Calendar day selection
    if (selectedDay) {
      result = result.filter((b) => b.booking_date === selectedDay)
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter((b) => {
        const name = b.profile?.full_name?.toLowerCase() ?? ''
        const email = b.profile?.email?.toLowerCase() ?? ''
        const date = b.booking_date ?? ''
        return name.includes(q) || email.includes(q) || date.includes(q)
      })
    }

    // Sort
    result.sort((a, b) => {
      const dateA = a.booking_date ?? ''
      const dateB = b.booking_date ?? ''
      if (sortOrder === 'date-asc') return dateA.localeCompare(dateB)
      return dateB.localeCompare(dateA)
    })

    return result
  }, [bookings, statusFilter, timeFilter, search, sortOrder, selectedDay, today])

  return (
    <div className="space-y-4">
      {/* Calendar Strip */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Upcoming 2 Weeks</h2>
          {selectedDay && (
            <button
              onClick={() => setSelectedDay(null)}
              className="text-xs text-purple-600 hover:text-purple-800 font-medium"
            >
              Clear selection
            </button>
          )}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {next14Days.map((day) => {
            const ds = toDateString(day)
            const count = bookingsPerDay[ds] || 0
            const isToday = ds === today
            const isSelected = ds === selectedDay

            return (
              <button
                key={ds}
                onClick={() => setSelectedDay(isSelected ? null : ds)}
                className={`flex-shrink-0 w-14 rounded-lg py-2 px-1 text-center transition-all border ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : isToday
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                }`}
              >
                <p className={`text-[10px] font-medium uppercase ${isSelected ? 'text-purple-200' : 'text-gray-400'}`}>
                  {shortDay(day)}
                </p>
                <p className={`text-lg font-bold leading-tight ${isSelected ? 'text-white' : ''}`}>
                  {day.getDate()}
                </p>
                <p className={`text-[10px] ${isSelected ? 'text-purple-200' : 'text-gray-400'}`}>
                  {shortMonth(day)}
                </p>
                {count > 0 && (
                  <div className={`mt-1 mx-auto flex items-center justify-center gap-0.5`}>
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-purple-500'
                      }`}
                    />
                    <span className={`text-[10px] font-semibold ${isSelected ? 'text-white' : 'text-purple-600'}`}>
                      {count}
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status Filter */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm flex-shrink-0">
            {([['active', 'Active'], ['cancelled', 'Cancelled'], ['all', 'All']] as const).map(
              ([value, label]) => (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={`px-3 py-1.5 font-medium transition-colors ${
                    statusFilter === value
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>

          {/* Time Filter */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm flex-shrink-0">
            {([['upcoming', 'Upcoming'], ['past', 'Past'], ['all', 'All Time']] as const).map(
              ([value, label]) => (
                <button
                  key={value}
                  onClick={() => setTimeFilter(value)}
                  className={`px-3 py-1.5 font-medium transition-colors ${
                    timeFilter === value
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="rounded-lg border border-gray-200 text-sm text-gray-600 px-3 py-1.5 bg-white flex-shrink-0"
          >
            <option value="date-asc">Date (earliest first)</option>
            <option value="date-desc">Date (latest first)</option>
          </select>

          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search customer or date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 text-sm text-gray-700 pl-9 pr-3 py-1.5 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-gray-500 px-1">
        {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
        {selectedDay && (
          <>
            {' '}
            on{' '}
            <span className="font-medium text-gray-700">
              {formatDate(selectedDay)}
            </span>
          </>
        )}
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filtered.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Experience</th>
                  <th className="px-6 py-3 font-medium">Date &amp; Time</th>
                  <th className="px-6 py-3 font-medium">Guests</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((booking) => {
                  const isExpanded = expandedId === booking.id
                  const hasNotes = booking.notes && booking.notes.trim().length > 0
                  return (
                    <Fragment key={booking.id}>
                      <tr
                        className={`hover:bg-gray-50 transition-colors ${hasNotes ? 'cursor-pointer' : ''}`}
                        onClick={() => hasNotes && setExpandedId(isExpanded ? null : booking.id)}
                      >
                        <td className="px-6 py-3">
                          <p className="font-medium text-gray-900">
                            {booking.profile?.full_name ?? '—'}
                          </p>
                          <p className="text-xs text-gray-500">{booking.profile?.email ?? ''}</p>
                        </td>
                        <td className="px-6 py-3 text-gray-700">
                          {booking.experience?.title ?? '—'}
                        </td>
                        <td className="px-6 py-3 text-gray-700">
                          {booking.booking_date ? (
                            <>
                              <p>{formatDate(booking.booking_date)}</p>
                              {booking.start_time && booking.end_time && (
                                <p className="text-xs text-gray-500">
                                  {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                                </p>
                              )}
                            </>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-6 py-3 text-gray-700">{booking.guest_count}</td>
                        <td className="px-6 py-3 text-gray-700">
                          {formatPrice(booking.total_price)}
                        </td>
                        <td className="px-6 py-3">
                          <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <BookingStatusSelect
                              bookingId={booking.id}
                              currentStatus={
                                booking.status as 'pending' | 'confirmed' | 'cancelled'
                              }
                            />
                            {hasNotes && (
                              <svg
                                className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && hasNotes && (
                        <tr className="bg-amber-50/50">
                          <td colSpan={6} className="px-6 py-3">
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <p className="text-xs font-medium text-amber-800 mb-1">
                                Special Requests / Notes
                              </p>
                              <p className="text-sm text-amber-900 whitespace-pre-wrap">
                                {booking.notes}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <p className="px-6 py-8 text-sm text-gray-500 text-center">
              No bookings match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
