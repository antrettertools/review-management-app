'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { LogoIcon } from '@/components/Logo'
import { BarChart3, Zap, Shield, ArrowRight, CheckCircle, MessageSquare, TrendingUp, Clock, Users, Globe, Bell, Sparkles, Lock, Headphones } from 'lucide-react'

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
            <LogoIcon size={28} />
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
            Stop juggling between platforms. See all reviews, respond faster with AI-powered suggestions, and track your reputation in real time. ReviewInzight helps businesses of all sizes turn customer feedback into growth.
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
          <p className="text-sm text-slate-400 mt-4">No charge for 7 days. Then $39.99/month. Cancel anytime.</p>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-14 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-slate-900">10K+</p>
              <p className="text-sm text-slate-500 mt-1">Reviews Managed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">500+</p>
              <p className="text-sm text-slate-500 mt-1">Businesses Trust Us</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">85%</p>
              <p className="text-sm text-slate-500 mt-1">Faster Response Time</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">4.9/5</p>
              <p className="text-sm text-slate-500 mt-1">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-3">The Problem</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-5">Managing reviews is time-consuming and scattered</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-500 text-sm font-bold">&times;</span>
                  </div>
                  <p className="text-slate-600">Logging into multiple platforms just to check for new reviews wastes hours every week</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-500 text-sm font-bold">&times;</span>
                  </div>
                  <p className="text-slate-600">Crafting thoughtful, professional responses to every review is exhausting and inconsistent</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-500 text-sm font-bold">&times;</span>
                  </div>
                  <p className="text-slate-600">Negative reviews slip through the cracks, damaging your reputation before you can respond</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-500 text-sm font-bold">&times;</span>
                  </div>
                  <p className="text-slate-600">No clear picture of how your reputation is trending over time across all platforms</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">The Solution</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-5">ReviewInzight handles it all for you</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} className="text-emerald-500" />
                  </div>
                  <p className="text-slate-600">All your reviews from Google (and more coming soon) synced into a single, unified dashboard</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} className="text-emerald-500" />
                  </div>
                  <p className="text-slate-600">AI-generated responses that sound professional and are tailored to each review&apos;s context</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} className="text-emerald-500" />
                  </div>
                  <p className="text-slate-600">Instant notifications for critical reviews so you can respond before the damage is done</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} className="text-emerald-500" />
                  </div>
                  <p className="text-slate-600">Rich analytics that show your rating trends, response rates, and reputation score at a glance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">Features</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Everything you need to manage reviews</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Powerful tools that help you stay on top of your online reputation and turn every review into an opportunity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: BarChart3, title: 'Unified Dashboard', desc: 'See all reviews from Google and more in one place. Get a bird\'s-eye view of your entire reputation. Never miss important feedback again.' },
              { icon: MessageSquare, title: 'AI-Powered Responses', desc: 'Get intelligent response suggestions tailored to each review\'s tone and content. Save hours every week while maintaining a professional, consistent voice.' },
              { icon: TrendingUp, title: 'Smart Analytics', desc: 'Track ratings, sentiment trends, and response rates over time. Make data-driven decisions to improve your customer experience and reputation.' },
              { icon: Bell, title: 'Instant Notifications', desc: 'Get alerted immediately when you receive critical reviews. Prioritize urgent feedback and respond quickly to protect your brand reputation.' },
              { icon: Globe, title: 'Multi-Business Support', desc: 'Manage reviews for multiple locations or businesses from a single account. Perfect for franchises, agencies, and growing businesses.' },
              { icon: Sparkles, title: 'One-Click Responses', desc: 'Review, edit, and post AI-generated responses directly to Google. No copy-pasting, no switching tabs. Just click and respond.' },
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
            <p className="text-slate-500 max-w-xl mx-auto">No complicated setup. No technical knowledge required. Just connect and start managing.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { num: '1', title: 'Connect Your Platforms', desc: 'Link your Google Business Profile in just a few clicks. We securely sync all your existing reviews and keep them updated in real time.' },
              { num: '2', title: 'Monitor & Respond', desc: 'View all reviews in one clean dashboard. Use our AI to craft thoughtful, professional responses in seconds. Edit if you want, then post directly.' },
              { num: '3', title: 'Track & Improve', desc: 'Use detailed analytics to spot trends, measure your response rate, and watch your reputation improve over time. Set alerts for critical reviews.' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 bg-blue-800 text-white rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose ReviewInzight */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">Why ReviewInzight</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Built for businesses that care about their reputation</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Whether you run a single location or manage multiple businesses, ReviewInzight gives you the tools to stay on top of every review and build lasting customer relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: 'Save Hours Weekly', desc: 'AI responses cut your reply time from minutes to seconds. Spend less time writing and more time running your business.' },
              { icon: Users, title: 'Better Customer Relations', desc: 'Responding promptly and professionally to every review builds trust and shows customers you care about their experience.' },
              { icon: Lock, title: 'Secure & Private', desc: 'Your data is encrypted and never shared. We use industry-standard security to protect your business information.' },
              { icon: Headphones, title: 'Dedicated Support', desc: 'Our team is here to help you succeed. Get personalized assistance whenever you need it via email support.' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-white rounded-xl p-6 border border-slate-200">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                    <Icon size={18} className="text-blue-700" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">What People Are Saying</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Trusted by business owners everywhere</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: 'ReviewInzight has completely transformed how we handle customer feedback. The AI responses are incredibly well-written and save us so much time. We went from spending 2 hours a day on reviews to just 15 minutes.',
                name: 'Sarah M.',
                role: 'Restaurant Owner',
              },
              {
                quote: 'Managing reviews across 5 locations used to be a nightmare. Now I see everything in one place, get notified about urgent reviews instantly, and can respond with a single click. Game changer for our franchise.',
                name: 'David K.',
                role: 'Franchise Manager',
              },
              {
                quote: 'The analytics alone are worth the price. I can finally see how our reputation is trending, which locations need attention, and how our response rate affects our overall rating. Highly recommend.',
                name: 'Jennifer L.',
                role: 'Marketing Director',
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-xl p-7 border border-slate-200">
                <div className="flex items-center gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-xs text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">FAQ</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Frequently asked questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How does the 7-day free trial work?',
                a: 'You get full access to all ReviewInzight features for 7 days at no cost. A credit card is required to start your trial, but you won\'t be charged until the trial ends. You can cancel anytime during the trial period.',
              },
              {
                q: 'What platforms does ReviewInzight support?',
                a: 'We currently support Google Business Profile reviews with automatic syncing. Support for additional platforms like Yelp, Facebook, and TripAdvisor is coming soon.',
              },
              {
                q: 'How does the AI response feature work?',
                a: 'Our AI analyzes the content, tone, and sentiment of each review, then generates a professional, context-aware response. You can use it as-is, edit it to add a personal touch, or regenerate for a different approach. Responses are posted directly to Google.',
              },
              {
                q: 'Can I manage multiple businesses?',
                a: 'Yes! You can add and manage unlimited businesses from a single ReviewInzight account. Each business gets its own set of reviews, analytics, and response history. Perfect for franchises, agencies, and multi-location businesses.',
              },
              {
                q: 'Is my data secure?',
                a: 'Absolutely. We use industry-standard encryption, secure OAuth connections for Google, and your data is never shared with third parties. Your business information and review data are always private and protected.',
              },
              {
                q: 'What happens if I cancel my subscription?',
                a: 'If you cancel, your data is preserved and you can reactivate your account at any time. You won\'t lose any of your review history, analytics data, or response history.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">Pricing</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Simple, transparent pricing</h2>
            <p className="text-slate-500 max-w-lg mx-auto">One plan with everything you need. No hidden fees, no feature gates, no surprises.</p>
          </div>

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
          <p className="text-blue-200 mb-4 max-w-lg mx-auto">Join hundreds of businesses already using ReviewInzight to protect and grow their online reputation.</p>
          <p className="text-blue-300/80 text-sm mb-8 max-w-md mx-auto">Start your free trial today and see the difference professional review management makes. No credit card charged for 7 days.</p>
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
              <LogoIcon size={24} />
              <span className="font-semibold text-slate-900">ReviewInzight</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms and Conditions</Link>
              <a href="mailto:reviewinzight@gmail.com" className="hover:text-slate-600 transition-colors">Contact</a>
            </div>
            <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} ReviewInzight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
