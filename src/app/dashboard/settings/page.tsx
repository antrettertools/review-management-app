'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { X, Plus, Trash2, CheckCircle, Pencil, Globe, CreditCard, User, Building2, Link2 } from 'lucide-react'

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
      const { error } = await supabase.from('users').update({ subscription_plan: 'cancelled' }).eq('id', user.id)
      if (error) { setError('Failed to cancel plan'); setCancelLoading(false); return }
      setUser({ ...user, subscription_plan: 'cancelled' })
      setShowCancelConfirm(false)
      setSuccessMessage('Subscription cancelled successfully')
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
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading settings...</p>
        </div>
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
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your account, businesses, and billing</p>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-fade-in-up">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-fade-in-up">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Account & Billing Row */}
        <div className="grid md:grid-cols-3 gap-5">
          {/* Account Section */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/60 md:col-span-2 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                <User size={16} className="text-blue-700" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Account</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                {isEditingName ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-sm bg-slate-50/50"
                    />
                    <button onClick={handleUpdateProfile} disabled={saving}
                      className="px-4 py-2.5 bg-gradient-to-b from-blue-800 to-blue-900 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all font-semibold text-xs shadow-sm">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => { setIsEditingName(false); setEditName(user.name) }}
                      className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-xs">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-700 font-medium">{editName}</p>
                    <button onClick={() => setIsEditingName(true)}
                      className="text-xs text-blue-700 hover:text-blue-900 font-semibold transition-colors">
                      Edit
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                {isEditingEmail ? (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-sm bg-slate-50/50"
                    />
                    <button onClick={handleUpdateProfile} disabled={saving}
                      className="px-4 py-2.5 bg-gradient-to-b from-blue-800 to-blue-900 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all font-semibold text-xs shadow-sm">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => { setIsEditingEmail(false); setEditEmail(user.email) }}
                      className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-xs">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-700 font-medium">{editEmail}</p>
                    <button onClick={() => setIsEditingEmail(true)}
                      className="text-xs text-blue-700 hover:text-blue-900 font-semibold transition-colors">
                      Edit
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account Created</label>
                <p className="text-sm text-slate-700 font-medium">{formatDate(user.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Billing Section */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/60 animate-fade-in-up delay-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CreditCard size={16} className="text-emerald-700" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Billing</h2>
            </div>

            <div className="space-y-3.5">
              <div className="p-3.5 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-100 rounded-xl">
                <p className="text-[11px] text-blue-600 font-semibold uppercase tracking-wider">Plan</p>
                <p className="text-sm font-bold text-blue-900 mt-0.5">ReviewHub Pro</p>
              </div>

              <div className="p-3.5 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-100 rounded-xl">
                <p className="text-[11px] text-blue-600 font-semibold uppercase tracking-wider">Price</p>
                <p className="text-sm font-bold text-blue-900 mt-0.5">$39.99/month</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Status</p>
                <p className={`text-sm font-bold mt-0.5 ${user.subscription_plan === 'cancelled' ? 'text-red-600' : 'text-emerald-600'}`}>
                  {user.subscription_plan === 'cancelled' ? 'Cancelled' : 'Active'}
                </p>
              </div>

              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={user.subscription_plan === 'cancelled'}
                className="w-full px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs mt-2"
              >
                Cancel Plan
              </button>
            </div>
          </div>
        </div>

        {/* Businesses Section */}
        <div className="bg-white rounded-2xl p-7 border border-slate-200/60 animate-fade-in-up delay-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Building2 size={16} className="text-indigo-700" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Your Businesses</h2>
            </div>
            <button
              onClick={() => setShowAddBusiness(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-b from-blue-800 to-blue-900 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold text-xs shadow-sm shadow-blue-900/20"
            >
              <Plus size={14} />
              Add Business
            </button>
          </div>

          {/* Google Connection */}
          <div className="mb-6 p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/60 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Link2 size={16} className="text-blue-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-900 mb-0.5">Google Business Connection</h3>
                  <p className="text-xs text-blue-700/70">
                    {isGoogleConnected
                      ? 'Connected. Reviews will sync automatically.'
                      : 'Connect to automatically sync and manage reviews.'}
                  </p>
                </div>
              </div>
              {isGoogleConnected && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] font-semibold text-emerald-700 flex-shrink-0">
                  <CheckCircle size={11} />
                  Connected
                </span>
              )}
            </div>

            {!isGoogleConnected && (
              <button
                onClick={handleConnectGoogle}
                disabled={googleConnecting}
                className="mt-3 px-4 py-2.5 bg-gradient-to-b from-blue-800 to-blue-900 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all text-xs shadow-sm"
              >
                {googleConnecting ? 'Connecting...' : 'Connect Google Account'}
              </button>
            )}
          </div>

          {/* Add Business Form */}
          {showAddBusiness && (
            <div className="mb-6 p-5 bg-slate-50 border border-slate-200/60 rounded-xl animate-slide-down">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Add New Business</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Business Name *</label>
                  <input type="text" value={newBusinessName} onChange={(e) => setNewBusinessName(e.target.value)}
                    placeholder="e.g., Main Location, Downtown Office"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Website (Optional)</label>
                  <input type="url" value={newBusinessWebsite} onChange={(e) => setNewBusinessWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-sm bg-white" />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={handleAddBusiness} disabled={savingBusiness || !newBusinessName.trim()}
                    className="px-4 py-2.5 bg-gradient-to-b from-blue-800 to-blue-900 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all font-semibold text-xs shadow-sm">
                    {savingBusiness ? 'Creating...' : 'Create Business'}
                  </button>
                  <button onClick={() => { setShowAddBusiness(false); setNewBusinessName(''); setNewBusinessWebsite('') }}
                    className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-white transition-colors font-semibold text-xs">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Business List */}
          {businesses.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
              <Globe size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">No businesses added yet</p>
              <p className="text-xs text-slate-400 mt-1">Click "Add Business" above to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {businesses.map((business) => (
                <div key={business.id} className="group rounded-xl border border-slate-200/60 bg-white hover:shadow-sm transition-all overflow-hidden">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{business.name}</h4>
                      {business.website && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Globe size={12} className="text-slate-400 flex-shrink-0" />
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
                      className={`ml-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                        expandedBusinessId === business.id
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Pencil size={13} />
                      Edit
                    </button>
                  </div>

                  {expandedBusinessId === business.id && (
                    <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50/50 animate-slide-down">
                      <div className="pt-4 space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Business Name</label>
                          <input type="text" value={editBusinessName} onChange={(e) => setEditBusinessName(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-sm bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Website</label>
                          <input type="url" value={editBusinessWebsite} onChange={(e) => setEditBusinessWebsite(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-sm bg-white" />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => handleUpdateBusiness(business.id)} disabled={savingBusiness}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-b from-blue-800 to-blue-900 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all font-semibold text-xs shadow-sm">
                            {savingBusiness ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button onClick={() => handleDeleteBusiness(business.id)}
                            className="px-3 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                            title="Delete business">
                            <Trash2 size={14} />
                          </button>
                          <button onClick={() => setExpandedBusinessId(null)}
                            className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-white transition-colors font-semibold text-xs">
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full animate-scale-in border border-slate-200/60">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-slate-900">Cancel Subscription?</h2>
              <button onClick={() => setShowCancelConfirm(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to cancel your ReviewHub Pro subscription? You will lose access to your account.
            </p>
            <div className="space-y-2">
              <button onClick={handleCancelPlan} disabled={cancelLoading}
                className="w-full py-2.5 px-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors text-sm">
                {cancelLoading ? 'Canceling...' : 'Yes, Cancel Subscription'}
              </button>
              <button onClick={() => setShowCancelConfirm(false)}
                className="w-full py-2.5 px-4 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors text-sm">
                Keep Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Connection Success Modal */}
      {showGoogleConnectSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full animate-scale-in border border-slate-200/60">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Google Reviews Connected!</h2>
              <p className="text-sm text-slate-500 mb-6">
                Your Google Business account has been successfully connected. Reviews will sync automatically.
              </p>
              <button onClick={() => setShowGoogleConnectSuccess(false)}
                className="w-full px-4 py-2.5 bg-gradient-to-b from-blue-800 to-blue-900 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all text-sm shadow-sm">
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
