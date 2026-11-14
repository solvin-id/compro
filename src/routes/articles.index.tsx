import { createFileRoute, Link } from '@tanstack/react-router'
import { Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageShell } from '@/components/layout/PageShell'
import { ImageFromStorage } from '@/components/ImageFromStorage'
import { BoundingBoxFrame, SpecTable } from '@/components/ui/blueprint'
import { getPublishedArticlesFn } from '@/functions/articles'

export const Route = createFileRoute('/articles/')({
  loader: async () => {
    const articles = await getPublishedArticlesFn()
    return { articles }
  },
  component: ArticlesPage,
})

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function ArticlesPage() {
  const { t } = useTranslation()
  const { articles } = Route.useLoaderData()

  return (
    <PageShell>
      <header className="border-b border-line p-5 md:p-8 lg:p-12">
        <span className="label-mono text-accent-strong">[INDEX / INSIGHTS]</span>

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h1 className="display-lg text-ink">
              {t('insights.pageTitle')}{' '}
              <span className="text-accent-strong">
                {t('insights.pageTitleGradient')}
              </span>
              .
            </h1>
            <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-ink-muted md:text-lg">
              {t('insights.pageSubtitle')}
            </p>
          </div>

          <div className="lg:col-span-4">
            <SpecTable
              rows={[
                { label: 'ARTICLES', value: articles.length },
                { label: 'STATUS', value: 'PUBLISHED' },
              ]}
            />
          </div>
        </div>
      </header>

      <div className="p-5 md:p-8 lg:p-12">
        {articles.length === 0 ? (
          <div className="border border-line p-8">
            <p className="label-mono text-ink-muted">
              {t('insights.noArticles')}
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              {t('insights.noArticlesDesc')}
            </p>
          </div>
        ) : (
          <div className="grid border-l border-t border-line md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <BoundingBoxFrame
                key={article.slug}
                as="article"
                baseBorder={false}
                label={`INS-${String(index + 1).padStart(2, '0')}`}
                className="bbf--meta-inset border-r border-b border-line bg-surface"
              >
                <Link
                  to="/articles/$slug"
                  params={{ slug: article.slug }}
                  className="flex h-full flex-col"
                >
                  <div className="aspect-video w-full overflow-hidden bg-surface-2">
                    {article.coverImage ? (
                      <ImageFromStorage
                        objectKey={article.coverImage}
                        alt={article.coverImageAlt || article.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        fallback={
                          <span className="label-mono blueprint-grid flex h-full items-center justify-center text-ink-muted">
                            [ARTICLE_IMAGE]
                          </span>
                        }
                      />
                    ) : (
                      <span className="label-mono blueprint-grid flex h-full items-center justify-center text-ink-muted">
                        [ARTICLE_IMAGE]
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5 pb-7">
                    <div className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-muted">
                      <span className="text-accent-strong">{article.category}</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>

                    <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-ink">
                      {article.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                      {article.summary}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                      <span className="label-mono flex items-center gap-1 text-ink-muted">
                        <Clock size={10} aria-hidden="true" />
                        {article.readTime || '5 min read'}
                      </span>
                      <span className="label-mono text-accent-strong">
                        {t('insights.readArticle')} ↗
                      </span>
                    </div>
                  </div>
                </Link>
              </BoundingBoxFrame>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
