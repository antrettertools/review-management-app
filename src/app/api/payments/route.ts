import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, priceId, userId, cancelUrl, isNewSignup } = body

    if (!planId || !priceId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, stripe_customer_id, subscription_plan')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let customerId = user.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      })
      customerId = customer.id

      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    // Only new signups get the 14-day free trial
    // Reactivated accounts (previously cancelled) pay immediately
    const shouldTrial = isNewSignup === true && user.subscription_plan !== 'cancelled'

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}${cancelUrl || '/auth/signup'}`,
      metadata: {
        planId,
        userId,
        isNewSignup: shouldTrial ? 'true' : 'false',
      },
    }

    // Add 14-day trial for new signups only
    if (shouldTrial) {
      sessionConfig.subscription_data = {
        trial_period_days: 14,
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Payments error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
