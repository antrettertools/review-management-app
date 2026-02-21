'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState, Suspense } from 'react'
import { PRICING_PLANS } from '@/lib/stripe'
import Link from 'next/link'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const planId = searchParams.get('plan')
  const plan = PRICING_PLANS.find((p) => p.id === planId)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signup')
    }
  }, [session, router])

  const handleCheckout = async () => {
    if (!plan) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          priceId: plan.priceId,
          userId: (session?.user as any)?.id,
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

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan not found</h1>
          <Link href="/pricing" className="text-blue-600 hover:underline">
            Back to pricing
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/pricing" className="text-blue-600 hover:underline mb-8 block">
          ← Back to pricing
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Confirm your order
          </h1>
          <p className="text-gray-600 mb-8">
            You're about to subscribe to the {plan.name} plan
          </p>

          {/* Order Summary */}
          <div className="border-t border-b py-8 mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {plan.name} Plan
                </h2>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                </p>
                <p className="text-gray-600 text-sm">/month, billed monthly</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                What's included:
              </h3>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Billing Details</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-700">
                <span className="font-medium">Email:</span>{' '}
                {session?.user?.email}
              </p>
              <p className="text-gray-700 mt-2">
                <span className="font-medium">Name:</span> {session?.user?.name}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <Link
              href="/pricing"
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 text-center"
            >
              Cancel
            </Link>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By clicking "Continue to Payment", you agree to our Terms of Service
            and Privacy Policy. Your subscription will auto-renew each month.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}