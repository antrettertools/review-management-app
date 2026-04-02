const FACEBOOK_API_VERSION = 'v19.0'
const FACEBOOK_GRAPH_API = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`

/**
 * Builds the Facebook OAuth authorization URL
 */
export function getFacebookOAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID || '',
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/integrations/facebook/callback`,
    scope: 'pages_read_engagement,pages_manage_metadata',
    state,
  })

  return `https://www.facebook.com/${FACEBOOK_API_VERSION}/dialog/oauth?${params.toString()}`
}

interface PageTokenResult {
  pageAccessToken: string
  pageId: string
  pageName: string
}

/**
 * Exchanges the authorization code for a page access token
 */
export async function getFacebookPageToken(code: string): Promise<PageTokenResult | null> {
  try {
    // Step 1: Exchange code for user access token
    const tokenParams = new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID || '',
      client_secret: process.env.FACEBOOK_APP_SECRET || '',
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/integrations/facebook/callback`,
      code,
    })

    const tokenResponse = await fetch(`${FACEBOOK_GRAPH_API}/oauth/access_token`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then((r) =>
      r.json().then((d) => ({
        ...d,
        status: r.status,
      }))
    )

    if (!tokenResponse.access_token) {
      console.error('Facebook token exchange failed:', tokenResponse)
      return null
    }

    const userAccessToken = tokenResponse.access_token

    // Step 2: Get list of pages managed by the user
    const pagesResponse = await fetch(
      `${FACEBOOK_GRAPH_API}/me/accounts?access_token=${userAccessToken}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    ).then((r) => r.json())

    if (!pagesResponse.data || pagesResponse.data.length === 0) {
      console.error('No Facebook pages found for user')
      return null
    }

    // Return the first page (MVP approach)
    const firstPage = pagesResponse.data[0]
    return {
      pageAccessToken: firstPage.access_token,
      pageId: firstPage.id,
      pageName: firstPage.name,
    }
  } catch (err) {
    console.error('Error getting Facebook page token:', err)
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
 * Fetches reviews from a Facebook business page
 */
export async function syncFacebookReviews(pageAccessToken: string, pageId: string): Promise<SyncResult> {
  try {
    const fieldsParam = 'reviewer,rating,review_text,created_time'
    const response = await fetch(
      `${FACEBOOK_GRAPH_API}/${pageId}/ratings?fields=${fieldsParam}&access_token=${pageAccessToken}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    ).then((r) => r.json())

    if (response.error) {
      console.error('Facebook API error:', response.error)
      return { success: false, error: response.error.message, reviews: [] }
    }

    if (!response.data || response.data.length === 0) {
      return { success: true, reviews: [] }
    }

    const reviews = response.data
      .map((rating: any) => {
        // Skip reviews without a rating
        if (!rating.rating) return null

        return {
          platform: 'facebook',
          platform_review_id: `${rating.reviewer?.id || 'unknown'}_${rating.created_time}`,
          author_name: rating.reviewer?.name || 'Anonymous',
          rating: Math.round(rating.rating), // Facebook ratings are 1-5
          content: rating.review_text || '',
          created_at: new Date(rating.created_time * 1000).toISOString(),
        }
      })
      .filter((r: any) => r !== null)

    return { success: true, reviews }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error syncing Facebook reviews:', errorMsg)
    return { success: false, error: errorMsg, reviews: [] }
  }
}
