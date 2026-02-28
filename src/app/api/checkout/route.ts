import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST(request: NextRequest) {
  try {
    console.log('Checkout API called')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { planId, priceId, userId } = body

    if (!planId || !priceId || !userId) {
      console.log('Missing fields - planId:', planId, 'priceId:', priceId, 'userId:', userId)
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      console.log('User not found:', userId)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('Stripe initialized')

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success&plan=${planId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      customer_email: user.email,
      metadata: {
        planId,
        userId,
      },
    })

    console.log('Checkout session created:', checkoutSession.id)
    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error message:', errorMessage)
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}