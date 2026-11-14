'use client'

import { Link, useLocation } from '@tanstack/react-router'
import { ArrowUp, Mail, MapPin, MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FOOTER_COMPANY_LINKS,
  FOOTER_CONTACT,
  FOOTER_SOCIAL_LINKS,
  FOOTER_SOLUTIONS_LINKS,
  type FooterLink,
} from '@/data/footer-data'
import { Section, useNavigateStore } from '@/hooks/useNavigateStore'
import { scrollToSection, scrollToTop } from '@/lib/scroll'
import { cn } from '@/lib/utils'
import { buttonClassName } from '../ui/Button'

export function Footer() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const setSection = useNavigateStore((state) => state.setSection)
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault()
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

  const handleInternalLink = (event: React.MouseEvent, link: FooterLink) => {
    if (!link.hash) return
    if (pathname === '/') {
      event.preventDefault()
      scrollToSection(link.hash)
      return
    }
    setSection(link.hash as Section)
  }

  if (pathname.includes('/admin')) {
    return null
  }

  const linkClassName =
    'group inline-flex items-center font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted transition-colors duration-150 ease-cad hover:text-accent-strong'

  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto w-full max-w-[1600px] border-line md:border-x">
        <div className="grid divide-y divide-line lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2">
              <img
                src="/brand/solvin-mark.png"
                alt=""
                aria-hidden="true"
                width={28}
                height={28}
                className="h-7 w-7 shrink-0"
              />
              <span className="text-2xl font-semibold tracking-[-0.03em] text-ink">
                Solvin
              </span>
            </div>

            <p className="mt-4 text-sm font-medium text-accent-strong">
              {t('footer.tagline')}
            </p>
            <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-ink-muted">
              {t('footer.description')}
            </p>

            <div className="mt-6 flex items-center gap-2">
              {FOOTER_SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="flex h-8 w-8 items-center justify-center border border-line text-ink-muted transition-colors duration-150 ease-cad hover:border-accent hover:text-accent-strong"
                >
                  <social.icon size={14} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h3 className="label-mono text-ink-muted">{t('footer.company')}</h3>
            <ul className="mt-4 space-y-2">
              {FOOTER_COMPANY_LINKS.map((link) => (
                <li key={link.labelKey + link.to + (link.hash ?? '')}>
                  <Link
                    to={link.to}
                    hash={link.hash}
                    onClick={(event) => handleInternalLink(event, link)}
                    className={linkClassName}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 md:p-8">
            <h3 className="label-mono text-ink-muted">
              {t('footer.solutions')}
            </h3>
            <ul className="mt-4 space-y-2">
              {FOOTER_SOLUTIONS_LINKS.map((link) => (
                <li key={link.labelKey + link.to + (link.hash ?? '')}>
                  <Link
                    to={link.to}
                    hash={link.hash}
                    onClick={(event) => handleInternalLink(event, link)}
                    className={linkClassName}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 md:p-8">
            <h3 className="label-mono text-ink-muted">{t('footer.contact')}</h3>

            <Link
              to="/start"
              className={cn(buttonClassName('outline', 'sm'), 'mt-4')}
            >
              {t('footer.startProject')}
            </Link>

            <ul className="mt-4 space-y-3 text-sm text-ink-muted">
              <li className="flex items-center gap-2">
                <Mail size={14} aria-hidden="true" className="text-accent-strong" />
                <a
                  href={`mailto:${FOOTER_CONTACT.email}`}
                  className="transition-colors hover:text-ink"
                >
                  {FOOTER_CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle
                  size={14}
                  aria-hidden="true"
                  className="text-accent-strong"
                />
                <a
                  href={FOOTER_CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-ink"
                >
                  {FOOTER_CONTACT.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} aria-hidden="true" className="text-accent-strong" />
                <span>{FOOTER_CONTACT.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-line p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h4 className="label-mono text-ink-muted">
                {t('footer.subscribe')}
              </h4>
              <form
                onSubmit={handleSubscribe}
                className="mt-3 flex w-full max-w-md gap-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t('footer.subscribePlaceholder')}
                  disabled={status === 'loading' || status === 'success'}
                  required
                  className="h-10 min-w-0 flex-1 border border-line bg-surface px-3 font-mono text-xs text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className={buttonClassName('primary', 'sm', 'h-10')}
                >
                  {status === 'loading' ? (
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border border-accent-ink/30 border-t-accent-ink"
                    />
                  ) : (
                    <Send size={14} aria-hidden="true" />
                  )}
                  <span className="hidden sm:inline">
                    {status === 'success'
                      ? t('footer.subscribed')
                      : t('footer.subscribeButton')}
                  </span>
                </button>
              </form>
              <p
                aria-live="polite"
                className={cn(
                  'mt-2 min-h-[1rem] font-mono text-[10px] uppercase tracking-[0.06em]',
                  status === 'error' ? 'text-signal' : 'text-ink-muted',
                )}
              >
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line p-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
            {t('footer.copyright', { year: currentYear })}
          </p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-success" />
              SYS: OPERATIONAL
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted transition-colors duration-150 ease-cad hover:text-accent-strong"
            >
              BACK TO TOP
              <ArrowUp size={12} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
