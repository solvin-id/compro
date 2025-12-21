'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function useMountedTheme() {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme, setTheme, systemTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    theme: mounted ? theme : undefined,
    resolvedTheme: mounted ? resolvedTheme : undefined,
    systemTheme: mounted ? systemTheme : undefined,
    setTheme,
    mounted,
  }
}
