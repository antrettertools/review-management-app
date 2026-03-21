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
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-slate-100 overflow-y-auto transition-all duration-200 flex-shrink-0 ${
          sidebarOpen ? 'w-56' : 'w-0'
        }`}
      >
        <div className="p-4 w-56 h-full flex flex-col">
          {/* Logo */}
          <div className="mb-6 px-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-800 rounded-lg flex items-center justify-center">
                <Star size={14} className="text-white fill-white" />
              </div>
              <h1 className="text-base font-bold text-slate-900 leading-none">ReviewInzight</h1>
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
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-800 text-white'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
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
            <div className="bg-slate-50 rounded-lg p-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-blue-800 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
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
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-100 px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={18} className="text-slate-500" />
            </button>
            <span className="text-sm text-slate-400">
              Welcome back, {session.user?.name || session.user?.email?.split('@')[0]}
            </span>
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
