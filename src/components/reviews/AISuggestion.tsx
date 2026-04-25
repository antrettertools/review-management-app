'use client'

import { useState, useEffect } from 'react'
import { Sparkles, X, RefreshCw, Check } from 'lucide-react'

type Tone = 'professional' | 'friendly' | 'casual' | 'formal'

interface AISuggestionProps {
  reviewId: string
  onUse: (response: string) => void
  onClose: () => void
}

const TONES: { key: Tone; label: string }[] = [
  { key: 'professional', label: 'Professional' },
  { key: 'friendly', label: 'Friendly' },
  { key: 'casual', label: 'Casual' },
  { key: 'formal', label: 'Formal' },
]

export default function AISuggestion({
  reviewId,
  onUse,
  onClose,
}: AISuggestionProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editedResponse, setEditedResponse] = useState('')
  const [tone, setTone] = useState<Tone>('professional')

  const fetchSuggestion = async (selectedTone: Tone = tone) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/responses/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, tone: selectedTone }),
      })

      if (!response.ok) throw new Error('Failed to generate response')

      const data = await response.json()
      setEditedResponse(data.response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuggestion('professional')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewId])

  const handleToneChange = (next: Tone) => {
    if (next === tone || loading) return
    setTone(next)
    fetchSuggestion(next)
  }

  return (
    <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 animate-slide-down">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-slate-900 text-sm flex items-center gap-2">
          <Sparkles size={14} className="text-blue-600" />
          AI Response Suggestion
        </h4>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={15} />
        </button>
      </div>

      {/* Tone selector */}
      <div className="mb-3">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Tone</p>
        <div className="flex flex-wrap gap-1.5">
          {TONES.map((t) => (
            <button
              key={t.key}
              type="button"
              disabled={loading}
              onClick={() => handleToneChange(t.key)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors border ${
                tone === t.key
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Generating response...</p>
        </div>
      ) : error ? (
        <div className="text-center py-3">
          <p className="text-red-600 text-sm mb-2">{error}</p>
          <button onClick={() => fetchSuggestion()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200">
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      ) : (
        <>
          <textarea
            value={editedResponse}
            onChange={(e) => setEditedResponse(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm mb-3 focus:border-blue-800 bg-white resize-none leading-relaxed text-slate-900"
            rows={5}
          />
          <div className="flex gap-2">
            <button onClick={() => onUse(editedResponse)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors font-medium">
              <Check size={13} />
              Use This Response
            </button>
            <button onClick={() => fetchSuggestion()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs bg-white text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium border border-slate-200">
              <RefreshCw size={12} />
              Regenerate
            </button>
          </div>
        </>
      )}
    </div>
  )
}
