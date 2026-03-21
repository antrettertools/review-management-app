export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

export const PRO_PLAN = {
  id: 'pro',
  name: 'ReviewInzight Pro',
  price: 39.99,
  priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
  features: [
    'Unlimited Businesses',
    'Unlimited AI Responses',
    'Full Analytics',
    'Priority Support',
    'Google Reviews Integration',
  ],
}