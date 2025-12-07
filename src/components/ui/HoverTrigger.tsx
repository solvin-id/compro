import { useCursorStore, CursorVariant } from '../../hooks/useCursorStore'

interface HoverTriggerProps {
  children: React.ReactNode
  variant?: CursorVariant
  className?: string
}

export function HoverTrigger({
  children,
  variant = 'button',
  className = '',
}: HoverTriggerProps) {
  const setVariant = useCursorStore((state) => state.setVariant)

  return (
    <div
      className={className}
      onMouseEnter={() => setVariant(variant)}
      onMouseLeave={() => setVariant('default')}
    >
      {children}
    </div>
  )
}
