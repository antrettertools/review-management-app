'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Star, TrendingUp, MessageSquare, AlertTriangle, ThumbsUp, ThumbsDown, ArrowRight, Sparkles } from 'lucide-react'

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
          <p className="text-slate-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Overview of your review performance</p>
        </div>
        <Link
          href="/dashboard/reviews"
          className="group flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
        >
          View all reviews
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Total Reviews */}
        <div className="stat-card bg-white rounded-2xl p-6 border border-slate-200/60 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Reviews</p>
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <MessageSquare size={16} className="text-blue-700" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.totalReviews}</p>
          <p className="text-xs text-slate-400 mt-1.5">Across all platforms</p>
        </div>

        {/* Average Rating */}
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
              <Star
                key={star}
                size={13}
                className={star <= Math.round(stats.averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
              />
            ))}
          </div>
        </div>

        {/* Response Rate */}
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

        {/* Positive Reviews */}
        <div className="stat-card bg-white rounded-2xl p-6 border border-slate-200/60 animate-fade-in-up delay-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Positive Reviews</p>
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
          <p className="text-xs text-slate-400 mt-1.5">4-5 star ratings</p>
        </div>

        {/* Negative Reviews */}
        <div className="stat-card bg-white rounded-2xl p-6 border border-slate-200/60 animate-fade-in-up delay-400">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Negative Reviews</p>
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
          <p className="text-xs text-slate-400 mt-1.5">1-2 star ratings</p>
        </div>

        {/* Urgent Reviews */}
        <div className={`stat-card bg-white rounded-2xl p-6 border animate-fade-in-up delay-500 ${stats.urgentReviews > 0 ? 'border-orange-200 bg-gradient-to-br from-white to-orange-50/50' : 'border-slate-200/60'}`}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Urgent Reviews</p>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stats.urgentReviews > 0 ? 'bg-orange-100' : 'bg-slate-50'}`}>
              <AlertTriangle size={16} className={stats.urgentReviews > 0 ? 'text-orange-600 animate-pulse-soft' : 'text-slate-400'} />
            </div>
          </div>
          <p className={`text-3xl font-extrabold tracking-tight ${stats.urgentReviews > 0 ? 'text-orange-600' : 'text-slate-900'}`}>{stats.urgentReviews}</p>
          <p className="text-xs text-slate-400 mt-1.5">{stats.urgentReviews > 0 ? 'Needs immediate attention' : 'No urgent reviews'}</p>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200/60 animate-fade-in-up delay-600">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
            <Sparkles size={16} className="text-blue-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Getting Started</h2>
            <p className="text-xs text-slate-400">Follow these steps to set up your account</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { href: '/dashboard/settings', num: '1', title: 'Connect your Google Business account', desc: 'Go to Settings to link your platforms' },
            { href: '/dashboard/reviews', num: '2', title: 'View all customer reviews', desc: 'See reviews from Google and other platforms' },
            { href: '/dashboard/reviews', num: '3', title: 'Respond with AI-powered suggestions', desc: 'Click Reply on any review for AI help' },
            { href: '/dashboard/analytics', num: '4', title: 'Track your analytics', desc: 'Monitor improvement over time' },
          ].map((step) => {
            return (
              <Link key={step.num} href={step.href} className="group flex items-start gap-3.5 p-4 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-800 to-blue-900 text-white rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm mt-0.5">
                  {step.num}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-900 transition-colors">{step.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
