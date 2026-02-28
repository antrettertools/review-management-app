import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { syncGoogleReviews } from '@/lib/api-clients/google-reviews'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessId } = body

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId is required' },
        { status: 400 }
      )
    }

    // Get business with Google connection info
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (businessError || !business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    // Check if Google is connected
    const googleConnection = business.platform_connections?.google
    if (!googleConnection?.accessToken) {
      return NextResponse.json(
        { error: 'Google Business not connected' },
        { status: 400 }
      )
    }

    // Sync reviews from Google
    const syncResult = await syncGoogleReviews(
      googleConnection.accessToken,
      `accounts/[ACCOUNT_ID]/locations/${business.id}`,
      businessId
    )

    if (!syncResult.success) {
      return NextResponse.json(
        { error: syncResult.error || 'Failed to sync reviews' },
        { status: 500 }
      )
    }

    // Insert reviews into database
    const reviews = syncResult.reviews || []
    
    if (reviews.length > 0) {
      const { error: insertError } = await supabase
        .from('reviews')
        .upsert(
          reviews.map((review: any) => ({
            ...review,
            business_id: businessId,
          })),
          { onConflict: 'platform_review_id' }
        )

      if (insertError) {
        console.error('Error inserting reviews:', insertError)
        return NextResponse.json(
          { error: 'Failed to save reviews' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      reviewsCount: reviews.length,
      message: `Synced ${reviews.length} reviews from Google`,
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}