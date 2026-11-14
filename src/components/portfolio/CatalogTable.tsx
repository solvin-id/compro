import { Link } from '@tanstack/react-router'
import type { Portfolio } from '@/db/schema'
import { parseTechStack } from '@/lib/portfolio'

interface CatalogTableProps {
  items: Portfolio[]
}

const HEADERS = ['ID', 'PROJECT', 'CATEGORY', 'STACK', 'YEAR', 'ACTION']

export function CatalogTable({ items }: CatalogTableProps) {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[820px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            {HEADERS.map((header) => (
              <th
                key={header}
                scope="col"
                className="label-mono px-4 py-3 text-ink-muted"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-line last:border-b-0 hover:bg-surface"
            >
              <td className="px-4 py-4 font-mono text-[11px] text-ink-muted">
                {String(item.id).padStart(3, '0')}
              </td>
              <th scope="row" className="px-4 py-4 text-left font-normal">
                <Link
                  to="/portfolio/$slug"
                  params={{ slug: item.slug }}
                  className="text-sm font-medium text-ink transition-colors duration-150 ease-cad hover:text-accent-strong"
                >
                  {item.title}
                </Link>
              </th>
              <td className="px-4 py-4 text-sm text-ink-muted">{item.sector}</td>
              <td className="px-4 py-4 font-mono text-[11px] text-ink-muted">
                {parseTechStack(item.techStack).join(' / ')}
              </td>
              <td className="px-4 py-4 font-mono text-[11px] text-ink-muted">
                {item.year}
              </td>
              <td className="px-4 py-4">
                <Link
                  to="/portfolio/$slug"
                  params={{ slug: item.slug }}
                  className="label-mono inline-flex items-center gap-1 text-accent-strong hover:underline"
                >
                  INSPECT ↗
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
