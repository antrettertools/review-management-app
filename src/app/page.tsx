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
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-7 h-7 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-800 rounded-lg flex items-center justify-center">
              <Star size={14} className="text-white fill-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">ReviewInzight</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="px-4 py-2 text-slate-600 font-medium hover:text-slate-900 rounded-lg transition-colors text-sm">
              Sign In
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-blue-700 mb-8">
            <Zap size={14} />
            AI-Powered Review Management
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
            Manage All Your<br />
            <span className="text-blue-800">Customer Reviews</span><br />
            in One Place
          </h1>

          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop juggling between platforms. See all reviews, respond faster with AI-powered suggestions, and track your reputation in real time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start 7-Day Free Trial
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#features"
              className="px-7 py-3.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
          <p className="text-sm text-slate-400 mt-4">No charge for 7 days. Then $39.99/month.</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">Features</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Everything you need to manage reviews</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Powerful tools that help you stay on top of your online reputation.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: BarChart3, title: 'Unified Dashboard', desc: 'See all reviews from Google and more in one place. Never miss important feedback again.' },
              { icon: MessageSquare, title: 'AI-Powered Responses', desc: 'Get intelligent response suggestions tailored to each review. Save hours every week.' },
              { icon: TrendingUp, title: 'Smart Analytics', desc: 'Track ratings, sentiment, and response rates. Make data-driven decisions.' },
            ].map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="bg-white rounded-xl p-7 border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <Icon size={20} className="text-blue-700" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">How It Works</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Get up and running in minutes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { num: '1', title: 'Connect Your Platforms', desc: 'Link your Google Business Profile in seconds.' },
              { num: '2', title: 'Monitor & Respond', desc: 'View all reviews in one dashboard. Use AI to craft responses.' },
              { num: '3', title: 'Track & Improve', desc: 'Use analytics to spot trends and grow your reputation.' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 bg-blue-800 text-white rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-blue-800 p-8 text-center">
                <p className="text-blue-200 font-medium text-sm uppercase tracking-wider mb-2">ReviewInzight Pro</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">$39.99</span>
                  <span className="text-blue-200">/month</span>
                </div>
                <p className="text-blue-200/80 text-sm mt-2">7-day free trial included</p>
              </div>

              <div className="p-7">
                <div className="space-y-3 mb-7">
                  {['Unlimited businesses', 'Unlimited AI responses', 'Google Business integration', 'Full analytics dashboard', 'Real-time notifications', 'Urgent review alerts', 'Response history', 'Priority support'].map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/auth/signup"
                  className="group w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Start Free Trial
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto bg-blue-800 rounded-2xl p-12 md:p-14 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-5">
            <Shield size={24} className="text-blue-200" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to simplify review management?</h2>
          <p className="text-blue-200 mb-8 max-w-lg mx-auto">Join businesses already using ReviewInzight to protect and grow their reputation.</p>
          <Link
            href="/auth/signup"
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-blue-800 font-bold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Start Free Trial
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-800 rounded-md flex items-center justify-center">
                <Star size={12} className="text-white fill-white" />
              </div>
              <span className="font-semibold text-slate-900">ReviewInzight</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms and Conditions</Link>
              <a href="mailto:support@reviewinzight.com" className="hover:text-slate-600 transition-colors">Contact</a>
            </div>
            <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} ReviewInzight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
