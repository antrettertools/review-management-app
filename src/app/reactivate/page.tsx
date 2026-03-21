'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

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
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated' && session?.user) {
      loadUser()
    }
  }, [status, session, router])

  const loadUser = async () => {
    if (!session?.user) return

    try {
      const userId = (session.user as any).id || session.user.email

      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (dbError || !data) {
        setError('Failed to load account information')
        setPageLoading(false)
        return
      }

      // If subscription is not cancelled, redirect to dashboard
      if (data.subscription_plan !== 'cancelled') {
        router.push('/dashboard')
        return
      }

      setUser(data)
    } catch (err) {
      console.error('Error loading user:', err)
      setError('An error occurred')
    } finally {
      setPageLoading(false)
    }
  }

  const handleCheckout = async () => {
    if (!user) return

    if (!termsAccepted) {
      setError('You must accept the Terms and Conditions to reactivate your subscription.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Record terms acceptance for reactivation
      await supabase
        .from('users')
        .update({ terms_accepted_at: new Date().toISOString() })
        .eq('id', user.id)

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'pro',
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          userId: user.id,
          cancelUrl: '/account-cancelled',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  if (status === 'loading' || pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-600">
        Loading...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Unable to load account'}</p>
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            ReviewHub
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome Back!</h1>
          <p className="text-xl text-slate-600">Reactivate your subscription to continue managing your reviews</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <h2 className="text-2xl font-bold text-slate-900 mb-4">ReviewHub Pro</h2>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold text-slate-900">$39.99</span>
            <span className="text-slate-600">/month</span>
          </div>

          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Account Details:</p>
            <p className="font-medium text-slate-900">{user.name}</p>
            <p className="text-slate-600">{user.email}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">What You'll Get:</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-slate-700">
                <span className="text-green-600 font-bold">✓</span> Unlimited Businesses
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <span className="text-green-600 font-bold">✓</span> Unlimited AI Responses
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <span className="text-green-600 font-bold">✓</span> Full Analytics
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <span className="text-green-600 font-bold">✓</span> Priority Support
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <span className="text-green-600 font-bold">✓</span> Google Reviews Integration
              </li>
            </ul>
          </div>

          <div className="flex items-start gap-3 mb-4">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
              disabled={loading}
            />
            <label htmlFor="terms" className="text-sm text-slate-600">
              I have read and agree to the{' '}
              <Link href="/terms" target="_blank" className="text-blue-600 hover:underline font-medium">
                Terms and Conditions
              </Link>
              , including the AI-Generated Content Disclaimer, Limitation of Liability, and Arbitration Agreement.
            </label>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || !termsAccepted}
            className="w-full py-3 px-4 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Processing...' : 'Reactivate Subscription'}
          </button>

          <p className="text-center text-slate-600 mt-4 text-xs">
            You'll be redirected to our secure payment processor
          </p>
        </div>
      </div>
    </div>
  )
}
