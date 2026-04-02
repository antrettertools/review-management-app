const TRIPADVISOR_API_URL = 'https://api.content.tripadvisor.com/api/v1'

/**
 * Validates that a TripAdvisor location ID is valid
 */
export async function validateTripAdvisorLocationId(locationId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${TRIPADVISOR_API_URL}/location/${locationId}/details?key=${process.env.TRIPADVISOR_API_KEY}&language=en`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    ).then((r) =>
      r.json().then((d) => ({
        ...d,
        status: r.status,
      }))
    )

    return response.status === 200 && !!response.location_id
  } catch (err) {
    console.error('Error validating TripAdvisor location ID:', err)
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
 * Fetches reviews from a TripAdvisor location
 */
export async function syncTripAdvisorReviews(locationId: string): Promise<SyncResult> {
  try {
    const response = await fetch(
      `${TRIPADVISOR_API_URL}/location/${locationId}/reviews?key=${process.env.TRIPADVISOR_API_KEY}&language=en`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    ).then((r) => r.json())

    if (response.error) {
      console.error('TripAdvisor API error:', response.error)
      return { success: false, error: response.error, reviews: [] }
    }

    if (!response.reviews || response.reviews.length === 0) {
      return { success: true, reviews: [] }
    }

    const reviews = response.reviews
      .map((review: any) => {
        if (!review.rating || !review.review_id) return null

        return {
          platform: 'tripadvisor',
          platform_review_id: review.review_id,
          author_name: review.user?.display_name || 'Anonymous',
          rating: Math.round(review.rating),
          content: review.text || review.title || '',
          created_at: new Date(review.published_date).toISOString(),
        }
      })
      .filter((r: any) => r !== null)

    return { success: true, reviews }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error syncing TripAdvisor reviews:', errorMsg)
    return { success: false, error: errorMsg, reviews: [] }
  }
}
