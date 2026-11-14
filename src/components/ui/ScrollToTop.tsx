'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { scrollToTop } from '@/lib/scroll'

/**
 * Fixed progress square. The scroll fraction is written to `--scroll-progress`
 * on the button; React only re-renders when visibility flips.
 */
export function ScrollToTop() {
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const scrollTop = window.scrollY
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      const progress =
        maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0

      buttonRef.current?.style.setProperty(
        '--scroll-progress',
        `${Math.round(progress * 100)}%`,
      )
      setIsVisible(scrollTop > 600)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      aria-hidden={isVisible ? undefined : true}
      tabIndex={isVisible ? 0 : -1}
      style={{ '--scroll-progress': '0%' } as React.CSSProperties}
      className={cn(
        'fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center border border-line bg-surface text-ink-muted transition-opacity duration-150 ease-cad hover:border-accent hover:text-accent-strong',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <ArrowUp size={16} aria-hidden="true" />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] bg-accent"
        style={{ width: 'var(--scroll-progress)' }}
      />
    </button>
  )
}
