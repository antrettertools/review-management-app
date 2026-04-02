import { syncFacebookReviews } from '@/lib/api-clients/facebook-reviews'
import { upsertReviews } from '@/lib/platform-connections'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { businessId } = await request.json()

    if (!businessId) {
      return Response.json({ error: 'Missing businessId' }, { status: 400 })
    }

    // Fetch the business to get Facebook connection info
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (businessError || !business) {
      return Response.json({ error: 'Business not found' }, { status: 404 })
    }

    if (!business.platform_connections?.facebook?.pageAccessToken) {
      return Response.json({ error: 'Facebook not connected for this business' }, { status: 400 })
    }

    const { pageAccessToken, pageId } = business.platform_connections.facebook

    // Sync reviews from Facebook
    const syncResult = await syncFacebookReviews(pageAccessToken, pageId)

    if (!syncResult.success) {
      return Response.json({ error: syncResult.error, synced: 0 }, { status: 500 })
    }

    // Upsert reviews into the database
    const { count, error: upsertError } = await upsertReviews(businessId, syncResult.reviews || [])

    if (upsertError) {
      return Response.json({ error: upsertError, synced: 0 }, { status: 500 })
    }

    return Response.json({ success: true, synced: count })
  } catch (error) {
    console.error('Facebook sync error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 }
    )
  }
}
