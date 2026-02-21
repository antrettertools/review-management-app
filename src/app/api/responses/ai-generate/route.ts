import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateReviewResponse } from '@/lib/anthropic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviewId } = body

    if (!reviewId) {
      return NextResponse.json(
        { error: 'reviewId is required' },
        { status: 400 }
      )
    }

    // Fetch the review
    const { data: review, error: fetchError } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
      .single()

    if (fetchError || !review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Generate response using Anthropic
    const result = await generateReviewResponse({
      content: review.content,
      rating: review.rating,
      author_name: review.author_name,
    })

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