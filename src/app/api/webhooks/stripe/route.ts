import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature') || ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('Stripe webhook event:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const planId = session.metadata?.planId
  const isNewSignup = session.metadata?.isNewSignup === 'true'

  if (!userId || !planId) {
    console.error('Missing userId or planId in metadata')
    return
  }

  const customerId = session.customer as string

  const updateData: Record<string, any> = {
    stripe_customer_id: customerId,
  }

  if (isNewSignup) {
    // Trial user - set trialing status (14-day trial as advertised on landing page)
    updateData.subscription_plan = 'trialing'
    updateData.trial_ends_at = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  } else {
    // Reactivation - active immediately
    updateData.subscription_plan = planId
    updateData.trial_ends_at = null
  }

  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)

  if (error) {
    console.error('Error updating user:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const priceId = subscription.items.data[0]?.price.id

  let planId = 'starter'
  if (
    priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ||
    priceId === process.env.STRIPE_PRICE_ID
  ) {
    planId = 'pro'
  } else if (
    priceId === process.env.NEXT_PUBLIC_STRIPE_ADVANCED_PRICE_ID ||
    priceId === process.env.STRIPE_ADVANCED_PRICE_ID
  ) {
    planId = 'advanced'
  }

  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (findError || !user) {
    console.error('User not found by customer ID:', findError)
    return
  }

  // Check if trial just ended (subscription moved from trialing to active)
  const subscriptionStatus = subscription.status
  const updateData: Record<string, any> = { subscription_plan: planId }

  if (subscriptionStatus === 'active') {
    // Trial ended, now paying - clear trial data
    updateData.trial_ends_at = null
  } else if (subscriptionStatus === 'trialing') {
    // Still in trial
    updateData.subscription_plan = 'trialing'
    if (subscription.trial_end) {
      updateData.trial_ends_at = new Date(subscription.trial_end * 1000).toISOString()
    }
  }

  const { error: updateError } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', user.id)

  if (updateError) {
    console.error('Error updating subscription:', updateError)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (findError || !user) {
    console.error('User not found:', findError)
    return
  }

  const { error: updateError } = await supabase
    .from('users')
    .update({ subscription_plan: 'cancelled', trial_ends_at: null })
    .eq('id', user.id)

  if (updateError) {
    console.error('Error cancelling user:', updateError)
  }
}