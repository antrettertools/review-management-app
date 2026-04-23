'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import NotificationBell from '@/components/layout/NotificationBell'
import { LogoIcon } from '@/components/Logo'
import { LayoutDashboard, MessageSquareText, Bell, Settings, LogOut, Menu, HelpCircle, Mail, X } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showHelpGuide, setShowHelpGuide] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-7 h-7 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const isActive = (href: string) => pathname === href

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/reviews', label: 'Reviews', icon: MessageSquareText },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-slate-100 overflow-y-auto transition-all duration-200 flex-shrink-0 shadow-sm ${
          sidebarOpen ? 'w-56' : 'w-0'
        }`}
      >
        <div className="p-4 w-56 h-full flex flex-col">
          {/* Logo */}
          <div className="mb-6 px-1 pb-4 border-b border-slate-200">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <LogoIcon size={28} />
              <h1 className="text-base font-bold text-slate-900 leading-none">ReviewInzight</h1>
            </Link>
          </div>

          {/* Navigation */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-3 py-2">Navigation</p>
          </div>
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-800 border-l-2 border-blue-800 pl-[11px]'
                      : 'text-slate-600 hover:bg-slate-100 border-l-2 border-transparent'
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-slate-100 pt-3 mt-3">
            {/* Help Guide Box */}
            <button
              onClick={() => setShowHelpGuide(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 mb-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-left"
            >
              <div className="w-7 h-7 bg-slate-200 rounded-md flex items-center justify-center flex-shrink-0">
                <HelpCircle size={14} className="text-slate-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-700">Need Help?</p>
                <p className="text-[10px] text-slate-500 truncate">View guide & support</p>
              </div>
            </button>

            <div className="bg-slate-50 rounded-lg p-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-700 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-blue-200">
                  {(session.user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{session.user?.name || 'User'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{session.user?.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: '/auth/login' })}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Help Guide Modal */}
      {showHelpGuide && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full animate-scale-in border border-slate-200 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-blue-700" />
                <h2 className="text-base font-semibold text-slate-900">Help Guide</h2>
              </div>
              <button onClick={() => setShowHelpGuide(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Getting Started</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Add a business, connect your Google Business Profile, and start managing your reviews all from one place.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Connecting Google</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Go to Settings and click &ldquo;Connect Google Account&rdquo; in the Businesses section. You&apos;ll be redirected to Google to authorize access. Once connected, reviews will sync automatically.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Managing Reviews</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Go to the Reviews tab to see all your reviews. Click &ldquo;Reply&rdquo; on any review to get AI-powered response suggestions. You can edit the suggestion before posting.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">AI Responses</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Our AI analyzes each review and generates a professional, context-aware response. You can regenerate, edit, or post the response directly.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Dashboard Analytics</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Your Dashboard shows your reputation score, rating distribution, AI insights, response rates, and trends all in one place.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Billing & Subscription</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Your subscription is managed through Stripe. You can cancel anytime from the Settings page. If you cancel, your data is preserved and you can reactivate later.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">Need More Help?</h3>
                <p className="text-sm text-blue-700/80 leading-relaxed">
                  Contact our support team at{' '}
                  <a href="mailto:reviewinzight@gmail.com" className="text-blue-700 hover:text-blue-800 font-medium underline">
                    reviewinzight@gmail.com
                  </a>
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Mail size={13} className="text-blue-600" />
                  <span className="text-xs text-blue-600/70">We typically respond within 24 hours</span>
                </div>
              </div>
            </div>

            <button onClick={() => setShowHelpGuide(false)}
              className="w-full mt-5 px-4 py-2.5 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
            >
              <Menu size={18} className="text-slate-500" />
            </button>
            <div className="text-sm">
              <p className="font-medium text-slate-900">Welcome back</p>
              <p className="text-xs text-slate-400 mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <NotificationBell userId={(session?.user as any)?.id} />
        </div>

        {/* Page Content - full width */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
