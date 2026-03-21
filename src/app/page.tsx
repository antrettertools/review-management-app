'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { BarChart3, Zap, Shield, Star, ArrowRight, CheckCircle, MessageSquare, TrendingUp, Sparkles } from 'lucide-react'

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
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-indigo-700 rounded-lg flex items-center justify-center">
              <Star size={16} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">ReviewHub</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="px-5 py-2.5 text-slate-700 font-medium hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all text-sm"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2.5 bg-gradient-to-b from-blue-800 to-blue-900 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md shadow-blue-900/20 text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/60 to-indigo-100/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-slate-100/60 to-blue-50/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full dot-pattern opacity-[0.35]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28 lg:pt-28 lg:pb-36">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-full text-sm font-medium text-blue-800 mb-8 shadow-sm">
              <Sparkles size={14} className="text-blue-600" />
              AI-Powered Review Management
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">
              Manage All Your<br />
              <span className="gradient-text">
                Customer Reviews
              </span>
              <br />
              in One Place
            </h1>

            <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
              Stop juggling between platforms. See all reviews, respond faster with AI-powered suggestions, and track your reputation in real time.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up delay-200">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-b from-blue-800 to-blue-900 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-900/25 hover:shadow-xl hover:shadow-blue-900/30 text-center"
              >
                Get Started - $39.99/mo
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="relative bg-gradient-to-b from-slate-50/50 to-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Everything you need to manage reviews</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Powerful tools that help you stay on top of your online reputation and grow your business.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                color: 'blue',
                title: 'Unified Dashboard',
                desc: 'See all reviews from Google, Yelp, and more in one place. Never miss important feedback again.',
              },
              {
                icon: MessageSquare,
                color: 'indigo',
                title: 'AI-Powered Responses',
                desc: 'Get intelligent response suggestions tailored to each review. Save hours every single week.',
              },
              {
                icon: TrendingUp,
                color: 'emerald',
                title: 'Smart Analytics',
                desc: 'Track ratings, sentiment, and response rates. Make data-driven decisions for your business.',
              },
            ].map((feature, i) => {
              const colors: Record<string, { bg: string; iconBg: string; icon: string; border: string }> = {
                blue: { bg: 'group-hover:bg-blue-50/50', iconBg: 'bg-blue-100', icon: 'text-blue-700', border: 'hover:border-blue-200' },
                indigo: { bg: 'group-hover:bg-indigo-50/50', iconBg: 'bg-indigo-100', icon: 'text-indigo-700', border: 'hover:border-indigo-200' },
                emerald: { bg: 'group-hover:bg-emerald-50/50', iconBg: 'bg-emerald-100', icon: 'text-emerald-700', border: 'hover:border-emerald-200' },
              }
              const c = colors[feature.color]
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className={`group bg-white rounded-2xl p-8 border border-slate-200/60 ${c.border} hover:shadow-lg transition-all duration-300 animate-fade-in-up delay-${(i + 1) * 100}`}
                >
                  <div className={`w-12 h-12 ${c.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                    <Icon size={22} className={c.icon} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Get up and running in minutes</h2>
            <p className="text-lg text-slate-500">Three simple steps to take control of your reviews.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { num: '1', title: 'Connect Your Platforms', desc: 'Link your Google Business Profile and other review platforms in seconds.', icon: Zap },
              { num: '2', title: 'Monitor & Respond', desc: 'View all reviews in one dashboard. Use AI to craft perfect responses instantly.', icon: MessageSquare },
              { num: '3', title: 'Track & Improve', desc: 'Use analytics to spot trends, improve your ratings, and grow your reputation.', icon: TrendingUp },
            ].map((step, i) => (
              <div key={step.num} className={`text-center animate-fade-in-up delay-${(i + 1) * 100}`}>
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-800 to-blue-900 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-900/20">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-slate-400 font-semibold uppercase tracking-wider text-xs mb-12">Trusted by growing businesses</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { value: '500+', label: 'Reviews Managed' },
              { value: '4.9', label: 'Average Rating', hasStar: true },
              { value: '98%', label: 'Response Rate' },
              { value: '2hrs', label: 'Avg. Response Time' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-1.5 mb-1">
                  {stat.value}
                  {stat.hasStar && <Star size={18} className="text-amber-500 fill-amber-500" />}
                </div>
                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included / Pricing */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">
              {/* Pricing header */}
              <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                  <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                </div>
                <div className="relative">
                  <p className="text-blue-300 font-semibold text-sm uppercase tracking-wider mb-3">ReviewHub Pro</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold text-white">$39.99</span>
                    <span className="text-blue-300 text-lg font-medium">/month</span>
                  </div>
                  <p className="text-blue-200/70 text-sm mt-2">Everything you need, one simple price</p>
                </div>
              </div>

              {/* Features list */}
              <div className="p-8">
                <div className="space-y-3.5">
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
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={13} className="text-emerald-600" />
                      </div>
                      <span className="text-slate-700 font-medium text-[15px]">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/auth/signup"
                  className="group w-full mt-8 inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-b from-blue-800 to-blue-900 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-900/20"
                >
                  Start Your Subscription
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-12 md:p-16 overflow-hidden text-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute inset-0 dot-pattern opacity-[0.06]" />
            </div>
            <div className="relative">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Shield size={28} className="text-blue-300" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Ready to simplify review management?</h2>
              <p className="text-lg text-blue-200/80 mb-10 max-w-lg mx-auto">Join hundreds of businesses already using ReviewHub to protect and grow their reputation.</p>
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started Now
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-900 to-indigo-700 rounded-lg flex items-center justify-center">
                <Star size={13} className="text-white fill-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">ReviewHub</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-400">
              <Link href="/terms" className="hover:text-slate-700 transition-colors">Terms and Conditions</Link>
              <a href="mailto:support@reviewhub.com" className="hover:text-slate-700 transition-colors">Contact</a>
            </div>
            <p className="text-sm text-slate-400">&copy; 2026 ReviewHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
