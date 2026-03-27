'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Star, TrendingUp, MessageSquare, AlertTriangle, ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react'

const SETUP_STEPS = [
  { key: 'add_business', label: 'Add your first business', desc: 'Go to Settings and add a business', href: '/dashboard/settings' },
  { key: 'connect_google', label: 'Connect Google Business Profile', desc: 'Link your Google account to sync reviews', href: '/dashboard/settings' },
  { key: 'view_reviews', label: 'View your reviews', desc: 'Check the Reviews tab once synced', href: '/dashboard/reviews' },
  { key: 'respond_review', label: 'Respond to a review with AI', desc: 'Click Reply on any review for AI suggestions', href: '/dashboard/reviews' },
  { key: 'check_analytics', label: 'Check your analytics', desc: 'See your reputation trends and insights', href: '/dashboard/analytics' },
]

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
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [setupDismissed, setSetupDismissed] = useState(false)

  useEffect(() => {
    if ((session?.user as any)?.id) {
      fetchStats()
      loadSetupProgress()
    }
  }, [session])

  const loadSetupProgress = async () => {
    const userId = (session?.user as any)?.id
    if (!userId) return

    // Check database first for permanent dismissal
    try {
      const { data } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', userId)
        .single()

      if (data?.onboarding_completed) {
        setSetupDismissed(true)
        return
      }
    } catch {
      // Column may not exist yet, fall through to localStorage
    }

    const saved = localStorage.getItem(`setup_${userId}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      setCompletedSteps(parsed.completed || [])
      if (parsed.dismissed) {
        setSetupDismissed(true)
        // Persist to database so it's permanent
        markOnboardingComplete(userId)
      }
    }
  }

  const markOnboardingComplete = async (userId: string) => {
    try {
      await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', userId)
    } catch {
      // If column doesn't exist, localStorage still handles it
    }
  }

  const saveSetupProgress = (completed: string[], dismissed: boolean) => {
    const userId = (session?.user as any)?.id
    if (!userId) return
    localStorage.setItem(`setup_${userId}`, JSON.stringify({ completed, dismissed }))
  }

  const toggleStep = (key: string) => {
    const updated = completedSteps.includes(key)
      ? completedSteps.filter(s => s !== key)
      : [...completedSteps, key]
    setCompletedSteps(updated)

    // Auto-dismiss permanently when all steps are completed
    if (updated.length === SETUP_STEPS.length) {
      setSetupDismissed(true)
      saveSetupProgress(updated, true)
      const userId = (session?.user as any)?.id
      if (userId) markOnboardingComplete(userId)
    } else {
      saveSetupProgress(updated, false)
    }
  }

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
          const urgentReviews = reviews.filter((r) => r.urgency_level === 'critical').length
          const averageRating = totalReviews > 0
            ? parseFloat((reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews).toFixed(1))
            : 0

          setStats({ totalReviews, averageRating, positiveReviews, negativeReviews, respondedReviews, urgentReviews })
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
        <div className="w-7 h-7 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Overview of your review performance</p>
        </div>
        <Link
          href="/dashboard/reviews"
          className="group flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
        >
          View all reviews
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 border border-slate-200 animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Reviews</p>
            <MessageSquare size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.totalReviews}</p>
          <p className="text-xs text-slate-400 mt-1">Across all platforms</p>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 animate-fade-in-up delay-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Average Rating</p>
            <Star size={16} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-900">{stats.averageRating}</p>
            <span className="text-sm text-slate-300">/ 5.0</span>
          </div>
          <div className="flex items-center gap-0.5 mt-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={12} className={star <= Math.round(stats.averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 animate-fade-in-up delay-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Response Rate</p>
            <TrendingUp size={16} className={responseRate >= 80 ? 'text-emerald-500' : responseRate >= 50 ? 'text-amber-500' : 'text-slate-400'} />
          </div>
          <p className={`text-2xl font-bold ${responseRate >= 80 ? 'text-emerald-600' : responseRate >= 50 ? 'text-amber-600' : 'text-slate-900'}`}>
            {responseRate}%
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full transition-all animate-fill-bar ${responseRate >= 80 ? 'bg-emerald-500' : responseRate >= 50 ? 'bg-amber-500' : 'bg-slate-300'}`}
              style={{ width: `${responseRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 animate-fade-in-up delay-300">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Positive</p>
            <ThumbsUp size={16} className="text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-emerald-600">{stats.positiveReviews}</p>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              {stats.totalReviews > 0 ? Math.round((stats.positiveReviews / stats.totalReviews) * 100) : 0}%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">4-5 star ratings</p>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 animate-fade-in-up delay-400">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Negative</p>
            <ThumbsDown size={16} className="text-red-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-red-600">{stats.negativeReviews}</p>
            <span className="text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
              {stats.totalReviews > 0 ? Math.round((stats.negativeReviews / stats.totalReviews) * 100) : 0}%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">1-2 star ratings</p>
        </div>

        <div className={`bg-white rounded-lg p-5 border animate-fade-in-up delay-500 ${stats.urgentReviews > 0 ? 'border-orange-200' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Urgent</p>
            <AlertTriangle size={16} className={stats.urgentReviews > 0 ? 'text-orange-500 animate-pulse-soft' : 'text-slate-300'} />
          </div>
          <p className={`text-2xl font-bold ${stats.urgentReviews > 0 ? 'text-orange-600' : 'text-slate-900'}`}>{stats.urgentReviews}</p>
          <p className="text-xs text-slate-400 mt-1">{stats.urgentReviews > 0 ? 'Needs attention' : 'No urgent reviews'}</p>
        </div>
      </div>

      {/* Getting Started Checklist */}
      {!setupDismissed && (
        <div className="bg-white rounded-lg p-6 border border-slate-200 animate-fade-in-up delay-600">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Getting Started</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {completedSteps.length} of {SETUP_STEPS.length} steps completed
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-24 bg-slate-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${(completedSteps.length / SETUP_STEPS.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 font-medium">{Math.round((completedSteps.length / SETUP_STEPS.length) * 100)}%</span>
            </div>
          </div>
          <div className="space-y-1">
            {SETUP_STEPS.map((step) => {
              const done = completedSteps.includes(step.key)
              return (
                <div key={step.key} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleStep(step.key)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-800 focus:ring-blue-800 cursor-pointer"
                  />
                  <Link href={step.href} className="flex-1 min-w-0">
                    <p className={`text-sm font-medium transition-colors ${done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
