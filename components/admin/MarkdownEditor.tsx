'use client'

import { useState, useMemo, useCallback } from 'react'
import MarkdownIt from 'markdown-it'
import { sanitizeHtml } from '@/lib/sanitize'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

interface MarkdownEditorProps {
  value: string
  onChange: (md: string) => void
  placeholder?: string
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false)

  const renderedHtml = useMemo(() => {
    return sanitizeHtml(md.render(value))
  }, [value])

  const insertMarkdown = useCallback(
    (before: string, after: string = '') => {
      const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement | null
      if (!textarea) return
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selected = value.substring(start, end)
      const replacement = `${before}${selected || 'text'}${after}`
      const newValue = value.substring(0, start) + replacement + value.substring(end)
      onChange(newValue)
      // Restore cursor after React re-render
      requestAnimationFrame(() => {
        textarea.focus()
        const cursorPos = start + before.length + (selected || 'text').length + after.length
        textarea.setSelectionRange(cursorPos, cursorPos)
      })
    },
    [value, onChange]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault()
            insertMarkdown('**', '**')
            break
          case 'i':
            e.preventDefault()
            insertMarkdown('*', '*')
            break
          case 'k':
            e.preventDefault()
            insertMarkdown('[', '](url)')
            break
        }
      }
    },
    [insertMarkdown]
  )

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => insertMarkdown('**', '**')}
          title="Bold (Ctrl+B)"
          className="px-2 py-1.5 rounded text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('*', '*')}
          title="Italic (Ctrl+I)"
          className="px-2 py-1.5 rounded text-sm italic text-gray-600 hover:bg-gray-100 transition-colors"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('## ')}
          title="Heading"
          className="px-2 py-1.5 rounded text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('[', '](url)')}
          title="Link (Ctrl+K)"
          className="px-2 py-1.5 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('![alt](', ')')}
          title="Image"
          className="px-2 py-1.5 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('- ')}
          title="Bullet List"
          className="px-2 py-1.5 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </button>

        <div className="flex-1" />

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
        {/* Markdown textarea */}
        <div className={showPreview ? 'hidden md:block' : ''}>
          <textarea
            id="markdown-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? 'Write your content in Markdown...'}
            className="w-full min-h-[400px] px-4 py-3 text-sm font-mono text-gray-900 resize-y focus:outline-none"
          />
        </div>

        {/* Live preview */}
        <div className={`${!showPreview ? 'hidden md:block' : ''} bg-gray-50`}>
          <div className="px-2 py-1 border-b border-gray-200 text-xs font-medium text-gray-400 uppercase tracking-wider">
            Preview
          </div>
          <div
            className="prose prose-lg prose-pink max-w-none px-4 py-3 min-h-[400px]"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </div>
      </div>
    </div>
  )
}
