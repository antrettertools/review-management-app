'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import NotificationBell from '@/components/layout/NotificationBell'
import { LayoutDashboard, MessageSquareText, BarChart3, Bell, Settings, LogOut, Menu, Star } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
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
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-slate-50/80">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-slate-200/60 overflow-y-auto transition-all duration-300 ease-in-out flex-shrink-0 ${
          sidebarOpen ? 'w-64' : 'w-0'
        }`}
      >
        <div className="p-5 w-64 h-full flex flex-col">
          {/* Logo */}
          <div className="mb-8 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-indigo-700 rounded-lg flex items-center justify-center shadow-sm">
                <Star size={15} className="text-white fill-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">ReviewHub</h1>
                <p className="text-[11px] text-slate-400 mt-0.5">Review Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-0.5 flex-1">
            {navItems.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={17} strokeWidth={active ? 2.5 : 2} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-slate-100 pt-4 mt-4">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-xl p-3.5 mb-3 border border-slate-200/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {(session.user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{session.user?.name || 'User'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{session.user?.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: '/auth/login' })}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-[13px] font-medium text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={20} className="text-slate-500" />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400 font-medium">
                Welcome back, {session.user?.name || session.user?.email?.split('@')[0]}
              </span>
            </div>
          </div>
          <NotificationBell userId={(session?.user as any)?.id} />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
