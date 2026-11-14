import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageShell } from '@/components/layout/PageShell'
import { ProjectPlate } from '@/components/portfolio/ProjectPlate'
import { buttonClassName } from '@/components/ui/Button'
import {
  BlueprintGridContainer,
  BoundingBoxFrame,
  SpecTable,
} from '@/components/ui/blueprint'
import { parseTechStack } from '@/lib/portfolio'
import { getPortfolioItemBySlugFn } from '@/functions/portfolio'

export const Route = createFileRoute('/portfolio/$slug')({
  loader: async ({ params }) => {
    const item = await getPortfolioItemBySlugFn({ data: { slug: params.slug } })
    if (!item) {
      throw notFound()
    }
    return { item }
  },
  component: ProjectSpecSheet,
  notFoundComponent: CaseFileNotFound,
})

function CaseFileNotFound() {
  const { t } = useTranslation()

  return (
    <PageShell>
      <div className="flex min-h-[60vh] flex-col items-start justify-center gap-6 p-5 md:p-8 lg:p-12">
        <span className="label-mono text-accent-strong">[BOUNDARY / 404]</span>
        <h1 className="display-lg text-ink">CASE FILE NOT FOUND</h1>
        <Link to="/portfolio" className={buttonClassName('outline', 'md')}>
          ← {t('portfolio.backToCatalog')}
        </Link>
      </div>
    </PageShell>
  )
}

function ProjectSpecSheet() {
  const { t } = useTranslation()
  const { item } = Route.useLoaderData()
  const tech = parseTechStack(item.techStack)
  const fileId = `PRJ-${String(item.id).padStart(2, '0')}`

  const blocks: { index: string; label: string; body: React.ReactNode }[] = [
    {
      index: '01',
      label: 'OVERVIEW',
      body: (
        <>
          <p className="mt-4 max-w-[72ch] leading-relaxed text-ink-muted">
            {item.description}
          </p>
          <p className="label-mono mt-4 text-ink-muted">
            CLIENT / {item.client || t('portfolio.confidentialClient')}
          </p>
        </>
      ),
    },
    {
      index: '02',
      label: 'PROBLEM',
      body: (
        <p className="mt-4 max-w-[72ch] leading-relaxed text-ink-muted">
          {item.problem || t('portfolio.defaultProblem')}
        </p>
      ),
    },
    {
      index: '03',
      label: 'ARCHITECTURE BLUEPRINT',
      body: (
        <>
          <p className="mt-4 max-w-[72ch] leading-relaxed text-ink-muted">
            {item.solution || t('portfolio.defaultSolution')}
          </p>

          <span className="label-mono mt-8 block text-ink-muted">
            STACK MANIFEST
          </span>
          {tech.length > 0 ? (
            <BlueprintGridContainer grid crosshairs className="mt-3">
              {tech.map((entry, index) => (
                <div
                  key={entry}
                  className="flex items-baseline gap-4 border-b border-line px-4 py-3 last:border-b-0"
                >
                  <span className="label-mono text-ink-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink">
                    {entry}
                  </span>
                </div>
              ))}
            </BlueprintGridContainer>
          ) : (
            <p className="label-mono mt-3 text-ink-muted">
              [ STACK MANIFEST PENDING ]
            </p>
          )}
        </>
      ),
    },
    {
      index: '04',
      label: 'DELIVERY RECORD',
      body: (
        <div className="mt-4 border-l-2 border-accent bg-accent-soft p-5">
          <p className="max-w-[68ch] leading-relaxed text-ink">
            {item.outcome || t('portfolio.defaultOutcome')}
          </p>
        </div>
      ),
    },
  ]

  return (
    <PageShell>
      <header className="border-b border-line p-5 md:p-8 lg:p-12">
        <Link
          to="/portfolio"
          className="label-mono inline-flex items-center gap-1 text-ink-muted transition-colors duration-150 ease-cad hover:text-accent-strong"
        >
          ← {t('portfolio.backToCatalog')}
        </Link>

        <span className="label-mono mt-8 block text-accent-strong">
          [CASE FILE / {fileId}]
        </span>

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h1 className="display-lg text-ink">{item.title}.</h1>
            <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-ink-muted md:text-lg">
              {item.description}
            </p>
          </div>

          <div className="lg:col-span-4">
            <SpecTable
              rows={[
                {
                  label: 'CLIENT',
                  value: item.client || t('portfolio.confidentialClient'),
                },
                { label: 'SECTOR', value: item.sector },
                { label: 'YEAR', value: item.year },
                { label: 'STATUS', value: 'PUBLISHED' },
              ]}
            />
          </div>
        </div>
      </header>

      <div className="border-b border-line p-5 md:p-8">
        <BoundingBoxFrame
          active
          measure
          label="FRAME // PROJECT_HERO"
          meta="W × H"
        >
          <ProjectPlate item={item} index={0} variant="hero" />
        </BoundingBoxFrame>
      </div>

      <div className="grid lg:grid-cols-12">
        <div className="border-b border-line lg:col-span-8 lg:border-b-0 lg:border-r">
          {blocks.map((block) => (
            <section
              key={block.index}
              className="border-b border-line p-6 last:border-b-0 md:p-10"
            >
              <h2 className="label-mono text-accent-strong">
                {block.index} / {block.label}
              </h2>
              {block.body}
            </section>
          ))}
        </div>

        <aside className="p-6 md:p-10 lg:col-span-4">
          <h2 className="label-mono text-ink-muted">
            TECHNICAL SPECIFICATION
          </h2>
          <SpecTable
            className="mt-4"
            rows={[
              { label: 'FILE', value: fileId },
              { label: 'SLUG', value: item.slug },
              { label: 'SECTOR', value: item.sector },
              { label: 'YEAR', value: item.year },
              {
                label: 'CLIENT',
                value: item.client || t('portfolio.confidentialClient'),
              },
              {
                label: 'STACK',
                value: tech.length > 0 ? tech.join(' / ') : '—',
              },
              { label: 'STATUS', value: 'PUBLISHED' },
            ]}
          />

          <Link
            to="/start"
            className={buttonClassName('primary', 'md', 'mt-8 inline-flex')}
          >
            {t('portfolio.startProject')}
          </Link>
        </aside>
      </div>
    </PageShell>
  )
}
