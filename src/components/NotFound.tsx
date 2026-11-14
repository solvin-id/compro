import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageShell } from './layout/PageShell'
import { buttonClassName } from './ui/Button'

export function NotFound() {
  const { t } = useTranslation()

  return (
    <PageShell>
      <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center p-5 md:p-8">
        <div className="w-full max-w-2xl border border-line p-8 md:p-12">
          <span className="label-mono text-accent-strong">[BOUNDARY / 404]</span>

          <p className="display-xl mt-4 text-ink">404</p>

          <h1 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-ink md:text-3xl">
            {t('notFound.title')}
          </h1>
          <p className="mt-3 leading-relaxed text-ink-muted">
            {t('notFound.description')}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className={buttonClassName('primary', 'md')}>
              {t('notFound.backHome')}
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className={buttonClassName('outline', 'md')}
            >
              {t('notFound.goBack')}
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
