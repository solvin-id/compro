import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function About() {
  const containerRef = useRef<HTMLDivElement>(null)
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
      className="py-24 md:py-32 relative bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Sticky Visual Side */}
        <div className="hidden md:block sticky top-32 h-fit">
          <motion.div
            style={{ opacity, scale }}
            className="aspect-square rounded-3xl border border-white/40 bg-white/20 backdrop-blur-md flex items-center justify-center relative overflow-hidden group hover:border-[var(--color-brand-primary)] transition-colors duration-500 shadow-xl shadow-gray-200/50"
          >
            <div className="text-center p-8 bg-white/50 rounded-2xl backdrop-blur-sm border border-white/50">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-[10px] font-mono">ISO_COMP</span>
              </div>
              <p className="text-sm text-gray-500 font-mono">
                [ILLUSTRATION_SLOT_2]
                <br />
                Isometric Abstract Composition
                <br />
                Gears Morphing into Cloud
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-purple)] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          </motion.div>
        </div>

        {/* Scrolling Text Side */}
        <div className="space-y-24 md:py-12">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              We don't just write code;{' '}
              <span className="text-gradient">we solve problems.</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              In a digital landscape cluttered with buzzwords, we provide
              clarity. Our team acts as your technical partner, translating
              complex business requirements into elegant, scalable software.
            </p>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-bold">From Legacy to Leading Edge</h3>
            <p className="text-lg text-gray-600">
              Whether you're struggling with technical debt in a monolithic
              system or looking to secure reliable future-proofing system, we
              bridge the gap. We specialize in modernization strategies that
              minimize downtime and maximize value.
            </p>
            <div className="pl-6 border-l-4 border-[var(--color-brand-primary)] italic text-gray-500">
              "Solvin transformed our 10-year-old platform into a modern
              cloud-native marvel in just 6 months."
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-bold">
              Innovation is a Process, Not a Spark
            </h3>
            <p className="text-lg text-gray-600">
              We believe in rigorous engineering disciplines paired with
              creative problem solving. Our sprint-based agile methodology
              ensures transparency and rapid iteration, keeping you in the
              driver's seat.
            </p>
          </div>

          {/* Mobile Visual Fallback */}
          <div className="md:hidden aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
            <p className="text-xs text-center text-gray-400 font-mono">
              [ILLUSTRATION_SLOT_2 Mobile]
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
