import { supabase } from './supabase'
import { applyRulesToReviews } from './rule-engine'

/**
 * Merges a new platform connection into the existing platform_connections JSONB field.
 * This prevents overwriting existing platform connections when adding a new platform.
 */
export async function mergePlatformConnection(
  businessId: string,
  platform: string,
  data: Record<string, any>
) {
  try {
    const { data: biz, error: fetchError } = await supabase
      .from('businesses')
      .select('platform_connections')
      .eq('id', businessId)
      .single()

    if (fetchError || !biz) {
      throw new Error(`Failed to fetch business: ${fetchError?.message}`)
    }

    const merged = {
      ...(biz.platform_connections ?? {}),
      [platform]: data,
    }

    const { error: updateError } = await supabase
      .from('businesses')
      .update({ platform_connections: merged })
      .eq('id', businessId)

    if (updateError) {
      throw new Error(`Failed to update platform connection: ${updateError.message}`)
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * Upserts reviews into the database, handling platform-specific review IDs.
 */
export async function upsertReviews(businessId: string, reviews: any[]) {
  if (!reviews || reviews.length === 0) {
    return { success: true, count: 0 }
  }

  try {
    const reviewsWithBusiness = reviews.map((r) => ({
      ...r,
      business_id: businessId,
    }))

    const { error } = await supabase.from('reviews').upsert(reviewsWithBusiness, {
      onConflict: 'platform_review_id',
    })

    if (error) {
      throw new Error(`Failed to upsert reviews: ${error.message}`)
    }

    // Apply auto-response rules (fire-and-forget)
    applyRulesToReviews(businessId, reviewsWithBusiness).catch(err =>
      console.error('Rule engine error:', err)
    )

    return { success: true, count: reviews.length }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error', count: 0 }
  }
}
