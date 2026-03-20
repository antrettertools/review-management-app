import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { syncGoogleReviews } from '@/lib/api-clients/google-reviews'

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

    let syncedCount = 0
    let errorCount = 0

    // Sync reviews for each business
    for (const business of businesses || []) {
      try {
        const googleConnection = business.platform_connections?.google
        if (!googleConnection?.accessToken) continue

        const syncResult = await syncGoogleReviews(
          googleConnection.accessToken,
          `accounts/[ACCOUNT_ID]/locations/${business.id}`
        )

        if (syncResult.success) {
          syncedCount++

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
          errorCount++
          console.error(`Failed to sync reviews for business ${business.id}:`, syncResult.error)
        }
      } catch (err) {
        errorCount++
        console.error(`Error syncing business ${business.id}:`, err)
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      errors: errorCount,
      total: (businesses || []).length,
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
