'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star, CheckCircle, Shield, Lock, ArrowRight } from 'lucide-react'

interface SignupData {
  userId: string
  email: string
  name: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [signupData, setSignupData] = useState<SignupData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const data = sessionStorage.getItem('signupData')
    if (data) {
      setSignupData(JSON.parse(data))
    } else {
      router.push('/auth/signup')
    }
  }, [router])

  const handleCheckout = async () => {
    if (!signupData) return

    if (!process.env.NEXT_PUBLIC_STRIPE_PRICE_ID) {
      setError('Payment configuration error. Please contact support.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'pro',
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          userId: signupData.userId,
          isNewSignup: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
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

  if (!signupData) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-7 h-7 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
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
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Start Your Free Trial</h1>
            <p className="text-sm text-slate-500">7 days free, then $39.99/month</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="bg-blue-800 p-6 text-center">
              <p className="text-blue-200 font-medium text-sm uppercase tracking-wider mb-1">ReviewInzight Pro</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold text-white">$39.99</span>
                <span className="text-blue-200">/month</span>
              </div>
              <p className="text-blue-200/80 text-sm mt-1">after 7-day free trial</p>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
                  {error}
                </div>
              )}

              <div className="mb-5 p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Account</p>
                <p className="font-medium text-slate-900 text-sm">{signupData.name}</p>
                <p className="text-slate-500 text-sm">{signupData.email}</p>
              </div>

              <div className="space-y-2.5 mb-6">
                {['Unlimited Businesses', 'Unlimited AI Responses', 'Full Analytics', 'Priority Support', 'Google Reviews Integration'].map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3.5 mb-5">
                <p className="text-sm text-blue-800 font-medium">Your card will not be charged today.</p>
                <p className="text-xs text-blue-600 mt-0.5">Your 7-day free trial starts after entering payment details. Cancel anytime during the trial.</p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
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
                    Start Free Trial
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
