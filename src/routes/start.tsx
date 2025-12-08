import { createFileRoute } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, ArrowLeft, Send } from 'lucide-react'
import { Button } from '../components/ui/Button'

export const Route = createFileRoute('/start')({
  component: StartWizard,
})

const services = [
  { id: 'web', label: 'Web Application', icon: '🌍' },
  { id: 'mobile', label: 'Mobile App', icon: '📱' },
  { id: 'erp', label: 'Odoo ERP', icon: '📊' },
  { id: 'custom', label: 'Custom System', icon: '⚡' },
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

  // State update helpers
  const updateData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const handleSubmit = () => {
    // Construct WhatsApp message
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden py-12">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-muted">
        <motion.div
          className="h-full bg-brand-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className="max-w-2xl w-full mx-auto px-6 relative z-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <span className="text-sm font-bold uppercase text-brand-primary tracking-widest">
                  Step 1 of 4
                </span>
                <h1 className="text-4xl font-bold text-foreground">
                  What are we building today?
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      updateData('service', s.label)
                      nextStep()
                    }}
                    className="group p-6 rounded-2xl bg-card border border-border hover:border-brand-primary hover:ring-2 hover:ring-brand-primary/20 transition-all text-left shadow-sm hover:shadow-lg"
                  >
                    <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">
                      {s.icon}
                    </span>
                    <span className="font-bold text-foreground block">
                      {s.label}
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
              className="space-y-8 text-center"
            >
              <div className="space-y-4">
                <span className="text-sm font-bold uppercase text-brand-primary tracking-widest">
                  Step 2 of 4
                </span>
                <h1 className="text-4xl font-bold text-foreground">
                  Do you have a design ready?
                </h1>
                <p className="text-muted-foreground">
                  Do you have Figma files or do we need to craft the UI/UX?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                <button
                  onClick={() => {
                    updateData('hasDesign', true)
                    nextStep()
                  }}
                  className="p-8 rounded-2xl bg-card border border-border hover:border-green-500 hover:ring-2 hover:ring-green-500/20 transition-all"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-950/50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    🎨
                  </div>
                  <span className="font-bold text-lg block text-foreground">
                    Yes, I have designs
                  </span>
                </button>
                <button
                  onClick={() => {
                    updateData('hasDesign', false)
                    nextStep()
                  }}
                  className="p-8 rounded-2xl bg-card border border-border hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20 transition-all"
                >
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950/50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    🏗️
                  </div>
                  <span className="font-bold text-lg block text-foreground">
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
              className="space-y-8 text-center"
            >
              <div className="space-y-4">
                <span className="text-sm font-bold uppercase text-brand-primary tracking-widest">
                  Step 3 of 4
                </span>
                <h1 className="text-4xl font-bold text-foreground">
                  What is your estimated budget?
                </h1>
                <p className="text-muted-foreground">
                  This helps us recommend the right tech stack.
                </p>
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                {budgets.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      updateData('budget', b.label)
                      nextStep()
                    }}
                    className="w-full p-6 text-left rounded-xl bg-card border border-border hover:border-brand-primary hover:bg-brand-primary hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span className="font-bold text-lg">{b.label}</span>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
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
              <div className="text-center space-y-4">
                <span className="text-sm font-bold uppercase text-brand-primary tracking-widest">
                  Final Step
                </span>
                <h1 className="text-4xl font-bold text-foreground">
                  Where should we create magic?
                </h1>
              </div>

              <div className="bg-card p-8 rounded-3xl border border-border backdrop-blur-sm shadow-xl space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
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
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
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
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Additional Details (Optional)
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all min-h-[100px]"
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
                  className="w-full h-14 text-lg rounded-xl"
                  onClick={handleSubmit}
                  disabled={!formData.contact.name || !formData.contact.email}
                >
                  Send Proposal Request <Send className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-between items-center text-sm text-muted-foreground">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="flex items-center hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
