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

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]
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
    if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-500', label: 'Excellent', labelBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    if (score >= 60) return { text: 'text-blue-600', bg: 'bg-blue-500', label: 'Good', labelBg: 'bg-blue-50 text-blue-700 border-blue-200' }
    if (score >= 40) return { text: 'text-amber-600', bg: 'bg-amber-500', label: 'Fair', labelBg: 'bg-amber-50 text-amber-700 border-amber-200' }
    return { text: 'text-red-600', bg: 'bg-red-500', label: 'Needs Work', labelBg: 'bg-red-50 text-red-700 border-red-200' }
  }

  const scoreStyle = getScoreColor(reputationScore)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Insights into your review performance</p>
      </div>

      {/* Core Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="stat-card bg-white rounded-2xl p-6 border border-slate-200/60 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Reviews</p>
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <MessageSquare size={16} className="text-blue-700" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.totalReviews}</p>
        </div>

        <div className="stat-card bg-white rounded-2xl p-6 border border-slate-200/60 animate-fade-in-up delay-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Rating</p>
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
              <Star size={16} className="text-amber-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.averageRating}</p>
            <span className="text-sm text-slate-300 font-medium">/ 5.0</span>
          </div>
          <div className="flex items-center gap-0.5 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={13} className={star <= Math.round(stats.averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
            ))}
          </div>
        </div>

        <div className="stat-card bg-white rounded-2xl p-6 border border-slate-200/60 animate-fade-in-up delay-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Response Rate</p>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${responseRate >= 80 ? 'bg-emerald-50' : responseRate >= 50 ? 'bg-amber-50' : 'bg-red-50'}`}>
              <TrendingUp size={16} className={responseRate >= 80 ? 'text-emerald-600' : responseRate >= 50 ? 'text-amber-600' : 'text-red-600'} />
            </div>
          </div>
          <p className={`text-3xl font-extrabold tracking-tight ${responseRate >= 80 ? 'text-emerald-600' : responseRate >= 50 ? 'text-amber-600' : 'text-slate-900'}`}>
            {responseRate}%
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div
              className={`h-1.5 rounded-full transition-all duration-1000 animate-fill-bar ${responseRate >= 80 ? 'bg-emerald-500' : responseRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${responseRate}%` }}
            />
          </div>
        </div>

        <div className="stat-card bg-white rounded-2xl p-6 border border-slate-200/60 animate-fade-in-up delay-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Positive (4-5)</p>
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
              <ThumbsUp size={16} className="text-emerald-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">{stats.positiveReviews}</p>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              {stats.totalReviews > 0 ? Math.round((stats.positiveReviews / stats.totalReviews) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className="stat-card bg-white rounded-2xl p-6 border border-slate-200/60 animate-fade-in-up delay-400">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Negative (1-2)</p>
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
              <ThumbsDown size={16} className="text-red-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <p className="text-3xl font-extrabold text-red-600 tracking-tight">{stats.negativeReviews}</p>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
              {stats.totalReviews > 0 ? Math.round((stats.negativeReviews / stats.totalReviews) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className={`stat-card bg-white rounded-2xl p-6 border animate-fade-in-up delay-500 ${stats.urgentReviews > 0 ? 'border-orange-200 bg-gradient-to-br from-white to-orange-50/50' : 'border-slate-200/60'}`}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Urgent Reviews</p>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stats.urgentReviews > 0 ? 'bg-orange-100' : 'bg-slate-50'}`}>
              <AlertTriangle size={16} className={stats.urgentReviews > 0 ? 'text-orange-600 animate-pulse-soft' : 'text-slate-400'} />
            </div>
          </div>
          <p className={`text-3xl font-extrabold tracking-tight ${stats.urgentReviews > 0 ? 'text-orange-600' : 'text-slate-900'}`}>{stats.urgentReviews}</p>
        </div>
      </div>

      {/* Advanced Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Reputation Score */}
        <div className="bg-white rounded-2xl p-7 border border-slate-200/60 animate-fade-in-up delay-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center">
              <Shield size={16} className="text-indigo-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Reputation Score</h2>
              <p className="text-[11px] text-slate-400">Based on ratings, responses, sentiment & urgency</p>
            </div>
          </div>

          {stats.totalReviews === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">No review data yet to calculate a reputation score.</p>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              {/* Score Circle */}
              <div className="relative flex-shrink-0">
                <svg width="130" height="130" viewBox="0 0 130 130">
                  <circle cx="65" cy="65" r="56" fill="none" stroke="#f1f5f9" strokeWidth="9" />
                  <circle
                    cx="65"
                    cy="65"
                    r="56"
                    fill="none"
                    stroke={reputationScore >= 80 ? '#10b981' : reputationScore >= 60 ? '#3b82f6' : reputationScore >= 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={`${(reputationScore / 100) * 352} 352`}
                    transform="rotate(-90 65 65)"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-extrabold ${scoreStyle.text}`}>{reputationScore}</span>
                  <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="flex-1 space-y-3">
                {[
                  { label: 'Avg. Rating', value: Math.round((stats.averageRating / 5) * 100), color: 'bg-amber-500' },
                  { label: 'Response Rate', value: responseRate, color: 'bg-blue-500' },
                  { label: 'Positive Ratio', value: stats.totalReviews > 0 ? Math.round((stats.positiveReviews / stats.totalReviews) * 100) : 0, color: 'bg-emerald-500' },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 font-medium">{metric.label}</span>
                      <span className="font-bold text-slate-700">{metric.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${metric.color} animate-fill-bar`} style={{ width: `${metric.value}%` }} />
                    </div>
                  </div>
                ))}
                <div className="pt-1">
                  <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg border ${scoreStyle.labelBg}`}>
                    {scoreStyle.label}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-2xl p-7 border border-slate-200/60 animate-fade-in-up delay-400">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl flex items-center justify-center">
              <BarChart3 size={16} className="text-amber-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Rating Distribution</h2>
              <p className="text-[11px] text-slate-400">Breakdown of reviews by star rating</p>
            </div>
          </div>

          {stats.totalReviews === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">No review data yet to show distribution.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map((starLevel) => {
                const count = ratingDistribution[starLevel - 1]
                const pct = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0
                const barColor =
                  starLevel >= 4 ? 'bg-emerald-500' :
                  starLevel === 3 ? 'bg-amber-500' :
                  'bg-red-500'

                return (
                  <div key={starLevel} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-14 flex-shrink-0">
                      <span className="text-xs font-bold text-slate-600 w-3">{starLevel}</span>
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full ${barColor} animate-fill-bar transition-all`}
                        style={{ width: `${maxDistribution > 0 ? (count / maxDistribution) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="w-20 text-right flex-shrink-0">
                      <span className="text-xs font-bold text-slate-700">{count}</span>
                      <span className="text-[10px] text-slate-400 ml-1">({pct}%)</span>
                    </div>
                  </div>
                )
              })}

              {/* Sentiment summary */}
              <div className="flex items-center gap-5 pt-3 mt-3 border-t border-slate-100">
                {[
                  { color: 'bg-emerald-500', label: 'Positive', pct: stats.totalReviews > 0 ? Math.round((stats.positiveReviews / stats.totalReviews) * 100) : 0 },
                  { color: 'bg-amber-500', label: 'Neutral', pct: stats.totalReviews > 0 ? Math.round((stats.neutralReviews / stats.totalReviews) * 100) : 0 },
                  { color: 'bg-red-500', label: 'Negative', pct: stats.totalReviews > 0 ? Math.round((stats.negativeReviews / stats.totalReviews) * 100) : 0 },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 ${s.color} rounded-full`} />
                    <span className="text-[11px] text-slate-500 font-medium">{s.label} {s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-7 border border-slate-200/60 animate-fade-in-up delay-500">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
            <Activity size={16} className="text-slate-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Summary</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5 text-sm text-slate-600">
          <p>
            You have <strong className="text-slate-900">{stats.totalReviews}</strong> total reviews with an average rating of <strong className="text-slate-900">{stats.averageRating}</strong>.
          </p>
          <p>
            <strong className="text-emerald-600">{stats.positiveReviews}</strong> positive reviews ({stats.totalReviews > 0 ? Math.round((stats.positiveReviews / stats.totalReviews) * 100) : 0}%)
          </p>
          <p>
            You have responded to <strong className="text-slate-900">{stats.respondedReviews}</strong> reviews ({responseRate}% response rate)
          </p>
          <p>
            <strong className="text-red-600">{stats.negativeReviews}</strong> negative reviews ({stats.totalReviews > 0 ? Math.round((stats.negativeReviews / stats.totalReviews) * 100) : 0}%)
          </p>
          {stats.urgentReviews > 0 && (
            <p className="sm:col-span-2 text-orange-700 font-semibold">
              <strong>{stats.urgentReviews}</strong> reviews need urgent attention
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
