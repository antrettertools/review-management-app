'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Star, CheckCircle, Shield, Lock, ArrowRight } from 'lucide-react'

interface UserData {
  id: string
  email: string
  name: string
  subscription_plan: string
}

export default function ReactivatePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/login'); return }
    if (status === 'authenticated' && session?.user) { loadUser() }
  }, [status, session, router])

  const loadUser = async () => {
    if (!session?.user) return
    try {
      const userId = (session.user as any).id || session.user.email
      const { data, error: dbError } = await supabase.from('users').select('*').eq('id', userId).single()
      if (dbError || !data) { setError('Failed to load account information'); setPageLoading(false); return }
      if (data.subscription_plan !== 'cancelled') { router.push('/dashboard'); return }
      setUser(data)
    } catch (err) {
      setError('An error occurred')
    } finally {
      setPageLoading(false)
    }
  }

  const handleCheckout = async () => {
    if (!user) return
    if (!termsAccepted) { setError('You must accept the Terms and Conditions to reactivate your subscription.'); return }
    setLoading(true)
    setError('')
    try {
      await supabase.from('users').update({ terms_accepted_at: new Date().toISOString() }).eq('id', user.id)
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'pro', priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID, userId: user.id, cancelUrl: '/account-cancelled' }),
      })
      if (!response.ok) throw new Error('Failed to create checkout session')
      const data = await response.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  if (status === 'loading' || pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-red-600 text-sm mb-4">{error || 'Unable to load account'}</p>
          <Link href="/auth/login" className="text-blue-700 hover:text-blue-900 font-semibold text-sm">Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-indigo-700 rounded-lg flex items-center justify-center">
              <Star size={16} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">ReviewHub</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back!</h1>
            <p className="text-slate-500">Reactivate your subscription to continue</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden animate-fade-in-up delay-100">
            {/* Plan header */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
              </div>
              <div className="relative">
                <p className="text-blue-300 font-semibold text-sm uppercase tracking-wider mb-2">ReviewHub Pro</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-white">$39.99</span>
                  <span className="text-blue-300 text-lg">/month</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Account info */}
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Account</p>
                <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
                <p className="text-slate-500 text-sm">{user.email}</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {['Unlimited Businesses', 'Unlimited AI Responses', 'Full Analytics', 'Priority Support', 'Google Reviews Integration'].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={13} className="text-emerald-600" />
                    </div>
                    <span className="text-slate-700 font-medium text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 mb-5">
                <input type="checkbox" id="terms" checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                  disabled={loading}
                />
                <label htmlFor="terms" className="text-xs text-slate-500 leading-snug">
                  I have read and agree to the{' '}
                  <Link href="/terms" target="_blank" className="text-blue-700 hover:text-blue-900 font-semibold">Terms and Conditions</Link>
                  , including the AI-Generated Content Disclaimer, Limitation of Liability, and Arbitration Agreement.
                </label>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || !termsAccepted}
                className="group w-full flex items-center justify-center gap-2 bg-gradient-to-b from-blue-800 to-blue-900 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-lg shadow-blue-900/20 text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Reactivate Subscription
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1.5">
                <Shield size={12} />
                Redirected to our secure payment processor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
