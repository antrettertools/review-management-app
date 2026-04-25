/**
 * Environment variable validation.
 *
 * Why: silent missing env vars cause confusing runtime failures (Stripe
 * sessions create with empty keys, OAuth fails, AI calls 401, etc.). We
 * surface them on first import so problems show up at startup, not at
 * 2am when a user hits checkout.
 *
 * Pattern: import this module from any server-only entrypoint that needs
 * the vars. Missing vars in production THROW; in dev they just warn so
 * local hacking on a feature you don't need isn't blocked.
 */

const REQUIRED_ALWAYS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
] as const

const REQUIRED_FOR_PAYMENTS = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_PRICE_ID',
] as const

const REQUIRED_FOR_AI = ['ANTHROPIC_API_KEY'] as const

const REQUIRED_FOR_GOOGLE = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
] as const

type EnvKey =
  | (typeof REQUIRED_ALWAYS)[number]
  | (typeof REQUIRED_FOR_PAYMENTS)[number]
  | (typeof REQUIRED_FOR_AI)[number]
  | (typeof REQUIRED_FOR_GOOGLE)[number]
  | 'OAUTH_STATE_SECRET'

function check(keys: readonly string[]): string[] {
  return keys.filter((k) => !process.env[k])
}

let validated = false

export function validateEnv() {
  if (validated) return
  validated = true

  const missing = [
    ...check(REQUIRED_ALWAYS),
    ...check(REQUIRED_FOR_PAYMENTS),
    ...check(REQUIRED_FOR_AI),
    ...check(REQUIRED_FOR_GOOGLE),
  ]

  if (missing.length === 0) return

  const message =
    `Missing required environment variables: ${missing.join(', ')}.\n` +
    `Set them in .env.local (dev) or your hosting provider's env config.`

  if (process.env.NODE_ENV === 'production') {
    throw new Error(message)
  } else {
    console.warn(`[env] ${message}`)
  }
}

export function requireEnv(key: EnvKey): string {
  const v = process.env[key]
  if (!v) {
    throw new Error(`Required env var "${key}" is not set.`)
  }
  return v
}

export function getEnv(key: EnvKey, fallback = ''): string {
  return process.env[key] ?? fallback
}
