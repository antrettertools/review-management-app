import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getGoogleOAuthUrl } from '@/lib/api-clients/google-reviews'
import { signOAuthState } from '@/lib/oauth-state'

export async function POST(request: NextRequest) {
  try {
    // Require an authenticated session — prevents anonymous OAuth URL generation
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { businessId, userId } = body

    if (!businessId || !userId) {
      return NextResponse.json(
        { error: 'Missing businessId or userId' },
        { status: 400 }
      )
    }

    const redirectUri = `${process.env.NEXTAUTH_URL}/api/integrations/google/callback`

    // HMAC-sign the state so it can't be forged. Includes a timestamp; the
    // callback will reject stale (>10min) or tampered states.
    const state = signOAuthState({ businessId, userId })

    const oauthUrl = getGoogleOAuthUrl(
      process.env.GOOGLE_CLIENT_ID || '',
      redirectUri
    )

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
