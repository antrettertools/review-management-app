import { getFacebookOAuthUrl } from '@/lib/api-clients/facebook-reviews'

export async function POST(request: Request) {
  try {
    const { businessId, userId } = await request.json()

    if (!businessId || !userId) {
      return Response.json({ error: 'Missing businessId or userId' }, { status: 400 })
    }

    // Encode state with businessId and userId
    const state = Buffer.from(JSON.stringify({ businessId, userId })).toString('base64')

    // Get the OAuth URL
    const url = getFacebookOAuthUrl(state)

    return Response.json({ url })
  } catch (error) {
    console.error('Facebook auth error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to generate auth URL' },
      { status: 500 }
    )
  }
}
