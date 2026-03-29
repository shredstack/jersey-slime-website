'use client'

import { Fragment, useState } from 'react'
import { formatPrice, formatDate, formatTime } from '@/lib/utils'
import BookingStatusSelect from './BookingStatusSelect'

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

export default function BookingTableBody({ bookings }: { bookings: Booking[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <tbody className="divide-y divide-gray-100">
      {bookings.map((booking) => {
        const isExpanded = expandedId === booking.id
        const hasNotes = booking.notes && booking.notes.trim().length > 0
        return (
          <Fragment key={booking.id}>
            <tr
              className={`hover:bg-gray-50 transition-colors ${hasNotes ? 'cursor-pointer' : ''}`}
              onClick={() => hasNotes && setExpandedId(isExpanded ? null : booking.id)}
            >
              <td className="px-6 py-3">
                <p className="font-medium text-gray-900">{booking.profile?.full_name ?? '—'}</p>
                <p className="text-xs text-gray-500">{booking.profile?.email ?? ''}</p>
              </td>
              <td className="px-6 py-3 text-gray-700">{booking.experience?.title ?? '—'}</td>
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
              <td className="px-6 py-3 text-gray-700">{formatPrice(booking.total_price)}</td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <BookingStatusSelect
                    bookingId={booking.id}
                    currentStatus={booking.status as 'pending' | 'confirmed' | 'cancelled'}
                  />
                  {hasNotes && (
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </td>
            </tr>
            {isExpanded && hasNotes && (
              <tr className="bg-amber-50/50">
                <td colSpan={6} className="px-6 py-3">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs font-medium text-amber-800 mb-1">Special Requests / Notes</p>
                    <p className="text-sm text-amber-900 whitespace-pre-wrap">{booking.notes}</p>
                  </div>
                </td>
              </tr>
            )}
          </Fragment>
        )
      })}
    </tbody>
  )
}
