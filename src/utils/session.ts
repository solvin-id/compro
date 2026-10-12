const SESSION_COOKIE_NAME = 'solvin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7

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
