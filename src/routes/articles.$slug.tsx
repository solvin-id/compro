import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { InteractiveBackground } from '../components/ui/InteractiveBackground'
import { Button } from '../components/ui/Button'
import { getArticleBySlugFn } from '@/functions/articles'
import { ArticleRenderer } from '@/components/ArticleRenderer'
import { ImageFromStorage } from '@/components/ImageFromStorage'

export const Route = createFileRoute('/articles/$slug')({
  loader: async ({ params }) => {
    const article = await getArticleBySlugFn({ data: { slug: params.slug } })
    if (!article) {
      throw notFound()
    }
    return { article }
  },
  component: ArticleComponent,
  notFoundComponent: () => {
    const { t } = useTranslation()
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-muted-foreground">
          {t('insights.articleNotFound', 'Article not found')}
        </p>
        <Link to="/articles">
          <Button variant="outline">
            {t('insights.backToArticles', 'Back to Articles')}
          </Button>
        </Link>
      </div>
    )
  },
})

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function ArticleComponent() {
  const { article } = Route.useLoaderData()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <InteractiveBackground />
      </div>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto px-6 relative z-10"
      >
        <Link
          to="/articles"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-brand-primary mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.backToInsights', 'Back to Insights')}
        </Link>

        <header className="mb-12 space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border text-brand-secondary font-medium">
              <Tag className="w-3.5 h-3.5" />
              {article.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {article.readTime || '5 min read'}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            {article.title}
          </h1>

          {article.authorName && (
            <div className="flex items-center gap-3 pt-4">
              <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-medium">
                {article.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {article.authorName}
                </p>
                <p className="text-xs text-muted-foreground">Author</p>
              </div>
            </div>
          )}
        </header>

        {article.coverImage && (
          <div className="mb-12 rounded-2xl overflow-hidden border border-border">
            <ImageFromStorage
              objectKey={article.coverImage}
              alt={article.coverImageAlt || article.title}
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl leading-relaxed font-medium text-foreground mb-8">
            {article.summary}
          </p>

          <ArticleRenderer content={article.content} />
        </div>

        <div className="mt-20 pt-10 border-t border-border text-center">
          <p className="text-muted-foreground mb-6 font-medium">
            {t('insights.enjoyedPerspective', 'Enjoyed this perspective?')}
          </p>
          <Button size="lg" className="rounded-full">
            {t('insights.discussStrategy', "Let's Discuss Your Strategy")}
          </Button>
        </div>
      </motion.article>
    </div>
  )
}
