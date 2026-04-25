import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateReviewResponse, type ResponseTone } from '@/lib/anthropic'

const VALID_TONES: ResponseTone[] = ['professional', 'friendly', 'casual', 'formal']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviewId, tone } = body

    if (!reviewId) {
      return NextResponse.json(
        { error: 'reviewId is required' },
        { status: 400 }
      )
    }

    const safeTone: ResponseTone =
      tone && VALID_TONES.includes(tone) ? tone : 'professional'

    // Fetch the review (with business name for personalization)
    const { data: review, error: fetchError } = await supabase
      .from('reviews')
      .select('*, businesses(name)')
      .eq('id', reviewId)
      .single()

    if (fetchError || !review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    const businessName = (review as any).businesses?.name as string | undefined

    // Generate response using Anthropic
    const result = await generateReviewResponse(
      {
        content: review.content,
        rating: review.rating,
        author_name: review.author_name,
      },
      { tone: safeTone, businessName }
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate response' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      response: result.response,
      success: true,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}