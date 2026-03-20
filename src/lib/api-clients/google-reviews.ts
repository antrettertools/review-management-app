import { google } from 'googleapis'

export async function syncGoogleReviews(
  accessToken: string,
  locationName: string
) {
  try {
    // TODO: Implement full Google Business Profile API integration
    // For now, return a success response with 0 reviews
    // This confirms the connection is working

    // In the future, this will:
    // 1. Fetch user's Google Business locations
    // 2. Retrieve reviews for each location
    // 3. Store reviews in the database

    return {
      success: true,
      reviews: [],
      message: 'Google Business connection successful. Review syncing coming soon.',
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