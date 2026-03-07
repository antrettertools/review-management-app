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
  console.log('Checkout session completed:', session.id)
  console.log('Session metadata:', session.metadata)
  console.log('Session customer:', session.customer)

  const userId = session.metadata?.userId
  const planId = session.metadata?.planId

  if (!userId || !planId) {
    console.error('Missing userId or planId in metadata')
    return
  }

  const customerId = session.customer as string

  console.log('Updating user:', userId, 'with plan:', planId, 'and customer:', customerId)

  // Update user with subscription plan and customer ID
  const { error, data } = await supabase
    .from('users')
    .update({
      subscription_plan: planId,
      stripe_customer_id: customerId,
    })
    .eq('id', userId)
    .select()

  if (error) {
    console.error('Error updating user:', error)
  } else {
    console.log('User updated successfully:', data)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id)
  console.log('Customer ID:', subscription.customer)

  const customerId = subscription.customer as string

  // Get the price ID from subscription items
  const priceId = subscription.items.data[0]?.price.id

  console.log('Price ID:', priceId)
  console.log('Advanced price ID env:', process.env.NEXT_PUBLIC_STRIPE_ADVANCED_PRICE_ID)

  // Determine plan based on price ID
  let planId = 'starter'
  if (
    priceId === process.env.NEXT_PUBLIC_STRIPE_ADVANCED_PRICE_ID ||
    priceId === process.env.STRIPE_ADVANCED_PRICE_ID
  ) {
    planId = 'advanced'
  }

  console.log('Determined plan:', planId)

  // Find user by stripe_customer_id and update
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (findError || !user) {
    console.error('User not found by customer ID:', findError)
    return
  }

  console.log('Updating user:', user.id, 'to plan:', planId)

  const { error: updateError } = await supabase
    .from('users')
    .update({ subscription_plan: planId })
    .eq('id', user.id)

  if (updateError) {
    console.error('Error updating subscription:', updateError)
  } else {
    console.log('Subscription updated to plan:', planId)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id)

  const customerId = subscription.customer as string

  // Find user and downgrade to starter
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (findError || !user) {
    console.error('User not found:', findError)
    return
  }

  console.log('Downgrading user:', user.id, 'to starter')

  const { error: updateError } = await supabase
    .from('users')
    .update({ subscription_plan: 'starter' })
    .eq('id', user.id)

  if (updateError) {
    console.error('Error downgrading user:', updateError)
  } else {
    console.log('User downgraded to starter plan')
  }
}