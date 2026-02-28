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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            ReviewHub
          </Link>
          <div className="flex gap-3">
            <Link
              href="/auth/login"
              className="px-6 py-2.5 text-slate-900 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2.5 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-600">Choose the perfect plan for your business. Upgrade or downgrade anytime.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-slate-100 overflow-hidden flex flex-col relative pt-6 ${
                plan.recommended ? 'ring-2 ring-blue-900 md:scale-105' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-blue-900 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">
                    Recommended
                  </span>
                </div>
              )}

              <div className="px-8 pb-8 flex-1 flex flex-col">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">{plan.name}</h2>
                  <p className="text-slate-600 mt-2">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <span className="text-5xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-slate-600 ml-2 text-lg">/month</span>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3.5 px-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
                    plan.recommended
                      ? 'bg-blue-900 text-white hover:bg-blue-800'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {session ? 'Get Started' : 'Sign Up Now'}
                </button>

                <div className="border-t border-slate-200 mt-8 pt-8">
                  <p className="text-sm font-semibold text-slate-900 mb-4">What's included:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-slate-700">
                        <span className="text-green-600 font-bold mr-3 flex-shrink-0 mt-0.5">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Down Indicator */}
        <div className="text-center mb-12">
          <p className="text-slate-600 font-medium">Scroll down to see more</p>
          <div className="flex justify-center mt-3">
            <svg className="w-6 h-6 text-slate-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white border-y border-slate-200 py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Can I change my plan later?</h3>
              <p className="text-slate-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Is there a free trial?</h3>
              <p className="text-slate-600">We offer a 14-day free trial for new users with no credit card required.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-slate-600">We accept all major credit cards through our secure Stripe payment system.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-slate-600">Absolutely. You can cancel your subscription at any time with no questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to simplify review management?</h2>
          <p className="text-lg text-blue-100 mb-8">Join thousands of businesses managing reviews efficiently with ReviewHub</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleSelectPlan('starter')}
              className="px-8 py-3.5 bg-white text-blue-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors shadow-lg"
            >
              Start Free Trial
            </button>
            <Link
              href="/"
              className="px-8 py-3.5 border-2 border-white text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-600 text-sm">
          <p>&copy; 2026 ReviewHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}