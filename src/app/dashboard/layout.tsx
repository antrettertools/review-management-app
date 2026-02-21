'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-6 shadow-lg overflow-y-auto">
        <h1 className="text-2xl font-bold mb-8">Review Manager</h1>

        <nav className="space-y-4">
          <Link
            href="/dashboard"
            className="block px-4 py-2 rounded hover:bg-blue-800 transition"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/dashboard/reviews"
            className="block px-4 py-2 rounded hover:bg-blue-800 transition"
          >
            📝 Reviews
          </Link>
          <Link
            href="/dashboard/analytics"
            className="block px-4 py-2 rounded hover:bg-blue-800 transition"
          >
            📈 Analytics
          </Link>
          <Link
            href="/dashboard/notifications"
            className="block px-4 py-2 rounded hover:bg-blue-800 transition"
          >
            🔔 Notifications
          </Link>
          <Link
            href="/dashboard/settings"
            className="block px-4 py-2 rounded hover:bg-blue-800 transition"
          >
            ⚙️ Settings
          </Link>
          <Link
            href="/pricing"
            className="block px-4 py-2 rounded hover:bg-blue-800 transition"
          >
            💳 Upgrade Plan
          </Link>
        </nav>

        <div className="mt-8 pt-8 border-t border-blue-800">
          <p className="text-sm text-blue-200 mb-4">{session.user?.email}</p>
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/auth/login' })}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome, {session.user?.name || session.user?.email}
            </h2>
            <NotificationBell userId={(session?.user as any)?.id} />
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}