'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { LogoIcon } from '@/components/Logo'
import { BarChart3, Zap, Shield, ArrowRight, CheckCircle, MessageSquare, TrendingUp, Clock, Users, Globe, Bell, Sparkles, Lock, Headphones } from 'lucide-react'

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
          <AnimateOnScroll>
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
            ReviewInzight makes it easy to keep track of customer feedback from your business. Instead of visiting multiple platforms and spending time writing responses, you can now see all your reviews in a single dashboard and use AI-powered suggestions to craft professional replies. Whether you're a small business or managing multiple locations, ReviewInzight helps you stay organized and responsive.
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
          <p className="text-sm text-slate-400 mt-4">No charge for 14 days. Then $39.99/month. Cancel anytime.</p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Why Reviews Matter */}
      <section className="py-14 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Online reviews matter more than ever</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Customer reviews have become a critical part of business reputation. People read reviews before deciding where to spend their money, and how you respond to feedback shapes their perception of your business. Managing this effectively requires time, organization, and consistency.
              </p>
              <p className="text-slate-600 leading-relaxed">
                ReviewInzight is designed to help you manage this process more efficiently, bringing all your reviews into one place and helping you respond thoughtfully to customer feedback.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <AnimateOnScroll delay={100}>
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <Globe size={24} className="text-blue-600 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Centralized View</h3>
                  <p className="text-sm text-slate-500">See all your reviews in one dashboard instead of checking multiple platforms</p>
                </div>
              </AnimateOnScroll>
              <AnimateOnScroll delay={200}>
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <Clock size={24} className="text-blue-600 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Save Time</h3>
                  <p className="text-sm text-slate-500">Spend less time copying between platforms and more time running your business</p>
                </div>
              </AnimateOnScroll>
              <AnimateOnScroll delay={300}>
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <MessageSquare size={24} className="text-blue-600 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Better Responses</h3>
                  <p className="text-sm text-slate-500">Get suggestions for professional, thoughtful replies to every review</p>
                </div>
              </AnimateOnScroll>
              <AnimateOnScroll delay={400}>
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <TrendingUp size={24} className="text-blue-600 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Track Progress</h3>
                  <p className="text-sm text-slate-500">Monitor your review trends and response activity over time</p>
                </div>
              </AnimateOnScroll>
            </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-3">The Challenge</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-5">Managing reviews can be overwhelming</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-slate-400 text-xs">•</span>
                  </div>
                  <p className="text-slate-600">Juggling multiple review platforms means logging in and out constantly, which takes up valuable time that could be spent on your business</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-slate-400 text-xs">•</span>
                  </div>
                  <p className="text-slate-600">Writing thoughtful, professional responses to every review requires effort and care to maintain consistent voice and quality</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-slate-400 text-xs">•</span>
                  </div>
                  <p className="text-slate-600">Important negative feedback can slip through the cracks if you don't check platforms regularly, potentially affecting your reputation</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-slate-400 text-xs">•</span>
                  </div>
                  <p className="text-slate-600">Without a clear system, it's hard to see patterns in customer feedback or understand how your reputation is changing over time</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">The Solution</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-5">ReviewInzight brings it all together</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1" />
                  <p className="text-slate-600">One unified dashboard that collects reviews from your connected platforms, eliminating the need to visit multiple sites</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1" />
                  <p className="text-slate-600">AI-generated response suggestions that give you a starting point for replies, which you can edit and customize before posting</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1" />
                  <p className="text-slate-600">Real-time notifications help keep you informed about new reviews so you can respond promptly and thoughtfully</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1" />
                  <p className="text-slate-600">Built-in analytics and tracking tools that help you understand your review data and see how you're doing over time</p>
                </div>
              </div>
            </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">Features</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">What ReviewInzight Offers</h2>
              <p className="text-slate-500 max-w-xl mx-auto">A complete toolkit for managing your online reputation and staying connected with customer feedback.</p>
            </div>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: BarChart3, title: 'Unified Dashboard', desc: 'Access all your reviews in a single, organized dashboard. Review content is displayed clearly with all relevant details, making it easy to browse and find specific feedback.' },
              { icon: MessageSquare, title: 'AI Response Suggestions', desc: 'The app generates suggested responses based on the content of each review. You remain in complete control—review every suggestion, edit as needed, and only post what you\'re comfortable with.' },
              { icon: TrendingUp, title: 'Review Analytics', desc: 'Track your reviews over time with basic analytics. View information about your rating distribution, response activity, and review trends to better understand your customer feedback.' },
              { icon: Bell, title: 'Notifications', desc: 'Stay informed about new reviews as they come in. Configure notifications so you\'re aware of feedback when it matters most for your business.' },
              { icon: Globe, title: 'Multi-Business Support', desc: 'If you manage multiple locations or businesses, ReviewInzight allows you to set up and organize each one separately within your account.' },
              { icon: Sparkles, title: 'One-Platform Posting', desc: 'Review and post responses directly from ReviewInzight, streamlining your workflow and reducing the need to switch between multiple websites.' },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <AnimateOnScroll key={feature.title} delay={index * 100}>
                  <div className="bg-white rounded-xl p-7 border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                      <Icon size={20} className="text-blue-700" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">Getting Started</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Simple Setup Process</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Getting started with ReviewInzight is straightforward. Here's how the process works.</p>
            </div>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { num: '1', title: 'Create Your Account', desc: 'Sign up with your email and set up your account in just a few minutes. You\'ll have access to your dashboard right away to start exploring the platform.' },
              { num: '2', title: 'Connect Your Business', desc: 'Add your business information and connect it to your Google Business Profile to start syncing reviews. The connection process uses secure authentication to protect your data.' },
              { num: '3', title: 'Start Managing Reviews', desc: 'Once connected, your reviews will appear in your dashboard. You can browse feedback, generate response suggestions, and manage your review activity all in one place.' },
            ].map((step, index) => (
              <AnimateOnScroll key={step.num} delay={index * 100}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-800 text-white rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Why ReviewInzight */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">Why Choose ReviewInzight</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Built with business owners in mind</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                ReviewInzight is designed to be straightforward and practical. Whether you're a single-location business or managing multiple locations, the platform adapts to your needs.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: 'Designed for Efficiency', desc: 'By bringing reviews together in one place, ReviewInzight helps reduce the time spent jumping between platforms and managing feedback.' },
              { icon: Users, title: 'For Growing Businesses', desc: 'Whether you\'re just starting out or managing multiple locations, ReviewInzight scales with your business and your review management needs.' },
              { icon: Lock, title: 'Data Security', desc: 'Your information is important. ReviewInzight uses industry-standard security practices and secure authentication to protect your data.' },
              { icon: Headphones, title: 'Customer Support', desc: 'If you have questions or need help, our support team is available to assist you via email at reviewinzight@gmail.com.' },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <AnimateOnScroll key={item.title} delay={index * 100}>
                  <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                      <Icon size={18} className="text-blue-700" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* About the App */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">About ReviewInzight</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
            </div>
          </AnimateOnScroll>

          <div className="space-y-6">
            <AnimateOnScroll delay={0}>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Review Collection</h3>
                <p className="text-slate-600 leading-relaxed">
                  ReviewInzight connects to your Google Business Profile to retrieve your reviews. Once connected, the app regularly checks for new reviews and updates your dashboard so you always have current information about your feedback.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-base font-semibold text-slate-900 mb-2">AI-Assisted Responses</h3>
                <p className="text-slate-600 leading-relaxed">
                  For each review, ReviewInzight can generate a suggested response using AI technology. These suggestions are intended as a starting point to help you craft your reply. You have complete control over any responses before they're posted—you can edit them, regenerate new suggestions, or write your own response from scratch.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Dashboard Organization</h3>
                <p className="text-slate-600 leading-relaxed">
                  All your reviews appear in a clean, organized dashboard where you can browse, search, and manage your feedback. Information is presented clearly so you can quickly understand your review activity and respond to customer feedback effectively.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={300}>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Analytics & Tracking</h3>
                <p className="text-slate-600 leading-relaxed">
                  ReviewInzight provides basic analytics and tracking of your review data, including information about your reviews over time. This information can help you understand trends in customer feedback and track your response activity.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={400}>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Multi-Location Support</h3>
                <p className="text-slate-600 leading-relaxed">
                  If you operate multiple businesses or locations, you can add and manage each one within ReviewInzight. Each business gets its own set of reviews and management interface, making it easier to handle multiple properties from a single account.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">FAQ</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Common Questions</h2>
              <p className="text-slate-500">Here are some questions people often ask about ReviewInzight.</p>
            </div>
          </AnimateOnScroll>

          <div className="space-y-4">
            {[
              {
                q: 'How does the free trial work?',
                a: 'The free trial gives you full access to ReviewInzight for 14 days. We require a credit card to start the trial, but you won\'t be charged during this period. You can explore all the features and decide if ReviewInzight is right for your business. You can cancel anytime.',
              },
              {
                q: 'What review platforms does ReviewInzight support?',
                a: 'Currently, ReviewInzight works with Google Business Profile reviews. Additional platforms may be supported in the future as the product continues to develop.',
              },
              {
                q: 'How do the AI response suggestions work?',
                a: 'ReviewInzight analyzes each review you receive and generates a suggested response using AI. The suggestion is meant as a starting point—you can review it, edit it, customize it, or discard it entirely. You control what gets posted to your review platform.',
              },
              {
                q: 'Can I manage multiple businesses?',
                a: 'Yes. You can set up multiple businesses in your ReviewInzight account, and each one can be managed separately. This is useful if you operate multiple locations, manage client accounts, or run several different business properties.',
              },
              {
                q: 'What happens to my data if I cancel?',
                a: 'Your data remains yours. If you cancel your subscription, your information is preserved and you can reactivate your account at any time. You won\'t lose your review history or account information.',
              },
              {
                q: 'How is my information protected?',
                a: 'ReviewInzight uses secure authentication and industry-standard security practices to protect your data. When you connect your Google account, the connection uses OAuth, a secure authentication standard. Your information is treated with care and security in mind.',
              },
              {
                q: 'Is there a contract or long-term commitment?',
                a: 'No. You can cancel your subscription anytime. There\'s no long-term contract or commitment required. Pay month-to-month and stop whenever you\'d like.',
              },
              {
                q: 'How can I get support?',
                a: 'If you have questions or run into issues, you can reach our support team at reviewinzight@gmail.com. We\'ll do our best to help you get the most out of ReviewInzight.',
              },
            ].map((faq, index) => (
              <AnimateOnScroll key={faq.q} delay={index * 50}>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">Pricing</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">One Simple Plan</h2>
              <p className="text-slate-500 max-w-lg mx-auto">ReviewInzight offers straightforward pricing with no hidden fees. Start with a 14-day free trial to see if it works for your business.</p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-blue-800 p-8 text-center">
                <p className="text-blue-200 font-medium text-sm uppercase tracking-wider mb-2">ReviewInzight</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">$39.99</span>
                  <span className="text-blue-200">/month</span>
                </div>
                <p className="text-blue-200/80 text-sm mt-3">Includes 14-day free trial</p>
              </div>

              <div className="p-7">
                <div className="space-y-3 mb-7">
                  {['Unlimited businesses', 'Unlimited AI responses', 'Google Business integration', 'Review analytics', 'Real-time notifications', 'Urgent review alerts', 'Response history', 'Email support'].map((feature) => (
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
                  Start Your Free Trial
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <p className="text-xs text-slate-500 text-center mt-3">No charge for 7 days. Then $39.99/month.</p>
              </div>
            </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto bg-blue-800 rounded-2xl p-12 md:p-14 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-5">
            <Shield size={24} className="text-blue-200" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to simplify your review management?</h2>
          <p className="text-blue-200 mb-4 max-w-lg mx-auto">ReviewInzight makes it easier to stay on top of customer feedback and manage your online reputation from one dashboard.</p>
          <p className="text-blue-300/80 text-sm mb-8 max-w-md mx-auto">Try it free for 14 days to see how ReviewInzight can help you manage your reviews more effectively.</p>
          <Link
            href="/auth/signup"
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-blue-800 font-bold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Start Free Trial
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          </div>
        </AnimateOnScroll>
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
