'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import NotificationBell from '@/components/layout/NotificationBell'
import { LayoutDashboard, MessageSquareText, BarChart3, Bell, Settings, LogOut, Menu } from 'lucide-react'

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
    return <div className="flex items-center justify-center h-screen">Loading...</div>
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
        className={`bg-white border-r border-slate-200 overflow-y-auto transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-0'
        }`}
      >
        <div className="p-6 w-64">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">ReviewHub</h1>
            <p className="text-xs text-slate-500 mt-1">Manage your business reputation</p>
          </div>

          <nav className="space-y-1 mb-8">
            {navItems.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    active
                      ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-slate-200 pt-6">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 mb-4 border border-slate-200">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Account</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{session.user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">{session.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: '/auth/login' })}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={22} className="text-slate-700" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Welcome back, {session.user?.name || session.user?.email?.split('@')[0]}
              </h2>
            </div>
          </div>
          <NotificationBell userId={(session?.user as any)?.id} />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
