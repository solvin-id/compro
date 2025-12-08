'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center"
        aria-label="Toggle theme"
      >
        <div className="w-4 h-4" />
      </button>
    )
  }

  const cycleTheme = () => {
    if (theme === 'system') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('system')
    }
  }

  const currentIcon = () => {
    if (theme === 'system') {
      return <Monitor className="w-4 h-4" />
    } else if (
      theme === 'dark' ||
      (theme === 'system' && resolvedTheme === 'dark')
    ) {
      return <Moon className="w-4 h-4" />
    }
    return <Sun className="w-4 h-4" />
  }

  return (
    <button
      onClick={cycleTheme}
      className="relative w-9 h-9 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors border border-border/50"
      aria-label="Toggle theme"
      title={`Current: ${theme}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {currentIcon()}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
