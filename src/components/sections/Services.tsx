import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowUpRight,
  Globe,
  Server,
  Smartphone,
  Database,
  Cloud,
  X,
} from 'lucide-react'
import { services, Service } from '../../data'
import { cn } from '../../lib/utils'

const icons: Record<string, any> = {
  Globe,
  Server,
  Smartphone,
  Database,
  Cloud,
}

export function Services() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  return (
    <section id="services" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-[var(--color-dark-text)] mb-4">
            Our Expertise
          </h2>
          <p className="text-gray-500 max-w-xl">
            We don't just write code. We build the infrastructure that powers
            your business logic.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 auto-rows-[300px] gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                'group relative p-8 rounded-3xl border border-white/50 backdrop-blur-md shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white/40 hover:bg-white/60',
                service.id === 'odoo' &&
                  'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-purple-50/50 to-white/50 border-purple-100',
                service.id === 'web' && 'row-span-2',
              )}
            >
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {(() => {
                    const Icon = icons[service.icon] || Globe
                    return <Icon className="w-6 h-6 text-gray-700" />
                  })()}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-brand-primary)] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-1 bg-white/50 rounded-md text-gray-500 border border-gray-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedService(service)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-400 group-hover:text-[var(--color-dark-text)] transition-colors cursor-pointer"
                >
                  Learn more <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-[var(--color-dark-text)] p-8 flex flex-col justify-center items-center text-center text-white relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-20 group-hover:opacity-30 transition-opacity" />
            <h3 className="text-2xl font-bold mb-4 relative z-10">Unsure?</h3>
            <p className="text-gray-300 mb-6 relative z-10">
              Chat with our engineers directly. No sales fluff.
            </p>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm relative z-10 group-hover:bg-white/20 transition-colors">
              <ArrowUpRight className="text-white" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                {(() => {
                  const Icon = icons[selectedService.icon] || Globe
                  return (
                    <Icon className="w-7 h-7 text-[var(--color-brand-primary)]" />
                  )
                })()}
              </div>

              <h3 className="text-2xl font-bold mb-2">
                {selectedService.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {selectedService.details || selectedService.description}
              </p>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500">
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedService.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
