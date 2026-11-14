import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageShell } from '@/components/layout/PageShell'
import { ArticleRenderer } from '@/components/ArticleRenderer'
import { ImageFromStorage } from '@/components/ImageFromStorage'
import { buttonClassName } from '@/components/ui/Button'
import { BoundingBoxFrame } from '@/components/ui/blueprint'
import { getArticleBySlugFn } from '@/functions/articles'

export const Route = createFileRoute('/articles/$slug')({
  loader: async ({ params }) => {
    const article = await getArticleBySlugFn({ data: { slug: params.slug } })
    if (!article) {
      throw notFound()
    }
    return { article }
  },
  component: ArticleDetail,
  notFoundComponent: ArticleNotFound,
})

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function ArticleNotFound() {
  const { t } = useTranslation()

  return (
    <PageShell>
      <div className="flex min-h-[60vh] flex-col items-start justify-center gap-6 p-5 md:p-8 lg:p-12">
        <span className="label-mono text-accent-strong">[BOUNDARY / 404]</span>
        <h1 className="display-lg text-ink">
          {t('insights.articleNotFound', 'Article not found')}
        </h1>
        <Link to="/articles" className={buttonClassName('outline', 'md')}>
          ← {t('insights.backToArticles', 'Back to Articles')}
        </Link>
      </div>
    </PageShell>
  )
}

function ArticleDetail() {
  const { t } = useTranslation()
  const { article } = Route.useLoaderData()

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
        <Link
          to="/articles"
          className="label-mono inline-flex items-center gap-1 text-ink-muted transition-colors duration-150 ease-cad hover:text-accent-strong"
        >
          ← {t('common.backToInsights', 'Back to Insights')}
        </Link>

        <header className="mt-8 border-b border-line pb-8">
          <div className="label-mono flex flex-wrap items-center gap-x-4 gap-y-1 text-ink-muted">
            <span className="text-accent-strong">{article.category}</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>{article.readTime || '5 min read'}</span>
          </div>

          <h1 className="display-lg mt-4 text-ink">{article.title}</h1>

          {article.authorName && (
            <div className="mt-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center border border-line font-mono text-[11px] uppercase text-accent-strong"
              >
                {article.authorName.charAt(0).toUpperCase()}
              </span>
              <span className="label-mono text-ink-muted">
                {article.authorName} / AUTHOR
              </span>
            </div>
          )}
        </header>

        {article.coverImage && (
          <BoundingBoxFrame className="mt-8 bg-surface">
            <ImageFromStorage
              objectKey={article.coverImage}
              alt={article.coverImageAlt || article.title}
              className="w-full"
            />
          </BoundingBoxFrame>
        )}

        <p className="mt-8 text-lg leading-relaxed text-ink md:text-xl">
          {article.summary}
        </p>

        <ArticleRenderer content={article.content} />

        <div className="mt-16 flex flex-col items-start gap-4 border border-line p-6 md:flex-row md:items-center md:justify-between">
          <p className="text-ink-muted">
            {t('insights.enjoyedPerspective', 'Enjoyed this perspective?')}
          </p>
          <Link to="/start" className={buttonClassName('primary', 'md')}>
            {t('insights.discussStrategy', "Let's Discuss Your Strategy")}
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
