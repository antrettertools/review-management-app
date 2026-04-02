const YELP_API_URL = 'https://api.yelp.com/v3'

/**
 * Validates that a Yelp business ID is valid
 */
export async function validateYelpBusinessId(yelpBusinessId: string): Promise<boolean> {
  try {
    const response = await fetch(`${YELP_API_URL}/businesses/${yelpBusinessId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.YELP_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }).then((r) =>
      r.json().then((d) => ({
        ...d,
        status: r.status,
      }))
    )

    return response.status === 200 && !!response.id
  } catch (err) {
    console.error('Error validating Yelp business ID:', err)
    return false
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
 * Fetches reviews from a Yelp business
 * Note: Yelp API returns a maximum of 3 reviews per business
 */
export async function syncYelpReviews(yelpBusinessId: string, locale: string = 'en_US'): Promise<SyncResult> {
  try {
    const params = new URLSearchParams({
      locale,
    })

    const response = await fetch(`${YELP_API_URL}/businesses/${yelpBusinessId}/reviews?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.YELP_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }).then((r) => r.json())

    if (response.error) {
      console.error('Yelp API error:', response.error)
      return { success: false, error: response.error.description || 'Yelp API error', reviews: [] }
    }

    if (!response.reviews || response.reviews.length === 0) {
      return { success: true, reviews: [] }
    }

    const reviews = response.reviews
      .map((review: any) => {
        // Skip reviews without required fields
        if (!review.rating || !review.id) return null

        return {
          platform: 'yelp',
          platform_review_id: review.id,
          author_name: review.user?.name || 'Anonymous',
          rating: Math.round(review.rating),
          content: review.text || '',
          created_at: new Date(review.time_created).toISOString(),
        }
      })
      .filter((r: any) => r !== null)

    return { success: true, reviews }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error syncing Yelp reviews:', errorMsg)
    return { success: false, error: errorMsg, reviews: [] }
  }
}
