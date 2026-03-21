'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Star, ArrowRight, Eye, EyeOff, Shield } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!termsAccepted) {
      setError('You must accept the Terms and Conditions to create an account.')
      setLoading(false)
      return
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        const { error: dbError } = await supabase
          .from('users')
          .upsert(
            [
              {
                id: data.user.id,
                email,
                name,
                subscription_plan: 'pending',
              },
            ],
            { onConflict: 'id' }
          )

        if (dbError) {
          setError('Failed to create account profile. Please try again.')
          setLoading(false)
          return
        }

        await supabase
          .from('users')
          .update({ terms_accepted_at: new Date().toISOString() })
          .eq('id', data.user.id)

        const signupData = {
          userId: data.user.id,
          email,
          name,
        }

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('signupData', JSON.stringify(signupData))
        }

        setTimeout(() => {
          router.push('/checkout')
        }, 300)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-indigo-700 rounded-lg flex items-center justify-center">
              <Star size={16} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">ReviewHub</span>
          </Link>
          <Link
            href="/auth/login"
            className="px-5 py-2.5 text-slate-700 font-medium hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all text-sm"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Create Your Account</h1>
            <p className="text-slate-500">Get started with ReviewHub in minutes</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-8 animate-fade-in-up delay-100">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-sm bg-slate-50/50"
                  placeholder="John Smith"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-sm bg-slate-50/50"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-sm bg-slate-50/50 pr-11"
                    placeholder="Create a strong password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                  disabled={loading}
                />
                <label htmlFor="terms" className="text-sm text-slate-500 leading-snug">
                  I have read and agree to the{' '}
                  <Link href="/terms" target="_blank" className="text-blue-700 hover:text-blue-900 font-semibold transition-colors">
                    Terms and Conditions
                  </Link>
                  , including the AI-Generated Content Disclaimer, Limitation of Liability, and Arbitration Agreement.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !termsAccepted}
                className="group w-full flex items-center justify-center gap-2 bg-gradient-to-b from-blue-800 to-blue-900 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-md shadow-blue-900/20 text-sm mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Continue to Payment
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-700 hover:text-blue-900 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Price hint */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400 animate-fade-in-up delay-200">
            <Shield size={14} />
            <span>You'll proceed to secure checkout. $39.99/month.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
