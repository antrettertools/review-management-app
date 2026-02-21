import { google } from 'googleapis'

export async function syncGoogleReviews(
  accessToken: string,
  locationName: string,
  businessId: string
) {
  try {
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken })

    const mybusiness = google.mybusinessbusinessinformation('v1') as any

    // Fetch reviews for the location
    const response = await mybusiness.locations.reviews.list({
      parent: locationName,
      auth,
    })

    const reviews = response.data.reviews || []

    return {
      success: true,
      reviews: reviews.map((review: any) => ({
        platform: 'google',
        platform_review_id: review.name,
        author_name: review.reviewer?.displayName || 'Anonymous',
        author_email: review.reviewer?.emailAddress,
        rating: review.starRating || 0,
        title: review.reviewReply?.comment || '',
        content: review.comment || '',
        platform_created_at: review.createTime,
      })),
    }
  } catch (error) {
    console.error('Error syncing Google reviews:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export function getGoogleOAuthUrl(clientId: string, redirectUri: string) {
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  )

  const scopes = [
    'https://www.googleapis.com/auth/business.manage',
  ]

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  })

  return url
}

export async function getGoogleAccessToken(code: string, clientId: string, redirectUri: string) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    )

    const { tokens } = await oauth2Client.getToken(code)
    return {
      success: true,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    }
  } catch (error) {
    console.error('Error getting Google access token:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}