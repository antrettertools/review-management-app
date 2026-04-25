'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { LogoIcon } from '@/components/Logo'
import { ArrowRight, CheckCircle, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const redirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}/auth/reset-password`
          : undefined

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (resetError) {
        // Don't leak whether the email exists — show success either way to prevent
        // user enumeration attacks. We log internally so you can detect abuse.
        console.warn('Password reset error:', resetError.message)
      }

      setSent(true)
    } catch (err) {
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
          <Link
            href="/auth/login"
            className="px-4 py-2 text-slate-600 font-medium hover:text-slate-900 rounded-lg transition-colors text-sm"
          >
            Sign In
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Reset your password</h1>
            <p className="text-sm text-slate-500">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-7">
            {sent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={24} className="text-emerald-600" />
                </div>
                <h2 className="text-base font-semibold text-slate-900 mb-1">Check your inbox</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  If <span className="font-medium text-slate-700">{email}</span> is associated with
                  an account, we&apos;ve sent a password reset link. The link expires in 1 hour.
                </p>
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <Mail size={12} />
                  <span>Didn&apos;t get it? Check your spam folder.</span>
                </div>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-900"
                >
                  Back to sign in
                </Link>
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
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:border-blue-800 text-sm text-gray-900"
                      placeholder="you@example.com"
                      required
                      disabled={loading}
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full flex items-center justify-center gap-2 bg-blue-800 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending link...
                      </>
                    ) : (
                      <>
                        Send reset link
                        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-5 pt-5 border-t border-slate-100 text-center">
                  <p className="text-sm text-slate-500">
                    Remember your password?{' '}
                    <Link href="/auth/login" className="text-blue-700 hover:text-blue-800 font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
