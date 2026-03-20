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

    // Retrieve the checkout session from Stripe to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Only proceed if payment was successful
    if (session.payment_status === 'paid') {
      const userId = session.metadata?.userId
      const planId = session.metadata?.planId || 'pro'

      if (userId) {
        // Update subscription_plan in database
        // This ensures the subscription is active even if webhooks don't fire
        const { error } = await supabase
          .from('users')
          .update({ subscription_plan: planId })
          .eq('id', userId)

        if (error) {
          console.error('Error updating subscription after payment:', error)
          // Still redirect even on error - user can refresh to see updated status
        }
      }
    }

    // Redirect to dashboard regardless of payment status
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`)
  } catch (error) {
    console.error('Payment success handler error:', error)
    // Always redirect to dashboard on error
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`)
  }
}
