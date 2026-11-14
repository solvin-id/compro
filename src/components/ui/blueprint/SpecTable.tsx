import { cn } from '@/lib/utils'

export interface SpecRow {
  label: string
  value: React.ReactNode
}

interface SpecTableProps {
  rows: SpecRow[]
  dense?: boolean
  className?: string
}

/**
 * Two-column definition list used for technical specifications.
 */
export function SpecTable({ rows, dense = false, className }: SpecTableProps) {
  return (
    <dl className={cn('divide-y divide-line border-t border-line', className)}>
      {rows.map((row, index) => (
        <div
          key={`${row.label}-${index}`}
          className={cn(
            'grid grid-cols-[minmax(96px,0.4fr)_1fr] items-baseline gap-4',
            dense ? 'py-2' : 'py-3',
          )}
        >
          <dt className="label-mono text-ink-muted">{row.label}</dt>
          <dd className="text-sm text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
