'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { LogoIcon } from '@/components/Logo'
import { BarChart3, Zap, Shield, ArrowRight, CheckCircle, MessageSquare, TrendingUp, Clock, Users, Globe, Bell, Sparkles, Lock, Headphones, ChevronDown } from 'lucide-react'

// Hook to detect when element enters viewport
function useInView(ref: React.RefObject<HTMLDivElement | null>, threshold = 0.15) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [ref, threshold])

  return isVisible
}

// Wrapper component for scroll animations
function AnimateOnScroll({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useInView(ref)

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  )
}

// Accordion item component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-slate-50 transition-colors px-4"
      >
        <h3 className="font-semibold text-slate-900">{question}</h3>
        <ChevronDown size={18} className={`text-slate-400 transition-transform flex-shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-4 px-4 text-slate-600 leading-relaxed animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  )
}

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
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, blue 0%, transparent 50%)'}} />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <AnimateOnScroll>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
            Your reviews.<br />
            <span className="text-blue-800">One inbox.</span><br />
            Replied.
          </h1>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Stop bouncing between Google, Facebook, and email. See all customer reviews in one place and reply faster with AI assistance.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors surface-2"
            >
              Start 14-Day Free Trial
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#features"
              className="px-7 py-3.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              See How It Works
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-4 uppercase tracking-widest">How it works</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-600">
              <div>All reviews synced automatically</div>
              <div className="hidden sm:block text-slate-300">•</div>
              <div>Google Business Profile + more coming</div>
              <div className="hidden sm:block text-slate-300">•</div>
              <div>No manual work needed</div>
            </div>
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Key Benefits - Clear Selling Points */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Why respond to reviews matters</h2>
              <p className="text-slate-600 text-lg">Reviews influence 94% of purchasing decisions. ResponseTime drives results.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Bell size={32} className="text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Build Trust Faster</h3>
                <p className="text-slate-600">Responding to reviews shows you care. Businesses that reply see 25% higher trust scores from customers.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp size={32} className="text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Stop Losing Customers</h3>
                <p className="text-slate-600">50% of consumers don't return to businesses with unaddressed negative reviews. Quick responses save relationships.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock size={32} className="text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Stay Competitive</h3>
                <p className="text-slate-600">Businesses that respond within 24 hours outrank competitors on Google. Speed matters.</p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3">The Problem</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-lg flex-shrink-0">✕</span>
                  <p className="text-slate-700 font-medium">Multiple logins. Constant tab switching.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-lg flex-shrink-0">✕</span>
                  <p className="text-slate-700 font-medium">Writing professional responses takes hours.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-lg flex-shrink-0">✕</span>
                  <p className="text-slate-700 font-medium">Critical feedback gets missed or forgotten.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-lg flex-shrink-0">✕</span>
                  <p className="text-slate-700 font-medium">No way to see trends or patterns.</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">ReviewInzight Solves It</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold text-lg flex-shrink-0">✓</span>
                  <p className="text-slate-700 font-medium">All reviews in one dashboard.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold text-lg flex-shrink-0">✓</span>
                  <p className="text-slate-700 font-medium">AI suggests replies in seconds.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold text-lg flex-shrink-0">✓</span>
                  <p className="text-slate-700 font-medium">Instant notifications on new reviews.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold text-lg flex-shrink-0">✓</span>
                  <p className="text-slate-700 font-medium">Analytics show what customers care about.</p>
                </div>
              </div>
            </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Built for busy business owners</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to manage reviews faster, respond better, and track your reputation growth.</p>
            </div>
          </AnimateOnScroll>

          {/* Feature 1: Unified Dashboard */}
          <AnimateOnScroll delay={0}>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 size={24} className="text-blue-700" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">One inbox for all reviews</h3>
                <p className="text-slate-600 leading-relaxed mb-4">Google, Facebook, or other platforms — see everything in your ReviewInzight dashboard. No more tab switching.</p>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li className="flex items-start gap-2"><span className="text-blue-700 font-bold">✓</span> Auto-sync from all platforms</li>
                  <li className="flex items-start gap-2"><span className="text-blue-700 font-bold">✓</span> Real-time notifications</li>
                  <li className="flex items-start gap-2"><span className="text-blue-700 font-bold">✓</span> Search and filter reviews</li>
                </ul>
              </div>
              <div className="bg-slate-50 rounded-lg p-8 border border-slate-200">
                <div className="space-y-3">
                  <div className="h-12 bg-white rounded border border-slate-200" />
                  <div className="h-12 bg-white rounded border border-slate-200" />
                  <div className="h-12 bg-white rounded border border-slate-200" />
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Feature 2: AI Responses */}
          <AnimateOnScroll delay={100}>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="bg-slate-50 rounded-lg p-8 border border-slate-200 order-2 md:order-1">
                <div className="space-y-3">
                  <div className="h-8 bg-white rounded border border-slate-200" />
                  <div className="h-4 bg-blue-50 rounded w-3/4" />
                  <div className="h-4 bg-blue-50 rounded w-4/5" />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare size={24} className="text-emerald-700" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Reply in seconds, not hours</h3>
                <p className="text-slate-600 leading-relaxed mb-4">Get AI-powered response suggestions tailored to each review. Edit, customize, or write your own.</p>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li className="flex items-start gap-2"><span className="text-emerald-700 font-bold">✓</span> AI understands review context</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-700 font-bold">✓</span> You stay in full control</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-700 font-bold">✓</span> Save templates for faster replies</li>
                </ul>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Feature 3: Analytics */}
          <AnimateOnScroll delay={200}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp size={24} className="text-amber-700" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Track what matters</h3>
                <p className="text-slate-600 leading-relaxed mb-4">See your reputation score, response rate, sentiment trends, and AI-powered business insights at a glance.</p>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li className="flex items-start gap-2"><span className="text-amber-700 font-bold">✓</span> Real-time reputation metrics</li>
                  <li className="flex items-start gap-2"><span className="text-amber-700 font-bold">✓</span> Identify patterns and trends</li>
                  <li className="flex items-start gap-2"><span className="text-amber-700 font-bold">✓</span> AI extracts key insights</li>
                </ul>
              </div>
              <div className="bg-slate-50 rounded-lg p-8 border border-slate-200">
                <div className="flex items-end gap-2">
                  <div className="h-16 bg-blue-200 rounded flex-1" />
                  <div className="h-20 bg-blue-400 rounded flex-1" />
                  <div className="h-24 bg-blue-600 rounded flex-1" />
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

{/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Frequently Asked</h2>
              <p className="text-slate-600">Everything you need to know about ReviewInzight.</p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="bg-white rounded-xl border border-slate-200">
              <FAQItem
                question="How does the 14-day free trial work?"
                answer="Start with full access to ReviewInzight. No charge during the trial. We require a credit card to prevent fraud, but you won't be charged until day 15. Cancel anytime—no questions asked."
              />
              <FAQItem
                question="What platforms do you support?"
                answer="We currently sync reviews from Google Business Profile. Facebook and other platforms are coming soon. Let us know which platforms matter most to your business."
              />
              <FAQItem
                question="How good are the AI suggestions?"
                answer="Our AI analyzes the review's tone, rating, and content to generate contextual responses. You always review and edit before posting—it's a starting point, not final text. Most users customize responses to match their voice."
              />
              <FAQItem
                question="Can I manage multiple locations?"
                answer="Yes. Add each business separately in your account, and manage them all from one dashboard. Perfect for franchises, multi-location operators, or agencies."
              />
              <FAQItem
                question="What happens if I cancel?"
                answer="Your review history and account data stay with us. You can reactivate anytime without losing anything. We never delete your data."
              />
              <FAQItem
                question="How secure is my data?"
                answer="We use OAuth for secure Google authentication—you never share passwords with us. All data is encrypted in transit and at rest using industry standards."
              />
              <FAQItem
                question="Is there a long-term contract?"
                answer="Nope. Monthly billing, cancel anytime. No commitments, no surprises. Stop by your settings to cancel with one click."
              />
              <FAQItem
                question="What if I need help?"
                answer="Email us at reviewinzight@gmail.com. We typically respond within 24 hours. There's also a built-in Help Guide in your dashboard."
              />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-slate-900 mb-3">Simple, transparent pricing</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">One plan. Everything included. Try free for 14 days.</p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="max-w-2xl mx-auto px-4 sm:px-0">
            <div className="bg-white rounded-2xl border-2 border-blue-800 overflow-hidden shadow-lg relative">
              {/* Most Popular Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Most Popular</div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 text-center border-b border-blue-800">
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-slate-900">$39.99</span>
                  <span className="text-slate-600 text-lg">/month</span>
                </div>
                <p className="text-sm text-slate-600">14-day free trial • Cancel anytime</p>
              </div>

              <div className="p-8">
                <div className="mb-8 pb-8 border-b border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-2">Everything you need:</p>
                  <ul className="space-y-3">
                    {['Unlimited businesses & locations', 'Unlimited AI-powered responses', 'Google Business Profile integration', 'Real-time review notifications', 'Reputation score & analytics', 'Sentiment analysis & insights', 'Response history & audit log', 'Email support'].map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/auth/signup"
                  className="group w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Start Free Trial
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <p className="text-xs text-slate-500 text-center mt-4">vs. hiring an assistant: $2,000+/month</p>
              </div>
            </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900 to-blue-800 opacity-[0.95]" />
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">Ready to take control of your reviews?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">Join hundreds of businesses already managing reviews smarter, responding faster, and building better customer relationships with ReviewInzight.</p>
          <Link
            href="/auth/signup"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-800 font-bold rounded-lg hover:bg-blue-50 transition-colors surface-3"
          >
            Start Free Trial
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LogoIcon size={24} />
                <span className="font-bold text-slate-900">ReviewInzight</span>
              </div>
              <p className="text-sm text-slate-600">Manage your reviews. Faster. Together.</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Product</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link></li>
                <li><Link href="/#" className="text-slate-600 hover:text-slate-900 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="text-slate-600 hover:text-slate-900 transition-colors">Terms</Link></li>
                <li><a href="mailto:reviewinzight@gmail.com" className="text-slate-600 hover:text-slate-900 transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} ReviewInzight. All rights reserved.</p>
            <p className="text-xs text-slate-500">Questions? Email us at <a href="mailto:reviewinzight@gmail.com" className="font-medium text-slate-600 hover:text-slate-900">reviewinzight@gmail.com</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
