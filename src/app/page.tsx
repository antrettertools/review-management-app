'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { BarChart3, Zap, Shield, Star, ArrowRight, CheckCircle, MessageSquare, TrendingUp } from 'lucide-react'

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
      <section className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full opacity-30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-800 mb-8">
              <Zap size={14} className="text-blue-600" />
              AI-Powered Review Management
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
              Manage All Your<br />
              <span className="bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Customer Reviews
              </span>
              <br />
              in One Place
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
              Stop juggling between Google, Yelp, and other platforms. See all reviews, respond faster with AI-powered suggestions, and track what matters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all hover:shadow-lg hover:shadow-blue-900/20 text-center"
              >
                Get Started - $39.99/month
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 border border-slate-300 text-slate-900 font-semibold rounded-xl hover:bg-white hover:border-slate-400 hover:shadow-md transition-all text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to manage reviews</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Powerful tools that help you stay on top of your online reputation.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-white rounded-2xl shadow-md p-8 border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 animate-fade-in-up delay-100">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
              <BarChart3 size={24} className="text-blue-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Unified Dashboard</h3>
            <p className="text-slate-600 leading-relaxed">See all reviews from Google, Yelp, and more in one place. Never miss important feedback.</p>
          </div>

          <div className="group bg-white rounded-2xl shadow-md p-8 border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 animate-fade-in-up delay-200">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-indigo-100 transition-colors">
              <MessageSquare size={24} className="text-indigo-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">AI-Powered Responses</h3>
            <p className="text-slate-600 leading-relaxed">Get intelligent response suggestions tailored to each review. Save hours every week.</p>
          </div>

          <div className="group bg-white rounded-2xl shadow-md p-8 border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 animate-fade-in-up delay-300">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
              <TrendingUp size={24} className="text-emerald-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Smart Analytics</h3>
            <p className="text-slate-600 leading-relaxed">Track ratings, sentiment, and response rates. Make data-driven decisions for your business.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-lg text-slate-600">Get up and running in three simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-900 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-5">1</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Connect Your Platforms</h3>
              <p className="text-slate-600">Link your Google Business Profile and other review platforms in seconds.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-900 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-5">2</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Monitor & Respond</h3>
              <p className="text-slate-600">View all reviews in one dashboard. Use AI to craft perfect responses instantly.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-900 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-5">3</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Track & Improve</h3>
              <p className="text-slate-600">Use analytics to spot trends, improve your ratings, and grow your reputation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-slate-500 font-medium uppercase tracking-wider text-sm mb-10">Trusted by growing businesses</p>
          <div className="flex justify-center gap-16 flex-wrap">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900">500+</div>
              <p className="text-sm text-slate-500 mt-1">Reviews Managed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-1">
                4.9 <Star size={20} className="text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-sm text-slate-500 mt-1">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900">98%</div>
              <p className="text-sm text-slate-500 mt-1">Response Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900">2hrs</div>
              <p className="text-sm text-slate-500 mt-1">Avg. Response Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-white border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything in ReviewHub Pro</h2>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-slate-900">$39.99</span>
                <span className="text-slate-500 text-lg">/month</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'Unlimited businesses',
                'Unlimited AI responses',
                'Google Business integration',
                'Full analytics dashboard',
                'Real-time notifications',
                'Urgent review alerts',
                'Response history',
                'Priority support',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 p-3 rounded-lg">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all hover:shadow-lg hover:shadow-blue-900/20"
              >
                Start Your Subscription
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-12 md:p-16 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
            </div>
            <div className="relative">
              <Shield size={40} className="text-blue-300 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to simplify review management?</h2>
              <p className="text-xl text-blue-200 mb-10 max-w-xl mx-auto">Join hundreds of businesses already using ReviewHub to protect and grow their reputation.</p>
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-900 font-semibold rounded-xl hover:bg-blue-50 transition-all hover:shadow-lg text-center"
              >
                Get Started Now
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-lg font-bold text-slate-900">ReviewHub</div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms and Conditions</Link>
              <a href="mailto:support@reviewhub.com" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <p className="text-sm text-slate-500">&copy; 2026 ReviewHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
