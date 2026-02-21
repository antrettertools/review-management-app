'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    positiveReviews: 0,
    negativeReviews: 0,
    respondedReviews: 0,
    urgentReviews: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if ((session?.user as any)?.id) {
      fetchAnalytics()
    }
  }, [session])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Get user's businesses
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', (session?.user as any)?.id)

      if (businesses && businesses.length > 0) {
        const businessIds = businesses.map((b) => b.id)

        // Get all reviews for these businesses
        const { data: reviews } = await supabase
          .from('reviews')
          .select('*')
          .in('business_id', businessIds)

        if (reviews) {
          const totalReviews = reviews.length
          const positiveReviews = reviews.filter((r) => r.rating >= 4).length
          const negativeReviews = reviews.filter((r) => r.rating <= 2).length
          const respondedReviews = reviews.filter((r) => r.is_responded).length
          const urgentReviews = reviews.filter(
            (r) => r.urgency_level === 'critical'
          ).length
          const averageRating =
            totalReviews > 0
              ? (
                  reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
                  totalReviews
                ).toFixed(1)
              : 0

          setStats({
            totalReviews,
            averageRating: parseFloat(averageRating as string),
            positiveReviews,
            negativeReviews,
            respondedReviews,
            urgentReviews,
          })
        }
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading analytics...</div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Reviews */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Total Reviews
          </h3>
          <p className="text-4xl font-bold text-gray-800">
            {stats.totalReviews}
          </p>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Average Rating
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-gray-800">
              {stats.averageRating}
            </p>
            <span className="text-xl text-yellow-500">★</span>
          </div>
        </div>

        {/* Response Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Response Rate
          </h3>
          <p className="text-4xl font-bold text-blue-600">
            {stats.totalReviews > 0
              ? Math.round(
                  (stats.respondedReviews / stats.totalReviews) * 100
                )
              : 0}
            %
          </p>
        </div>

        {/* Positive Reviews */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Positive Reviews (4-5⭐)
          </h3>
          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-bold text-green-600">
              {stats.positiveReviews}
            </p>
            <span className="text-sm text-gray-500">
              {stats.totalReviews > 0
                ? Math.round((stats.positiveReviews / stats.totalReviews) * 100)
                : 0}
              %
            </span>
          </div>
        </div>

        {/* Negative Reviews */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Negative Reviews (1-2⭐)
          </h3>
          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-bold text-red-600">
              {stats.negativeReviews}
            </p>
            <span className="text-sm text-gray-500">
              {stats.totalReviews > 0
                ? Math.round((stats.negativeReviews / stats.totalReviews) * 100)
                : 0}
              %
            </span>
          </div>
        </div>

        {/* Urgent Reviews */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Urgent Reviews
          </h3>
          <p className="text-4xl font-bold text-orange-600">
            {stats.urgentReviews}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Summary</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            You have <strong>{stats.totalReviews}</strong> total reviews with an
            average rating of <strong>{stats.averageRating}⭐</strong>
          </p>
          <p>
            <strong>{stats.positiveReviews}</strong> positive reviews (
            {stats.totalReviews > 0
              ? Math.round((stats.positiveReviews / stats.totalReviews) * 100)
              : 0}
            %)
          </p>
          <p>
            <strong>{stats.negativeReviews}</strong> negative reviews (
            {stats.totalReviews > 0
              ? Math.round((stats.negativeReviews / stats.totalReviews) * 100)
              : 0}
            %)
          </p>
          <p>
            You've responded to <strong>{stats.respondedReviews}</strong> reviews (
            {stats.totalReviews > 0
              ? Math.round((stats.respondedReviews / stats.totalReviews) * 100)
              : 0}
            % response rate)
          </p>
          <p>
            <strong>{stats.urgentReviews}</strong> reviews need urgent attention
          </p>
        </div>
      </div>
    </div>
  )
}