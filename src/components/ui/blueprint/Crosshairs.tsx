import { cn } from '@/lib/utils'

const CORNERS = [
  '-left-px -top-px',
  '-right-px -top-px',
  '-left-px -bottom-px',
  '-right-px -bottom-px',
] as const

/**
 * Four registration marks pinned to the corners of the nearest positioned
 * ancestor. Decorative only.
 */
export function Crosshairs() {
  return (
    <>
      {CORNERS.map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] leading-none text-line-strong select-none',
            corner,
          )}
        >
          +
        </span>
      ))}
    </>
  )
}
