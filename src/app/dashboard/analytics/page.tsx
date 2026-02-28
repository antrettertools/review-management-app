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
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', (session?.user as any)?.id)

      if (businesses && businesses.length > 0) {
        const businessIds = businesses.map((b) => b.id)

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
    return <div className="text-center py-8 text-slate-500">Loading analytics...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-slate-100">
          <p className="text-sm text-slate-600 font-medium">Total Reviews</p>
          <p className="text-4xl font-bold text-slate-900 mt-3">{stats.totalReviews}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-slate-100">
          <p className="text-sm text-slate-600 font-medium">Average Rating</p>
          <p className="text-4xl font-bold text-slate-900 mt-3">{stats.averageRating}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-slate-100">
          <p className="text-sm text-slate-600 font-medium">Response Rate</p>
          <p className="text-4xl font-bold text-blue-600 mt-3">
            {stats.totalReviews > 0
              ? Math.round(
                  (stats.respondedReviews / stats.totalReviews) * 100
                )
              : 0}%
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-slate-100">
          <p className="text-sm text-slate-600 font-medium">Positive (4-5 stars)</p>
          <div className="flex items-baseline gap-3 mt-3">
            <p className="text-4xl font-bold text-green-600">{stats.positiveReviews}</p>
            <span className="text-sm text-slate-500">
              {stats.totalReviews > 0
                ? Math.round((stats.positiveReviews / stats.totalReviews) * 100)
                : 0}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-slate-100">
          <p className="text-sm text-slate-600 font-medium">Negative (1-2 stars)</p>
          <div className="flex items-baseline gap-3 mt-3">
            <p className="text-4xl font-bold text-red-600">{stats.negativeReviews}</p>
            <span className="text-sm text-slate-500">
              {stats.totalReviews > 0
                ? Math.round((stats.negativeReviews / stats.totalReviews) * 100)
                : 0}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-slate-100">
          <p className="text-sm text-slate-600 font-medium">Urgent Reviews</p>
          <p className="text-4xl font-bold text-orange-600 mt-3">{stats.urgentReviews}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Summary</h2>
        <div className="space-y-4 text-slate-700">
          <p>
            You have <strong>{stats.totalReviews}</strong> total reviews with an average rating of <strong>{stats.averageRating}</strong>.
          </p>
          <p>
            <strong>{stats.positiveReviews}</strong> positive reviews ({stats.totalReviews > 0 ? Math.round((stats.positiveReviews / stats.totalReviews) * 100) : 0}%)
          </p>
          <p>
            <strong>{stats.negativeReviews}</strong> negative reviews ({stats.totalReviews > 0 ? Math.round((stats.negativeReviews / stats.totalReviews) * 100) : 0}%)
          </p>
          <p>
            You have responded to <strong>{stats.respondedReviews}</strong> reviews ({stats.totalReviews > 0 ? Math.round((stats.respondedReviews / stats.totalReviews) * 100) : 0}% response rate)
          </p>
          <p>
            <strong>{stats.urgentReviews}</strong> reviews need urgent attention
          </p>
        </div>
      </div>
    </div>
  )
}