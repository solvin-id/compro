import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

const SALT_ROUNDS = 12
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'solvin-secret-key-change-in-production',
)

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

export {
  SESSION_COOKIE_NAME,
  createClearSessionCookieHeader,
  createSessionCookieHeader,
  getSessionTokenFromCookies,
  parseCookies,
} from './session'
