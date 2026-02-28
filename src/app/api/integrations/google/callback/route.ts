import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getGoogleAccessToken } from '@/lib/api-clients/google-reviews'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing authorization code or state' },
        { status: 400 }
      )
    }

    // Decode state to get businessId and userId
    const decodedState = JSON.parse(Buffer.from(decodeURIComponent(state), 'base64').toString())
    const { businessId, userId } = decodedState

    // Get access token from Google
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/integrations/google/callback`
    const tokenResult = await getGoogleAccessToken(
      code,
      process.env.GOOGLE_CLIENT_ID || '',
      redirectUri
    )

    if (!tokenResult.success) {
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 500 }
      )
    }

    // Save token to business.platform_connections
    const { error } = await supabase
      .from('businesses')
      .update({
        platform_connections: {
          google: {
            accessToken: tokenResult.accessToken,
            refreshToken: tokenResult.refreshToken,
            connectedAt: new Date().toISOString(),
          },
        },
      })
      .eq('id', businessId)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save connection' },
        { status: 500 }
      )
    }

    // Redirect back to settings
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/settings?google=connected`
    )
  } catch (error) {
    console.error('Google callback error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}