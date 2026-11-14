import { cn } from '@/lib/utils'
import { useElementSize } from '@/hooks/useElementSize'

const CORNER_CLASSES = [
  'bbf-corner--tl',
  'bbf-corner--tr',
  'bbf-corner--bl',
  'bbf-corner--br',
] as const

export interface BoundingBoxFrameProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'article' | 'section' | 'figure'
  /** Top-left identifier badge, e.g. `FRAME // HERO_01`. */
  label?: string
  /** Bottom-right metadata badge when not measuring. */
  meta?: string
  /** Permanently selected (hero, project hero). */
  active?: boolean
  /** Measure the element and print live `W × H` in the meta badge. */
  measure?: boolean
  /** Draw the resting hairline border. Turn off inside hairline-gap grids. */
  baseBorder?: boolean
}

/**
 * A CAD-style selection frame: 1px hairline, four 6px handles and mono
 * badges. Never clips its children — handles and badges sit outside the box.
 */
export function BoundingBoxFrame({
  as = 'div',
  label,
  meta,
  active = false,
  measure = false,
  baseBorder = true,
  className,
  children,
  ...rest
}: BoundingBoxFrameProps) {
  const { ref, size } = useElementSize(measure)
  const Tag = as as React.ElementType

  const metaText = measure
    ? size.width
      ? `${size.width} × ${size.height}`
      : 'W: AUTO'
    : meta

  return (
    <Tag
      ref={ref}
      data-active={active ? 'true' : undefined}
      className={cn('bbf', !baseBorder && 'bbf--seam', className)}
      {...rest}
    >
      {CORNER_CLASSES.map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          data-bbox-corner=""
          className={cn('bbf-corner', corner)}
        />
      ))}
      {label && (
        <span aria-hidden="true" data-bbox-label="" className="bbf-badge bbf-badge--label">
          {label}
        </span>
      )}
      {metaText && (
        <span aria-hidden="true" data-bbox-meta="" className="bbf-badge bbf-badge--meta">
          {metaText}
        </span>
      )}
      {children}
    </Tag>
  )
}
