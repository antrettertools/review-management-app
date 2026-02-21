'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import AISuggestion from './AISuggestion'

interface ResponseModalProps {
  review: {
    id: string
    author_name: string
    content: string
    rating: number
  }
  businessId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function ResponseModal({
  review,
  businessId,
  isOpen,
  onClose,
  onSuccess,
}: ResponseModalProps) {
  const [responseContent, setResponseContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAISuggestion, setShowAISuggestion] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId: review.id,
          businessId,
          content: responseContent,
          aiGenerated: false,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save response')
      }

      // Mark review as responded
      await supabase
        .from('reviews')
        .update({ is_responded: true })
        .eq('id', review.id)

      setResponseContent('')
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleUseAISuggestion = (suggestion: string) => {
    setResponseContent(suggestion)
    setShowAISuggestion(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Reply to Review</h2>
              <p className="text-blue-100 mt-1">From {review.author_name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-2xl font-bold hover:text-blue-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Original Review */}
        <div className="p-6 bg-gray-50 border-b">
          <h3 className="font-semibold text-gray-800 mb-2">Original Review</h3>
          <div className="bg-white p-4 rounded border border-gray-200">
            <div className="flex gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-700">{review.content}</p>
          </div>
        </div>

        {/* Response Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* AI Suggestion */}
          {showAISuggestion && (
            <AISuggestion
              reviewId={review.id}
              onUse={handleUseAISuggestion}
              onClose={() => setShowAISuggestion(false)}
            />
          )}

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Your Response
              </label>
              <button
                type="button"
                onClick={() => setShowAISuggestion(!showAISuggestion)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showAISuggestion ? 'Hide AI Suggestion' : 'Get AI Suggestion ✨'}
              </button>
            </div>
            <textarea
              value={responseContent}
              onChange={(e) => setResponseContent(e.target.value)}
              placeholder="Write your response to this review..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {responseContent.length} / 500 characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !responseContent.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}