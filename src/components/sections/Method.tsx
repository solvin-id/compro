import { useTranslation } from 'react-i18next'
import { SchematicSectionHeader } from '../ui/blueprint'

const STEPS = [
  'discovery',
  'architecture',
  'build',
  'harden',
  'handover',
] as const

export function Method() {
  const { t } = useTranslation()

  return (
    <section
      id="method"
      aria-labelledby="method-title"
      className="border-b border-line"
    >
      <div className="p-5 md:p-8 lg:p-12">
        <SchematicSectionHeader
          index={4}
          total={7}
          id="method"
          label="METHOD"
          title={t('method.title')}
          description={t('method.subtitle')}
        />

        <div className="mt-12 flex flex-wrap items-baseline justify-between gap-2">
          <span className="label-mono text-ink-muted">PROCESS // 05 GATES</span>
          <span className="label-mono text-ink-muted">MODE: FIXED SEQUENCE</span>
        </div>

        <ol className="mt-4 grid border border-line lg:grid-cols-5">
          {STEPS.map((step, index) => (
            <li
              key={step}
              className="flex flex-col justify-between border-b border-line p-6 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <div>
                <span className="label-mono text-accent-strong">
                  GATE {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-ink">
                  {t(`method.steps.${step}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {t(`method.steps.${step}.body`)}
                </p>
              </div>
              <p className="label-mono mt-8 border-t border-line pt-3 text-ink-muted">
                OUTPUT / {t(`method.steps.${step}.output`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
