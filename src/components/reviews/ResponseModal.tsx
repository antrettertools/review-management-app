'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AISuggestion from './AISuggestion'
import { Star, Trash2, AlertTriangle, MessageSquare, X, Sparkles, Clock, Send } from 'lucide-react'

interface ResponseModalProps {
  review: {
    id: string
    author_name: string
    content: string
    rating: number
    platform?: string
    created_at?: string
    is_responded?: boolean
  }
  businessId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface SavedResponse {
  id: string
  content: string
  ai_generated: boolean
  created_at: string
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

  // Existing responses state
  const [existingResponses, setExistingResponses] = useState<SavedResponse[]>([])
  const [loadingResponses, setLoadingResponses] = useState(false)
  const [deletingResponseId, setDeletingResponseId] = useState<string | null>(null)
  const [showDeleteResponseConfirm, setShowDeleteResponseConfirm] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && review.is_responded) {
      fetchExistingResponses()
    }
  }, [isOpen, review.id, review.is_responded])

  if (!isOpen) return null

  const fetchExistingResponses = async () => {
    setLoadingResponses(true)
    try {
      const res = await fetch(`/api/responses?reviewId=${review.id}`)
      if (res.ok) {
        const data = await res.json()
        setExistingResponses(data || [])
      }
    } catch (err) {
      console.error('Error fetching responses:', err)
    } finally {
      setLoadingResponses(false)
    }
  }

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


  const handleDeleteResponse = async (responseId: string) => {
    setDeletingResponseId(responseId)
    setError('')

    try {
      const res = await fetch(`/api/responses/${responseId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete response')
      }

      // Remove from local state
      const updated = existingResponses.filter(r => r.id !== responseId)
      setExistingResponses(updated)

      // If no more responses, mark review as not responded
      if (updated.length === 0) {
        await supabase
          .from('reviews')
          .update({ is_responded: false })
          .eq('id', review.id)
      }

      setShowDeleteResponseConfirm(null)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete response')
    } finally {
      setDeletingResponseId(null)
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

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-blue-800 text-white p-5 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
              <MessageSquare size={17} />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">{review.is_responded ? 'Review & Response' : 'Reply to Review'}</h2>
              <p className="text-sm text-blue-200/70">From {review.author_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Original Review Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-sm font-bold flex-shrink-0">
                  {review.author_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-[15px]">{review.author_name}</h3>
                  {review.platform && (
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                      {review.platform} Review
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                  />
                ))}
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">{review.content}</p>

            {review.created_at && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-2 border-t border-slate-200">
                <Clock size={10} />
                Posted on {formatDate(review.created_at)}
              </p>
            )}
          </div>

          {/* Existing Responses */}
          {review.is_responded && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Responses</h4>
              {loadingResponses ? (
                <div className="text-center py-4">
                  <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Loading responses...</p>
                </div>
              ) : existingResponses.length > 0 ? (
                existingResponses.map((resp) => (
                  <div key={resp.id} className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-slate-700 leading-relaxed flex-1">{resp.content}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock size={10} />
                          {formatDateTime(resp.created_at)}
                        </p>
                        {resp.ai_generated && (
                          <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                            AI Generated
                          </span>
                        )}
                      </div>
                      {/* Delete response button */}
                      {showDeleteResponseConfirm === resp.id ? (
                        <div className="flex items-center gap-1.5 animate-fade-in">
                          <span className="text-[11px] text-red-600 font-medium">Delete?</span>
                          <button
                            onClick={() => handleDeleteResponse(resp.id)}
                            disabled={deletingResponseId === resp.id}
                            className="text-[11px] font-semibold text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
                          >
                            {deletingResponseId === resp.id ? 'Deleting...' : 'Yes'}
                          </button>
                          <button
                            onClick={() => setShowDeleteResponseConfirm(null)}
                            className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-md transition-colors border border-slate-200"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteResponseConfirm(resp.id)}
                          className="text-[11px] font-medium text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1 px-2 py-1 rounded-md hover:bg-red-50"
                        >
                          <Trash2 size={11} />
                          Delete Response
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-2">No responses found.</p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
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
                  {existingResponses.length > 0 ? 'Write Another Response' : 'Your Response'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowAISuggestion(!showAISuggestion)}
                  className="text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles size={13} />
                  {showAISuggestion ? 'Hide AI Suggestion' : 'Get AI Suggestion'}
                </button>
              </div>
              <textarea
                value={responseContent}
                onChange={(e) => setResponseContent(e.target.value)}
                placeholder="Write your response to this review..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all min-h-[120px] resize-none text-sm bg-slate-50/50"
                required
              />
              <div className="flex justify-between items-center mt-1.5">
                <p className="text-[11px] text-slate-400">
                  {responseContent.length} / 2,000 characters
                </p>
                {responseContent.length > 1800 && (
                  <p className="text-[11px] text-orange-600 font-semibold">Getting close to limit</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 justify-end pt-4 border-t border-slate-100">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors font-semibold text-xs border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !responseContent.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-xs"
                >
                  <Send size={13} />
                  {loading ? 'Saving...' : 'Save Response'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}
