import { Link } from '@tanstack/react-router'
import type { Portfolio } from '@/db/schema'
import { parseTechStack } from '@/lib/portfolio'
import { BoundingBoxFrame } from '../ui/blueprint'
import { ProjectPlate } from './ProjectPlate'

interface CatalogGridProps {
  items: Portfolio[]
}

export function CatalogGrid({ items }: CatalogGridProps) {
  return (
    <div className="grid border-l border-t border-line md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
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
              <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-ink">
                {item.title}
              </h2>
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
  )
}
