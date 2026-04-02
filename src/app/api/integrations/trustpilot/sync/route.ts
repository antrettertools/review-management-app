import { syncTrustpilotReviews } from '@/lib/api-clients/trustpilot-reviews'
import { upsertReviews } from '@/lib/platform-connections'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { businessId } = await request.json()

    if (!businessId) {
      return Response.json({ error: 'Missing businessId' }, { status: 400 })
    }

    // Fetch the business to get Trustpilot connection info
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (businessError || !business) {
      return Response.json({ error: 'Business not found' }, { status: 404 })
    }

    if (!business.platform_connections?.trustpilot?.businessUnitId) {
      return Response.json({ error: 'Trustpilot not connected for this business' }, { status: 400 })
    }

    const { businessUnitId } = business.platform_connections.trustpilot

    // Sync reviews from Trustpilot
    const syncResult = await syncTrustpilotReviews(businessUnitId)

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
    console.error('Trustpilot sync error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 }
    )
  }
}
