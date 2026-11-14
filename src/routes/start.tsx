import { createFileRoute } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Database, Globe, Send, Smartphone, Zap } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'

export const Route = createFileRoute('/start')({
  component: StartWizard,
})

const services = [
  { id: 'web', label: 'Web Application', icon: Globe },
  { id: 'mobile', label: 'Mobile App', icon: Smartphone },
  { id: 'erp', label: 'Odoo ERP', icon: Database },
  { id: 'custom', label: 'Custom System', icon: Zap },
]

const budgets = [
  { id: 'low', label: '$1k - $5k' },
  { id: 'mid', label: '$5k - $10k' },
  { id: 'high', label: '$10k - $25k' },
  { id: 'enterprise', label: 'Enterprise ($25k+)' },
]

function StartWizard() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    service: '',
    hasDesign: null as boolean | null,
    budget: '',
    contact: { name: '', email: '', details: '' },
  })

  const updateData = <K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const handleSubmit = () => {
    const message = `
Hi Solvin Team! 👋
I'd like to start a project:
    
🚀 Type: ${formData.service || 'Not specified'}
🎨 Design Ready: ${formData.hasDesign ? 'Yes' : 'No, need help'}
💰 Budget: ${formData.budget || 'Not specified'}
    
👤 Name: ${formData.contact.name}
📧 Email: ${formData.contact.email}
📝 Details: ${formData.contact.details}
    `.trim()

    const url = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const stepHeadingClassName =
    'text-3xl font-semibold tracking-[-0.03em] text-ink md:text-4xl'
  const fieldClassName =
    'w-full rounded-none border border-line bg-canvas px-4 py-3 text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-0 transition-colors duration-150 ease-cad'
  const fieldLabelClassName = 'label-mono mb-2 block text-ink-muted'

  return (
    <PageShell>
      <div className="min-h-[calc(100svh-4rem)]">
        <div className="border-b border-line p-5 md:p-8 lg:p-12">
          <div className="flex items-baseline justify-between gap-4">
            <span className="label-mono text-accent-strong">[INTAKE / 04 STEPS]</span>
            <span className="label-mono text-ink-muted">
              STEP {String(step).padStart(2, '0')} / 04
            </span>
          </div>
          <div className="mt-4 h-px w-full bg-surface-2">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-5 py-12 md:px-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <span className="label-mono text-accent-strong">Step 1 of 4</span>
                  <h1 className={stepHeadingClassName}>
                    What are we building today?
                  </h1>
                </div>

                <div className="grid grid-cols-2 border-l border-t border-line">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        updateData('service', service.label)
                        nextStep()
                      }}
                      className="group border-r border-b border-line bg-surface p-6 text-left transition-colors duration-150 ease-cad hover:bg-accent-soft"
                    >
                      <service.icon
                        className="size-6 text-accent-strong"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <span className="mt-8 block font-medium text-ink">
                        {service.label}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <span className="label-mono text-accent-strong">Step 2 of 4</span>
                  <h1 className={stepHeadingClassName}>
                    Do you have a design ready?
                  </h1>
                  <p className="text-ink-muted">
                    Do you have Figma files or do we need to craft the UI/UX?
                  </p>
                </div>

                <div className="grid grid-cols-1 border-l border-t border-line md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateData('hasDesign', true)
                      nextStep()
                    }}
                    className="border-r border-b border-line bg-surface p-8 text-center transition-colors duration-150 ease-cad hover:bg-accent-soft"
                  >
                    <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-accent-soft text-2xl">
                      🎨
                    </span>
                    <span className="block text-lg font-medium text-ink">
                      Yes, I have designs
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateData('hasDesign', false)
                      nextStep()
                    }}
                    className="border-r border-b border-line bg-surface p-8 text-center transition-colors duration-150 ease-cad hover:bg-accent-soft"
                  >
                    <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-surface-2 text-2xl">
                      🏗️
                    </span>
                    <span className="block text-lg font-medium text-ink">
                      No, I need magic
                    </span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <span className="label-mono text-accent-strong">Step 3 of 4</span>
                  <h1 className={stepHeadingClassName}>
                    What is your estimated budget?
                  </h1>
                  <p className="text-ink-muted">
                    This helps us recommend the right tech stack.
                  </p>
                </div>

                <div className="divide-y divide-line border border-line">
                  {budgets.map((budget) => (
                    <button
                      key={budget.id}
                      type="button"
                      onClick={() => {
                        updateData('budget', budget.label)
                        nextStep()
                      }}
                      className="group flex w-full items-center justify-between bg-surface p-6 text-left transition-colors duration-150 ease-cad hover:bg-accent hover:text-accent-ink"
                    >
                      <span className="text-lg font-medium">{budget.label}</span>
                      <ArrowRight
                        aria-hidden="true"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <span className="label-mono text-accent-strong">Final Step</span>
                  <h1 className={stepHeadingClassName}>
                    Where should we create magic?
                  </h1>
                </div>

                <div className="space-y-6 border border-line bg-surface p-8">
                  <div>
                    <label
                      htmlFor="intake-name"
                      className={fieldLabelClassName}
                    >
                      Your Name
                    </label>
                    <input
                      id="intake-name"
                      type="text"
                      className={fieldClassName}
                      placeholder="John Doe"
                      value={formData.contact.name}
                      onChange={(e) =>
                        updateData('contact', {
                          ...formData.contact,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="intake-email"
                      className={fieldLabelClassName}
                    >
                      Email Address
                    </label>
                    <input
                      id="intake-email"
                      type="email"
                      className={fieldClassName}
                      placeholder="john@company.com"
                      value={formData.contact.email}
                      onChange={(e) =>
                        updateData('contact', {
                          ...formData.contact,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="intake-details"
                      className={fieldLabelClassName}
                    >
                      Additional Details (Optional)
                    </label>
                    <textarea
                      id="intake-details"
                      className={`${fieldClassName} min-h-[100px]`}
                      placeholder="Tell us more about your vision..."
                      value={formData.contact.details}
                      onChange={(e) =>
                        updateData('contact', {
                          ...formData.contact,
                          details: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={!formData.contact.name || !formData.contact.email}
                  >
                    Send Proposal Request
                    <Send className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="label-mono flex items-center gap-2 text-ink-muted transition-colors duration-150 ease-cad hover:text-accent-strong"
              >
                <ArrowLeft size={12} aria-hidden="true" /> Back
              </button>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
