import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`)
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })

    const userId = session.metadata?.userId
    const isNewSignup = session.metadata?.isNewSignup === 'true'

    if (userId) {
      if (isNewSignup && session.subscription) {
        // New signup with trial - set trialing status
        const subscription = session.subscription as Stripe.Subscription
        const trialEnd = subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

        await supabase
          .from('users')
          .update({
            subscription_plan: 'trialing',
            trial_ends_at: trialEnd,
          })
          .eq('id', userId)
      } else if (session.payment_status === 'paid') {
        // Reactivation or non-trial - set active immediately
        await supabase
          .from('users')
          .update({
            subscription_plan: 'pro',
            trial_ends_at: null,
          })
          .eq('id', userId)
      }
    }

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`)
  } catch (error) {
    console.error('Payment success handler error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`)
  }
}
