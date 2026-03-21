'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import AISuggestion from './AISuggestion'
import { Star, Trash2, AlertTriangle, MessageSquare } from 'lucide-react'

interface ResponseModalProps {
  review: {
    id: string
    author_name: string
    content: string
    rating: number
    platform?: string
    created_at?: string
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  const handleDeleteReview = async () => {
    setDeleting(true)
    setError('')

    try {
      await supabase
        .from('reviews')
        .delete()
        .eq('id', review.id)

      setShowDeleteConfirm(false)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review')
      setDeleting(false)
    }
  }

  const handleUseAISuggestion = (suggestion: string) => {
    setResponseContent(suggestion)
    setShowAISuggestion(false)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 border-b border-blue-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Reply to Review</h2>
              <p className="text-sm text-blue-100">From {review.author_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:text-blue-200 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Original Review Card */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">{review.author_name}</h3>
                {review.platform && (
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-0.5">
                    {review.platform} Review
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}
                  />
                ))}
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed">{review.content}</p>

            {review.created_at && (
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                Posted on {formatDate(review.created_at)}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
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

          {/* Response Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-900">
                  Your Response
                </label>
                <button
                  type="button"
                  onClick={() => setShowAISuggestion(!showAISuggestion)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {showAISuggestion ? '✕ Hide AI Suggestion' : '✨ Get AI Suggestion'}
                </button>
              </div>
              <textarea
                value={responseContent}
                onChange={(e) => setResponseContent(e.target.value)}
                placeholder="Write your response to this review..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all min-h-[120px] resize-none"
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-slate-500">
                  {responseContent.length} / 500 characters
                </p>
                {responseContent.length > 450 && (
                  <p className="text-xs text-orange-600 font-medium">Getting close to limit</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
              >
                <Trash2 size={16} />
                Delete Review
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !responseContent.trim()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Saving...' : 'Save Response'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto">
              <AlertTriangle size={24} className="text-red-600" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Delete This Review?</h3>
              <p className="text-slate-600 text-sm mt-2">
                This action cannot be undone. The review from <strong>{review.author_name}</strong> will be permanently removed.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleDeleteReview}
                disabled={deleting}
                className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Review'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="w-full px-4 py-2.5 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
