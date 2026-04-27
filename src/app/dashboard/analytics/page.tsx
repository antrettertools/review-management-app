'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { startOfWeek, format, eachWeekOfInterval, subDays } from 'date-fns'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp } from 'lucide-react'

interface Review {
  id: string
  rating: number
  created_at: string
  platform: string
  is_responded: boolean
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [businesses, setBusinesses] = useState<any[]>([])
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const userId = (session?.user as any)?.id

  // Fetch businesses
  useEffect(() => {
    if (!userId) return
    ;(async () => {
      const { data } = await supabase.from('businesses').select('id, name').eq('user_id', userId)
      if (data && data.length > 0) {
        setBusinesses(data)
        setSelectedBusinessId(data[0].id)
      }
    })()
  }, [userId])

  // Fetch reviews for selected business
  useEffect(() => {
    if (!selectedBusinessId) return
    setLoading(true)
    ;(async () => {
      const { data } = await supabase
        .from('reviews')
        .select('id, rating, created_at, platform, is_responded')
        .eq('business_id', selectedBusinessId)
        .order('created_at', { ascending: false })
      setReviews(data || [])
      setLoading(false)
    })()
  }, [selectedBusinessId])

  const cutoffDate = useMemo(() => {
    const now = new Date()
    if (timeRange === '30d') return subDays(now, 30)
    if (timeRange === '90d') return subDays(now, 90)
    return subDays(now, 365)
  }, [timeRange])

  const filteredReviews = useMemo(
    () => reviews.filter(r => new Date(r.created_at) >= cutoffDate),
    [reviews, cutoffDate]
  )

  const weeklyData = useMemo(() => {
    const buckets: Record<string, { totalRating: number; count: number }> = {}
    const weeks = eachWeekOfInterval(
      { start: cutoffDate, end: new Date() },
      { weekStartsOn: 1 }
    )
    weeks.forEach(w => {
      const key = format(w, 'MMM d')
      buckets[key] = { totalRating: 0, count: 0 }
    })
    filteredReviews.forEach(r => {
      const weekStart = startOfWeek(new Date(r.created_at), { weekStartsOn: 1 })
      const key = format(weekStart, 'MMM d')
      if (buckets[key]) {
        buckets[key].totalRating += r.rating
        buckets[key].count += 1
      }
    })
    return Object.entries(buckets).map(([week, { totalRating, count }]) => ({
      week,
      avgRating: count > 0 ? parseFloat((totalRating / count).toFixed(2)) : null,
      volume: count,
    }))
  }, [filteredReviews, cutoffDate])

  const platformData = useMemo(() => {
    const counts: Record<string, number> = {}
    filteredReviews.forEach(r => {
      const p = r.platform || 'unknown'
      counts[p] = (counts[p] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [filteredReviews])

  const sentimentData = useMemo(() => {
    let positive = 0, neutral = 0, negative = 0
    filteredReviews.forEach(r => {
      if (r.rating >= 4) positive++
      else if (r.rating === 3) neutral++
      else negative++
    })
    const total = filteredReviews.length || 1
    return [
      { name: 'Positive', value: positive, pct: Math.round(positive / total * 100), color: '#10b981' },
      { name: 'Neutral', value: neutral, pct: Math.round(neutral / total * 100), color: '#f59e0b' },
      { name: 'Negative', value: negative, pct: Math.round(negative / total * 100), color: '#ef4444' },
    ]
  }, [filteredReviews])

  const summaryStats = useMemo(() => {
    const total = filteredReviews.length
    const avgRating = total > 0 ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(2) : 0
    const responded = filteredReviews.filter(r => r.is_responded).length
    const responseRate = total > 0 ? Math.round(responded / total * 100) : 0
    const positive = filteredReviews.filter(r => r.rating >= 4).length
    return { total, avgRating, responseRate, positive }
  }, [filteredReviews])

  const PLATFORM_COLORS: Record<string, string> = {
    google: '#4285F4',
    facebook: '#1877F2',
    tripadvisor: '#34E0A1',
    trustpilot: '#00B67A',
    yelp: '#FF1A1A',
    unknown: '#94a3b8',
  }

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-7 h-7 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600 mb-4">No businesses connected yet.</p>
          <a href="/dashboard/settings" className="text-blue-800 hover:text-blue-700 font-medium">Go to Settings</a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={24} className="text-blue-800" />
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
      </div>

      {/* Controls */}
      <div className="flex gap-4 items-center">
        {businesses.length > 1 && (
          <select
            value={selectedBusinessId}
            onChange={e => setSelectedBusinessId(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900"
          >
            {businesses.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        )}
        <div className="flex gap-2">
          {(['30d', '90d', '1y'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-800 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Last {range === '30d' ? '30d' : range === '90d' ? '90d' : '1y'}
            </button>
          ))}
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600">No reviews in this time period</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Total Reviews</p>
              <p className="text-2xl font-bold text-slate-900">{summaryStats.total}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Avg Rating</p>
              <p className="text-2xl font-bold text-slate-900">{summaryStats.avgRating}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Response Rate</p>
              <p className="text-2xl font-bold text-slate-900">{summaryStats.responseRate}%</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Positive</p>
              <p className="text-2xl font-bold text-emerald-600">{summaryStats.positive}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Trend */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Rating Trend</h3>
              {mounted && (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis domain={[1, 5]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="avgRating"
                      stroke="#1e40af"
                      fill="#bfdbfe"
                      connectNulls={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Review Volume */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Review Volume</h3>
              {mounted && (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="volume" fill="#1e40af" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Platform Breakdown */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Platform Distribution</h3>
              {mounted && platformData.length > 0 && (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} (${value})`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.name] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Sentiment Split */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Sentiment Split</h3>
              <div className="space-y-4">
                {sentimentData.map(item => (
                  <div key={item.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      <span className="text-sm font-semibold text-slate-900">{item.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{item.value} reviews</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
