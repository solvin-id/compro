import { useTranslation } from 'react-i18next'
import { FOOTER_CONTACT } from '@/data/footer-data'
import {
  BlueprintGridContainer,
  BoundingBoxFrame,
  SchematicSectionHeader,
  SpecTable,
} from '../ui/blueprint'

export function Profile() {
  const { t } = useTranslation()

  return (
    <section
      id="profile"
      aria-labelledby="profile-title"
      className="border-b border-line"
    >
      <div className="p-5 md:p-8 lg:p-12">
        <SchematicSectionHeader
          index={2}
          total={7}
          id="profile"
          label="PROFILE"
          coord="06°12′S / 106°49′E"
          title={
            <>
              {t('about.heading')}{' '}
              <span className="text-accent-strong">{t('about.headingGradient')}</span>
            </>
          }
          description={t('about.intro')}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SpecTable
              rows={[
                { label: 'FOUNDED', value: '2022' },
                { label: 'BASE', value: FOOTER_CONTACT.location },
                { label: 'DISCIPLINE', value: 'Software systems' },
                { label: 'TEAM', value: '05 operators' },
                { label: 'STATUS', value: t('hero.status') },
              ]}
            />
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:col-span-8">
            <div>
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-ink">
                {t('about.legacyTitle')}
              </h3>
              <p className="mt-3 max-w-[72ch] leading-relaxed text-ink-muted">
                {t('about.legacyText')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-ink">
                {t('about.innovationTitle')}
              </h3>
              <p className="mt-3 max-w-[72ch] leading-relaxed text-ink-muted">
                {t('about.innovationText')}
              </p>
            </div>

            <BoundingBoxFrame
              label="NOTE // FIELD_01"
              meta="SRC: CLIENT"
              className="bg-surface p-6 md:col-span-2"
            >
              <blockquote className="max-w-[72ch] text-lg leading-relaxed text-ink md:text-xl">
                “{t('about.quote')}”
              </blockquote>
              <p className="label-mono mt-4 text-ink-muted">
                CLIENT / PLATFORM MODERNISATION
              </p>
            </BoundingBoxFrame>
          </div>
        </div>

        <BlueprintGridContainer
          grid
          crosshairs
          className="mt-12 grid grid-cols-2 md:grid-cols-4"
        >
          {[
            { value: '3+', label: t('hero.stats.experience') },
            { value: '10+', label: t('hero.stats.projects') },
            { value: '98%', label: t('hero.stats.clients') },
            { value: '05', label: 'TEAM / OPERATORS' },
          ].map((metric) => (
            <div
              key={metric.label}
              className="border-b border-r border-line p-5 last:border-r-0 md:border-b-0 md:p-6"
            >
              <p className="display-md text-ink">{metric.value}</p>
              <p className="label-mono mt-3 text-ink-muted">{metric.label}</p>
            </div>
          ))}
        </BlueprintGridContainer>
      </div>
    </section>
  )
}
