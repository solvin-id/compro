import { db } from '@/db'
import { users } from '@/db/schema'
import { env } from '@/env'
import {
  createSessionCookieHeader,
  createSessionToken,
  getSessionTokenFromCookies,
  verifyPassword,
  verifySessionToken,
} from '@/utils/auth'
import { createServerFn } from '@tanstack/react-start'
import { getRequest, setCookie } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const DEV_USER = {
  id: 'dev-user-001',
  email: 'admin@solvin.dev',
  name: 'Dev Admin',
  role: 'admin',
  avatar: null,
  createdAt: new Date(),
}

const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const { email, password } = data

    if (env.DEV_MODE) {
      console.log('[DEV MODE] Bypassing authentication for:', email)
      const token = 'dev-session-token-' + Date.now()

      setCookie('solvin_session', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      })

      return {
        user: DEV_USER,
        sessionCookie: createSessionCookieHeader(token),
      }
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    })

    if (!user) {
      return { error: 'Invalid credentials' }
    }

    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return { error: 'Invalid credentials' }
    }

    const token = await createSessionToken(user.id)

    const isProduction = process.env.NODE_ENV === 'production'
    setCookie('solvin_session', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
    })

    const { password: _, ...safeUser } = user
    return {
      user: safeUser,
      sessionCookie: createSessionCookieHeader(token),
    }
  })

export const logoutFn = createServerFn({
  method: 'POST',
}).handler(async () => {
  setCookie('solvin_session', '', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
  })
  return { success: true }
})

export const validateSessionFn = createServerFn({
  method: 'POST',
})
  .inputValidator(z.string().optional())
  .handler(async ({ data: token }) => {
    if (env.DEV_MODE) {
      if (token?.startsWith('dev-session-token-')) {
        console.log('[DEV MODE] Returning dev user for session validation')
        return DEV_USER
      }
      return null
    }

    if (!token) {
      return null
    }

    const session = await verifySessionToken(token)
    if (!session) {
      return null
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    })

    return user || null
  })

export const getAuthenticatedUserFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const request = getRequest()
  const cookieHeader = request?.headers.get('cookie') || ''
  const token = getSessionTokenFromCookies(cookieHeader)
  console.log('cookieHeader', cookieHeader)
  console.log(
    '[getAuthenticatedUserFn] Cookie header:',
    cookieHeader ? 'present' : 'empty',
  )
  console.log('[getAuthenticatedUserFn] Token:', token ? 'found' : 'not found')

  if (env.DEV_MODE) {
    if (token?.startsWith('dev-session-token-')) {
      console.log('[DEV MODE] Returning dev user from request cookies')
      return DEV_USER
    }
    return null
  }

  if (!token) {
    return null
  }

  const session = await verifySessionToken(token)
  if (!session) {
    return null
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
    columns: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
  })

  return user || null
})

export { getSessionTokenFromCookies } from '@/utils/auth'
