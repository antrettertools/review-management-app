'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'
import ResponseModal from '@/components/reviews/ResponseModal'

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

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Reviews</h1>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-100">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('responded')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              filter === 'responded'
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            }`}
          >
            Responded
          </button>
          <button
            onClick={() => setFilter('not-responded')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              filter === 'not-responded'
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            }`}
          >
            Not Responded
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              filter === 'urgent'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            }`}
          >
            Urgent
          </button>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8 text-slate-500">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-slate-500">No reviews found</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {review.author_name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{review.platform}</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium text-white ${
                      review.rating >= 4
                        ? 'bg-green-600'
                        : review.rating >= 3
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                    }`}
                  >
                    {review.rating} star
                  </span>
                  {review.is_responded && (
                    <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-700">
                      Responded
                    </span>
                  )}
                  {review.urgency_level === 'critical' && (
                    <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700">
                      Urgent
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-700 mb-6 leading-relaxed">{review.content}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleReplyClick(review)}
                  className="px-4 py-2.5 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
                >
                  Reply
                </button>
                <button
                  onClick={() => handleMarkUrgent(review.id)}
                  className="px-4 py-2.5 bg-slate-200 text-slate-900 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                >
                  Mark Urgent
                </button>
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