'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

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

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'pro',
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          userId: signupData.userId,
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

  if (!signupData) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-600">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            ReviewHub
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Complete Your Purchase</h1>
          <p className="text-xl text-slate-600">One more step to get started</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">ReviewHub Pro</h2>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900">$39.99</span>
              <span className="text-slate-600">/month</span>
            </div>
          </div>

          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Account Details:</p>
            <p className="text-sm font-medium text-slate-900">{signupData.name}</p>
            <p className="text-sm text-slate-600">{signupData.email}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">What You Get:</h3>
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

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>

          <p className="text-center text-slate-600 mt-4 text-xs">
            You'll be redirected to our secure payment processor
          </p>
        </div>
      </div>
    </div>
  )
}