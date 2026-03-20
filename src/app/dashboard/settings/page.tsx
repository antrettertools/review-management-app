'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { X, Plus, Trash2, CheckCircle, Pencil, Globe } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  name: string
  subscription_plan: string
  created_at: string
  google_connected?: boolean
}

interface Business {
  id: string
  name: string
  website?: string
  platform_connections?: Record<string, any>
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Account editing
  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState('')
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [editEmail, setEditEmail] = useState('')
  const [saving, setSaving] = useState(false)

  // Business creation
  const [showAddBusiness, setShowAddBusiness] = useState(false)
  const [newBusinessName, setNewBusinessName] = useState('')
  const [newBusinessWebsite, setNewBusinessWebsite] = useState('')
  const [savingBusiness, setSavingBusiness] = useState(false)

  // Business editing (expandable)
  const [expandedBusinessId, setExpandedBusinessId] = useState<string | null>(null)
  const [editBusinessName, setEditBusinessName] = useState('')
  const [editBusinessWebsite, setEditBusinessWebsite] = useState('')

  // Cancel subscription
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Google connection
  const [googleConnecting, setGoogleConnecting] = useState(false)
  const [showGoogleConnectSuccess, setShowGoogleConnectSuccess] = useState(false)

  // Check if any business has Google connected
  const isGoogleConnected = businesses.some(b => b.platform_connections?.google?.accessToken)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated' && session?.user) {
      loadUser()
      loadBusinesses()
    }
  }, [status, session, router])

  // Check for Google connection success
  useEffect(() => {
    const googleConnected = searchParams.get('google')
    if (googleConnected === 'connected') {
      setShowGoogleConnectSuccess(true)
      loadBusinesses()
      window.history.replaceState({}, '', '/dashboard/settings')
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
        await supabase
          .from('users')
          .insert([
            {
              id: userId,
              email: session.user.email,
              name: session.user.name || 'User',
              subscription_plan: 'active',
            },
          ])

        setUser({
          id: userId,
          email: session.user.email || '',
          name: session.user.name || 'User',
          subscription_plan: 'active',
          created_at: new Date().toISOString(),
        })
        setEditName(session.user.name || 'User')
        setEditEmail(session.user.email || '')
      } else {
        setUser(data)
        setEditName(data.name)
        setEditEmail(data.email)
      }
    } catch (err) {
      console.error('Error loading user:', err)
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const loadBusinesses = async () => {
    if (!session?.user) return

    try {
      const userId = (session.user as any).id || session.user.email

      const { data, error: dbError } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', userId)

      if (dbError) {
        console.error('Error fetching businesses:', dbError)
        return
      }

      setBusinesses(data || [])
    } catch (err) {
      console.error('Error loading businesses:', err)
    }
  }

  const handleUpdateProfile = async () => {
    if (!user || (!editName.trim() && !editEmail.trim())) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ name: editName, email: editEmail })
        .eq('id', user.id)

      if (error) {
        setError('Failed to update profile')
        setSaving(false)
        return
      }

      setUser({ ...user, name: editName, email: editEmail })
      setIsEditingName(false)
      setIsEditingEmail(false)
      setError('')
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleConnectGoogle = async () => {
    if (!user) return

    setGoogleConnecting(true)
    setError('')

    try {
      // Use the first business, or create a default one if none exist
      let businessId = businesses[0]?.id
      if (!businessId) {
        const { data: newBiz, error: bizError } = await supabase
          .from('businesses')
          .insert([{ user_id: user.id, name: 'My Business', platform_connections: {} }])
          .select()
          .single()

        if (bizError || !newBiz) {
          setError('Failed to set up Google connection')
          setGoogleConnecting(false)
          return
        }
        businessId = newBiz.id
        await loadBusinesses()
      }

      const response = await fetch('/api/integrations/google/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate auth URL')
      }

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setGoogleConnecting(false)
    }
  }

  const handleAddBusiness = async () => {
    if (!user || !newBusinessName.trim()) return

    setSavingBusiness(true)
    try {
      // If Google is connected, copy the google connection from the first connected business
      const googleConnection = businesses.find(b => b.platform_connections?.google)?.platform_connections?.google
      const platformConnections = googleConnection ? { google: googleConnection } : {}

      const { error } = await supabase
        .from('businesses')
        .insert([
          {
            user_id: user.id,
            name: newBusinessName,
            website: newBusinessWebsite || null,
            platform_connections: platformConnections,
          },
        ])

      if (error) {
        setError('Failed to create business')
        setSavingBusiness(false)
        return
      }

      setNewBusinessName('')
      setNewBusinessWebsite('')
      setShowAddBusiness(false)
      await loadBusinesses()
    } catch (err) {
      console.error('Error creating business:', err)
      setError('An error occurred')
    } finally {
      setSavingBusiness(false)
    }
  }

  const handleUpdateBusiness = async (businessId: string) => {
    setSavingBusiness(true)
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ name: editBusinessName, website: editBusinessWebsite || null })
        .eq('id', businessId)

      if (error) {
        setError('Failed to update business')
        setSavingBusiness(false)
        return
      }

      setExpandedBusinessId(null)
      await loadBusinesses()
    } catch (err) {
      console.error('Error updating business:', err)
      setError('An error occurred')
    } finally {
      setSavingBusiness(false)
    }
  }

  const handleDeleteBusiness = async (businessId: string) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', businessId)

      if (error) {
        setError('Failed to delete business')
        return
      }

      setExpandedBusinessId(null)
      await loadBusinesses()
    } catch (err) {
      console.error('Error deleting business:', err)
      setError('An error occurred')
    }
  }

  const handleCancelPlan = async () => {
    if (!user) return

    setCancelLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('users')
        .update({ subscription_plan: 'cancelled' })
        .eq('id', user.id)

      if (error) {
        setError('Failed to cancel plan')
        setCancelLoading(false)
        return
      }

      setUser({ ...user, subscription_plan: 'cancelled' })
      setShowCancelConfirm(false)
      setSuccessMessage('Subscription cancelled successfully')

      // Log out after a short delay to show success message
      setTimeout(() => {
        signOut({ callbackUrl: '/auth/login' })
      }, 2000)
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

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Account Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Account</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Full Name</label>
              {isEditingName ? (
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
                    onClick={() => { setIsEditingName(false); setEditName(user.name) }}
                    className="px-4 py-2.5 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-slate-600">{editName}</p>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-blue-600 hover:text-blue-900 font-medium transition-colors text-sm"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Email Address</label>
              {isEditingEmail ? (
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
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
                    onClick={() => { setIsEditingEmail(false); setEditEmail(user.email) }}
                    className="px-4 py-2.5 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-slate-600">{editEmail}</p>
                  <button
                    onClick={() => setIsEditingEmail(true)}
                    className="text-blue-600 hover:text-blue-900 font-medium transition-colors text-sm"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Account Created</label>
              <p className="text-slate-600">{formatDate(user.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Businesses Section - Full Width */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 md:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Your Businesses</h2>
            <button
              onClick={() => setShowAddBusiness(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
            >
              <Plus size={18} />
              Add Business
            </button>
          </div>

          {/* Google Connection Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-1">Google Business Connection</h3>
                <p className="text-sm text-blue-800 mb-4">
                  {isGoogleConnected
                    ? 'Your Google account is connected. Reviews will sync automatically daily.'
                    : 'Connect your Google Business account to automatically sync and manage your reviews.'}
                </p>
              </div>
              {isGoogleConnected && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-100 border border-green-300 rounded-lg ml-4 whitespace-nowrap">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="text-sm font-medium text-green-700">Connected</span>
                </div>
              )}
            </div>

            {!isGoogleConnected && (
              <button
                onClick={handleConnectGoogle}
                disabled={googleConnecting}
                className="px-6 py-2.5 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50 transition-colors"
              >
                {googleConnecting ? 'Connecting...' : 'Connect Google Account'}
              </button>
            )}
          </div>

          {/* Add Business Form */}
          {showAddBusiness && (
            <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Business</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Business Name *</label>
                  <input
                    type="text"
                    value={newBusinessName}
                    onChange={(e) => setNewBusinessName(e.target.value)}
                    placeholder="e.g., Main Location, Downtown Office"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Website (Optional)</label>
                  <input
                    type="url"
                    value={newBusinessWebsite}
                    onChange={(e) => setNewBusinessWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleAddBusiness}
                    disabled={savingBusiness || !newBusinessName.trim()}
                    className="px-6 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors font-medium"
                  >
                    {savingBusiness ? 'Creating...' : 'Create Business'}
                  </button>
                  <button
                    onClick={() => { setShowAddBusiness(false); setNewBusinessName(''); setNewBusinessWebsite('') }}
                    className="px-6 py-2.5 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-100 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Business List */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {businesses.length === 0 ? 'No Businesses Yet' : `${businesses.length} Business${businesses.length !== 1 ? 'es' : ''}`}
            </h3>

            {businesses.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                <Globe size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 mb-2">No businesses added yet</p>
                <p className="text-sm text-slate-500">Click "Add Business" above to get started</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {businesses.map((business) => (
                  <div key={business.id} className="group rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all overflow-hidden">
                    {/* Business header row */}
                    <div className="flex items-center justify-between p-5">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-slate-900 truncate">{business.name}</h4>
                        {business.website && (
                          <div className="flex items-center gap-2 mt-2">
                            <Globe size={14} className="text-slate-400 flex-shrink-0" />
                            <a
                              href={business.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 truncate"
                            >
                              {business.website}
                            </a>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (expandedBusinessId === business.id) {
                            setExpandedBusinessId(null)
                          } else {
                            setExpandedBusinessId(business.id)
                            setEditBusinessName(business.name)
                            setEditBusinessWebsite(business.website || '')
                          }
                        }}
                        className={`ml-4 flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                          expandedBusinessId === business.id
                            ? 'bg-blue-100 text-blue-900'
                            : 'text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Pencil size={16} />
                        <span className="text-sm">Edit</span>
                      </button>
                    </div>

                    {/* Expanded edit panel */}
                    {expandedBusinessId === business.id && (
                      <div className="px-5 pb-5 border-t border-slate-200 bg-slate-50">
                        <div className="pt-5 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Business Name</label>
                            <input
                              type="text"
                              value={editBusinessName}
                              onChange={(e) => setEditBusinessName(e.target.value)}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                            <input
                              type="url"
                              value={editBusinessWebsite}
                              onChange={(e) => setEditBusinessWebsite(e.target.value)}
                              placeholder="https://example.com"
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                            />
                          </div>
                          <div className="flex gap-3 pt-3">
                            <button
                              onClick={() => handleUpdateBusiness(business.id)}
                              disabled={savingBusiness}
                              className="flex-1 px-4 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors font-medium"
                            >
                              {savingBusiness ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                              onClick={() => handleDeleteBusiness(business.id)}
                              className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                              title="Delete business"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => setExpandedBusinessId(null)}
                              className="px-4 py-2.5 border border-slate-300 text-slate-900 rounded-lg hover:bg-white transition-colors font-medium"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Billing Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Billing</h2>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-medium">Plan</p>
              <p className="text-lg font-bold text-blue-900 mt-1">ReviewHub Pro</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-medium">Price</p>
              <p className="text-lg font-bold text-blue-900 mt-1">$39.99/month</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-sm text-slate-600 font-medium">Status</p>
              <p className="text-lg font-bold text-green-600 mt-1">
                {user.subscription_plan === 'cancelled' ? 'Cancelled' : 'Active'}
              </p>
            </div>

            <button
              onClick={() => setShowCancelConfirm(true)}
              disabled={user.subscription_plan === 'cancelled'}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
            >
              Cancel Plan
            </button>
          </div>
        </div>
      </div>

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
              Are you sure you want to cancel your ReviewHub Pro subscription? You will lose access to your account.
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

      {/* Google Connection Success Modal */}
      {showGoogleConnectSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <CheckCircle size={56} className="text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Google Reviews Connected!</h2>
              <p className="text-slate-600 mb-6">
                Your Google Business account has been successfully connected. Reviews will sync automatically.
              </p>
              <button
                onClick={() => setShowGoogleConnectSuccess(false)}
                className="w-full px-4 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
