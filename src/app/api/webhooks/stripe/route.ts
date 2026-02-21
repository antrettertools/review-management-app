import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature') || ''

    // Verify webhook signature
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Checkout session completed:', session.id)

    const planId = session.metadata?.planId
    const userId = session.metadata?.userId

    if (!planId || !userId) {
      console.error('Missing metadata in checkout session')
      return
    }

    // Update user subscription plan in database
    const { error } = await supabase
      .from('users')
      .update({
        subscription_plan: planId,
        stripe_customer_id: session.customer as string,
      })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user subscription:', error)
    } else {
      console.log('User subscription updated:', userId, planId)
    }
  } catch (error) {
    console.error('Error handling checkout session:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription updated:', subscription.id)

    const customerId = subscription.customer as string

    // Find user by stripe_customer_id
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (fetchError || !user) {
      console.error('User not found for customer:', customerId)
      return
    }

    // Determine plan from subscription items
    const priceId = subscription.items.data[0]?.price.id
    let planId = 'starter'

    if (priceId?.includes('advanced') || priceId?.includes('49')) {
      planId = 'advanced'
    }

    // Update subscription plan
    const { error: updateError } = await supabase
      .from('users')
      .update({ subscription_plan: planId })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating subscription:', updateError)
    } else {
      console.log('Subscription updated for user:', user.id, planId)
    }
  } catch (error) {
    console.error('Error handling subscription update:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription deleted:', subscription.id)

    const customerId = subscription.customer as string

    // Find user by stripe_customer_id
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (fetchError || !user) {
      console.error('User not found for customer:', customerId)
      return
    }

    // Downgrade to starter plan
    const { error: updateError } = await supabase
      .from('users')
      .update({ subscription_plan: 'starter' })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error downgrading subscription:', updateError)
    } else {
      console.log('Subscription cancelled for user:', user.id)
    }
  } catch (error) {
    console.error('Error handling subscription deletion:', error)
  }
}