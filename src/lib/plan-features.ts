export type PlanType = 'starter' | 'advanced'

export const planFeatures: Record<PlanType, {
  maxBusinesses: number
  maxAIResponses: number
  analyticsRetention: number // days
  googleIntegration: boolean
  customTemplates: boolean
  priority: boolean
}> = {
  starter: {
    maxBusinesses: 1,
    maxAIResponses: 5, // per day
    analyticsRetention: 30,
    googleIntegration: true,
    customTemplates: false,
    priority: false,
  },
  advanced: {
    maxBusinesses: 99,
    maxAIResponses: -1, // unlimited
    analyticsRetention: 365,
    googleIntegration: true,
    customTemplates: true,
    priority: true,
  },
}

export function canCreateBusiness(plan: PlanType, currentBusinessCount: number): boolean {
  return currentBusinessCount < planFeatures[plan].maxBusinesses
}

export function canUseAI(plan: PlanType, dailyUsage: number): boolean {
  const limit = planFeatures[plan].maxAIResponses
  if (limit === -1) return true // unlimited
  return dailyUsage < limit
}

export function hasFeature(plan: PlanType, feature: keyof typeof planFeatures.starter): boolean {
  return (planFeatures[plan][feature] as boolean)
}