import { cn } from '@/lib/utils'
import { Crosshairs } from './Crosshairs'

interface BlueprintGridContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'aside'
  grid?: boolean
  crosshairs?: boolean
}

/**
 * A hairline-bounded box that can expose the drafting grid and corner
 * registration marks. Padding is the caller's concern.
 */
export function BlueprintGridContainer({
  as = 'div',
  grid = false,
  crosshairs = true,
  className,
  children,
  ...rest
}: BlueprintGridContainerProps) {
  const Tag = as as React.ElementType

  return (
    <Tag
      className={cn(
        'relative border border-line',
        grid && 'blueprint-grid',
        className,
      )}
      {...rest}
    >
      {crosshairs !== false && <Crosshairs />}
      {children}
    </Tag>
  )
}
