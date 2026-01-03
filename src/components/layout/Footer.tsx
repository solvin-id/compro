'use client'

import { useMountedTheme } from '@/hooks/useMountedTheme'
import { Link, useLocation } from '@tanstack/react-router'
import { ArrowRight, Mail, MapPin, MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FOOTER_COMPANY_LINKS,
  FOOTER_CONTACT,
  FOOTER_SOCIAL_LINKS,
  FOOTER_SOLUTIONS_LINKS,
} from '../../data/footer-data'
import { cn } from '../../lib/utils'

export function Footer() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const currentYear = new Date().getFullYear()
  const { theme } = useMountedTheme()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const { subscribeFn } = await import('@/functions/newsletter')
      const result = await subscribeFn({ data: { email } })

      if (result.success) {
        setStatus('success')
        setMessage(result.message)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(result.message)
      }
    } catch (error) {
      console.error('Subscribe error:', error)
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (pathname.includes('/admin')) {
    return null
  }

  return (
    <footer
      className={cn(
        'bg-[#0B0F19] text-white relative',
        theme !== 'light' &&
          'bg-gray-900/20 border-gray-800/50 backdrop-blur-md',
        theme === 'light' && 'bg-gray-900 border-gray-200',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold tracking-tight">Solvin</span>
              <div className="w-2 h-2 rounded-full bg-brand-primary" />
            </div>

            <p className="text-brand-primary font-medium mb-3">
              {t('footer.tagline')}
            </p>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>

            <div className="flex items-center gap-4">
              {FOOTER_SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="group p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <social.icon
                    size={20}
                    className="text-gray-400 group-hover:text-brand-primary group-hover:drop-shadow-[0_0_8px_rgba(255,166,41,0.6)] transition-all duration-300"
                  />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">
              {t('footer.company')}
            </h3>
            <ul className="space-y-3">
              {FOOTER_COMPANY_LINKS.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center text-gray-400 hover:text-brand-primary transition-all duration-300"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {t(link.labelKey)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">
              {t('footer.solutions')}
            </h3>
            <ul className="space-y-3">
              {FOOTER_SOLUTIONS_LINKS.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center text-gray-400 hover:text-brand-primary transition-all duration-300"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {t(link.labelKey)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">
              {t('footer.contact')}
            </h3>

            <a
              href={FOOTER_CONTACT.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-xl font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors duration-300 mb-6"
            >
              <span>{t('footer.startProject')}</span>
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </a>

            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <Mail size={18} className="text-brand-primary shrink-0" />
                <a
                  href={`mailto:${FOOTER_CONTACT.email}`}
                  className="hover:text-brand-primary transition-colors duration-300"
                >
                  {FOOTER_CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <MessageCircle
                  size={18}
                  className="text-brand-primary shrink-0"
                />
                <a
                  href={FOOTER_CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary transition-colors duration-300"
                >
                  {FOOTER_CONTACT.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin size={18} className="text-brand-primary shrink-0" />
                <span>{FOOTER_CONTACT.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-1">
                {t('footer.subscribe')}
              </h4>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex gap-2 max-w-md w-full"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.subscribePlaceholder')}
                disabled={status === 'loading' || status === 'success'}
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-lg',
                  'bg-white/5 border border-white/10',
                  'text-white placeholder:text-gray-500',
                  'focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary',
                  'transition-all duration-300',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                )}
                required
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={cn(
                  'px-4 py-2.5 rounded-lg',
                  'bg-brand-primary hover:bg-brand-primary-hover',
                  'text-white font-medium',
                  'flex items-center gap-2',
                  'transition-colors duration-300',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                )}
              >
                {status === 'loading' ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : status === 'success' ? (
                  <Send size={18} className="text-white" />
                ) : (
                  <Send size={18} />
                )}
                <span className="hidden sm:inline">
                  {status === 'success'
                    ? t('footer.subscribed') || 'Subscribed'
                    : t('footer.subscribeButton')}
                </span>
              </button>
            </form>
            {message && (
              <p
                className={cn(
                  'mt-2 text-sm',
                  status === 'error' ? 'text-red-400' : 'text-green-400',
                )}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-gray-500 text-sm">
              {t('footer.copyright', { year: currentYear })}
            </p>

            <div className="flex items-center gap-6">
              <a
                href="/privacy"
                className="text-gray-500 text-sm hover:text-brand-primary transition-colors duration-300"
              >
                {t('footer.privacy')}
              </a>
              <span className="text-gray-700">|</span>
              <a
                href="/terms"
                className="text-gray-500 text-sm hover:text-brand-primary transition-colors duration-300"
              >
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
