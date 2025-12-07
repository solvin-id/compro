import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { portfolio } from '../data'
import { Button } from '../components/ui/Button'

export const Route = createFileRoute('/portfolio')({
  component: PortfolioPage,
})

function PortfolioPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden bg-white">
      {/* Static Background for better performance */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[var(--color-brand-primary)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <header className="mb-20 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--color-dark-text)] mb-6"
          >
            Proof of <span className="text-gradient">Competence</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            We don't just claim expertise. We ship production-grade systems for
            ambitious companies. Here are a few selected case studies.
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
                className={`rounded-3xl bg-gray-50 border border-gray-100 p-8 md:p-12 h-full flex flex-col justify-between ${index % 2 === 1 ? 'lg:order-2' : ''}`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {item.sector}
                    </span>
                    <span className="text-gray-400 font-mono text-sm">
                      {item.year}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-[var(--color-dark-text)] mb-4">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    {item.description}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {item.techStack?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-white rounded-md text-sm font-medium text-gray-600 shadow-sm border border-gray-100"
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
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-brand-primary)]">
                    The Client
                  </h3>
                  <p className="text-xl font-medium text-gray-900">
                    {item.client || 'Confidential Enterprise Client'}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                    The Problem
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.problem ||
                      'Legacy systems impacting operational efficiency and scalability.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-brand-secondary)]">
                    The Solvin Solution
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.solution ||
                      'Custom architecture designed for high availability.'}
                  </p>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-100 flex items-start gap-3 mt-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-green-900 text-sm uppercase tracking-wide mb-1">
                        Impact
                      </h4>
                      <p className="text-green-800 font-medium">
                        {item.outcome ||
                          'Operational efficiency increased by significant margin.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-32 text-center bg-[var(--color-dark-text)] rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to be our next success story?
            </h2>
            <p className="text-gray-400 text-xl">
              Let's build something that makes your competitors jealous.
            </p>
            <Link to="/start">
              <Button size="lg" className="rounded-full h-14 px-10 text-lg">
                Start Your Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
