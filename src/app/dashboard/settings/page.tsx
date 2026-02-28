'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'
import GoogleConnect from '@/components/integrations/GoogleConnect'
import { canCreateBusiness } from '@/lib/plan-features'

interface Business {
  id: string
  name: string
  description: string
  website: string
  logo_url: string
  is_active: boolean
  platform_connections?: {
    google?: {
      accessToken: string
      refreshToken: string
      connectedAt: string
    }
  }
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
  })
  const [userPlan, setUserPlan] = useState<'starter' | 'advanced'>('starter')

  useEffect(() => {
    if ((session?.user as any)?.id) {
      fetchBusinesses()
      fetchUserPlan()
    }
  }, [session])

  const fetchUserPlan = async () => {
    try {
      const { data } = await supabase
        .from('users')
        .select('subscription_plan')
        .eq('id', (session?.user as any)?.id)
        .single()

      if (data) {
        setUserPlan(data.subscription_plan || 'starter')
      }
    } catch (error) {
      console.error('Error fetching plan:', error)
    }
  }

  const fetchBusinesses = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', (session?.user as any)?.id)

      setBusinesses(data || [])
    } catch (error) {
      console.error('Error fetching businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check plan limits
    if (!canCreateBusiness(userPlan, businesses.length)) {
      alert(`Your ${userPlan} plan allows only 1 business. Upgrade to Advanced to add more.`)
      return
    }

    try {
      const { error } = await supabase.from('businesses').insert([
        {
          user_id: (session?.user as any)?.id,
          name: formData.name,
          description: formData.description,
          website: formData.website,
          is_active: true,
        },
      ])

      if (error) {
        alert('Error creating business: ' + error.message)
        return
      }

      setFormData({ name: '', description: '', website: '' })
      setShowAddForm(false)
      fetchBusinesses()
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create business')
    }
  }

  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', businessId)

      if (error) {
        alert('Error deleting business: ' + error.message)
        return
      }

      fetchBusinesses()
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to delete business')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Settings</h1>

      {/* Plan Info */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-slate-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Current Plan</h2>
            <p className="text-slate-600 mt-1 capitalize">{userPlan} Plan</p>
          </div>
          <a href="/pricing" className="px-6 py-2.5 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors">
            Upgrade
          </a>
        </div>
      </div>

      {/* Businesses Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-900">My Businesses</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={!canCreateBusiness(userPlan, businesses.length)}
            className={`font-semibold py-2.5 px-4 rounded-lg transition-colors ${
              canCreateBusiness(userPlan, businesses.length)
                ? 'bg-blue-900 text-white hover:bg-blue-800'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            {showAddForm ? 'Cancel' : 'Add Business'}
          </button>
        </div>

        {!canCreateBusiness(userPlan, businesses.length) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              You've reached the business limit for your {userPlan} plan. 
              <a href="/pricing" className="font-semibold hover:underline ml-1">Upgrade to Advanced</a> to add more businesses.
            </p>
          </div>
        )}

        {/* Add Business Form */}
        {showAddForm && (
          <form onSubmit={handleAddBusiness} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Create Business
              </button>
            </div>
          </form>
        )}

        {/* Businesses List */}
        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading...</div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No businesses yet. Create one to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="flex justify-between items-start p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">{business.name}</h3>
                  {business.description && (
                    <p className="text-sm text-slate-600 mt-1">{business.description}</p>
                  )}
                  {business.website && (
                    <p className="text-sm text-blue-600 mt-1">{business.website}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg font-medium hover:bg-slate-300 transition-colors text-sm">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBusiness(business.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Integrations Section */}
      <div>
        {businesses.length > 0 && (
          <GoogleConnect
            businessId={businesses[0].id}
            isConnected={
              businesses[0].platform_connections?.google?.accessToken
                ? true
                : false
            }
            onSuccess={() => fetchBusinesses()}
          />
        )}

        {businesses.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <p className="text-slate-600">
              Create a business first to set up integrations.
            </p>
          </div>
        )}
      </div>

      {/* Account Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 mt-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <p className="text-slate-900 font-medium mt-1">{session?.user?.email}</p>
          </div>
          <div>
            <label className="text-sm text-slate-600">Name</label>
            <p className="text-slate-900 font-medium mt-1">{session?.user?.name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}