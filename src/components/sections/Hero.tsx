import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { FOOTER_CONTACT } from '@/data/footer-data'
import { buttonClassName } from '../ui/Button'
import { BoundingBoxFrame, SpecTable } from '../ui/blueprint'
import { HeroSchematic } from './HeroSchematic'

export function Hero() {
  const { t } = useTranslation()

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="border-b border-line"
    >
      <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-12">
        <div className="flex flex-col justify-between border-b border-line p-5 md:p-8 lg:col-span-7 lg:border-b-0 lg:border-r lg:p-10">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <div className="flex items-baseline gap-3">
              <span className="label-mono text-accent-strong">[FIG. 01]</span>
              <span className="label-mono text-ink-muted">
                {t('hero.kicker')}
              </span>
            </div>
            <span className="label-mono text-ink-muted">
              {t('hero.location')}
            </span>
          </div>

          <BoundingBoxFrame
            active
            measure
            label="FRAME // HERO_01"
            meta="TYPE: DISPLAY"
            data-bbox="hero"
            className="mt-10"
          >
            <h1 id="hero-title" className="display-xl p-4 text-ink md:p-6">
              <span className="block">{t('hero.headline1')}</span>
              <span className="block text-ink-muted">{t('hero.headline2')}</span>
              <span className="block text-accent-strong">{t('hero.headline3')}.</span>
            </h1>
          </BoundingBoxFrame>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
            {t('hero.subtext')}
            <br />
            {t('hero.subtext2')}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/start" className={buttonClassName('primary', 'lg')}>
              {t('hero.cta')}
            </Link>
            <Link to="/portfolio" className={buttonClassName('outline', 'lg')}>
              {t('portfolio.viewAll')}
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <span aria-hidden="true" className="h-6 w-px bg-line-strong" />
            <span className="label-mono text-ink-muted">{t('hero.scroll')}</span>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8 p-5 md:p-8 lg:col-span-5 lg:p-10">
          <div>
            <span className="label-mono text-ink-muted">{t('hero.index')}</span>
            <div className="mt-4 border border-line bg-surface-2 p-3 md:p-5">
              <HeroSchematic />
            </div>
          </div>

          <SpecTable
            rows={[
              { label: 'DISCIPLINE', value: 'Software systems' },
              { label: 'STACK', value: 'React / Go / Odoo' },
              { label: 'MODE', value: 'Paper / CAD' },
              { label: 'BASE', value: FOOTER_CONTACT.location },
              {
                label: 'STATUS',
                value: (
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 bg-accent"
                    />
                    {t('hero.status')}
                  </span>
                ),
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 border-t border-line sm:grid-cols-3 lg:col-span-12">
          {[
            'YOG 07°47′S 110°21′E',
            'SYS: OPERATIONAL',
            'MODE: PAPER / CAD',
          ].map((label) => (
            <span
              key={label}
              className="label-mono border-b border-line px-4 py-3 text-ink-muted last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
