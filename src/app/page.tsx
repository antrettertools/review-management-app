'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="text-center py-20">Loading...</div>
  }

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-slate-900">ReviewHub</div>
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Manage All Your<br />
            <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
              Customer Reviews
            </span>
            <br />
            in One Place
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Stop juggling between Google, Yelp, and other platforms. See all reviews, respond faster with AI-powered suggestions, and track what matters.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/auth/signup"
              className="px-8 py-3.5 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors text-center"
            >
              Start Free Trial
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3.5 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors text-center"
            >
              See Pricing
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Unified Dashboard</h3>
              <p className="text-slate-600">See all reviews from Google, Yelp, and more in one place. Never miss important feedback.</p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">AI-Powered Responses</h3>
              <p className="text-slate-600">Get intelligent response suggestions tailored to each review. Save hours every week.</p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Smart Analytics</h3>
              <p className="text-slate-600">Track ratings, sentiment, and response rates. Make data-driven decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-600 mb-8">Trusted by growing businesses</p>
          <div className="flex justify-center gap-12 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">500+</div>
              <p className="text-sm text-slate-600">Reviews Managed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">4.9</div>
              <p className="text-sm text-slate-600">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">98%</div>
              <p className="text-sm text-slate-600">Response Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Ready to simplify review management?</h2>
        <p className="text-xl text-slate-600 mb-8">Join thousands of businesses already using ReviewHub</p>
        <Link
          href="/auth/signup"
          className="inline-block px-8 py-3.5 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
        >
          Get Started Free
        </Link>
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