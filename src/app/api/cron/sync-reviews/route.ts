import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { syncGoogleReviews } from '@/lib/api-clients/google-reviews'
import { syncFacebookReviews } from '@/lib/api-clients/facebook-reviews'
import { upsertReviews } from '@/lib/platform-connections'

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch all businesses with Google connected
    const { data: businesses, error: fetchError } = await supabase
      .from('businesses')
      .select('*, users:user_id(id)')
      .not('platform_connections->google', 'is', null)

    if (fetchError) {
      console.error('Error fetching businesses:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch businesses' },
        { status: 500 }
      )
    }

    let googleSynced = 0
    let googleErrors = 0
    let facebookSynced = 0
    let facebookErrors = 0

    // Sync Google reviews
    for (const business of businesses || []) {
      try {
        const googleConnection = business.platform_connections?.google
        if (!googleConnection?.accessToken) continue

        const syncResult = await syncGoogleReviews(
          googleConnection.accessToken,
          `accounts/[ACCOUNT_ID]/locations/${business.id}`
        )

        if (syncResult.success && syncResult.reviews) {
          // Upsert reviews
          await upsertReviews(business.id, syncResult.reviews)
          googleSynced++

          // Create notification for the user
          const userId = (business.users as any)?.id || business.user_id
          try {
            await fetch(`${process.env.NEXTAUTH_URL}/api/notifications`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId,
                type: 'new_review',
                title: 'Reviews Synced',
                message: `${syncResult.reviews?.length || 0} reviews synced from Google for ${business.name}`,
                data: { businessId: business.id },
              }),
            })
          } catch (notificationError) {
            console.error('Error creating notification:', notificationError)
          }
        } else {
          googleErrors++
          console.error(`Failed to sync Google reviews for business ${business.id}:`, syncResult.error)
        }
      } catch (err) {
        googleErrors++
        console.error(`Error syncing Google for business ${business.id}:`, err)
      }
    }

    // Sync Facebook reviews
    const { data: fbBusinesses, error: fbFetchError } = await supabase
      .from('businesses')
      .select('*, users:user_id(id)')
      .not('platform_connections->facebook', 'is', null)

    if (fbFetchError) {
      console.error('Error fetching Facebook businesses:', fbFetchError)
    } else {
      for (const business of fbBusinesses || []) {
        try {
          const fbConnection = business.platform_connections?.facebook
          if (!fbConnection?.pageAccessToken || !fbConnection?.pageId) continue

          const syncResult = await syncFacebookReviews(fbConnection.pageAccessToken, fbConnection.pageId)

          if (syncResult.success && syncResult.reviews) {
            // Upsert reviews
            await upsertReviews(business.id, syncResult.reviews)
            facebookSynced++

            // Create notification for the user
            const userId = (business.users as any)?.id || business.user_id
            try {
              await fetch(`${process.env.NEXTAUTH_URL}/api/notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId,
                  type: 'new_review',
                  title: 'Reviews Synced',
                  message: `${syncResult.reviews?.length || 0} reviews synced from Facebook for ${business.name}`,
                  data: { businessId: business.id },
                }),
              })
            } catch (notificationError) {
              console.error('Error creating notification:', notificationError)
            }
          } else {
            facebookErrors++
            console.error(`Failed to sync Facebook reviews for business ${business.id}:`, syncResult.error)
          }
        } catch (err) {
          facebookErrors++
          console.error(`Error syncing Facebook for business ${business.id}:`, err)
        }
      }
    }

    return NextResponse.json({
      success: true,
      google: { synced: googleSynced, errors: googleErrors },
      facebook: { synced: facebookSynced, errors: facebookErrors },
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
