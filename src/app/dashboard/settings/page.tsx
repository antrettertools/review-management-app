'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'

interface Business {
  id: string
  name: string
  description: string
  website: string
  logo_url: string
  is_active: boolean
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

  useEffect(() => {
    if ((session?.user as any)?.id) {
      fetchBusinesses()
    }
  }, [session])

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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>

      {/* Businesses Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">My Businesses</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
          >
            {showAddForm ? 'Cancel' : 'Add Business'}
          </button>
        </div>

        {/* Add Business Form */}
        {showAddForm && (
          <form onSubmit={handleAddBusiness} className="mb-6 p-4 bg-gray-50 rounded">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Create Business
              </button>
            </div>
          </form>
        )}

        {/* Businesses List */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No businesses yet. Create one to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{business.name}</h3>
                  <p className="text-sm text-gray-500">{business.description}</p>
                  {business.website && (
                    <p className="text-sm text-blue-600">{business.website}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBusiness(business.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <p className="text-gray-800 font-medium">{session?.user?.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Plan</label>
            <p className="text-gray-800 font-medium">Starter</p>
          </div>
        </div>
      </div>
    </div>
  )
}