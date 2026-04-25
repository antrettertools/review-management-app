'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LogoIcon } from '@/components/Logo'
import { ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Supabase delivers the recovery token in the URL hash. The auth client
  // picks it up automatically and emits a PASSWORD_RECOVERY event — we wait
  // for that before letting the user submit a new password.
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setSessionReady(true)
      }
    })
    // If the user already has a session (token consumed), mark ready.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!passwordValid) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, and a number.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(updateError.message)
        return
      }
      setSuccess(true)
      setTimeout(() => router.push('/auth/login'), 2500)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon size={28} />
            <span className="text-lg font-bold text-slate-900">ReviewInzight</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Choose a new password</h1>
            <p className="text-sm text-slate-500">
              Pick something memorable but hard to guess.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-7">
            {success ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={24} className="text-emerald-600" />
                </div>
                <h2 className="text-base font-semibold text-slate-900 mb-1">Password updated</h2>
                <p className="text-sm text-slate-500">Redirecting you to sign in…</p>
              </div>
            ) : !sessionReady ? (
              <div className="text-center py-6">
                <div className="w-6 h-6 border-2 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-500">
                  Verifying reset link…
                </p>
                <p className="text-xs text-slate-400 mt-3">
                  If this hangs, your link may have expired.{' '}
                  <Link href="/auth/forgot-password" className="text-blue-700 hover:text-blue-800 font-medium">
                    Request a new one
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:border-blue-800 text-sm pr-10 text-gray-900"
                        placeholder="Create a strong password"
                        required
                        disabled={loading}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <p className={`text-[11px] mt-1.5 ${passwordValid ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {passwordValid
                        ? 'Strong password ✓'
                        : 'Use 8+ characters with uppercase, lowercase, and a number'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:border-blue-800 text-sm text-gray-900"
                      placeholder="Re-enter your new password"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !passwordValid || password !== confirm}
                    className="group w-full flex items-center justify-center gap-2 bg-blue-800 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating…
                      </>
                    ) : (
                      <>
                        Update password
                        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
