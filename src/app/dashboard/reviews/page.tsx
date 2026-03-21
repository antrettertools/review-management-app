'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'
import ResponseModal from '@/components/reviews/ResponseModal'
import { Star, MessageSquare, AlertTriangle, CheckCircle, Filter } from 'lucide-react'

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
          size={14}
          className={star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-200'}
        />
      ))}
    </div>
  )

  const filters = [
    { key: 'all', label: 'All', activeClass: 'bg-blue-900 text-white shadow-md' },
    { key: 'responded', label: 'Responded', activeClass: 'bg-blue-900 text-white shadow-md' },
    { key: 'not-responded', label: 'Not Responded', activeClass: 'bg-blue-900 text-white shadow-md' },
    { key: 'urgent', label: 'Urgent', activeClass: 'bg-red-600 text-white shadow-md' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Reviews</h1>
        {!loading && (
          <p className="text-sm text-slate-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-5 mb-6 border border-slate-100 animate-fade-in-up">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter size={16} className="text-slate-400" />
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.key
                  ? f.activeClass
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500">Loading reviews...</p>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-slate-100">
          <MessageSquare size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No reviews found</p>
          <p className="text-sm text-slate-400 mt-1">
            {filter !== 'all' ? 'Try changing the filter above.' : 'Connect your platforms to start seeing reviews.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 border animate-fade-in-up ${
                review.urgency_level === 'critical'
                  ? 'border-orange-200 bg-gradient-to-r from-white to-orange-50/30'
                  : 'border-slate-100'
              }`}
              style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {review.author_name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    {renderStars(review.rating)}
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">{review.platform}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  {review.is_responded && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      <CheckCircle size={12} />
                      Responded
                    </span>
                  )}
                  {review.urgency_level === 'critical' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                      <AlertTriangle size={12} />
                      Urgent
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-700 mb-5 leading-relaxed">{review.content}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleReplyClick(review)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
                >
                  <MessageSquare size={14} />
                  Reply
                </button>
                {review.urgency_level !== 'critical' && (
                  <button
                    onClick={() => handleMarkUrgent(review.id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    <AlertTriangle size={14} />
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
