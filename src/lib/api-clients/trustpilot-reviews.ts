const TRUSTPILOT_API_URL = 'https://api.trustpilot.com/v1'

/**
 * Looks up a Trustpilot business unit ID by domain name
 */
export async function getTrustpilotBusinessUnitId(domain: string): Promise<string | null> {
  try {
    // Normalize domain: remove http(s):// and www if present
    let cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '')

    const params = new URLSearchParams({
      name: cleanDomain,
      apikey: process.env.TRUSTPILOT_API_KEY || '',
    })

    const response = await fetch(`${TRUSTPILOT_API_URL}/business-units/find?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then((r) => r.json())

    if (response.errors || !response.id) {
      console.error('Trustpilot business unit lookup failed:', response.errors || 'No ID returned')
      return null
    }

    return response.id
  } catch (err) {
    console.error('Error looking up Trustpilot business unit:', err)
    return null
  }
}

interface SyncResult {
  success: boolean
  reviews?: Array<{
    platform: string
    platform_review_id: string
    author_name: string
    rating: number
    content: string
    created_at: string
  }>
  error?: string
}

/**
 * Fetches reviews from a Trustpilot business
 */
export async function syncTrustpilotReviews(businessUnitId: string): Promise<SyncResult> {
  try {
    const params = new URLSearchParams({
      apikey: process.env.TRUSTPILOT_API_KEY || '',
      sort: 'recency', // Get most recent reviews
    })

    const response = await fetch(
      `${TRUSTPILOT_API_URL}/business-units/${businessUnitId}/reviews?${params.toString()}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    ).then((r) => r.json())

    if (response.errors) {
      console.error('Trustpilot API error:', response.errors)
      return { success: false, error: response.errors?.[0]?.message || 'Trustpilot API error', reviews: [] }
    }

    if (!response.reviews || response.reviews.length === 0) {
      return { success: true, reviews: [] }
    }

    const reviews = response.reviews
      .map((review: any) => {
        if (!review.rating || !review.id) return null

        return {
          platform: 'trustpilot',
          platform_review_id: review.id,
          author_name: review.consumer?.name || 'Anonymous',
          rating: Math.round(review.rating),
          content: review.title ? `${review.title}\n\n${review.text}` : review.text || '',
          created_at: new Date(review.createdAt).toISOString(),
        }
      })
      .filter((r: any) => r !== null)

    return { success: true, reviews }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error syncing Trustpilot reviews:', errorMsg)
    return { success: false, error: errorMsg, reviews: [] }
  }
}
