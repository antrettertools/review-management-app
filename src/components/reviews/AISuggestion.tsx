'use client'

import { useState, useEffect } from 'react'
import { Sparkles, X, RefreshCw, Check } from 'lucide-react'

interface AISuggestionProps {
  reviewId: string
  onUse: (response: string) => void
  onClose: () => void
}

export default function AISuggestion({
  reviewId,
  onUse,
  onClose,
}: AISuggestionProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editedResponse, setEditedResponse] = useState('')

  const fetchSuggestion = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/responses/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate response')
      }

      const data = await response.json()
      setEditedResponse(data.response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuggestion()
  }, [reviewId])

  return (
    <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 rounded-xl border border-indigo-200/60 p-5 animate-slide-down">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-md flex items-center justify-center">
            <Sparkles size={12} className="text-white" />
          </div>
          AI Response Suggestion
        </h4>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-all"
        >
          <X size={15} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-6">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Generating response...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-red-600 text-sm mb-3 font-medium">{error}</p>
          <button
            onClick={fetchSuggestion}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-semibold border border-red-200/60"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      ) : (
        <>
          <textarea
            value={editedResponse}
            onChange={(e) => setEditedResponse(e.target.value)}
            className="w-full px-3.5 py-3 border border-indigo-200/60 rounded-xl text-sm mb-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all bg-white/80 resize-none leading-relaxed"
            rows={4}
          />

          <div className="flex gap-2">
            <button
              onClick={() => onUse(editedResponse)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs bg-gradient-to-b from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-400 hover:to-emerald-500 transition-all font-semibold shadow-sm shadow-emerald-600/20"
            >
              <Check size={13} />
              Use This Response
            </button>
            <button
              onClick={fetchSuggestion}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs bg-white text-slate-600 rounded-lg hover:bg-slate-50 transition-all font-semibold border border-slate-200/60"
            >
              <RefreshCw size={12} />
              Regenerate
            </button>
          </div>
        </>
      )}
    </div>
  )
}
