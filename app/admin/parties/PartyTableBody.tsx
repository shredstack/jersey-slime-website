'use client'

import { Fragment, useState } from 'react'
import { formatDate, formatTime } from '@/lib/utils'
import PartyStatusSelect from './PartyStatusSelect'
import PartyTotalCostInput from './PartyTotalCostInput'

type Inquiry = {
  id: string
  contact_name: string
  contact_email: string
  contact_phone: string | null
  preferred_date: string
  preferred_time: string | null
  guest_count: number
  age_range: string
  duration_minutes: number | null
  message: string | null
  status: string
  admin_notes: string | null
  total_cost: number | null
  created_at: string
  package: { name: string } | null
}

export default function PartyTableBody({ inquiries }: { inquiries: Inquiry[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <tbody className="divide-y divide-gray-100">
      {inquiries.map((inquiry) => {
        const isExpanded = expandedId === inquiry.id
        const hasMessage = inquiry.message && inquiry.message.trim().length > 0
        return (
          <Fragment key={inquiry.id}>
            <tr
              className={`hover:bg-gray-50 transition-colors ${hasMessage ? 'cursor-pointer' : ''}`}
              onClick={() => hasMessage && setExpandedId(isExpanded ? null : inquiry.id)}
            >
              <td className="px-6 py-3">
                <p className="font-medium text-gray-900">{inquiry.contact_name}</p>
                <p className="text-xs text-gray-500">{inquiry.contact_email}</p>
                {inquiry.contact_phone && (
                  <p className="text-xs text-gray-500">{inquiry.contact_phone}</p>
                )}
              </td>
              <td className="px-6 py-3 text-gray-700">{inquiry.package?.name ?? '—'}</td>
              <td className="px-6 py-3 text-gray-700">
                <p>{formatDate(inquiry.preferred_date)}</p>
                {inquiry.preferred_time && (
                  <p className="text-xs text-gray-500">
                    {formatTime(inquiry.preferred_time)}
                  </p>
                )}
              </td>
              <td className="px-6 py-3 text-gray-700">
                {inquiry.duration_minutes ? `${inquiry.duration_minutes} min` : '—'}
              </td>
              <td className="px-6 py-3 text-gray-700">{inquiry.guest_count}</td>
              <td className="px-6 py-3 text-gray-700">{inquiry.age_range}</td>
              <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                <PartyTotalCostInput
                  inquiryId={inquiry.id}
                  currentCost={inquiry.total_cost ?? null}
                />
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <PartyStatusSelect
                    inquiryId={inquiry.id}
                    currentStatus={
                      inquiry.status as 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled'
                    }
                  />
                  {hasMessage && (
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
            {isExpanded && hasMessage && (
              <tr className="bg-purple-50/50">
                <td colSpan={8} className="px-6 py-3">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-xs font-medium text-purple-800 mb-1">Customer Message</p>
                    <p className="text-sm text-purple-900 whitespace-pre-wrap">{inquiry.message}</p>
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
