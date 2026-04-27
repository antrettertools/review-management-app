'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Zap, X, Trash2, ToggleRight, ToggleLeft } from 'lucide-react'

interface Rule {
  id: string
  name: string
  condition_type: 'rating_lte' | 'rating_gte' | 'platform' | 'urgency_critical'
  condition_value: string | null
  response_template: string | null
  use_ai: boolean
  tone: string
  is_active: boolean
  created_at: string
}

interface Business {
  id: string
  name: string
}

export default function RulesPage() {
  const { data: session } = useSession()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('')
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const userId = (session?.user as any)?.id

  // Fetch businesses
  useEffect(() => {
    if (!userId) return
    ;(async () => {
      const { data } = await supabase.from('businesses').select('id, name').eq('user_id', userId)
      if (data && data.length > 0) {
        setBusinesses(data)
        setSelectedBusinessId(data[0].id)
      }
    })()
  }, [userId])

  // Fetch rules
  const fetchRules = async (businessId: string) => {
    if (!businessId) return
    setLoading(true)
    try {
      const response = await fetch(`/api/rules?businessId=${businessId}`)
      const data = await response.json()
      setRules(data || [])
    } catch (err) {
      console.error('Error fetching rules:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedBusinessId) {
      fetchRules(selectedBusinessId)
    }
  }, [selectedBusinessId])

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const name = formData.get('name') as string
    const conditionType = formData.get('conditionType') as string
    const conditionValue = formData.get('conditionValue') as string | null
    const useAi = formData.get('responseType') === 'ai'
    const responseTemplate = formData.get('responseTemplate') as string | null
    const tone = formData.get('tone') as string

    if (!name || !conditionType) {
      setError('Name and condition type are required')
      setSaving(false)
      return
    }

    if (!useAi && !responseTemplate?.trim()) {
      setError('Please provide a response template or enable AI generation')
      setSaving(false)
      return
    }

    try {
      const response = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: selectedBusinessId,
          name,
          conditionType,
          conditionValue: conditionValue || null,
          responseTemplate,
          useAi,
          tone,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to create rule')
      }

      await fetchRules(selectedBusinessId)
      setShowForm(false)
      ;(e.currentTarget as HTMLFormElement).reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleRule = async (rule: Rule) => {
    try {
      const response = await fetch(`/api/rules/${rule.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !rule.is_active }),
      })

      if (!response.ok) throw new Error('Failed to toggle rule')
      await fetchRules(selectedBusinessId)
    } catch (err) {
      console.error('Error toggling rule:', err)
    }
  }

  const handleDeleteRule = async (ruleId: string) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return

    setDeletingId(ruleId)
    try {
      const response = await fetch(`/api/rules/${ruleId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete rule')
      await fetchRules(selectedBusinessId)
    } catch (err) {
      console.error('Error deleting rule:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const getConditionLabel = (rule: Rule): string => {
    const condMap: Record<string, string> = {
      rating_lte: `Rating ≤ ${rule.condition_value}★`,
      rating_gte: `Rating ≥ ${rule.condition_value}★`,
      platform: `Platform = ${rule.condition_value}`,
      urgency_critical: 'Review is marked Urgent',
    }
    return condMap[rule.condition_type] || rule.condition_type
  }

  const getResponseLabel = (rule: Rule): string => {
    if (rule.use_ai) {
      return `AI (${rule.tone})`
    }
    return rule.response_template ? `Template: ${rule.response_template.substring(0, 40)}...` : 'No response'
  }

  if (!session) return null

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={24} className="text-blue-800" />
          <h1 className="text-2xl font-bold text-slate-900">Auto-Response Rules</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Rule'}
        </button>
      </div>

      {/* Business Selector */}
      {businesses.length > 1 && (
        <select
          value={selectedBusinessId}
          onChange={e => setSelectedBusinessId(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900"
        >
          {businesses.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Create New Rule</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSaveRule} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rule Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Reply to negative reviews"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Condition Type</label>
                <select
                  name="conditionType"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                >
                  <option value="">Select condition...</option>
                  <option value="rating_lte">Rating ≤</option>
                  <option value="rating_gte">Rating ≥</option>
                  <option value="platform">Platform is</option>
                  <option value="urgency_critical">Is marked Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Value</label>
                <select
                  name="conditionValue"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                >
                  <option value="">Auto</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                  <option value="google">Google</option>
                  <option value="facebook">Facebook</option>
                  <option value="yelp">Yelp</option>
                  <option value="tripadvisor">TripAdvisor</option>
                  <option value="trustpilot">Trustpilot</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Response Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="responseType"
                    value="template"
                    defaultChecked
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-slate-700">Template</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="responseType"
                    value="ai"
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-slate-700">AI Generate</span>
                </label>
              </div>
            </div>

            <div id="template-section">
              <label className="block text-sm font-medium text-slate-700 mb-1">Response Template</label>
              <textarea
                name="responseTemplate"
                placeholder="Write your auto-response template..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-24 resize-none text-slate-900"
              />
            </div>

            <div id="tone-section" className="hidden">
              <label className="block text-sm font-medium text-slate-700 mb-1">Tone</label>
              <select
                name="tone"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">AI will generate a response using this tone.</p>
            </div>

            <script>
              {`
                document.querySelectorAll('input[name="responseType"]').forEach(radio => {
                  radio.addEventListener('change', function() {
                    document.getElementById('template-section').style.display = this.value === 'template' ? 'block' : 'none'
                    document.getElementById('tone-section').style.display = this.value === 'ai' ? 'block' : 'none'
                  })
                })
              `}
            </script>

            <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {saving ? 'Saving...' : 'Save Rule'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rules List */}
      {loading ? (
        <div className="flex items-center justify-center h-24">
          <div className="w-6 h-6 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : rules.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600 mb-4">No rules yet. Create one to auto-reply to reviews.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map(rule => (
            <div
              key={rule.id}
              className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{rule.name}</h3>
                <p className="text-sm text-slate-600 mt-1">Condition: {getConditionLabel(rule)}</p>
                <p className="text-sm text-slate-600">Response: {getResponseLabel(rule)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleRule(rule)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title={rule.is_active ? 'Disable rule' : 'Enable rule'}
                >
                  {rule.is_active ? (
                    <ToggleRight size={20} className="text-emerald-600" />
                  ) : (
                    <ToggleLeft size={20} className="text-slate-400" />
                  )}
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  disabled={deletingId === rule.id}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete rule"
                >
                  <Trash2 size={20} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
        <p className="font-medium mb-1">How rules work:</p>
        <ul className="list-disc list-inside space-y-0.5 text-blue-800">
          <li>Rules are checked when new reviews are synced</li>
          <li>Only the first matching rule applies per review</li>
          <li>AI-generated responses use the selected tone</li>
          <li>You can toggle rules on/off without deleting them</li>
        </ul>
      </div>
    </div>
  )
}
