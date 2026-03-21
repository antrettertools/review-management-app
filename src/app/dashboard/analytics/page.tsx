'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'
import { Star, TrendingUp, MessageSquare, ThumbsUp, ThumbsDown, AlertTriangle, Shield, BarChart3, Activity } from 'lucide-react'

interface Review {
  id: string
  rating: number
  is_responded: boolean
  urgency_level: string
  created_at: string
  content: string
  author_name: string
  platform: string
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    positiveReviews: 0,
    negativeReviews: 0,
    neutralReviews: 0,
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

        const { data: reviewData } = await supabase
          .from('reviews')
          .select('*')
          .in('business_id', businessIds)
          .order('created_at', { ascending: false })

        if (reviewData) {
          setReviews(reviewData)
          const totalReviews = reviewData.length
          const positiveReviews = reviewData.filter((r) => r.rating >= 4).length
          const negativeReviews = reviewData.filter((r) => r.rating <= 2).length
          const neutralReviews = reviewData.filter((r) => r.rating === 3).length
          const respondedReviews = reviewData.filter((r) => r.is_responded).length
          const urgentReviews = reviewData.filter(
            (r) => r.urgency_level === 'critical'
          ).length
          const averageRating =
            totalReviews > 0
              ? (
                  reviewData.reduce((sum: number, r: any) => sum + r.rating, 0) /
                  totalReviews
                ).toFixed(1)
              : 0

          setStats({
            totalReviews,
            averageRating: parseFloat(averageRating as string),
            positiveReviews,
            negativeReviews,
            neutralReviews,
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

  // --- Advanced Metric: Reputation Score (0–100) ---
  // Weighted composite: avg rating (40%), response rate (30%), positive ratio (20%), low urgency (10%)
  const computeReputationScore = () => {
    if (stats.totalReviews === 0) return 0

    const ratingScore = (stats.averageRating / 5) * 100
    const responseRate = (stats.respondedReviews / stats.totalReviews) * 100
    const positiveRatio = (stats.positiveReviews / stats.totalReviews) * 100
    const urgencyScore = stats.totalReviews > 0
      ? ((stats.totalReviews - stats.urgentReviews) / stats.totalReviews) * 100
      : 100

    return Math.round(
      ratingScore * 0.4 +
      responseRate * 0.3 +
      positiveRatio * 0.2 +
      urgencyScore * 0.1
    )
  }

  // --- Advanced Metric: Rating Distribution ---
  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0] // index 0 = 1-star, index 4 = 5-star
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[r.rating - 1]++
      }
    })
    return distribution
  }

  const reputationScore = computeReputationScore()
  const ratingDistribution = getRatingDistribution()
  const maxDistribution = Math.max(...ratingDistribution, 1)

  const responseRate = stats.totalReviews > 0
    ? Math.round((stats.respondedReviews / stats.totalReviews) * 100)
    : 0

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: 'text-green-600', bg: 'bg-green-500', ring: 'ring-green-100', label: 'Excellent' }
    if (score >= 60) return { text: 'text-blue-600', bg: 'bg-blue-500', ring: 'ring-blue-100', label: 'Good' }
    if (score >= 40) return { text: 'text-yellow-600', bg: 'bg-yellow-500', ring: 'ring-yellow-100', label: 'Fair' }
    return { text: 'text-red-600', bg: 'bg-red-500', ring: 'ring-red-100', label: 'Needs Work' }
  }

  const scoreStyle = getScoreColor(reputationScore)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
      </div>

      {/* Core Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <div className="stat-card bg-white rounded-2xl shadow-md p-6 border border-slate-100 animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500 font-medium">Total Reviews</p>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <MessageSquare size={18} className="text-blue-700" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900">{stats.totalReviews}</p>
        </div>

        <div className="stat-card bg-white rounded-2xl shadow-md p-6 border border-slate-100 animate-fade-in-up delay-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500 font-medium">Average Rating</p>
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Star size={18} className="text-yellow-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-slate-900">{stats.averageRating}</p>
            <span className="text-sm text-slate-400">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={star <= Math.round(stats.averageRating) ? 'text-yellow-500 fill-yellow-500' : 'text-slate-200'}
              />
            ))}
          </div>
        </div>

        <div className="stat-card bg-white rounded-2xl shadow-md p-6 border border-slate-100 animate-fade-in-up delay-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500 font-medium">Response Rate</p>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${responseRate >= 80 ? 'bg-green-50' : responseRate >= 50 ? 'bg-yellow-50' : 'bg-red-50'}`}>
              <TrendingUp size={18} className={responseRate >= 80 ? 'text-green-600' : responseRate >= 50 ? 'text-yellow-600' : 'text-red-600'} />
            </div>
          </div>
          <p className={`text-4xl font-bold ${responseRate >= 80 ? 'text-green-600' : responseRate >= 50 ? 'text-yellow-600' : 'text-slate-900'}`}>
            {responseRate}%
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
            <div
              className={`h-2 rounded-full transition-all duration-1000 animate-fill-bar ${responseRate >= 80 ? 'bg-green-500' : responseRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${responseRate}%` }}
            />
          </div>
        </div>

        <div className="stat-card bg-white rounded-2xl shadow-md p-6 border border-slate-100 animate-fade-in-up delay-300">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500 font-medium">Positive (4-5 stars)</p>
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <ThumbsUp size={18} className="text-green-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-bold text-green-600">{stats.positiveReviews}</p>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
              {stats.totalReviews > 0
                ? Math.round((stats.positiveReviews / stats.totalReviews) * 100)
                : 0}%
            </span>
          </div>
        </div>

        <div className="stat-card bg-white rounded-2xl shadow-md p-6 border border-slate-100 animate-fade-in-up delay-400">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500 font-medium">Negative (1-2 stars)</p>
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <ThumbsDown size={18} className="text-red-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-bold text-red-600">{stats.negativeReviews}</p>
            <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
              {stats.totalReviews > 0
                ? Math.round((stats.negativeReviews / stats.totalReviews) * 100)
                : 0}%
            </span>
          </div>
        </div>

        <div className={`stat-card bg-white rounded-2xl shadow-md p-6 border animate-fade-in-up delay-500 ${stats.urgentReviews > 0 ? 'border-orange-200 bg-gradient-to-br from-white to-orange-50' : 'border-slate-100'}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500 font-medium">Urgent Reviews</p>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stats.urgentReviews > 0 ? 'bg-orange-100' : 'bg-slate-50'}`}>
              <AlertTriangle size={18} className={stats.urgentReviews > 0 ? 'text-orange-600 animate-pulse-soft' : 'text-slate-400'} />
            </div>
          </div>
          <p className={`text-4xl font-bold ${stats.urgentReviews > 0 ? 'text-orange-600' : 'text-slate-900'}`}>{stats.urgentReviews}</p>
        </div>
      </div>

      {/* Advanced Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Reputation Score */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100 animate-fade-in-up delay-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-indigo-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Reputation Score</h2>
              <p className="text-xs text-slate-500">Composite metric based on ratings, responses, sentiment &amp; urgency</p>
            </div>
          </div>

          {stats.totalReviews === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">No review data yet to calculate a reputation score.</p>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              {/* Score Circle */}
              <div className="relative flex-shrink-0">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="60" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    fill="none"
                    stroke={reputationScore >= 80 ? '#22c55e' : reputationScore >= 60 ? '#3b82f6' : reputationScore >= 40 ? '#eab308' : '#ef4444'}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(reputationScore / 100) * 377} 377`}
                    transform="rotate(-90 70 70)"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${scoreStyle.text}`}>{reputationScore}</span>
                  <span className="text-xs text-slate-500">/ 100</span>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Avg. Rating</span>
                    <span className="font-medium text-slate-900">{Math.round((stats.averageRating / 5) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-yellow-500 animate-fill-bar" style={{ width: `${(stats.averageRating / 5) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Response Rate</span>
                    <span className="font-medium text-slate-900">{responseRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-blue-500 animate-fill-bar" style={{ width: `${responseRate}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Positive Ratio</span>
                    <span className="font-medium text-slate-900">
                      {stats.totalReviews > 0 ? Math.round((stats.positiveReviews / stats.totalReviews) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-green-500 animate-fill-bar" style={{ width: `${stats.totalReviews > 0 ? (stats.positiveReviews / stats.totalReviews) * 100 : 0}%` }} />
                  </div>
                </div>
                <div className="pt-2">
                  <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-lg ${scoreStyle.text} ${scoreStyle.ring} ring-2`}>
                    {scoreStyle.label}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100 animate-fade-in-up delay-400">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <BarChart3 size={18} className="text-amber-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Rating Distribution</h2>
              <p className="text-xs text-slate-500">Breakdown of reviews by star rating</p>
            </div>
          </div>

          {stats.totalReviews === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">No review data yet to show distribution.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((starLevel) => {
                const count = ratingDistribution[starLevel - 1]
                const pct = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0
                const barColor =
                  starLevel >= 4 ? 'bg-green-500' :
                  starLevel === 3 ? 'bg-yellow-500' :
                  'bg-red-500'

                return (
                  <div key={starLevel} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16 flex-shrink-0">
                      <span className="text-sm font-semibold text-slate-700 w-3">{starLevel}</span>
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full ${barColor} animate-fill-bar transition-all`}
                        style={{ width: `${maxDistribution > 0 ? (count / maxDistribution) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="w-20 text-right flex-shrink-0">
                      <span className="text-sm font-semibold text-slate-700">{count}</span>
                      <span className="text-xs text-slate-400 ml-1">({pct}%)</span>
                    </div>
                  </div>
                )
              })}

              {/* Sentiment summary below the bars */}
              <div className="flex items-center gap-4 pt-4 mt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-xs text-slate-600">Positive {stats.totalReviews > 0 ? Math.round((stats.positiveReviews / stats.totalReviews) * 100) : 0}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-xs text-slate-600">Neutral {stats.totalReviews > 0 ? Math.round((stats.neutralReviews / stats.totalReviews) * 100) : 0}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-xs text-slate-600">Negative {stats.totalReviews > 0 ? Math.round((stats.negativeReviews / stats.totalReviews) * 100) : 0}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100 animate-fade-in-up delay-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
            <Activity size={18} className="text-slate-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-slate-700">
          <p>
            You have <strong className="text-slate-900">{stats.totalReviews}</strong> total reviews with an average rating of <strong className="text-slate-900">{stats.averageRating}</strong>.
          </p>
          <p>
            <strong className="text-green-600">{stats.positiveReviews}</strong> positive reviews ({stats.totalReviews > 0 ? Math.round((stats.positiveReviews / stats.totalReviews) * 100) : 0}%)
          </p>
          <p>
            You have responded to <strong className="text-slate-900">{stats.respondedReviews}</strong> reviews ({responseRate}% response rate)
          </p>
          <p>
            <strong className="text-red-600">{stats.negativeReviews}</strong> negative reviews ({stats.totalReviews > 0 ? Math.round((stats.negativeReviews / stats.totalReviews) * 100) : 0}%)
          </p>
          {stats.urgentReviews > 0 && (
            <p className="sm:col-span-2 text-orange-700 font-medium">
              <strong>{stats.urgentReviews}</strong> reviews need urgent attention
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
