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
        options: { data: { name } },
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        const { error: dbError } = await supabase
          .from('users')
          .upsert([{ id: data.user.id, email, name, subscription_plan: 'pending' }], { onConflict: 'id' })

        if (dbError) {
          setError('Failed to create account profile. Please try again.')
          setLoading(false)
          return
        }

        await supabase.from('users').update({ terms_accepted_at: new Date().toISOString() }).eq('id', data.user.id)

        const signupData = { userId: data.user.id, email, name }
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('signupData', JSON.stringify(signupData))
        }

        setTimeout(() => { router.push('/checkout') }, 300)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-800 rounded-lg flex items-center justify-center">
              <Star size={14} className="text-white fill-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">ReviewInzight</span>
          </Link>
          <Link href="/auth/login" className="px-4 py-2 text-slate-600 font-medium hover:text-slate-900 rounded-lg transition-colors text-sm">
            Sign In
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Create Your Account</h1>
            <p className="text-sm text-slate-500">Start your 7-day free trial</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-7">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:border-blue-800 text-sm"
                  placeholder="John Smith" required disabled={loading} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:border-blue-800 text-sm"
                  placeholder="you@example.com" required disabled={loading} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:border-blue-800 text-sm pr-10"
                    placeholder="Create a strong password" required disabled={loading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-800 focus:ring-blue-800" disabled={loading} />
                <label htmlFor="terms" className="text-sm text-slate-500 leading-snug">
                  I agree to the{' '}
                  <Link href="/terms" target="_blank" className="text-blue-700 hover:text-blue-800 font-medium">Terms and Conditions</Link>
                </label>
              </div>

              <button type="submit" disabled={loading || !termsAccepted}
                className="group w-full flex items-center justify-center gap-2 bg-blue-800 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm mt-1">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Continue to Payment
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-700 hover:text-blue-800 font-medium">Sign in</Link>
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-slate-400">
            <Shield size={13} />
            <span>7-day free trial. Credit card required. Then $39.99/mo.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
