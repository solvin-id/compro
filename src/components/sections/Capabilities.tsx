import { Link } from '@tanstack/react-router'
import {
  ArrowUpRight,
  Cloud,
  Database,
  Globe,
  LineChart,
  Server,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FOOTER_CONTACT } from '@/data/footer-data'
import { useServicesData } from '@/hooks/useTranslatedData'
import { cn } from '@/lib/utils'
import { BoundingBoxFrame, SchematicSectionHeader } from '../ui/blueprint'

const icons: Record<string, LucideIcon> = {
  Globe,
  Server,
  Smartphone,
  Database,
  Cloud,
  LineChart,
}

const SPANS: Record<string, string> = {
  web: 'lg:col-span-7',
  backend: 'lg:col-span-5',
  mobile: 'lg:col-span-4',
  odoo: 'lg:col-span-4',
  cms: 'lg:col-span-4',
  seo: 'lg:col-span-8',
}

export function Capabilities() {
  const { t } = useTranslation()
  const services = useServicesData()

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-title"
      className="border-b border-line"
    >
      <div className="p-5 md:p-8 lg:p-12">
        <SchematicSectionHeader
          index={3}
          total={7}
          id="capabilities"
          label="CAPABILITIES"
          title={t('services.title')}
          description={t('services.subtitle')}
        />

        <div className="mt-12 grid grid-cols-1 border-l border-t border-line md:grid-cols-2 lg:grid-cols-12">
          {services.map((service, index) => {
            const Icon = icons[service.icon] ?? Globe
            return (
              <BoundingBoxFrame
                key={service.id}
                as="article"
                baseBorder={false}
                label={`SVC-${String(index + 1).padStart(2, '0')}`}
                meta={service.mode}
                className={cn(
                  'service-cell bbf--meta-inset flex flex-col border-r border-b border-line bg-surface p-6 pb-8 md:p-8',
                  SPANS[service.id],
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="text-accent-strong"
                />

                <h3 className="mt-12 text-2xl font-semibold tracking-[-0.03em] text-ink">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-ink-muted">
                  {service.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {service.tech.map((tech) => (
                    <span
                      key={tech}
                      className="label-mono border border-line px-2 py-1 text-ink-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="hover-reveal mt-6">
                  <div>
                    <span className="label-mono text-accent-strong">
                      DELIVERABLES
                    </span>
                    <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-ink-muted">
                      {service.details}
                    </p>
                    <Link
                      to="/start"
                      className="label-mono mt-4 inline-flex items-center gap-1 text-accent-strong hover:underline"
                    >
                      REQUEST SPEC
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </BoundingBoxFrame>
            )
          })}

          <BoundingBoxFrame
            as="article"
            baseBorder={false}
            label="SVC // OPEN"
            meta="UNSCOPED"
            className="service-cell bbf--meta-inset flex flex-col border-r border-b border-line bg-surface p-6 pb-8 md:p-8 lg:col-span-4"
          >
            <a
              href={FOOTER_CONTACT.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full flex-col justify-between gap-10"
            >
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-ink">
                  {t('services.unsure')}
                </h3>
                <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-ink-muted">
                  {t('services.unsureText')}
                </p>
              </div>
              <span className="label-mono inline-flex items-center gap-1 text-accent-strong">
                OPEN CHANNEL
                <ArrowUpRight size={12} aria-hidden="true" />
              </span>
            </a>
          </BoundingBoxFrame>
        </div>
      </div>
    </section>
  )
}
