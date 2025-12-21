import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { articles } from '../data'
import { InteractiveBackground } from '../components/ui/InteractiveBackground'
import { Button } from '../components/ui/Button'

export const Route = createFileRoute('/articles/$slug')({
  component: ArticleComponent,
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug)
    if (!article) {
      throw notFound()
    }
    return { article }
  },
  notFoundComponent: () => {
    const { t } = useTranslation()
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t('insights.articleNotFound')}
      </div>
    )
  },
})

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
          to="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-brand-primary mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.backToInsights')}
        </Link>

        <header className="mb-12 space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border text-brand-secondary font-medium">
              <Tag className="w-3.5 h-3.5" />
              {article.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            {article.title}
          </h1>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-8">
          <p className="text-xl leading-relaxed font-medium text-foreground">
            {article.summary}
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>

          <h2 className="text-2xl font-bold text-foreground pt-4">
            {t('insights.theChallenge')}
          </h2>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>

          <blockquote className="border-l-4 border-brand-primary pl-6 italic my-8 text-foreground bg-muted/50 py-4 rounded-r-lg">
            "Innovation distinguishes between a leader and a follower. Adopting
            these technologies is no longer an option but a specific survival
            trait."
          </blockquote>

          <h2 className="text-2xl font-bold text-foreground pt-4">
            {t('insights.implementingSolution')}
          </h2>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit.
          </p>

          <div className="bg-muted/50 p-8 rounded-2xl border border-border not-prose my-8">
            <h3 className="font-bold text-lg text-foreground mb-2">
              {t('insights.keyTakeaway')}
            </h3>
            <p className="text-muted-foreground m-0">
              Focus on incremental adoption rather than "big bang" rewrites.
              This approach mitigates risk while delivering continuous value to
              stakeholders.
            </p>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-border text-center">
          <p className="text-muted-foreground mb-6 font-medium">
            {t('insights.enjoyedPerspective')}
          </p>
          <Button size="lg" className="rounded-full">
            {t('insights.discussStrategy')}
          </Button>
        </div>
      </motion.article>
    </div>
  )
}
