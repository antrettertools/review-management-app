import crypto from 'crypto'

/**
 * HMAC-signed OAuth state parameter.
 *
 * Why: a plain Base64-encoded state can be forged by anyone, allowing CSRF
 * attacks that connect an attacker's account to another user's business.
 * We sign the payload with a server-side secret and include a timestamp so
 * stale states (>10 min) are rejected.
 */

const STATE_TTL_MS = 10 * 60 * 1000 // 10 minutes

function getSecret(): string {
  const secret =
    process.env.OAUTH_STATE_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    throw new Error(
      'OAuth state signing secret missing. Set OAUTH_STATE_SECRET (or NEXTAUTH_SECRET) in env.'
    )
  }
  return secret
}

function b64urlEncode(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function b64urlDecode(s: string): Buffer {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return Buffer.from(s, 'base64')
}

export function signOAuthState(payload: Record<string, unknown>): string {
  const body = { ...payload, iat: Date.now() }
  const json = JSON.stringify(body)
  const data = b64urlEncode(Buffer.from(json, 'utf8'))
  const sig = b64urlEncode(
    crypto.createHmac('sha256', getSecret()).update(data).digest()
  )
  return `${data}.${sig}`
}

export function verifyOAuthState<T = Record<string, unknown>>(
  state: string
): { ok: true; payload: T } | { ok: false; reason: string } {
  if (!state || typeof state !== 'string') return { ok: false, reason: 'missing' }
  const parts = state.split('.')
  if (parts.length !== 2) return { ok: false, reason: 'malformed' }
  const [data, sig] = parts
  const expected = b64urlEncode(
    crypto.createHmac('sha256', getSecret()).update(data).digest()
  )
  // Constant-time compare
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, reason: 'bad_signature' }
  }
  let parsed: any
  try {
    parsed = JSON.parse(b64urlDecode(data).toString('utf8'))
  } catch {
    return { ok: false, reason: 'unparseable' }
  }
  if (typeof parsed?.iat !== 'number' || Date.now() - parsed.iat > STATE_TTL_MS) {
    return { ok: false, reason: 'expired' }
  }
  return { ok: true, payload: parsed as T }
}
