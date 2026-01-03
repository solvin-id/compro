import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, ArrowUpRight, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { InteractiveBackground } from '../components/ui/InteractiveBackground'
import { getPublishedArticlesFn } from '@/functions/articles'
import { ImageFromStorage } from '@/components/ImageFromStorage'
import type { Article } from '@/db/schema'

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
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden bg-transparent">
      <div className="absolute inset-0 z-0 opacity-10">
        <InteractiveBackground />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-brand-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.backToHome')}
        </Link>

        <header className="mb-20 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6"
          >
            {t('insights.pageTitle')}{' '}
            <span className="text-gradient">
              {t('insights.pageTitleGradient')}
            </span>
            .
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            {t('insights.pageSubtitle')}
          </motion.p>
        </header>

        {articles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <FileText className="w-16 h-16 mx-auto text-muted-foreground/50 mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {t('insights.noArticles', 'No articles yet')}
            </h2>
            <p className="text-muted-foreground">
              {t(
                'insights.noArticlesDesc',
                'Check back soon for new insights and updates.',
              )}
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: Article, i: number) => (
              <Link
                key={article.slug}
                to="/articles/$slug"
                params={{ slug: article.slug }}
                className="group block"
              >
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="h-full bg-card/40 dark:bg-card/20 rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:shadow-muted/50 transition-all duration-300 flex flex-col"
                >
                  <div className="h-48 bg-muted relative overflow-hidden">
                    {article.coverImage ? (
                      <ImageFromStorage
                        objectKey={article.coverImage}
                        alt={article.coverImageAlt || article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-linear-to-tr from-muted to-card group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-mono text-xs">
                          [ARTICLE_IMAGE]
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground mb-4">
                      <span className="text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md">
                        {article.category}
                      </span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>

                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-brand-primary transition-colors leading-tight">
                      {article.title}
                    </h2>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                      {article.summary}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} /> {article.readTime || '5 min read'}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-foreground group-hover:translate-x-1 transition-transform">
                        {t('insights.readArticle')} <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
