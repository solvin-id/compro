import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { Portfolio } from '@/db/schema'
import { parseTechStack } from '@/lib/portfolio'
import { buttonClassName } from '../ui/Button'
import { BoundingBoxFrame, SchematicSectionHeader } from '../ui/blueprint'
import { ProjectPlate } from '../portfolio/ProjectPlate'

interface SelectedWorkProps {
  items: Portfolio[]
}

export function SelectedWork({ items }: SelectedWorkProps) {
  const { t } = useTranslation()
  const selected = items.slice(0, 3)

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="border-b border-line"
    >
      <div className="p-5 md:p-8 lg:p-12">
        <SchematicSectionHeader
          index={6}
          total={7}
          id="work"
          label="SELECTED WORK"
          title={t('portfolio.title')}
          description={t('portfolio.subtitle')}
          actions={
            <Link
              to="/portfolio"
              className="label-mono inline-flex items-center gap-1 text-accent-strong hover:underline"
            >
              FULL CATALOG [{items.length}] →
            </Link>
          }
        />

        {selected.length === 0 ? (
          <div className="mt-12 flex flex-col items-start gap-4 border border-line p-8">
            <span className="label-mono text-ink-muted">
              NO PUBLISHED ARTIFACTS
            </span>
            <Link to="/start" className={buttonClassName('outline', 'sm')}>
              {t('hero.cta')}
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid border-l border-t border-line md:grid-cols-3">
            {selected.map((item, index) => (
              <BoundingBoxFrame
                key={item.id}
                as="article"
                baseBorder={false}
                label={`PRJ-${String(item.id).padStart(2, '0')}`}
                meta={item.year}
                className="project-cell bbf--meta-inset border-r border-b border-line bg-surface"
              >
                <Link
                  to="/portfolio/$slug"
                  params={{ slug: item.slug }}
                  className="block h-full"
                >
                  <ProjectPlate item={item} index={index} />
                  <div className="p-5 pb-8">
                    <div className="label-mono flex items-center justify-between gap-3 text-ink-muted">
                      <span>{item.sector}</span>
                      <span>{item.year}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                      {item.description}
                    </p>

                    <div className="hover-reveal mt-4">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {parseTechStack(item.techStack)
                            .slice(0, 4)
                            .map((tech) => (
                              <span
                                key={tech}
                                className="label-mono border border-line px-2 py-1 text-ink-muted"
                              >
                                {tech}
                              </span>
                            ))}
                        </div>
                        <span className="label-mono mt-3 inline-flex items-center gap-1 text-accent-strong">
                          INSPECT ↗
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </BoundingBoxFrame>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
