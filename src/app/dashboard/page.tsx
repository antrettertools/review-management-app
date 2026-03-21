'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Star, TrendingUp, MessageSquare, AlertTriangle, ThumbsUp, ThumbsDown, ArrowRight, Zap } from 'lucide-react'

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

  const responseRate = stats.totalReviews > 0
    ? Math.round((stats.respondedReviews / stats.totalReviews) * 100)
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <Link
          href="/dashboard/reviews"
          className="group flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
        >
          View all reviews
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <div className="stat-card bg-white rounded-2xl shadow-md p-6 border border-slate-100 animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500 font-medium">Total Reviews</p>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <MessageSquare size={18} className="text-blue-700" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900">{stats.totalReviews}</p>
          <p className="text-xs text-slate-400 mt-2">Across all platforms</p>
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
            <p className="text-sm text-slate-500 font-medium">Positive Reviews</p>
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <ThumbsUp size={18} className="text-green-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-bold text-green-600">{stats.positiveReviews}</p>
            <span className="text-sm font-medium text-green-500 bg-green-50 px-2 py-0.5 rounded-md">
              {stats.totalReviews > 0 ? Math.round((stats.positiveReviews / stats.totalReviews) * 100) : 0}%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">4-5 star ratings</p>
        </div>

        <div className="stat-card bg-white rounded-2xl shadow-md p-6 border border-slate-100 animate-fade-in-up delay-400">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500 font-medium">Negative Reviews</p>
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <ThumbsDown size={18} className="text-red-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-bold text-red-600">{stats.negativeReviews}</p>
            <span className="text-sm font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
              {stats.totalReviews > 0 ? Math.round((stats.negativeReviews / stats.totalReviews) * 100) : 0}%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">1-2 star ratings</p>
        </div>

        <div className={`stat-card bg-white rounded-2xl shadow-md p-6 border animate-fade-in-up delay-500 ${stats.urgentReviews > 0 ? 'border-orange-200 bg-gradient-to-br from-white to-orange-50' : 'border-slate-100'}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500 font-medium">Urgent Reviews</p>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stats.urgentReviews > 0 ? 'bg-orange-100' : 'bg-slate-50'}`}>
              <AlertTriangle size={18} className={stats.urgentReviews > 0 ? 'text-orange-600 animate-pulse-soft' : 'text-slate-400'} />
            </div>
          </div>
          <p className={`text-4xl font-bold ${stats.urgentReviews > 0 ? 'text-orange-600' : 'text-slate-900'}`}>{stats.urgentReviews}</p>
          <p className="text-xs text-slate-400 mt-2">{stats.urgentReviews > 0 ? 'Needs immediate attention' : 'No urgent reviews'}</p>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100 animate-fade-in-up delay-600">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-blue-700" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Getting Started</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/dashboard/settings" className="group flex items-start gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <span className="text-green-600 font-bold mt-0.5 text-lg">1</span>
            <div>
              <p className="font-medium text-slate-900 group-hover:text-blue-900 transition-colors">Connect your Google Business account</p>
              <p className="text-sm text-slate-500 mt-0.5">Go to Settings to link your platforms</p>
            </div>
          </Link>
          <Link href="/dashboard/reviews" className="group flex items-start gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <span className="text-green-600 font-bold mt-0.5 text-lg">2</span>
            <div>
              <p className="font-medium text-slate-900 group-hover:text-blue-900 transition-colors">View all customer reviews</p>
              <p className="text-sm text-slate-500 mt-0.5">See reviews from Google and other platforms</p>
            </div>
          </Link>
          <Link href="/dashboard/reviews" className="group flex items-start gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <span className="text-green-600 font-bold mt-0.5 text-lg">3</span>
            <div>
              <p className="font-medium text-slate-900 group-hover:text-blue-900 transition-colors">Respond with AI-powered suggestions</p>
              <p className="text-sm text-slate-500 mt-0.5">Click Reply on any review for AI help</p>
            </div>
          </Link>
          <Link href="/dashboard/analytics" className="group flex items-start gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <span className="text-green-600 font-bold mt-0.5 text-lg">4</span>
            <div>
              <p className="font-medium text-slate-900 group-hover:text-blue-900 transition-colors">Track your analytics</p>
              <p className="text-sm text-slate-500 mt-0.5">Monitor improvement over time</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
