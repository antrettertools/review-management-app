'use client'

import { useState, useEffect } from 'react'

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
  const [suggestion, setSuggestion] = useState('')
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
      setSuggestion(data.response)
      setEditedResponse(data.response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Fetch suggestion on mount
  useEffect(() => {
    fetchSuggestion()
  }, [reviewId])

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-lg">✨</span> AI Response Suggestion
        </h4>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4 text-gray-500">
          <p>Generating response...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={fetchSuggestion}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <textarea
            value={editedResponse}
            onChange={(e) => setEditedResponse(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />

          <div className="flex gap-2">
            <button
              onClick={() => onUse(editedResponse)}
              className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Use This Response
            </button>
            <button
              onClick={fetchSuggestion}
              className="px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Regenerate
            </button>
          </div>
        </>
      )}
    </div>
  )
}