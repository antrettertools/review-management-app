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
        body: JSON.stringify({
          planId: 'pro',
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          userId: user.id,
          cancelUrl: '/account-cancelled',
          isNewSignup: false,
        }),
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
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-7 h-7 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-red-600 text-sm mb-3">{error || 'Unable to load account'}</p>
          <Link href="/auth/login" className="text-blue-700 hover:text-blue-800 font-medium text-sm">Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-7 h-7 bg-blue-800 rounded-lg flex items-center justify-center">
              <Star size={14} className="text-white fill-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">ReviewInzight</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome Back!</h1>
            <p className="text-sm text-slate-500">Reactivate your subscription to continue</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="bg-blue-800 p-6 text-center">
              <p className="text-blue-200 font-medium text-sm uppercase tracking-wider mb-1">ReviewInzight Pro</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold text-white">$39.99</span>
                <span className="text-blue-200">/month</span>
              </div>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
                  {error}
                </div>
              )}

              <div className="mb-5 p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Account</p>
                <p className="font-medium text-slate-900 text-sm">{user.name}</p>
                <p className="text-slate-500 text-sm">{user.email}</p>
              </div>

              <div className="space-y-2.5 mb-5">
                {['Unlimited Businesses', 'Unlimited AI Responses', 'Full Analytics', 'Priority Support', 'Google Reviews Integration'].map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2.5 mb-4">
                <input type="checkbox" id="terms" checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-800 focus:ring-blue-800"
                  disabled={loading} />
                <label htmlFor="terms" className="text-xs text-slate-500 leading-snug">
                  I agree to the{' '}
                  <Link href="/terms" target="_blank" className="text-blue-700 hover:text-blue-800 font-medium">Terms and Conditions</Link>
                </label>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || !termsAccepted}
                className="group w-full flex items-center justify-center gap-2 bg-blue-800 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    Reactivate Subscription
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
                <Shield size={11} />
                Secure payment via Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
