'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { X, Plus, Trash2, CheckCircle, Pencil, Globe, CreditCard, User, Building2, Link2, HelpCircle, Clock } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  name: string
  subscription_plan: string
  created_at: string
  trial_ends_at?: string
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

  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState('')
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [editEmail, setEditEmail] = useState('')
  const [saving, setSaving] = useState(false)

  const [showAddBusiness, setShowAddBusiness] = useState(false)
  const [newBusinessName, setNewBusinessName] = useState('')
  const [newBusinessWebsite, setNewBusinessWebsite] = useState('')
  const [savingBusiness, setSavingBusiness] = useState(false)

  const [expandedBusinessId, setExpandedBusinessId] = useState<string | null>(null)
  const [editBusinessName, setEditBusinessName] = useState('')
  const [editBusinessWebsite, setEditBusinessWebsite] = useState('')

  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [googleConnecting, setGoogleConnecting] = useState(false)
  const [showGoogleConnectSuccess, setShowGoogleConnectSuccess] = useState(false)
  const [facebookConnecting, setFacebookConnecting] = useState(false)
  const [showFacebookConnectSuccess, setShowFacebookConnectSuccess] = useState(false)
  const [showHelpGuide, setShowHelpGuide] = useState(false)

  const isGoogleConnected = businesses.some(b => b.platform_connections?.google?.accessToken)
  const isFacebookConnected = businesses.some(b => b.platform_connections?.facebook?.pageAccessToken)

  const isTrialing = user?.subscription_plan === 'trialing'
  const trialDaysLeft = user?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(user.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  const isNewAccount = user?.created_at
    ? (Date.now() - new Date(user.created_at).getTime()) < (2 * 24 * 60 * 60 * 1000)
    : false

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

  useEffect(() => {
    const googleConnected = searchParams.get('google')
    const facebookConnected = searchParams.get('facebook')
    if (googleConnected === 'connected') {
      setShowGoogleConnectSuccess(true)
      loadBusinesses()
      window.history.replaceState({}, '', '/dashboard/settings')
    }
    if (facebookConnected === 'connected') {
      setShowFacebookConnectSuccess(true)
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
        setError('Failed to load user profile')
        setLoading(false)
        return
      }

      if (!data) {
        await supabase.from('users').insert([{
          id: userId,
          email: session.user.email,
          name: session.user.name || 'User',
          subscription_plan: 'active',
        }])
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
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const loadBusinesses = async () => {
    if (!session?.user) return
    try {
      const userId = (session.user as any).id || session.user.email
      const { data } = await supabase.from('businesses').select('*').eq('user_id', userId)
      setBusinesses(data || [])
    } catch (err) {
      console.error('Error loading businesses:', err)
    }
  }

  const handleUpdateProfile = async () => {
    if (!user || (!editName.trim() && !editEmail.trim())) return
    setSaving(true)
    try {
      const { error } = await supabase.from('users').update({ name: editName, email: editEmail }).eq('id', user.id)
      if (error) { setError('Failed to update profile'); setSaving(false); return }
      setUser({ ...user, name: editName, email: editEmail })
      setIsEditingName(false)
      setIsEditingEmail(false)
      setError('')
    } catch (err) {
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
      let businessId = businesses[0]?.id
      if (!businessId) {
        const { data: newBiz, error: bizError } = await supabase
          .from('businesses')
          .insert([{ user_id: user.id, name: 'My Business', platform_connections: {} }])
          .select().single()
        if (bizError || !newBiz) { setError('Failed to set up Google connection'); setGoogleConnecting(false); return }
        businessId = newBiz.id
        await loadBusinesses()
      }
      const response = await fetch('/api/integrations/google/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, userId: user.id }),
      })
      if (!response.ok) throw new Error('Failed to generate auth URL')
      const data = await response.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setGoogleConnecting(false)
    }
  }

  const handleConnectFacebook = async () => {
    if (!user) return
    setFacebookConnecting(true)
    setError('')
    try {
      let businessId = businesses[0]?.id
      if (!businessId) {
        const { data: newBiz, error: bizError } = await supabase
          .from('businesses')
          .insert([{ user_id: user.id, name: 'My Business', platform_connections: {} }])
          .select().single()
        if (bizError || !newBiz) { setError('Failed to set up Facebook connection'); setFacebookConnecting(false); return }
        businessId = newBiz.id
        await loadBusinesses()
      }
      const response = await fetch('/api/integrations/facebook/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, userId: user.id }),
      })
      if (!response.ok) throw new Error('Failed to generate auth URL')
      const data = await response.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setFacebookConnecting(false)
    }
  }

  const handleAddBusiness = async () => {
    if (!user || !newBusinessName.trim()) return
    setSavingBusiness(true)
    try {
      const googleConnection = businesses.find(b => b.platform_connections?.google)?.platform_connections?.google
      const platformConnections = googleConnection ? { google: googleConnection } : {}
      const { error } = await supabase.from('businesses').insert([{
        user_id: user.id, name: newBusinessName, website: newBusinessWebsite || null, platform_connections: platformConnections,
      }])
      if (error) { setError('Failed to create business'); setSavingBusiness(false); return }
      setNewBusinessName(''); setNewBusinessWebsite(''); setShowAddBusiness(false)
      await loadBusinesses()
    } catch (err) {
      setError('An error occurred')
    } finally {
      setSavingBusiness(false)
    }
  }

  const handleUpdateBusiness = async (businessId: string) => {
    setSavingBusiness(true)
    try {
      const { error } = await supabase.from('businesses').update({ name: editBusinessName, website: editBusinessWebsite || null }).eq('id', businessId)
      if (error) { setError('Failed to update business'); setSavingBusiness(false); return }
      setExpandedBusinessId(null)
      await loadBusinesses()
    } catch (err) {
      setError('An error occurred')
    } finally {
      setSavingBusiness(false)
    }
  }

  const handleDeleteBusiness = async (businessId: string) => {
    try {
      const { error } = await supabase.from('businesses').delete().eq('id', businessId)
      if (error) { setError('Failed to delete business'); return }
      setExpandedBusinessId(null)
      await loadBusinesses()
    } catch (err) {
      setError('An error occurred')
    }
  }

  const handleCancelPlan = async () => {
    if (!user) return
    setCancelLoading(true)
    setError('')
    try {
      const { error } = await supabase.from('users').update({ subscription_plan: 'cancelled', trial_ends_at: null }).eq('id', user.id)
      if (error) { setError('Failed to cancel plan'); setCancelLoading(false); return }
      setUser({ ...user, subscription_plan: 'cancelled', trial_ends_at: undefined })
      setShowCancelConfirm(false)
      setSuccessMessage(isTrialing ? 'Free trial cancelled successfully' : 'Subscription cancelled successfully')
      setTimeout(() => { signOut({ callbackUrl: '/auth/login' }) }, 2000)
    } catch (err) {
      setError('An error occurred')
    } finally {
      setCancelLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-7 h-7 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !session) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400 text-sm">Unable to load settings</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage your account, businesses, and billing</p>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-5 text-sm font-medium">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Account & Billing Row */}
        <div className="grid md:grid-cols-3 gap-5">
          {/* Account Section */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 md:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <User size={16} className="text-blue-700" />
                <h2 className="text-sm font-semibold text-slate-900">Account</h2>
              </div>
              <button
                onClick={() => setShowHelpGuide(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors"
              >
                <HelpCircle size={14} />
                Help Guide
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                {isEditingName ? (
                  <div className="flex gap-2">
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-800 text-sm text-gray-900" />
                    <button onClick={handleUpdateProfile} disabled={saving}
                      className="px-3.5 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-xs font-medium">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => { setIsEditingName(false); setEditName(user.name) }}
                      className="px-3.5 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-xs font-medium">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-700">{editName}</p>
                    <button onClick={() => setIsEditingName(true)} className="text-xs text-blue-700 hover:text-blue-800 font-medium">Edit</button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                {isEditingEmail ? (
                  <div className="flex gap-2">
                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-800 text-sm text-gray-900" />
                    <button onClick={handleUpdateProfile} disabled={saving}
                      className="px-3.5 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-xs font-medium">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => { setIsEditingEmail(false); setEditEmail(user.email) }}
                      className="px-3.5 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-xs font-medium">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-700">{editEmail}</p>
                    <button onClick={() => setIsEditingEmail(true)} className="text-xs text-blue-700 hover:text-blue-800 font-medium">Edit</button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Account Created</label>
                <p className="text-sm text-slate-700">{formatDate(user.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Billing Section */}
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex items-center gap-2.5 mb-5">
              <CreditCard size={16} className="text-emerald-600" />
              <h2 className="text-sm font-semibold text-slate-900">Billing</h2>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-[11px] text-blue-600 font-medium uppercase tracking-wider">Plan</p>
                <p className="text-sm font-semibold text-blue-800 mt-0.5">ReviewInzight Pro</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-[11px] text-blue-600 font-medium uppercase tracking-wider">Price</p>
                <p className="text-sm font-semibold text-blue-800 mt-0.5">$39.99/month</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Status</p>
                <p className={`text-sm font-semibold mt-0.5 ${
                  user.subscription_plan === 'cancelled' ? 'text-red-600' :
                  isTrialing ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {user.subscription_plan === 'cancelled' ? 'Cancelled' :
                   isTrialing ? `Free Trial (${trialDaysLeft} days left)` : 'Active'}
                </p>
              </div>

              {isTrialing && user.trial_ends_at && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <p className="text-[11px] text-amber-600 font-medium uppercase tracking-wider">Trial Ends</p>
                  <p className="text-sm font-semibold text-amber-800 mt-0.5">{formatDate(user.trial_ends_at)}</p>
                </div>
              )}

              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={user.subscription_plan === 'cancelled'}
                className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs mt-1"
              >
                {isTrialing ? 'Cancel Free Trial' : 'Cancel Subscription'}
              </button>
            </div>
          </div>
        </div>

        {/* Businesses Section */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2.5">
              <Building2 size={16} className="text-indigo-600" />
              <h2 className="text-sm font-semibold text-slate-900">Your Businesses</h2>
            </div>
            <button
              onClick={() => setShowAddBusiness(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
            >
              <Plus size={13} />
              Add Business
            </button>
          </div>

          {/* New Account Sync Message */}
          {isNewAccount && (
            <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-900 mb-0.5">Reviews Syncing</h3>
                  <p className="text-xs text-amber-700">
                    Your reviews may take a bit of time to sync when starting out. This typically completes within 24-48 hours of connecting your first account.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Google Connection */}
          <div className="mb-5 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <Link2 size={16} className="text-blue-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-0.5">Google Business Connection</h3>
                  <p className="text-xs text-blue-600/70">
                    {isGoogleConnected ? 'Connected. Reviews sync automatically.' : 'Connect to sync and manage reviews.'}
                  </p>
                </div>
              </div>
              {isGoogleConnected && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded text-[11px] font-medium text-emerald-700 flex-shrink-0">
                  <CheckCircle size={11} />
                  Connected
                </span>
              )}
            </div>

            {!isGoogleConnected && (
              <button
                onClick={handleConnectGoogle}
                disabled={googleConnecting}
                className="mt-3 px-4 py-2 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors text-xs"
              >
                {googleConnecting ? 'Connecting...' : 'Connect Google Account'}
              </button>
            )}
          </div>

          {/* Facebook Connection */}
          <div className="mb-5 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <Link2 size={16} className="text-blue-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-0.5">Facebook Business Connection</h3>
                  <p className="text-xs text-blue-600/70">
                    {isFacebookConnected ? 'Connected. Reviews sync automatically.' : 'Connect to sync and manage reviews.'}
                  </p>
                </div>
              </div>
              {isFacebookConnected && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded text-[11px] font-medium text-emerald-700 flex-shrink-0">
                  <CheckCircle size={11} />
                  Connected
                </span>
              )}
            </div>

            {!isFacebookConnected && (
              <button
                onClick={handleConnectFacebook}
                disabled={true}
                className="mt-3 px-4 py-2 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors text-xs"
              >
                Connect Facebook Account (Coming Soon)
              </button>
            )}
          </div>

          {/* Yelp Connection */}
          <div className="mb-5 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <Link2 size={16} className="text-blue-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-0.5">Yelp Business Connection</h3>
                  <p className="text-xs text-blue-600/70">
                    Connect your Yelp business profile to sync reviews and ratings.
                  </p>
                </div>
              </div>
            </div>

            <button
              disabled={true}
              className="mt-3 px-4 py-2 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors text-xs"
            >
              Connect Yelp Account (Coming Soon)
            </button>
          </div>

          {/* Add Business Form */}
          {showAddBusiness && (
            <div className="mb-5 p-4 bg-slate-50 border border-slate-200 rounded-lg animate-slide-down">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Add New Business</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Business Name *</label>
                  <input type="text" value={newBusinessName} onChange={(e) => setNewBusinessName(e.target.value)}
                    placeholder="e.g., Main Location"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-800 text-sm text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Website (Optional)</label>
                  <input type="url" value={newBusinessWebsite} onChange={(e) => setNewBusinessWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-800 text-sm text-gray-900" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddBusiness} disabled={savingBusiness || !newBusinessName.trim()}
                    className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-xs font-medium">
                    {savingBusiness ? 'Creating...' : 'Create Business'}
                  </button>
                  <button onClick={() => { setShowAddBusiness(false); setNewBusinessName(''); setNewBusinessWebsite('') }}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-xs font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Business List */}
          {businesses.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
              <Globe size={28} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No businesses added yet</p>
              <p className="text-xs text-slate-400 mt-0.5">Click &ldquo;Add Business&rdquo; to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {businesses.map((business) => (
                <div key={business.id} className="group rounded-lg border border-slate-200 bg-white hover:shadow-sm transition-shadow overflow-hidden">
                  <div className="flex items-center justify-between p-3.5">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">{business.name}</h4>
                      {business.website && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Globe size={11} className="text-slate-400 flex-shrink-0" />
                          <a href={business.website} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 truncate">{business.website}</a>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (expandedBusinessId === business.id) { setExpandedBusinessId(null) }
                        else { setExpandedBusinessId(business.id); setEditBusinessName(business.name); setEditBusinessWebsite(business.website || '') }
                      }}
                      className={`ml-3 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                        expandedBusinessId === business.id
                          ? 'bg-blue-50 text-blue-800'
                          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Pencil size={12} />
                      Edit
                    </button>
                  </div>

                  {expandedBusinessId === business.id && (
                    <div className="px-3.5 pb-3.5 border-t border-slate-100 bg-slate-50 animate-slide-down">
                      <div className="pt-3.5 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Business Name</label>
                          <input type="text" value={editBusinessName} onChange={(e) => setEditBusinessName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-800 text-sm bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Website</label>
                          <input type="url" value={editBusinessWebsite} onChange={(e) => setEditBusinessWebsite(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-800 text-sm bg-white" />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateBusiness(business.id)} disabled={savingBusiness}
                            className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-xs font-medium">
                            {savingBusiness ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button onClick={() => handleDeleteBusiness(business.id)}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" title="Delete">
                            <Trash2 size={13} />
                          </button>
                          <button onClick={() => setExpandedBusinessId(null)}
                            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-white transition-colors text-xs font-medium">
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

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full animate-scale-in border border-slate-200">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-base font-semibold text-slate-900">
                {isTrialing ? 'Cancel Free Trial?' : 'Cancel Subscription?'}
              </h2>
              <button onClick={() => setShowCancelConfirm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-5">
              {isTrialing
                ? 'Are you sure you want to cancel your free trial? You will lose access to your account immediately.'
                : 'Are you sure you want to cancel your ReviewInzight Pro subscription? You will lose access to your account.'}
            </p>
            <div className="space-y-2">
              <button onClick={handleCancelPlan} disabled={cancelLoading}
                className="w-full py-2.5 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors text-sm">
                {cancelLoading ? 'Canceling...' : isTrialing ? 'Yes, Cancel Trial' : 'Yes, Cancel Subscription'}
              </button>
              <button onClick={() => setShowCancelConfirm(false)}
                className="w-full py-2.5 px-4 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm">
                {isTrialing ? 'Keep Trial' : 'Keep Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Connection Success Modal */}
      {showGoogleConnectSuccess && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full animate-scale-in border border-slate-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                <CheckCircle size={24} className="text-emerald-600" />
              </div>
              <h2 className="text-base font-semibold text-slate-900 mb-1">Google Reviews Connected!</h2>
              <p className="text-sm text-slate-500 mb-5">
                Your Google Business account has been connected. Reviews will sync automatically.
              </p>
              <button onClick={() => setShowGoogleConnectSuccess(false)}
                className="w-full px-4 py-2.5 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Facebook Connection Success Modal */}
      {showFacebookConnectSuccess && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full animate-scale-in border border-slate-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                <CheckCircle size={24} className="text-emerald-600" />
              </div>
              <h2 className="text-base font-semibold text-slate-900 mb-1">Facebook Reviews Connected!</h2>
              <p className="text-sm text-slate-500 mb-5">
                Your Facebook Business account has been connected. Reviews will sync automatically.
              </p>
              <button onClick={() => setShowFacebookConnectSuccess(false)}
                className="w-full px-4 py-2.5 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Guide Modal */}
      {showHelpGuide && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full animate-scale-in border border-slate-200 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-blue-700" />
                <h2 className="text-base font-semibold text-slate-900">Help Guide</h2>
              </div>
              <button onClick={() => setShowHelpGuide(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Getting Started</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Add a business, connect your Google Business Profile, and start managing your reviews all from one place.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Connecting Google</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Click &ldquo;Connect Google Account&rdquo; in the Businesses section below. You&apos;ll be redirected to Google to authorize access. Once connected, reviews will sync automatically.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Managing Reviews</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Go to the Reviews tab to see all your reviews. Click &ldquo;Reply&rdquo; on any review to get AI-powered response suggestions. You can edit the suggestion before posting.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">AI Responses</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Our AI analyzes each review and generates a professional, context-aware response. You can regenerate, edit, or post the response directly.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Analytics</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  The Analytics page shows your reputation score, rating distribution, response rates, and trends over time.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Billing & Subscription</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Your subscription is managed through Stripe. You can cancel anytime from this Settings page. If you cancel, your data is preserved and you can reactivate later.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Need More Help?</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Contact us at{' '}
                  <a href="mailto:reviewinzight@gmail.com" className="text-blue-700 hover:text-blue-800 font-medium">
                    reviewinzight@gmail.com
                  </a>
                </p>
              </div>
            </div>

            <button onClick={() => setShowHelpGuide(false)}
              className="w-full mt-5 px-4 py-2.5 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

