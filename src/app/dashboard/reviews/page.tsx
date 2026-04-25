'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import ResponseModal from '@/components/reviews/ResponseModal'
import { Star, MessageSquare, AlertTriangle, CheckCircle, Clock, Search, ArrowUpDown, Check, Settings as SettingsIcon } from 'lucide-react'

export default function ReviewsPage() {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<any[]>([])
  const [filteredReviews, setFilteredReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedReviews, setSelectedReviews] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 25

  useEffect(() => {
    if ((session?.user as any)?.id) {
      fetchReviews()
    }
  }, [session, filter])

  // Apply search and sort to reviews
  useEffect(() => {
    let result = [...reviews]

    // Apply filter
    if (filter === 'responded') {
      result = result.filter(r => r.is_responded)
    } else if (filter === 'not-responded') {
      result = result.filter(r => !r.is_responded)
    } else if (filter === 'urgent') {
      result = result.filter(r => r.urgency_level === 'critical')
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(r =>
        (r.content || '').toLowerCase().includes(query) ||
        (r.author_name || '').toLowerCase().includes(query)
      )
    }

    // Apply sort
    if (sort === 'oldest') {
      result.reverse()
    } else if (sort === 'highest-rated') {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sort === 'lowest-rated') {
      result.sort((a, b) => a.rating - b.rating)
    }
    // 'newest' is default (already in created_at DESC order)

    setFilteredReviews(result)
    // Reset to first page whenever filters/search/sort change
    setPage(1)
  }, [reviews, filter, searchQuery, sort])

  // Compute paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pagedReviews = filteredReviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

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

  const handleBulkMarkUrgent = async () => {
    if (selectedReviews.length === 0) return
    try {
      await supabase
        .from('reviews')
        .update({ urgency_level: 'critical' })
        .in('id', selectedReviews)

      setSelectedReviews([])
      fetchReviews()
    } catch (error) {
      console.error('Error marking urgent:', error)
      alert('Failed to mark reviews as urgent')
    }
  }

  const toggleSelectReview = (reviewId: string) => {
    setSelectedReviews(prev =>
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    )
  }

  const toggleSelectAll = () => {
    // Toggles selection for the currently visible (paged) reviews only.
    const pageIds = pagedReviews.map((r) => r.id)
    const allOnPageSelected = pageIds.every((id) => selectedReviews.includes(id))
    if (allOnPageSelected) {
      setSelectedReviews((prev) => prev.filter((id) => !pageIds.includes(id)))
    } else {
      setSelectedReviews((prev) => Array.from(new Set([...prev, ...pageIds])))
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
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reviews</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and respond to your customer reviews</p>
        </div>
        {!loading && (
          <div className="text-sm text-slate-400 font-medium bg-white px-3.5 py-2 rounded-lg border border-slate-200">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Filters, Search, and Sort */}
      <div className="mb-6 space-y-4 animate-fade-in-up">
        {/* Filter pills */}
        <div className="bg-white rounded-xl border border-slate-200 p-1.5 inline-flex gap-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.key
                  ? f.key === 'urgent'
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-800 text-white'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by author name or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest-rated">Highest rated</option>
            <option value="lowest-rated">Lowest rated</option>
          </select>
        </div>

        {/* Bulk actions */}
        {selectedReviews.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
            <Check size={18} className="text-blue-700" />
            <span className="text-sm font-medium text-blue-900">{selectedReviews.length} selected</span>
            <button
              onClick={handleBulkMarkUrgent}
              className="ml-auto text-sm px-3 py-1.5 bg-blue-700 text-white rounded font-medium hover:bg-blue-800 transition-colors"
            >
              Mark as Urgent
            </button>
            <button
              onClick={() => setSelectedReviews([])}
              className="text-sm px-3 py-1.5 border border-blue-200 text-blue-700 rounded font-medium hover:bg-blue-100 transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Loading reviews...</p>
          </div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-slate-200">
          <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} className="text-slate-300" />
          </div>
          <p className="text-slate-900 font-semibold">No reviews found</p>
          <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
            {searchQuery
              ? 'Try a different search term.'
              : filter !== 'all'
              ? 'Try changing the filter above.'
              : reviews.length === 0
              ? 'Connect Google Business Profile to start syncing reviews automatically. New reviews typically appear within 24 hours.'
              : 'No reviews match this filter yet.'}
          </p>
          {!searchQuery && filter === 'all' && reviews.length === 0 && (
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 bg-blue-800 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <SettingsIcon size={14} />
              Connect Google Business
            </Link>
          )}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Clear search
            </button>
          )}
          {filter !== 'all' && !searchQuery && (
            <button
              onClick={() => setFilter('all')}
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Show all reviews
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Select All on this page */}
          {pagedReviews.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={
                  pagedReviews.length > 0 &&
                  pagedReviews.every((r) => selectedReviews.includes(r.id))
                }
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-slate-300 cursor-pointer"
              />
              <label className="cursor-pointer">
                Select all {pagedReviews.length} on this page
              </label>
            </div>
          )}

          {pagedReviews.map((review, index) => (
            <div
              key={review.id}
              className={`bg-white rounded-xl hover:shadow-md transition-all p-5 border-l-4 animate-fade-in-up ${
                review.urgency_level === 'critical'
                  ? 'border-l-orange-500 border-orange-200 bg-orange-50/40'
                  : 'border-l-slate-200 border-slate-200'
              } ${selectedReviews.includes(review.id) ? 'bg-blue-50 border-blue-200 border-l-blue-500' : ''}`}
              style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
            >
              {/* Top row: Checkbox + Header + Badges */}
              <div className="flex items-start gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={selectedReviews.includes(review.id)}
                  onChange={() => toggleSelectReview(review.id)}
                  className="w-4 h-4 mt-1 rounded border-slate-300 cursor-pointer flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-500 text-sm font-bold flex-shrink-0">
                      {review.author_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-sm">{review.author_name}</h3>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {renderStars(review.rating)}
                        <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">{review.platform}</span>
                        {review.created_at && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock size={10} />
                            {formatDate(review.created_at)}
                          </span>
                        )}
                      </div>
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-800 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare size={13} />
                  {review.is_responded ? 'View Response' : 'Reply'}
                </button>
                {review.urgency_level !== 'critical' && (
                  <button
                    onClick={() => handleMarkUrgent(review.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    <AlertTriangle size={13} />
                    Mark Urgent
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * PAGE_SIZE + 1}</span>
                {'–'}
                <span className="font-semibold text-slate-700">
                  {Math.min(currentPage * PAGE_SIZE, filteredReviews.length)}
                </span>{' '}
                of <span className="font-semibold text-slate-700">{filteredReviews.length}</span>
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-500 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
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
