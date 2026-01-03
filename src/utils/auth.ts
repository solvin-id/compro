import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

const SALT_ROUNDS = 12
const SESSION_COOKIE_NAME = 'solvin_session'
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'solvin-secret-key-change-in-production',
)
const SESSION_MAX_AGE = 60 * 60 * 24 * 7

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS)
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  const result = await bcrypt.compare(plainPassword, hashedPassword)

  return result
}

export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifySessionToken(
  token: string,
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string }
  } catch {
    return null
  }
}

export function parseCookies(
  cookieHeader: string | null,
): Record<string, string> {
  const cookies: Record<string, string> = {}
  if (!cookieHeader) return cookies

  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.split('=')
    if (name) {
      cookies[name.trim()] = rest.join('=').trim()
    }
  })

  return cookies
}

export function getSessionTokenFromCookies(
  cookieHeader: string | null,
): string | null {
  const cookies = parseCookies(cookieHeader)
  return cookies[SESSION_COOKIE_NAME] || null
}

export function createSessionCookieHeader(token: string): string {
  const isProduction = process.env.NODE_ENV === 'production'

  return [
    `${SESSION_COOKIE_NAME}=${token}`,
    `Path=/`,
    `HttpOnly`,
    `Max-Age=${SESSION_MAX_AGE}`,
    `SameSite=Lax`,
    isProduction && 'Secure',
  ]
    .filter(Boolean)
    .join('; ')
}

export function createClearSessionCookieHeader(): string {
  return [
    `${SESSION_COOKIE_NAME}=`,
    `Path=/`,
    `HttpOnly`,
    `Max-Age=0`,
    `SameSite=Lax`,
  ].join('; ')
}

export { SESSION_COOKIE_NAME }
