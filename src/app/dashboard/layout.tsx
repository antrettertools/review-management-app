'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import NotificationBell from '@/components/layout/NotificationBell'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
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

          <nav className="space-y-2 mb-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium bg-white hover:shadow-md"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/reviews"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium bg-white hover:shadow-md"
            >
              Reviews
            </Link>
            <Link
              href="/dashboard/analytics"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium bg-white hover:shadow-md"
            >
              Analytics
            </Link>
            <Link
              href="/dashboard/notifications"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium bg-white hover:shadow-md"
            >
              Notifications
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium bg-white hover:shadow-md"
            >
              Settings
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium bg-white hover:shadow-md"
            >
              Upgrade
            </Link>
          </nav>

          <div className="border-t border-slate-200 pt-6">
            <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Account</p>
              <p className="text-sm font-medium text-slate-900 truncate">{session.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: '/auth/login' })}
              className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors bg-white hover:shadow-md"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-slate-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
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