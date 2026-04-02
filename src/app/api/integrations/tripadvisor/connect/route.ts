import { validateTripAdvisorLocationId } from '@/lib/api-clients/tripadvisor-reviews'
import { mergePlatformConnection } from '@/lib/platform-connections'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { businessId, userId, locationId } = await request.json()

    if (!businessId || !userId || !locationId) {
      return Response.json(
        { error: 'Missing businessId, userId, or locationId' },
        { status: 400 }
      )
    }

    // Validate the location ID
    const isValid = await validateTripAdvisorLocationId(locationId)
    if (!isValid) {
      return Response.json(
        { error: 'Invalid TripAdvisor location ID. Please check and try again.' },
        { status: 400 }
      )
    }

    // Merge into platform_connections
    const { success, error } = await mergePlatformConnection(businessId, 'tripadvisor', {
      locationId,
      connectedAt: new Date().toISOString(),
    })

    if (!success) {
      console.error('Failed to save TripAdvisor connection:', error)
      return Response.json(
        { error: error || 'Failed to save connection' },
        { status: 500 }
      )
    }

    // Post a notification
    try {
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'platform_connected',
        content: 'TripAdvisor connected successfully',
        read: false,
      })
    } catch (err) {
      console.error('Failed to post notification:', err)
      // Don't fail the whole flow if notification fails
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('TripAdvisor connect error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to connect TripAdvisor' },
      { status: 500 }
    )
  }
}
