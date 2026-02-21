'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PRICING_PLANS } from '@/lib/stripe'

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSelectPlan = (planId: string) => {
    if (!session) {
      router.push('/auth/signup')
      return
    }

    router.push(`/checkout?plan=${planId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="pt-20 pb-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your business. Upgrade or downgrade anytime.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 ${
                plan.recommended
                  ? 'ring-2 ring-blue-900 md:col-span-1 md:scale-105'
                  : ''
              }`}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="bg-blue-900 text-white text-center py-2 text-sm font-semibold">
                  ⭐ RECOMMENDED
                </div>
              )}

              {/* Card Content */}
              <div className="bg-white p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h2>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition mb-8 ${
                    plan.recommended
                      ? 'bg-blue-900 text-white hover:bg-blue-800'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {session ? 'Get Started' : 'Sign Up Now'}
                </button>

                {/* Features */}
                <div className="border-t pt-8">
                  <p className="text-sm font-semibold text-gray-900 mb-4">
                    What's included:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="text-green-500 mr-3 text-lg">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                We're currently offering 14 days free for new users. No credit card required.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards through Stripe. Your payment information is secure and encrypted.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Absolutely! You can cancel your subscription at any time with no questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of businesses managing reviews efficiently.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleSelectPlan('starter')}
              className="px-8 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:bg-gray-100"
            >
              Start Free Trial
            </button>
            <Link
              href="/"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-blue-800"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}