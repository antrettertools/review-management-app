'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'
import ResponseModal from '@/components/reviews/ResponseModal'
import { Star, MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export default function ReviewsPage() {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if ((session?.user as any)?.id) {
      fetchReviews()
    }
  }, [session, filter])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', (session?.user as any)?.id)

      if (businesses && businesses.length > 0) {
        const businessIds = businesses.map((b) => b.id)

        let query = supabase
          .from('reviews')
          .select('*')
          .in('business_id', businessIds)

        if (filter === 'responded') {
          query = query.eq('is_responded', true)
        } else if (filter === 'not-responded') {
          query = query.eq('is_responded', false)
        } else if (filter === 'urgent') {
          query = query.eq('urgency_level', 'critical')
        }

        const { data } = await query.order('created_at', { ascending: false })
        setReviews(data || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReplyClick = (review: any) => {
    setSelectedReview(review)
    setShowModal(true)
  }

  const handleMarkUrgent = async (reviewId: string) => {
    try {
      await supabase
        .from('reviews')
        .update({ urgency_level: 'critical' })
        .eq('id', reviewId)

      fetchReviews()
    } catch (error) {
      console.error('Error marking urgent:', error)
      alert('Failed to mark as urgent')
    }
  }

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={13}
          className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
        />
      ))}
    </div>
  )

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const filters = [
    { key: 'all', label: 'All Reviews' },
    { key: 'responded', label: 'Responded' },
    { key: 'not-responded', label: 'Awaiting Response' },
    { key: 'urgent', label: 'Urgent' },
  ]

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reviews</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and respond to your customer reviews</p>
        </div>
        {!loading && (
          <div className="text-sm text-slate-400 font-medium bg-white px-3.5 py-2 rounded-lg border border-slate-200/60">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-1.5 mb-6 inline-flex gap-1 animate-fade-in-up">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.key
                ? f.key === 'urgent'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-md shadow-blue-900/20'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Loading reviews...</p>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} className="text-slate-300" />
          </div>
          <p className="text-slate-900 font-semibold">No reviews found</p>
          <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
            {filter !== 'all' ? 'Try changing the filter above.' : 'Connect your platforms to start seeing reviews.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`bg-white rounded-xl hover:shadow-md transition-all p-5 border animate-fade-in-up ${
                review.urgency_level === 'critical'
                  ? 'border-orange-200/80 bg-gradient-to-r from-white to-orange-50/30'
                  : 'border-slate-200/60'
              }`}
              style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
            >
              {/* Review header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                  {/* Author avatar */}
                  <div className="w-9 h-9 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-500 text-sm font-bold flex-shrink-0">
                    {review.author_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-[15px] leading-tight">
                      {review.author_name}
                    </h3>
                    <div className="flex items-center gap-2.5 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">{review.platform}</span>
                      {review.created_at && (
                        <>
                          <span className="text-slate-200">|</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock size={10} />
                            {formatDate(review.created_at)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  {review.is_responded && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      <CheckCircle size={11} />
                      Responded
                    </span>
                  )}
                  {review.urgency_level === 'critical' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-100">
                      <AlertTriangle size={11} />
                      Urgent
                    </span>
                  )}
                </div>
              </div>

              {/* Review content */}
              <p className="text-slate-600 text-sm leading-relaxed mb-4 ml-12">{review.content}</p>

              {/* Actions */}
              <div className="flex gap-2 ml-12">
                <button
                  onClick={() => handleReplyClick(review)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-b from-blue-800 to-blue-900 text-white rounded-lg text-xs font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm shadow-blue-900/20"
                >
                  <MessageSquare size={13} />
                  {review.is_responded ? 'View Response' : 'Reply'}
                </button>
                {review.urgency_level !== 'critical' && (
                  <button
                    onClick={() => handleMarkUrgent(review.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors border border-slate-200/60"
                  >
                    <AlertTriangle size={13} />
                    Mark Urgent
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {selectedReview && (
        <ResponseModal
          review={selectedReview}
          businessId={selectedReview.business_id}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedReview(null)
          }}
          onSuccess={() => {
            fetchReviews()
          }}
        />
      )}
    </div>
  )
}
