'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PartyTotalCostInput({
  inquiryId,
  currentCost,
}: {
  inquiryId: string
  currentCost: number | null
}) {
  const [value, setValue] = useState(currentCost?.toString() ?? '')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  async function handleBlur() {
    const parsed = parseFloat(value)
    const cost = isNaN(parsed) ? null : parsed
    if (cost === currentCost) return

    setSaving(true)
    try {
      await fetch(`/api/admin/parties/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total_cost: cost }),
      })
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-gray-400 text-sm">$</span>
      <input
        type="number"
        min={0}
        step={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        disabled={saving}
        placeholder="—"
        className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm text-gray-900 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/30 disabled:opacity-50"
      />
    </div>
  )
}
