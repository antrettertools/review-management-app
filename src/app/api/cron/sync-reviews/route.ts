import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { syncGoogleReviews } from '@/lib/api-clients/google-reviews'
import { syncFacebookReviews } from '@/lib/api-clients/facebook-reviews'
import { syncTripAdvisorReviews } from '@/lib/api-clients/tripadvisor-reviews'
import { syncTrustpilotReviews } from '@/lib/api-clients/trustpilot-reviews'
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
    let tripadvisorSynced = 0
    let tripadvisorErrors = 0
    let trustpilotSynced = 0
    let trustpilotErrors = 0

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

    // Sync TripAdvisor reviews
    const { data: taBusinesses, error: taFetchError } = await supabase
      .from('businesses')
      .select('*, users:user_id(id)')
      .not('platform_connections->tripadvisor', 'is', null)

    if (taFetchError) {
      console.error('Error fetching TripAdvisor businesses:', taFetchError)
    } else {
      for (const business of taBusinesses || []) {
        try {
          const taConnection = business.platform_connections?.tripadvisor
          if (!taConnection?.locationId) continue

          const syncResult = await syncTripAdvisorReviews(taConnection.locationId)

          if (syncResult.success && syncResult.reviews) {
            await upsertReviews(business.id, syncResult.reviews)
            tripadvisorSynced++

            const userId = (business.users as any)?.id || business.user_id
            try {
              await fetch(`${process.env.NEXTAUTH_URL}/api/notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId,
                  type: 'new_review',
                  title: 'Reviews Synced',
                  message: `${syncResult.reviews?.length || 0} reviews synced from TripAdvisor for ${business.name}`,
                  data: { businessId: business.id },
                }),
              })
            } catch (notificationError) {
              console.error('Error creating notification:', notificationError)
            }
          } else {
            tripadvisorErrors++
          }
        } catch (err) {
          tripadvisorErrors++
          console.error(`Error syncing TripAdvisor for business ${business.id}:`, err)
        }
      }
    }

    // Sync Trustpilot reviews
    const { data: tpBusinesses, error: tpFetchError } = await supabase
      .from('businesses')
      .select('*, users:user_id(id)')
      .not('platform_connections->trustpilot', 'is', null)

    if (tpFetchError) {
      console.error('Error fetching Trustpilot businesses:', tpFetchError)
    } else {
      for (const business of tpBusinesses || []) {
        try {
          const tpConnection = business.platform_connections?.trustpilot
          if (!tpConnection?.businessUnitId) continue

          const syncResult = await syncTrustpilotReviews(tpConnection.businessUnitId)

          if (syncResult.success && syncResult.reviews) {
            await upsertReviews(business.id, syncResult.reviews)
            trustpilotSynced++

            const userId = (business.users as any)?.id || business.user_id
            try {
              await fetch(`${process.env.NEXTAUTH_URL}/api/notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId,
                  type: 'new_review',
                  title: 'Reviews Synced',
                  message: `${syncResult.reviews?.length || 0} reviews synced from Trustpilot for ${business.name}`,
                  data: { businessId: business.id },
                }),
              })
            } catch (notificationError) {
              console.error('Error creating notification:', notificationError)
            }
          } else {
            trustpilotErrors++
          }
        } catch (err) {
          trustpilotErrors++
          console.error(`Error syncing Trustpilot for business ${business.id}:`, err)
        }
      }
    }

    return NextResponse.json({
      success: true,
      google: { synced: googleSynced, errors: googleErrors },
      facebook: { synced: facebookSynced, errors: facebookErrors },
      tripadvisor: { synced: tripadvisorSynced, errors: tripadvisorErrors },
      trustpilot: { synced: trustpilotSynced, errors: trustpilotErrors },
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
