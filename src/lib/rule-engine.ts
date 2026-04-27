import { supabase } from './supabase'
import { generateReviewResponse } from './anthropic'

interface Review {
  id: string
  business_id: string
  rating: number
  platform: string
  urgency_level: string | null
  author_name: string
  content: string
  is_responded?: boolean
}

interface Rule {
  id: string
  condition_type: 'rating_lte' | 'rating_gte' | 'platform' | 'urgency_critical'
  condition_value: string | null
  response_template: string | null
  use_ai: boolean
  tone: string
}

function ruleMatchesReview(rule: Rule, review: Review): boolean {
  switch (rule.condition_type) {
    case 'rating_lte':
      return review.rating <= parseInt(rule.condition_value || '0', 10)
    case 'rating_gte':
      return review.rating >= parseInt(rule.condition_value || '5', 10)
    case 'platform':
      return (review.platform || '').toLowerCase() === (rule.condition_value || '').toLowerCase()
    case 'urgency_critical':
      return review.urgency_level === 'critical'
    default:
      return false
  }
}

export async function applyRulesToReviews(businessId: string, reviews: Review[]) {
  if (!reviews || reviews.length === 0) return

  const { data: rules, error } = await supabase
    .from('auto_response_rules')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error || !rules || rules.length === 0) return

  const { data: business } = await supabase
    .from('businesses')
    .select('name')
    .eq('id', businessId)
    .single()

  const businessName = business?.name as string | undefined

  for (const review of reviews) {
    // Check if response already exists
    const { count: existingCount } = await supabase
      .from('responses')
      .select('id', { count: 'exact', head: true })
      .eq('review_id', review.id)

    if (existingCount && existingCount > 0) continue

    for (const rule of rules) {
      if (!ruleMatchesReview(rule, review)) continue

      let responseContent: string | null = null

      if (rule.use_ai) {
        const result = await generateReviewResponse(
          {
            content: review.content,
            rating: review.rating,
            author_name: review.author_name,
          },
          {
            tone: rule.tone as any,
            businessName,
          }
        )
        if (result.success) {
          responseContent = result.response
        }
      } else {
        responseContent = rule.response_template
      }

      if (!responseContent) break

      try {
        await supabase.from('responses').insert([{
          review_id: review.id,
          business_id: businessId,
          content: responseContent,
          ai_generated: rule.use_ai,
          is_published: false,
        }])

        await supabase
          .from('reviews')
          .update({ is_responded: true })
          .eq('id', review.id)
      } catch (err) {
        console.error('Error inserting auto-response:', err)
      }

      break
    }
  }
}
