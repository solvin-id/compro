import { ArrowRight, Clock, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { Link } from '@tanstack/react-router'
import { ImageFromStorage } from '@/components/ImageFromStorage'
import type { Article } from '@/db/schema'

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

  // Handle empty state
  if (!articles || articles.length === 0) {
    return (
      <section id="insights" className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('insights.title')}
            </h2>
            <p className="text-muted-foreground max-w-xl">
              {t('insights.subtitle')}
            </p>
          </div>
        </div>
        <div className="text-center py-16">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            {t(
              'insights.noArticles',
              'No articles available yet. Check back soon!',
            )}
          </p>
        </div>
      </section>
    )
  }

  const featured = articles[0]
  const others = articles.slice(1, 4) // Limit to 3 other articles

  return (
    <section id="insights" className="py-24 max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t('insights.title')}
          </h2>
          <p className="text-muted-foreground max-w-xl">
            {t('insights.subtitle')}
          </p>
        </div>
        <Link to="/articles">
          <Button variant="ghost" className="gap-2 group hidden md:flex">
            {t('insights.viewAll')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <Link
          to="/articles/$slug"
          params={{ slug: featured.slug }}
          className="group cursor-pointer space-y-4"
        >
          <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {featured.coverImage ? (
              <ImageFromStorage
                objectKey={featured.coverImage}
                alt={featured.coverImageAlt || featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 font-mono">
                [FEATURED_IMAGE]
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="text-brand-primary">{featured.category}</span>
              <span>•</span>
              <span>{formatDate(featured.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {featured.readTime || '5 min read'}
              </span>
            </div>
            <h3 className="text-3xl font-bold group-hover:text-brand-primary transition-colors">
              {featured.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {featured.summary}
            </p>
            <div className="flex items-center gap-2 text-brand-primary font-medium pt-2">
              {t('insights.readStory')}{' '}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </Link>

        {others.length > 0 && (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {others.map((article) => (
              <Link
                key={article.slug}
                to="/articles/$slug"
                params={{ slug: article.slug }}
                className="group py-8 first:pt-0 flex gap-6 items-start cursor-pointer"
              >
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-xl shrink-0 border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {article.coverImage ? (
                    <ImageFromStorage
                      objectKey={article.coverImage}
                      alt={article.coverImageAlt || article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase">
                    <span className="text-muted-foreground">
                      {article.category}
                    </span>
                    <span>•</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <h4 className="text-xl font-bold group-hover:text-brand-primary transition-colors leading-tight">
                    {article.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="md:hidden mt-8">
        <Link to="/articles">
          <Button variant="outline" className="w-full justify-center">
            {t('insights.viewAll')}
          </Button>
        </Link>
      </div>
    </section>
  )
}
