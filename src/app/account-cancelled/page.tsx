'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AlertCircle, Zap, BarChart3, Clock, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function AccountCancelledPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated' && session?.user) {
      loadUser()
    }
  }, [status, session, router])

  const loadUser = async () => {
    if (!session?.user) return

    try {
      const userId = (session.user as any).id || session.user.email

      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (dbError || !data) {
        setError('Failed to load account information')
        setLoading(false)
        return
      }

      // If subscription is not cancelled, redirect to dashboard
      if (data.subscription_plan !== 'cancelled') {
        router.push('/dashboard')
        return
      }

      setUser(data)
    } catch (err) {
      console.error('Error loading user:', err)
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    setDeleting(true)
    setError('')

    try {
      // Delete all businesses for this user
      await supabase
        .from('businesses')
        .delete()
        .eq('user_id', user.id)

      // Delete user
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id)

      if (deleteError) {
        setError('Failed to delete account')
        setDeleting(false)
        return
      }

      // Sign out and redirect to login
      await signOut({ callbackUrl: '/auth/login' })
    } catch (err) {
      console.error('Error deleting account:', err)
      setError('An error occurred while deleting your account')
      setDeleting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-slate-600">Loading...</div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <AlertCircle size={64} className="text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Your Subscription Has Been Cancelled
            </h1>
            <p className="text-slate-600 max-w-md mx-auto">
              Your access to ReviewHub has been paused. All your data and review history is safely stored and will be restored when you reactivate.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Features You're Missing */}
          <div className="mb-8 p-6 bg-slate-50 rounded-xl">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">You're Missing Out On:</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Zap size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-slate-900">Automatic Review Syncing</p>
                  <p className="text-sm text-slate-600">Daily automatic sync of reviews from Google Business</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-slate-900">Advanced Analytics</p>
                  <p className="text-sm text-slate-600">Deep insights into review trends and sentiment</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-slate-900">Smart Responses</p>
                  <p className="text-sm text-slate-600">AI-powered response suggestions to manage your reviews</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Reactivate Button */}
            <Link
              href="/reactivate"
              className="block p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-900 rounded-xl hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-bold text-blue-900 mb-2">Reactivate Subscription</h3>
              <p className="text-sm text-blue-800">
                Restore your subscription and regain access to all features instantly.
              </p>
              <div className="mt-4 inline-flex items-center text-blue-900 font-semibold">
                Reactivate Now →
              </div>
            </Link>

            {/* Delete Account Button */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-900 rounded-xl hover:shadow-lg transition-shadow text-left"
            >
              <h3 className="text-lg font-bold text-red-900 mb-2">Delete Account</h3>
              <p className="text-sm text-red-800">
                Permanently delete your account and all associated data.
              </p>
              <div className="mt-4 inline-flex items-center text-red-900 font-semibold">
                Delete Account →
              </div>
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-center text-sm text-slate-500">
            Need help?{' '}
            <a href="mailto:support@reviewhub.com" className="text-blue-600 hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 size={32} className="text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-900 mb-3">
              Delete Account?
            </h2>

            <p className="text-slate-600 text-center mb-6">
              This action cannot be undone. All your data, including businesses, reviews, and settings will be permanently deleted.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="w-full py-3 px-4 border border-slate-300 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
