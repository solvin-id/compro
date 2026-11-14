import { useId } from 'react'
import { cn } from '@/lib/utils'

interface SchematicSectionHeaderProps {
  index: number
  total: number
  label: string
  title: React.ReactNode
  description?: string
  coord?: string
  id?: string
  actions?: React.ReactNode
  className?: string
}

/**
 * Section masthead: sheet index, mono label, coordinate readout, ruler and an
 * `h2`. The id must match the section's `aria-labelledby` target.
 */
export function SchematicSectionHeader({
  index,
  total,
  label,
  title,
  description,
  coord = 'GRID:12 / BASE:24',
  id,
  actions,
  className,
}: SchematicSectionHeaderProps) {
  const generatedId = useId()
  const titleId = id ? `${id}-title` : generatedId

  return (
    <header className={cn('relative', className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="label-mono text-accent-strong">
            [SEC-{String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}]
          </span>
          <span className="label-mono text-ink-muted">{label}</span>
        </div>
        <span className="label-mono hidden text-ink-muted sm:inline">
          {coord}
        </span>
      </div>

      <div className="ruler mt-3" />

      <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2 id={titleId} className="display-lg text-ink">
            {title}
          </h2>
          {description && (
            <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-ink-muted md:text-lg">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="lg:col-span-4 lg:justify-self-end">{actions}</div>
        )}
      </div>
    </header>
  )
}
