'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface GoogleConnectProps {
  businessId: string
  isConnected: boolean
  onSuccess: () => void
}

export default function GoogleConnect({
  businessId,
  isConnected,
  onSuccess,
}: GoogleConnectProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/integrations/google/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          userId: (session?.user as any)?.id,
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
      setLoading(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Business?')) {
      return
    }

    try {
      // TODO: Implement disconnect logic
      console.log('Disconnect Google')
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Google Business Reviews
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Connect your Google Business account to sync reviews automatically.
          </p>
        </div>
        {isConnected && (
          <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded">
            ✓ Connected
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        {isConnected ? (
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={loading}
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? 'Connecting...' : 'Connect Google Business'}
          </button>
        )}
      </div>
    </div>
  )
}