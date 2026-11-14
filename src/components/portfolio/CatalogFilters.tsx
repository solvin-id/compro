import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export type CatalogView = 'grid' | 'index'

interface CatalogFiltersProps {
  query: string
  setQuery: (value: string) => void
  category: string
  setCategory: (value: string) => void
  stack: string
  setStack: (value: string) => void
  year: string
  setYear: (value: string) => void
  sectorOptions: string[]
  stackOptions: string[]
  yearOptions: string[]
  onReset: () => void
  view: CatalogView
  setView: (view: CatalogView) => void
  activeCount: number
  shown: number
  total: number
}

const ALL = 'ALL'

export function CatalogFilters({
  query,
  setQuery,
  category,
  setCategory,
  stack,
  setStack,
  year,
  setYear,
  sectorOptions,
  stackOptions,
  yearOptions,
  onReset,
  view,
  setView,
  activeCount,
  shown,
  total,
}: CatalogFiltersProps) {
  const { t } = useTranslation()

  const selectClassName =
    'h-10 w-full border border-line bg-surface px-3 pr-8 font-mono text-[10px] uppercase tracking-[0.06em] text-ink focus:border-accent focus:outline-none'

  const selects = [
    {
      label: t('portfolio.filterCategory'),
      value: category,
      onChange: setCategory,
      options: sectorOptions,
    },
    {
      label: t('portfolio.filterStack'),
      value: stack,
      onChange: setStack,
      options: stackOptions,
    },
    {
      label: t('portfolio.filterYear'),
      value: year,
      onChange: setYear,
      options: yearOptions,
    },
  ]

  return (
    <div className="sticky top-16 z-30 border-y border-line bg-canvas/95 backdrop-blur">
      <div className="px-5 py-4 md:px-8 lg:px-12">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px_180px_140px_auto_auto] xl:items-end">
          <label className="block">
            <span className="label-mono text-ink-muted">SEARCH</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('portfolio.searchPlaceholder')}
              className="mt-1 h-10 w-full border border-line bg-surface px-3 font-mono text-xs text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
            />
          </label>

          {selects.map((select) => (
            <label key={select.label} className="block">
              <span className="label-mono text-ink-muted">{select.label}</span>
              <span className="relative mt-1 block">
                <select
                  value={select.value}
                  onChange={(event) => select.onChange(event.target.value)}
                  className={cn(selectClassName, 'bg-none')}
                >
                  <option value="">{ALL}</option>
                  {select.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
                />
              </span>
            </label>
          ))}

          <button
            type="button"
            onClick={onReset}
            disabled={activeCount === 0}
            className="h-10 self-end border border-line px-3 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted transition-colors duration-150 ease-cad hover:border-accent hover:text-accent-strong disabled:pointer-events-none disabled:opacity-40 xl:self-auto"
          >
            {t('portfolio.reset')}
          </button>

          <div
            role="group"
            aria-label="Catalog view"
            className="flex h-10 self-end border border-line xl:self-auto"
          >
            {(
              [
                { id: 'grid' as const, label: 'GRID' },
                { id: 'index' as const, label: 'INDEX' },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={view === option.id}
                onClick={() => setView(option.id)}
                className={cn(
                  'px-3 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors duration-150 ease-cad',
                  view === option.id
                    ? 'bg-accent text-accent-ink'
                    : 'text-ink-muted hover:text-ink',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <p aria-live="polite" className="label-mono mt-3 text-ink-muted">
          QUERY: [{activeCount === 0 ? 'ALL' : String(activeCount).padStart(2, '0')}]
          {' // SHOWING '}
          {shown} OF {total} ARTIFACTS
        </p>
      </div>
    </div>
  )
}
