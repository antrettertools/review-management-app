import { NextRequest, NextResponse } from 'next/server'
import { generateReviewInsights } from '@/lib/anthropic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviews } = body

    if (!reviews || !Array.isArray(reviews)) {
      return NextResponse.json({ error: 'reviews array is required' }, { status: 400 })
    }

    if (reviews.length === 0) {
      return NextResponse.json({ error: 'No reviews to analyze' }, { status: 400 })
    }

    const result = await generateReviewInsights(reviews)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate insights' },
        { status: 500 }
      )
    }

    return NextResponse.json({ insights: result.insights, success: true })
  } catch (error) {
    console.error('Error in insights route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
