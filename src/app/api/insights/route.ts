import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { generateReviewInsights } from '@/lib/anthropic'

/**
 * Insights cache.
 *
 * Why: every dashboard load was previously calling Claude even though the
 * underlying review set rarely changes. We fingerprint the review payload
 * (id+content+rating) and cache the generated insights in memory for 6h.
 *
 * In-memory caching is intentional — Vercel cold-starts will miss, but
 * that's a few cents per cold start, far cheaper than re-running the model
 * on every page navigation. For a multi-region setup, replace with Redis.
 */

const TTL_MS = 6 * 60 * 60 * 1000 // 6 hours
const cache = new Map<string, { value: unknown; expiresAt: number }>()

function fingerprint(reviews: Array<{ content?: string; rating?: number; author_name?: string }>): string {
  // Sort by rating + content so order-independent. Truncate content to keep
  // hashing fast on large payloads.
  const normalized = reviews
    .map((r) => `${r.rating ?? 0}|${(r.content || '').slice(0, 200)}`)
    .sort()
    .join('||')
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 32)
}

function getCached(key: string) {
  const entry = cache.get(key)
  if (!entry) return null
  if (entry.expiresAt < Date.now()) {
    cache.delete(key)
    return null
  }
  return entry.value
}

function setCached(key: string, value: unknown) {
  // Soft-cap cache size so we don't leak memory on long-running instances.
  if (cache.size > 500) {
    const oldest = cache.keys().next().value
    if (oldest) cache.delete(oldest)
  }
  cache.set(key, { value, expiresAt: Date.now() + TTL_MS })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviews } = body

    if (!reviews || !Array.isArray(reviews)) {
      return NextResponse.json({ error: 'reviews array is required' }, { status: 400 })
    }

    if (reviews.length === 0) {
      return NextResponse.json({ error: 'No reviews to analyze' }, { status: 400 })
    }

    const key = fingerprint(reviews)
    const cached = getCached(key)
    if (cached) {
      return NextResponse.json({ insights: cached, success: true, cached: true })
    }

    const result = await generateReviewInsights(reviews)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate insights' },
        { status: 500 }
      )
    }

    setCached(key, result.insights)
    return NextResponse.json({ insights: result.insights, success: true, cached: false })
  } catch (error) {
    console.error('Error in insights route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
