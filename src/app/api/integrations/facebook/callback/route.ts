import { getFacebookPageToken } from '@/lib/api-clients/facebook-reviews'
import { mergePlatformConnection } from '@/lib/platform-connections'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) {
      return Response.redirect(`${process.env.NEXTAUTH_URL}/dashboard/settings?error=missing_params`)
    }

    // Decode state to get businessId and userId
    let businessId: string, userId: string
    try {
      const decoded = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'))
      businessId = decoded.businessId
      userId = decoded.userId
    } catch {
      return Response.redirect(`${process.env.NEXTAUTH_URL}/dashboard/settings?error=invalid_state`)
    }

    // Exchange code for page token
    const pageToken = await getFacebookPageToken(code)
    if (!pageToken) {
      return Response.redirect(`${process.env.NEXTAUTH_URL}/dashboard/settings?error=failed_to_exchange_code`)
    }

    // Merge into platform_connections
    const { success, error } = await mergePlatformConnection(businessId, 'facebook', {
      pageAccessToken: pageToken.pageAccessToken,
      pageId: pageToken.pageId,
      pageName: pageToken.pageName,
      connectedAt: new Date().toISOString(),
    })

    if (!success) {
      console.error('Failed to save Facebook connection:', error)
      return Response.redirect(`${process.env.NEXTAUTH_URL}/dashboard/settings?error=failed_to_save`)
    }

    // Post a notification
    try {
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'platform_connected',
        content: `Facebook page "${pageToken.pageName}" connected successfully`,
        read: false,
      })
    } catch (err) {
      console.error('Failed to post notification:', err)
      // Don't fail the whole flow if notification fails
    }

    return Response.redirect(`${process.env.NEXTAUTH_URL}/dashboard/settings?facebook=connected`)
  } catch (error) {
    console.error('Facebook callback error:', error)
    return Response.redirect(`${process.env.NEXTAUTH_URL}/dashboard/settings?error=callback_failed`)
  }
}
