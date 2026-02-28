'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'

export default function DashboardPage() {
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
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
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
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-slate-500">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-slate-600 font-medium">Total Reviews</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{stats.totalReviews}</p>
        </div>

        <div className="card">
          <p className="text-sm text-slate-600 font-medium">Average Rating</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{stats.averageRating}</p>
        </div>

        <div className="card">
          <p className="text-sm text-slate-600 font-medium">Response Rate</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">
            {stats.totalReviews > 0
              ? Math.round((stats.respondedReviews / stats.totalReviews) * 100)
              : 0}%
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-slate-600 font-medium">Positive Reviews</p>
          <p className="text-4xl font-bold text-green-600 mt-2">{stats.positiveReviews}</p>
        </div>

        <div className="card">
          <p className="text-sm text-slate-600 font-medium">Negative Reviews</p>
          <p className="text-4xl font-bold text-red-600 mt-2">{stats.negativeReviews}</p>
        </div>

        <div className="card">
          <p className="text-sm text-slate-600 font-medium">Urgent Reviews</p>
          <p className="text-4xl font-bold text-orange-600 mt-2">{stats.urgentReviews}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Getting Started</h2>
        <ul className="space-y-3 text-slate-700">
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span>Connect your Google Business account in Settings</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span>View all customer reviews from Google and other platforms</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span>Respond to reviews with AI-powered suggestions</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span>Track your analytics and improvement over time</span>
          </li>
        </ul>
      </div>
    </div>
  )
}