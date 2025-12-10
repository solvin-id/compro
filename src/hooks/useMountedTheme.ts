'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

/**
 * A hook that safely returns theme information after client-side hydration.
 * This prevents hydration mismatches caused by server not knowing the user's theme preference.
 *
 * During SSR and initial hydration, returns `undefined` for theme values.
 * After mount, returns the actual theme value.
 *
 * @returns Object with theme, resolvedTheme, setTheme, and mounted state
 */
export function useMountedTheme() {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme, setTheme, systemTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    // Return undefined during SSR to ensure consistent rendering
    theme: mounted ? theme : undefined,
    resolvedTheme: mounted ? resolvedTheme : undefined,
    systemTheme: mounted ? systemTheme : undefined,
    setTheme,
    mounted,
  }
}
