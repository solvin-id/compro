'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Live pointer coordinates in the page chrome. Writes straight to the DOM so
 * pointer movement never re-renders React.
 */
export function CoordinateReadout({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    let frame = 0
    let x = 0
    let y = 0

    const write = () => {
      frame = 0
      if (ref.current) {
        ref.current.textContent = `X:${String(Math.max(0, Math.round(x))).padStart(4, '0')} / Y:${String(Math.max(0, Math.round(y))).padStart(4, '0')}`
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      if (frame) return
      frame = requestAnimationFrame(write)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        'font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted tabular-nums',
        className,
      )}
    >
      X:0000 / Y:0000
    </span>
  )
}
