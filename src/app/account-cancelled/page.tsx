'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AlertCircle, Zap, BarChart3, Clock, Trash2, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'

export default function AccountCancelledPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [deletionTermsAccepted, setDeletionTermsAccepted] = useState(false)

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
      const { data, error: dbError } = await supabase.from('users').select('*').eq('id', userId).single()
      if (dbError || !data) { setError('Failed to load account information'); setLoading(false); return }
      if (data.subscription_plan !== 'cancelled') { router.push('/dashboard'); return }
      setUser(data)
    } catch (err) {
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
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to delete account')
        setDeleting(false)
        return
      }
      await signOut({ callbackUrl: '/auth/login' })
    } catch (err) {
      setError('An error occurred while deleting your account')
      setDeleting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <Link href="/auth/login" className="text-blue-700 hover:text-blue-900 font-semibold text-sm">Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
              <Star size={16} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">ReviewInzight</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="p-8 text-center border-b border-slate-100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-orange-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                Your Subscription Has Been Cancelled
              </h1>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Your access to ReviewInzight has been paused. All your data is safely stored and will be restored when you reactivate.
              </p>
            </div>

            <div className="p-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Features You're Missing */}
              <div className="mb-8 p-5 bg-slate-50 rounded-lg border border-slate-200">
                <h2 className="text-sm font-bold text-slate-900 mb-4">You're Missing Out On:</h2>
                <div className="space-y-3">
                  {[
                    { icon: Zap, title: 'Automatic Review Syncing', desc: 'Daily automatic sync of reviews from Google Business' },
                    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Deep insights into review trends and sentiment' },
                    { icon: Clock, title: 'Smart Responses', desc: 'AI-powered response suggestions to manage your reviews' },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.title} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon size={15} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Link
                  href="/reactivate"
                  className="group p-5 bg-blue-50 border-2 border-blue-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <h3 className="text-sm font-bold text-blue-900 mb-1">Reactivate Subscription</h3>
                  <p className="text-xs text-blue-700/70">
                    Restore access to all features instantly.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-blue-900 font-bold group-hover:gap-1.5 transition-all">
                    Reactivate Now <ArrowRight size={13} />
                  </div>
                </Link>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-5 bg-red-50 border-2 border-red-200 rounded-lg hover:shadow-md hover:border-red-300 transition-all text-left"
                >
                  <h3 className="text-sm font-bold text-red-900 mb-1">Delete Account</h3>
                  <p className="text-xs text-red-700/70">
                    Permanently delete your account and all data.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-red-900 font-bold">
                    Delete Account <ArrowRight size={13} />
                  </div>
                </button>
              </div>

              <p className="text-center text-xs text-slate-400">
                Need help?{' '}
                <a href="mailto:reviewinzight@gmail.com" className="text-blue-600 hover:text-blue-800 font-semibold">Contact support</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-7 max-w-md w-full animate-scale-in border border-slate-200">
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={26} className="text-red-600" />
              </div>
            </div>

            <h2 className="text-lg font-bold text-center text-slate-900 mb-2">Delete Account?</h2>
            <p className="text-sm text-slate-500 text-center mb-4">
              This action cannot be undone. All your data will be permanently deleted.
            </p>

            <div className="flex items-start gap-3 mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg">
              <input
                type="checkbox" id="deletion-terms" checked={deletionTermsAccepted}
                onChange={(e) => setDeletionTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500"
                disabled={deleting}
              />
              <label htmlFor="deletion-terms" className="text-xs text-red-800 leading-snug">
                I understand that account deletion is permanent and irreversible. I acknowledge the{' '}
                <Link href="/terms" target="_blank" className="text-red-600 hover:underline font-semibold">Terms and Conditions</Link>
                {' '}regarding account deletion (Section 8).
              </label>
            </div>

            <div className="space-y-2">
              <button onClick={handleDeleteAccount} disabled={deleting || !deletionTermsAccepted}
                className="w-full py-2.5 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors text-sm">
                {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
              <button onClick={() => { setShowDeleteConfirm(false); setDeletionTermsAccepted(false) }} disabled={deleting}
                className="w-full py-2.5 px-4 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 disabled:opacity-50 transition-colors text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
