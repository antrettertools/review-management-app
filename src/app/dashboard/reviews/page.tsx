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
      // Get user's businesses first
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', (session?.user as any)?.id)

      if (businesses && businesses.length > 0) {
        const businessIds = businesses.map((b) => b.id)

        // Fetch reviews for these businesses
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reviews</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all'
                ? 'bg-blue-900 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('responded')}
            className={`px-4 py-2 rounded ${
              filter === 'responded'
                ? 'bg-blue-900 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Responded
          </button>
          <button
            onClick={() => setFilter('not-responded')}
            className={`px-4 py-2 rounded ${
              filter === 'not-responded'
                ? 'bg-blue-900 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Not Responded
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`px-4 py-2 rounded ${
              filter === 'urgent'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Urgent
          </button>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No reviews yet</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {review.author_name}
                  </h3>
                  <p className="text-sm text-gray-500">{review.platform}</p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 rounded text-sm text-white ${
                      review.rating >= 4
                        ? 'bg-green-600'
                        : review.rating >= 3
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                    }`}
                  >
                    ★ {review.rating}
                  </span>
                  {review.is_responded && (
                    <span className="px-3 py-1 rounded text-sm bg-blue-600 text-white">
                      Responded
                    </span>
                  )}
                  {review.urgency_level === 'critical' && (
                    <span className="px-3 py-1 rounded text-sm bg-red-600 text-white">
                      Urgent
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.content}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleReplyClick(review)}
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                >
                  Reply
                </button>
                <button
                  onClick={() => handleMarkUrgent(review.id)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
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