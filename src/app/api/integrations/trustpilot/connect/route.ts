import { getTrustpilotBusinessUnitId } from '@/lib/api-clients/trustpilot-reviews'
import { mergePlatformConnection } from '@/lib/platform-connections'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { businessId, userId, domain } = await request.json()

    if (!businessId || !userId || !domain) {
      return Response.json(
        { error: 'Missing businessId, userId, or domain' },
        { status: 400 }
      )
    }

    // Look up the business unit ID by domain
    const businessUnitId = await getTrustpilotBusinessUnitId(domain)
    if (!businessUnitId) {
      return Response.json(
        { error: 'Could not find a Trustpilot business for that domain. Please check and try again.' },
        { status: 400 }
      )
    }

    // Merge into platform_connections
    const { success, error } = await mergePlatformConnection(businessId, 'trustpilot', {
      businessUnitId,
      domain,
      connectedAt: new Date().toISOString(),
    })

    if (!success) {
      console.error('Failed to save Trustpilot connection:', error)
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
        content: 'Trustpilot connected successfully',
        read: false,
      })
    } catch (err) {
      console.error('Failed to post notification:', err)
      // Don't fail the whole flow if notification fails
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Trustpilot connect error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to connect Trustpilot' },
      { status: 500 }
    )
  }
}
