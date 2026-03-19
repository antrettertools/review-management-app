'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { X, Plus, Trash2 } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  name: string
  subscription_plan: string
  created_at: string
}

interface Business {
  id: string
  name: string
  platform_connections?: Record<string, any>
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
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
  const [savingBusiness, setSavingBusiness] = useState(false)

  // Cancel subscription
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

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

  const handleAddBusiness = async () => {
    if (!user || !newBusinessName.trim()) return

    setSavingBusiness(true)
    try {
      const { error } = await supabase
        .from('businesses')
        .insert([
          {
            user_id: user.id,
            name: newBusinessName,
            platform_connections: {},
          },
        ])

      if (error) {
        setError('Failed to create business')
        setSavingBusiness(false)
        return
      }

      setNewBusinessName('')
      setShowAddBusiness(false)
      await loadBusinesses()
    } catch (err) {
      console.error('Error creating business:', err)
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

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Three Column Layout */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Account Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Account</h2>

          <div className="space-y-6">
            {/* Full Name */}
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
                    onClick={() => {
                      setIsEditingName(false)
                      setEditName(user.name)
                    }}
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

            {/* Email Address */}
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
                    onClick={() => {
                      setIsEditingEmail(false)
                      setEditEmail(user.email)
                    }}
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

            {/* Account Created */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Account Created</label>
              <p className="text-slate-600">{formatDate(user.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Businesses Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Businesses</h2>
            <button
              onClick={() => setShowAddBusiness(true)}
              className="p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          {showAddBusiness && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <input
                type="text"
                value={newBusinessName}
                onChange={(e) => setNewBusinessName(e.target.value)}
                placeholder="Business name"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddBusiness}
                  disabled={savingBusiness}
                  className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors font-medium text-sm"
                >
                  {savingBusiness ? 'Creating...' : 'Create'}
                </button>
                <button
                  onClick={() => setShowAddBusiness(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {businesses.length === 0 ? (
              <p className="text-slate-500 text-sm">No businesses added yet</p>
            ) : (
              businesses.map((business) => (
                <div key={business.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-medium text-slate-900">{business.name}</p>
                    <button
                      onClick={() => handleDeleteBusiness(business.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-900 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors font-medium">
                      Connect Google Reviews
                    </button>
                    <div className="px-3 py-2 text-xs bg-slate-100 text-slate-600 rounded-lg border border-slate-200 text-center">
                      Yelp — Coming Soon
                    </div>
                  </div>
                </div>
              ))
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
              <p className="text-lg font-bold text-blue-900 mt-1">$49.99/month</p>
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
    </div>
  )
}
