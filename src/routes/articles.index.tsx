import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { articles } from '../data'
import { InteractiveBackground } from '../components/ui/InteractiveBackground'

export const Route = createFileRoute('/articles/')({
  component: ArticlesPage,
})

function ArticlesPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden bg-white">
      {/* Background with reduced opacity for performance/readability */}
      <div className="absolute inset-0 z-0 opacity-10">
        <InteractiveBackground />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.backToHome')}
        </Link>

        <header className="mb-20 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-dark-text mb-6"
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
            className="text-xl text-gray-600"
          >
            {t('insights.pageSubtitle')}
          </motion.p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => (
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
                className="h-full bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col"
              >
                {/* Image Placeholder */}
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-tr from-gray-200 to-gray-50 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-mono text-xs">
                    [ARTICLE_IMAGE]
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-xs font-medium text-gray-500 mb-4">
                    <span className="text-brand-primary bg-blue-50 px-2 py-1 rounded-md">
                      {article.category}
                    </span>
                    <span>{article.date}</span>
                  </div>

                  <h2 className="text-xl font-bold text-dark-text mb-3 group-hover:text-brand-primary transition-colors leading-tight">
                    {article.title}
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                    {article.summary}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} /> {article.readTime}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-dark-text group-hover:translate-x-1 transition-transform">
                      {t('insights.readArticle')} <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
