import { Link } from '@tanstack/react-router'
import { ArrowRight, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Article } from '@/db/schema'
import { ImageFromStorage } from '@/components/ImageFromStorage'
import { BoundingBoxFrame, SchematicSectionHeader } from '../ui/blueprint'

interface InsightsProps {
  articles: Article[]
}

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function Insights({ articles }: InsightsProps) {
  const { t } = useTranslation()
  const featured = articles[0]
  const others = articles.slice(1, 4)

  return (
    <section
      id="insights"
      aria-labelledby="insights-title"
      className="border-b border-line"
    >
      <div className="p-5 md:p-8 lg:p-12">
        <SchematicSectionHeader
          index={7}
          total={7}
          id="insights"
          label="INSIGHTS"
          title={t('insights.title')}
          description={t('insights.subtitle')}
          actions={
            <Link
              to="/articles"
              className="label-mono inline-flex items-center gap-1 text-accent-strong hover:underline"
            >
              {t('insights.viewAll')} →
            </Link>
          }
        />

        {articles.length === 0 ? (
          <div className="mt-12 border border-line p-8">
            <p className="label-mono text-ink-muted">
              {t('insights.noArticles')}
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              {t('insights.noArticlesDesc')}
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <BoundingBoxFrame
                as="article"
                label="INS-01"
                meta={featured.category}
                className="bg-surface"
              >
                <Link
                  to="/articles/$slug"
                  params={{ slug: featured.slug }}
                  className="block"
                >
                  <div className="aspect-video w-full overflow-hidden bg-surface-2">
                    {featured.coverImage ? (
                      <ImageFromStorage
                        objectKey={featured.coverImage}
                        alt={featured.coverImageAlt || featured.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        fallback={
                          <span className="label-mono flex h-full items-center justify-center text-ink-muted">
                            [FEATURED_IMAGE]
                          </span>
                        }
                      />
                    ) : (
                      <span className="label-mono flex h-full items-center justify-center text-ink-muted">
                        [FEATURED_IMAGE]
                      </span>
                    )}
                  </div>

                  <div className="p-5 md:p-6">
                    <div className="label-mono flex flex-wrap items-center gap-x-4 gap-y-1 text-ink-muted">
                      <span className="text-accent-strong">{featured.category}</span>
                      <span>{formatDate(featured.publishedAt)}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} aria-hidden="true" />
                        {featured.readTime || '5 min read'}
                      </span>
                    </div>

                    <h3 className="display-md mt-3 text-ink">
                      {featured.title}
                    </h3>
                    <p className="mt-3 max-w-[60ch] leading-relaxed text-ink-muted">
                      {featured.summary}
                    </p>
                    <span className="label-mono mt-6 inline-flex items-center gap-1 text-accent-strong">
                      {t('insights.readStory')}
                      <ArrowRight size={12} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </BoundingBoxFrame>
            </div>

            {others.length > 0 && (
              <div className="divide-y divide-line border-y border-line lg:col-span-5">
                {others.map((article, index) => (
                  <Link
                    key={article.slug}
                    to="/articles/$slug"
                    params={{ slug: article.slug }}
                    className="group flex gap-4 p-5 md:p-6"
                  >
                    <span className="label-mono text-ink-muted">
                      0{index + 2}
                    </span>
                    <div className="min-w-0">
                      <div className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-muted">
                        <span>{article.category}</span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <h4 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-ink">
                        {article.title}
                      </h4>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                        {article.summary}
                      </p>
                      <span className="label-mono mt-3 inline-flex items-center gap-1 text-ink-muted transition-colors duration-150 ease-cad group-hover:text-accent-strong">
                        {t('insights.readArticle')}
                        <ArrowRight size={12} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
