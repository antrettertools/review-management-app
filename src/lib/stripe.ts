import { loadStripe } from '@stripe/stripe-js'

let stripePromise: ReturnType<typeof loadStripe>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
    )
  }
  return stripePromise
}

export const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19.99,
    description: 'Perfect for small businesses',
    features: [
      'Up to 1 business',
      'Unlimited reviews',
      'AI response generation',
      'Basic analytics',
      'Email support',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || '',
  },
  {
    id: 'advanced',
    name: 'Advanced',
    price: 49.99,
    description: 'For growing businesses',
    features: [
      'Unlimited businesses',
      'Unlimited reviews',
      'AI response generation',
      'Advanced analytics',
      'Priority support',
      'Custom templates',
      'API access',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_ADVANCED_PRICE_ID || '',
    recommended: true,
  },
]