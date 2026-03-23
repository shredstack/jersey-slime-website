'use client'

import { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import MarkdownIt from 'markdown-it'

// Dynamically import editors to keep them out of the initial bundle
const VisualEditor = dynamic(() => import('./VisualEditor'), { ssr: false })
const MarkdownEditor = dynamic(() => import('./MarkdownEditor'), { ssr: false })
const HtmlEditor = dynamic(() => import('./HtmlEditor'), { ssr: false })

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

type EditorMode = 'visual' | 'markdown' | 'html'

interface ContentEditorProps {
  value: string
  onChange: (html: string) => void
  markdownSource?: string | null
  onMarkdownSourceChange?: (md: string | null) => void
  initialMode?: EditorMode
  onImageUpload: (file: File) => Promise<string>
  placeholder?: string
}

export default function ContentEditor({
  value,
  onChange,
  markdownSource,
  onMarkdownSourceChange,
  initialMode = 'visual',
  onImageUpload,
  placeholder,
}: ContentEditorProps) {
  const [mode, setMode] = useState<EditorMode>(initialMode)
  const [mdSource, setMdSource] = useState(markdownSource ?? '')
  const [showConfirm, setShowConfirm] = useState<EditorMode | null>(null)

  const hasContent = value.trim().length > 0 || mdSource.trim().length > 0

  const handleModeSwitch = useCallback(
    (newMode: EditorMode) => {
      if (newMode === mode) return

      // Show confirmation if content has been modified
      if (hasContent) {
        setShowConfirm(newMode)
        return
      }

      applyModeSwitch(newMode)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, hasContent]
  )

  const applyModeSwitch = useCallback(
    (newMode: EditorMode) => {
      setShowConfirm(null)

      if (mode === 'markdown' && newMode !== 'markdown') {
        // Convert markdown to HTML
        const html = md.render(mdSource)
        onChange(html)
        onMarkdownSourceChange?.(mdSource)
      }

      if (newMode === 'markdown' && mode !== 'markdown') {
        // If we have saved markdown source, restore it
        if (markdownSource) {
          setMdSource(markdownSource)
        } else {
          // Starting fresh in markdown mode — clear content
          setMdSource('')
        }
      }

      setMode(newMode)
    },
    [mode, mdSource, markdownSource, onChange, onMarkdownSourceChange]
  )

  // When markdown changes, also update HTML for storage
  const handleMarkdownChange = useCallback(
    (newMd: string) => {
      setMdSource(newMd)
      const html = md.render(newMd)
      onChange(html)
      onMarkdownSourceChange?.(newMd)
    },
    [onChange, onMarkdownSourceChange]
  )

  const modes: { key: EditorMode; label: string }[] = useMemo(
    () => [
      { key: 'visual', label: 'Visual' },
      { key: 'markdown', label: 'Markdown' },
      { key: 'html', label: 'HTML' },
    ],
    []
  )

  return (
    <div>
      {/* Mode switcher */}
      <div className="flex items-center gap-1 mb-2">
        {modes.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleModeSwitch(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === key
                ? 'bg-brand-purple text-white'
                : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="mb-2 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3">
          <p className="text-sm text-yellow-800">
            {showConfirm === 'markdown'
              ? 'Switching to Markdown mode will not convert your existing HTML. You can start fresh or stay in the current mode.'
              : 'Switching modes may cause minor formatting changes. Continue?'}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => applyModeSwitch(showConfirm)}
              className="rounded-lg bg-yellow-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-yellow-700 transition-colors"
            >
              Switch Anyway
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(null)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Editor surface */}
      {mode === 'visual' && (
        <VisualEditor
          value={value}
          onChange={onChange}
          onImageUpload={onImageUpload}
          placeholder={placeholder}
        />
      )}
      {mode === 'markdown' && (
        <MarkdownEditor
          value={mdSource}
          onChange={handleMarkdownChange}
          placeholder={placeholder}
        />
      )}
      {mode === 'html' && (
        <HtmlEditor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}
