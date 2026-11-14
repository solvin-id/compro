import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageShell } from '@/components/layout/PageShell'
import {
  CatalogFilters,
  type CatalogView,
} from '@/components/portfolio/CatalogFilters'
import { CatalogGrid } from '@/components/portfolio/CatalogGrid'
import { CatalogTable } from '@/components/portfolio/CatalogTable'
import { buttonClassName } from '@/components/ui/Button'
import { SpecTable } from '@/components/ui/blueprint'
import { parseTechStack } from '@/lib/portfolio'
import { getPublishedPortfolioFn } from '@/functions/portfolio'

export const Route = createFileRoute('/portfolio/')({
  loader: async () => {
    const items = await getPublishedPortfolioFn()
    return { items }
  },
  component: PortfolioCatalog,
})

function PortfolioCatalog() {
  const { t } = useTranslation()
  const { items } = Route.useLoaderData()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [stack, setStack] = useState('')
  const [year, setYear] = useState('')
  const [view, setView] = useState<CatalogView>('grid')

  const sectorOptions = useMemo(
    () => [...new Set(items.map((item) => item.sector))].sort(),
    [items],
  )
  const yearOptions = useMemo(
    () => [...new Set(items.map((item) => item.year))].sort().reverse(),
    [items],
  )
  const stackOptions = useMemo(
    () => [...new Set(items.flatMap((item) => parseTechStack(item.techStack)))].sort(),
    [items],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return items.filter((item) => {
      const tech = parseTechStack(item.techStack)

      if (needle) {
        const haystack = [
          item.title,
          item.client ?? '',
          item.description,
          item.sector,
          tech.join(' '),
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(needle)) return false
      }

      if (category && item.sector !== category) return false
      if (stack && !tech.includes(stack)) return false
      if (year && item.year !== year) return false
      return true
    })
  }, [items, query, category, stack, year])

  const activeCount = [query.trim(), category, stack, year].filter(Boolean)
    .length

  const resetFilters = () => {
    setQuery('')
    setCategory('')
    setStack('')
    setYear('')
  }

  return (
    <PageShell>
      <header className="border-b border-line p-5 md:p-8 lg:p-12">
        <span className="label-mono text-accent-strong">[INDEX / CATALOG]</span>

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h1 className="display-lg text-ink">
              {t('portfolio.pageTitle')}{' '}
              <span className="text-accent-strong">
                {t('portfolio.pageTitleGradient')}
              </span>
              .
            </h1>
            <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-ink-muted md:text-lg">
              {t('portfolio.pageSubtitle')}
            </p>
          </div>

          <div className="lg:col-span-4">
            <SpecTable
              rows={[
                { label: 'ARTIFACTS', value: items.length },
                {
                  label: 'VIEW',
                  value: view === 'grid' ? 'SCHEMATIC' : 'TECHNICAL',
                },
                { label: 'STATUS', value: 'PUBLISHED' },
              ]}
            />
          </div>
        </div>
      </header>

      <CatalogFilters
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        stack={stack}
        setStack={setStack}
        year={year}
        setYear={setYear}
        sectorOptions={sectorOptions}
        stackOptions={stackOptions}
        yearOptions={yearOptions}
        onReset={resetFilters}
        view={view}
        setView={setView}
        activeCount={activeCount}
        shown={filtered.length}
        total={items.length}
      />

      <div className="p-5 md:p-8 lg:p-12">
        {items.length === 0 ? (
          <div className="border border-line p-8">
            <p className="label-mono text-ink-muted">
              NO PUBLISHED ARTIFACTS
            </p>
            <Link
              to="/start"
              className={buttonClassName('outline', 'sm', 'mt-4')}
            >
              {t('hero.cta')}
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-line p-8">
            <p className="label-mono text-ink-muted">
              {t('portfolio.noResults')}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className={buttonClassName('outline', 'sm', 'mt-4')}
            >
              {t('portfolio.reset')}
            </button>
          </div>
        ) : view === 'grid' ? (
          <CatalogGrid items={filtered} />
        ) : (
          <CatalogTable items={filtered} />
        )}
      </div>

      <div className="border-t border-line p-5 md:p-8 lg:p-12">
        <div className="flex flex-col gap-6 border border-line p-8 md:flex-row md:items-end md:justify-between md:p-12">
          <div>
            <h2 className="display-md text-ink">{t('portfolio.ctaTitle')}</h2>
            <p className="mt-3 max-w-[52ch] leading-relaxed text-ink-muted">
              {t('portfolio.ctaSubtitle')}
            </p>
          </div>
          <Link to="/start" className={buttonClassName('primary', 'lg')}>
            {t('portfolio.startProject')}
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
