import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

export function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1])

  return (
    <section
      ref={containerRef}
      id="about"
      className="py-24 md:py-32 relative bg-background"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Sticky Visual Side */}
        <div className="hidden md:block sticky top-32 h-fit">
          <motion.div
            style={{ opacity, scale }}
            className="aspect-square rounded-3xl border border-border/40 bg-card/20 backdrop-blur-md flex items-center justify-center relative overflow-hidden group hover:border-brand-primary transition-colors duration-500 shadow-xl shadow-muted/50 dark:shadow-none"
          >
            <div className="text-center p-8 bg-card/50 rounded-2xl backdrop-blur-sm border border-border/50">
              <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-[10px] font-mono">ISO_COMP</span>
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                [ILLUSTRATION_SLOT_2]
                <br />
                Isometric Abstract Composition
                <br />
                Gears Morphing into Cloud
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-linear-to-br from-brand-primary to-brand-purple opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          </motion.div>
        </div>

        {/* Scrolling Text Side */}
        <div className="space-y-24 md:py-12">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              {t('about.heading')}{' '}
              <span className="text-gradient">
                {t('about.headingGradient')}
              </span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('about.intro')}
            </p>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-bold">{t('about.legacyTitle')}</h3>
            <p className="text-lg text-muted-foreground">
              {t('about.legacyText')}
            </p>
            <div className="pl-6 border-l-4 border-brand-primary italic text-muted-foreground">
              "{t('about.quote')}"
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-bold">{t('about.innovationTitle')}</h3>
            <p className="text-lg text-muted-foreground">
              {t('about.innovationText')}
            </p>
          </div>

          {/* Mobile Visual Fallback */}
          <div className="md:hidden aspect-square rounded-2xl border-2 border-dashed border-border bg-muted flex items-center justify-center">
            <p className="text-xs text-center text-muted-foreground font-mono">
              [ILLUSTRATION_SLOT_2 Mobile]
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
