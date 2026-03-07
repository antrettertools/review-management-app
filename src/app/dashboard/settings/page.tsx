'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { X, Zap } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  name: string
  subscription_plan: string
  created_at: string
  trial_ends_at?: string
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('account')
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [saving, setSaving] = useState(false)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated' && session?.user) {
      loadUser()
    }
  }, [status, session, router])

  // Check if payment was successful and refresh
  useEffect(() => {
    const paymentSuccess = searchParams.get('payment')
    if (paymentSuccess === 'success') {
      setSuccessMessage('Payment successful! Updating your plan...')
      setActiveTab('billing')
      
      // Refresh immediately
      setTimeout(() => {
        loadUser()
      }, 500)
      
      // Also refresh after 3 seconds to ensure webhook has processed
      setTimeout(() => {
        loadUser()
      }, 3000)
    }
  }, [searchParams])

  const loadUser = async () => {
    if (!session?.user) return

    try {
      const userId = (session.user as any).id || session.user.email

      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (dbError && dbError.code !== 'PGRST116') {
        console.error('Error fetching user:', dbError)
        setError('Failed to load user profile')
        setLoading(false)
        return
      }

      if (!data) {
        const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        await supabase
          .from('users')
          .insert([
            {
              id: userId,
              email: session.user.email,
              name: session.user.name || 'User',
              subscription_plan: 'starter',
              trial_ends_at: trialEndsAt,
            },
          ])

        setUser({
          id: userId,
          email: session.user.email || '',
          name: session.user.name || 'User',
          subscription_plan: 'starter',
          created_at: new Date().toISOString(),
          trial_ends_at: trialEndsAt,
        })
        setEditName(session.user.name || 'User')
      } else {
        setUser(data)
        setEditName(data.name)
        if (successMessage && data.subscription_plan === 'advanced') {
          setSuccessMessage('Successfully upgraded to Advanced plan!')
        }
      }
    } catch (err) {
      console.error('Error loading user:', err)
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (!user || !editName.trim()) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ name: editName })
        .eq('id', user.id)

      if (error) {
        setError('Failed to update profile')
        return
      }

      setUser({ ...user, name: editName })
      setIsEditing(false)
      setError('')
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleUpgrade = async () => {
    if (!user) return
    
    setUpgradeLoading(true)
    setError('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'advanced',
          priceId: process.env.NEXT_PUBLIC_STRIPE_ADVANCED_PRICE_ID,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setUpgradeLoading(false)
    }
  }

  const handleCancelPlan = async () => {
    if (!user) return
    
    setCancelLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('users')
        .update({ subscription_plan: 'starter' })
        .eq('id', user.id)

      if (error) {
        setError('Failed to cancel plan')
        return
      }

      setUser({ ...user, subscription_plan: 'starter' })
      setShowCancelConfirm(false)
      setSuccessMessage('Subscription cancelled. You are now on the Starter plan.')
    } catch (err) {
      console.error('Error canceling plan:', err)
      setError('An error occurred')
    } finally {
      setCancelLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const isTrialExpired = user?.trial_ends_at 
    ? new Date(user.trial_ends_at) < new Date()
    : false

  const daysRemaining = user?.trial_ends_at
    ? Math.ceil((new Date(user.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 'Free',
      description: '7-day trial',
      features: ['1 Business', '5 AI responses/day', '30-day analytics', 'Basic support'],
    },
    {
      id: 'advanced',
      name: 'Advanced',
      price: '$49.99',
      description: '/month',
      features: ['Unlimited businesses', 'Unlimited AI responses', '1-year analytics', 'Priority support', 'Custom templates'],
    },
  ]

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-8 text-slate-600">
        Loading...
      </div>
    )
  }

  if (!user || !session) {
    return (
      <div className="flex items-center justify-center py-8 text-slate-600">
        Unable to load settings
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Settings</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-200">
        {[
          { id: 'account', label: 'Account' },
          { id: 'billing', label: 'Billing & Plan' },
          { id: 'upgrade', label: 'Plans' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-blue-900 border-blue-900'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Full Name</label>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                  <button
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="px-4 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors font-medium"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setEditName(user.name)
                    }}
                    className="px-4 py-2.5 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-slate-600">{user.name}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Email Address</label>
              <p className="text-slate-600">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Account Created</label>
              <p className="text-slate-600">{formatDate(user.created_at)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Billing & Plan</h2>

          <div className="space-y-6">
            <div className="border-2 border-slate-200 rounded-xl p-6 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {plans.find(p => p.id === user.subscription_plan)?.name}
                  </h3>
                  <p className="text-slate-600 mt-1">
                    {plans.find(p => p.id === user.subscription_plan)?.description}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Active
                </span>
              </div>

              {user.subscription_plan === 'starter' && user.trial_ends_at && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  {isTrialExpired ? (
                    <p className="text-sm text-blue-900 font-medium">
                      Your trial has expired. Upgrade to continue using ReviewHub.
                    </p>
                  ) : (
                    <p className="text-sm text-blue-900">
                      Trial ends on <strong>{formatDate(user.trial_ends_at)}</strong><br/>
                      <span className="text-sm">{daysRemaining} days remaining</span>
                    </p>
                  )}
                </div>
              )}

              {user.subscription_plan === 'advanced' && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                  >
                    Cancel Subscription
                  </button>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Plan Includes</h3>
              <ul className="space-y-2">
                {plans.find(p => p.id === user.subscription_plan)?.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-slate-700">
                    <span className="text-green-600 font-bold">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'upgrade' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Choose Your Plan</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl border-2 p-8 transition-all ${
                    user.subscription_plan === plan.id
                      ? 'border-blue-900 bg-blue-50 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                    <div className="mt-3">
                      <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                      <span className="text-slate-600 ml-2">{plan.description}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-slate-700">
                        <span className="text-green-600 font-bold mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {user.subscription_plan === plan.id ? (
                    <button
                      disabled
                      className="w-full py-3 px-4 bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                  ) : plan.id === 'advanced' ? (
                    <button
                      onClick={handleUpgrade}
                      disabled={upgradeLoading}
                      className="w-full py-3 px-4 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Zap size={18} />
                      {upgradeLoading ? 'Processing...' : 'Upgrade Now'}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Upgrade to Advanced
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Secure Payment</h3>
            <p className="text-sm text-blue-900">
              Upgrades are processed securely through Stripe. You can cancel your subscription anytime from the Billing & Plan tab.
            </p>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Cancel Subscription?</h2>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-slate-600 mb-6">
              Are you sure you want to cancel your Advanced subscription? You'll be downgraded to the Starter plan immediately.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleCancelPlan}
                disabled={cancelLoading}
                className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {cancelLoading ? 'Canceling...' : 'Yes, Cancel Subscription'}
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="w-full py-3 px-4 border border-slate-300 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Keep Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}