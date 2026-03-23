'use client'

import { useState, useMemo } from 'react'
import { sanitizeHtml } from '@/lib/sanitize'

interface HtmlEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function HtmlEditor({ value, onChange, placeholder }: HtmlEditorProps) {
  const [showPreview, setShowPreview] = useState(false)

  const previewHtml = useMemo(() => sanitizeHtml(value), [value])

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
        <span className="text-xs font-medium text-gray-500 px-2">Raw HTML</span>

        <div className="flex-1" />

        <button
          type="button"
          onClick={async () => {
            try {
              const text = await navigator.clipboard.readText()
              onChange(value + text)
            } catch {
              // Clipboard access denied — user can paste manually
            }
          }}
          className="px-3 py-1.5 rounded text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          title="Paste from clipboard"
        >
          Paste HTML
        </button>

        {/* Mobile preview toggle */}
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors md:hidden ${
            showPreview ? 'bg-brand-purple text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Editor + Preview */}
      <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
        {/* HTML textarea */}
        <div className={showPreview ? 'hidden md:block' : ''}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? 'Paste or write HTML here...'}
            className="w-full min-h-[400px] px-4 py-3 text-sm font-mono text-gray-900 resize-y focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Live preview */}
        <div className={`${!showPreview ? 'hidden md:block' : ''} bg-gray-50`}>
          <div className="px-2 py-1 border-b border-gray-200 text-xs font-medium text-gray-400 uppercase tracking-wider">
            Preview
          </div>
          <div
            className="prose prose-lg prose-pink max-w-none px-4 py-3 min-h-[400px]"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>
    </div>
  )
}
