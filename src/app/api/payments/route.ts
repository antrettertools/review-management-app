import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('=== PAYMENTS API CALLED ===')
  
  try {
    const body = await request.json()
    console.log('Body received:', body)
    
    const { planId, priceId, userId } = body

    if (!planId || !priceId || !userId) {
      console.log('Missing fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('All fields present, importing Stripe...')
    
    const Stripe = require('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    
    console.log('Stripe initialized')

    return NextResponse.json({ url: 'test-url' })
  } catch (error) {
    console.error('PAYMENTS ERROR:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}