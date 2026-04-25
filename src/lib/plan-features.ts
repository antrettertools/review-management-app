/**
 * Subscription plan definitions.
 *
 * The app sells a single paid plan ("pro") at $39.99/month with a 14-day
 * free trial. Internal subscription_plan column on users may temporarily
 * hold 'pending' (signup, no payment yet), 'trialing' (active trial),
 * 'pro' (active paid), or 'cancelled'.
 */
export type PlanType = 'pro'

export type SubscriptionStatus = PlanType | 'pending' | 'trialing' | 'cancelled'

export const planFeatures: Record<PlanType, {
  maxBusinesses: number
  maxAIResponses: number
  analyticsRetention: number // days
  googleIntegration: boolean
  customTemplates: boolean
  priority: boolean
}> = {
  pro: {
    maxBusinesses: 99,
    maxAIResponses: -1, // unlimited
    analyticsRetention: 365,
    googleIntegration: true,
    customTemplates: true,
    priority: true,
  },
}

const FREE_FEATURES = planFeatures.pro // trial users get full Pro access

export function getEntitlements(status: SubscriptionStatus) {
  if (status === 'cancelled' || status === 'pending') {
    // Locked out — only allow read-only behaviour at the call site.
    return {
      maxBusinesses: 0,
      maxAIResponses: 0,
      analyticsRetention: 0,
      googleIntegration: false,
      customTemplates: false,
      priority: false,
    }
  }
  // 'trialing' and 'pro' both get full access during the trial / paid period.
  return FREE_FEATURES
}

export function canCreateBusiness(status: SubscriptionStatus, currentBusinessCount: number): boolean {
  return currentBusinessCount < getEntitlements(status).maxBusinesses
}

export function canUseAI(status: SubscriptionStatus, dailyUsage: number): boolean {
  const limit = getEntitlements(status).maxAIResponses
  if (limit === -1) return true
  return dailyUsage < limit
}

export function hasFeature(
  status: SubscriptionStatus,
  feature: keyof typeof planFeatures.pro
): boolean {
  return Boolean(getEntitlements(status)[feature])
}
