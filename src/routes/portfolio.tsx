import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { portfolio } from '../data'
import { Button } from '../components/ui/Button'
import { useMountedTheme } from '@/hooks/useMountedTheme'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/portfolio')({
  component: PortfolioPage,
})

function PortfolioPage() {
  const { t } = useTranslation()
  const { theme } = useMountedTheme()

  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden bg-transparent">
      {/* Static Background for better performance */}
      <div className="absolute inset-0 z-0 bg-linear-to-br from-blue-50/50 dark:from-blue-950/20 via-transparent to-purple-50/50 dark:to-purple-950/20 pointer-events-none" />

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
            {t('portfolio.pageTitle')}{' '}
            <span className="text-gradient">
              {t('portfolio.pageTitleGradient')}
            </span>
            .
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            {t('portfolio.pageSubtitle')}
          </motion.p>
        </header>

        <div className="space-y-24">
          {portfolio.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="grid lg:grid-cols-2 gap-12 items-start group"
            >
              {/* Project Visual / Summary Card */}
              <div
                className={`rounded-3xl bg-muted/50 dark:bg-card/30 border border-border p-8 md:p-12 h-full flex flex-col justify-between ${index % 2 === 1 ? 'lg:order-2' : ''}`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-background border border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.sector}
                    </span>
                    <span className="text-muted-foreground font-mono text-sm">
                      {item.year}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    {item.description}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {item.techStack?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-background rounded-md text-sm font-medium text-muted-foreground shadow-sm border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detailed Case Study */}
              <div
                className={`space-y-10 py-4 ${index % 2 === 1 ? 'lg:order-1' : ''}`}
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary">
                    {t('portfolio.theClient')}
                  </h3>
                  <p className="text-xl font-medium text-foreground">
                    {item.client || t('portfolio.confidentialClient')}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    {t('portfolio.theProblem')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.problem || t('portfolio.defaultProblem')}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-secondary">
                    {t('portfolio.theSolution')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.solution || t('portfolio.defaultSolution')}
                  </p>

                  <div
                    className={cn(
                      theme === 'light' && 'bg-green-50 border-green-100',
                      theme !== 'light' &&
                        'bg-green-950/30 border-green-900/50',
                      'rounded-xl p-6 border flex items-start gap-3 mt-4',
                    )}
                  >
                    <CheckCircle
                      className={cn(
                        theme === 'light' && 'text-green-600',
                        theme !== 'light' && 'text-green-400',
                        'w-6 h-6 shrink-0',
                      )}
                    />
                    <div>
                      <h4
                        className={cn(
                          theme === 'light' && 'text-green-900',
                          theme !== 'light' && 'text-green-300',
                          'font-bold text-sm uppercase tracking-wide mb-1',
                        )}
                      >
                        {t('portfolio.impact')}
                      </h4>
                      <p
                        className={cn(
                          theme === 'light' && 'text-green-800',
                          theme !== 'light' && 'text-green-400',
                          'font-medium',
                        )}
                      >
                        {item.outcome || t('portfolio.defaultOutcome')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-32 text-center bg-foreground dark:bg-card rounded-[3rem] p-12 md:p-24 relative overflow-hidden border border-border">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-purple-600/20" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-background dark:text-foreground">
              {t('portfolio.ctaTitle')}
            </h2>
            <p className="text-muted-foreground text-xl">
              {t('portfolio.ctaSubtitle')}
            </p>
            <Link to="/start">
              <Button size="lg" className="rounded-full h-14 px-10 text-lg">
                {t('portfolio.startProject')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
