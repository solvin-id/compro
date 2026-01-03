import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { About } from '../components/sections/About'
import { Services } from '../components/sections/Services'
import { Portfolio } from '../components/sections/Portfolio'
import { Insights } from '../components/sections/Insights'
import { BackgroundLayer } from '../components/ui/BackgroundLayer'
import { TeamSchematic } from '../components/sections/TeamSchematic'
import { useEffect } from 'react'
import { useNavigateStore } from '../hooks/useNavigateStore'
import { getPublishedArticlesFn } from '@/functions/articles'

export const Route = createFileRoute('/')({
  loader: async () => {
    const articles = await getPublishedArticlesFn()
    return { articles }
  },
  component: App,
})

function Hero() {
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 500], [0, 100])
  const { t } = useTranslation()

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9] as any,
      },
    }),
  }

  return (
    <section className="min-h-screen top-0 flex items-center justify-center overflow-hidden relative pt-20">
      <div className="absolute inset-0 z-0">
        <BackgroundLayer />
      </div>

      <div
        className="absolute inset-y-0 left-0 w-1/4 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, hsl(var(--background)), hsl(var(--background) / 0.5), transparent)',
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/4 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to left, hsl(var(--background)), hsl(var(--background) / 0.5), transparent)',
        }}
      />

      <motion.div
        style={{ y: imageY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-30 pointer-events-none z-10"
      >
        <div className="absolute inset-0 border border-indigo-100/50 rounded-full" />
        <div className="absolute inset-[15%] border border-indigo-100/40 rounded-full" />
        <div className="absolute inset-[30%] border border-indigo-100/30 rounded-full" />
        <div className="absolute inset-0 bg-linear-to-tr from-indigo-50/20 to-transparent rounded-full blur-2xl" />
      </motion.div>

      <div className="max-w-5xl mx-auto px-6 relative z-20 w-full flex flex-col items-center text-center space-y-10">
        <motion.h1
          className="text-6xl md:text-8xl font-bold tracking-tight text-foreground leading-[1.1]"
          initial="hidden"
          animate="visible"
        >
          {[t('hero.headline1'), t('hero.headline2')].map((word, i) => (
            <motion.span
              key={word}
              custom={i}
              variants={textVariants}
              className="inline-block mx-3"
            >
              {word}
            </motion.span>
          ))}
          <br className="hidden md:block" />
          <motion.span
            custom={2}
            variants={textVariants}
            className="text-gradient inline-block"
          >
            {t('hero.headline3')}.
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-muted-foreground max-w-4xl leading-relaxed mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {t('hero.subtext')}
          <br className="hidden md:block" /> {t('hero.subtext2')}
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Link to="/start">
            <Button
              size="lg"
              className="rounded-full group text-lg px-8 py-6 h-auto"
            >
              {t('hero.cta')}
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/portfolio">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-lg px-8 py-6 h-auto"
            >
              {t('portfolio.viewAll')}
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          {[
            { label: '3+', value: t('hero.stats.experience') },
            { label: '10+', value: t('hero.stats.projects') },
            { label: '98%', value: t('hero.stats.clients') },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <p className="text-2xl font-bold text-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function App() {
  const { articles } = Route.useLoaderData()
  const { t } = useTranslation()
  const section = useNavigateStore((state) => state.section)
  const isNavigating = useNavigateStore((state) => state.isNavigating)
  const clearSection = useNavigateStore((state) => state.clearSection)

  useEffect(() => {
    if (!isNavigating || !section) return

    const timeout = setTimeout(() => {
      const targetId = section === 'home' ? undefined : section

      if (!targetId) {
        // @ts-ignore
        if (window.lenis) {
          // @ts-ignore
          window.lenis.scrollTo(0)
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } else {
        // @ts-ignore
        if (window.lenis) {
          // @ts-ignore
          window.lenis.scrollTo(`#${targetId}`)
        } else {
          const element = document.getElementById(targetId)
          element?.scrollIntoView({ behavior: 'smooth' })
        }
      }

      clearSection()
    }, 500)

    return () => clearTimeout(timeout)
  }, [isNavigating, section, clearSection])

  return (
    <div className="bg-background min-h-screen">
      <Hero />
      <div className="relative">
        <About />
        <Services />
        <TeamSchematic />
        <Portfolio />
        <Insights articles={articles} />
      </div>
    </div>
  )
}
