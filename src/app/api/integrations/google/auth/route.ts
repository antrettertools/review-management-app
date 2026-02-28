import { NextRequest, NextResponse } from 'next/server'
import { getGoogleOAuthUrl } from '@/lib/api-clients/google-reviews'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessId, userId } = body

    if (!businessId || !userId) {
      return NextResponse.json(
        { error: 'Missing businessId or userId' },
        { status: 400 }
      )
    }

    const redirectUri = `${process.env.NEXTAUTH_URL}/api/integrations/google/callback`
    
    // Create state to pass back after OAuth
    const state = Buffer.from(
      JSON.stringify({ businessId, userId })
    ).toString('base64')

    // Get OAuth URL
    const oauthUrl = getGoogleOAuthUrl(
      process.env.GOOGLE_CLIENT_ID || '',
      redirectUri
    )

    // Add state parameter
    const urlWithState = `${oauthUrl}&state=${encodeURIComponent(state)}`

    return NextResponse.json({ url: urlWithState })
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    )
  }
}