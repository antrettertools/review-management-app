'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

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
      // Sign up with Supabase auth
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
        // Create or update user record in database
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

        // Record terms acceptance timestamp (non-blocking)
        await supabase
          .from('users')
          .update({ terms_accepted_at: new Date().toISOString() })
          .eq('id', data.user.id)

        // Store signup data and redirect to checkout
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            ReviewHub
          </Link>
          <div className="flex gap-3">
            <Link
              href="/auth/login"
              className="px-6 py-2.5 text-slate-900 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Create Your Account</h1>
          <p className="text-xl text-slate-600">Sign up to get started with ReviewHub</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-start gap-3 mt-6">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                disabled={loading}
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I have read and agree to the{' '}
                <Link href="/terms" target="_blank" className="text-blue-600 hover:underline font-medium">
                  Terms and Conditions
                </Link>
                , including the AI-Generated Content Disclaimer, Limitation of Liability, and Arbitration Agreement.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !termsAccepted}
              className="w-full px-4 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50 transition-colors mt-4"
            >
              {loading ? 'Creating account...' : 'Continue to Payment'}
            </button>
          </form>

          <p className="text-center text-slate-600 mt-6 text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              Next, you'll proceed to payment. ReviewHub is $39.99/month.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}