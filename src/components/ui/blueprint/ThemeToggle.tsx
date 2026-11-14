'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

/**
 * Two-state paper/CAD switch wired to next-themes. SSR and the first client
 * render agree (light), so no hydration mismatch and no layout shift.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Color mode"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex h-8 w-[72px] shrink-0 items-stretch border border-line bg-surface font-mono text-[9px] uppercase tracking-[0.06em] sm:w-[168px]"
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-y-0 left-0 w-1/2 border border-accent bg-accent-soft transition-transform duration-150 ease-cad',
          isDark && 'translate-x-full',
        )}
      />
      <span
        className={cn(
          'relative z-10 flex flex-1 items-center justify-center',
          isDark ? 'text-ink-muted' : 'text-accent-strong',
        )}
      >
        <span className="hidden sm:inline">LIGHT [PAPER]</span>
        <span className="sm:hidden">LT</span>
      </span>
      <span
        className={cn(
          'relative z-10 flex flex-1 items-center justify-center',
          isDark ? 'text-accent-strong' : 'text-ink-muted',
        )}
      >
        <span className="hidden sm:inline">DARK [CAD]</span>
        <span className="sm:hidden">DK</span>
      </span>
    </button>
  )
}
