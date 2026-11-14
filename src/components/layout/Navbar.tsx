'use client'

import { getAuthenticatedUserFn } from '@/functions/auth'
import { Section, useNavigateStore } from '@/hooks/useNavigateStore'
import { Link, useLocation, useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Menu, Settings, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { BACKEND_ENABLED } from '@/lib/backend'
import { scrollToSection, scrollToTop } from '@/lib/scroll'
import { buttonClassName } from '../ui/Button'
import { LanguageToggle } from '../ui/LanguageToggle'
import { CoordinateReadout, ThemeToggle } from '../ui/blueprint'

const HOME_LINKS: { index: string; section: Section; labelKey: string }[] = [
  { index: '01', section: 'profile', labelKey: 'nav.about' },
  { index: '02', section: 'capabilities', labelKey: 'nav.services' },
  { index: '03', section: 'method', labelKey: 'nav.method' },
]

const ROUTE_LINKS: { index: string; to: '/portfolio' | '/articles'; labelKey: string; match: string }[] = [
  { index: '04', to: '/portfolio', labelKey: 'nav.portfolio', match: '/portfolio' },
  { index: '05', to: '/articles', labelKey: 'nav.insights', match: '/articles' },
]

const CELL =
  'flex h-16 items-center gap-2 border-l border-line px-3 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors duration-150 ease-cad'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const setNavigate = useNavigateStore((state) => state.setSection)
  const router = useRouter()
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const { data: currentUser, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getAuthenticatedUserFn(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  useEffect(() => {
    refetch()
  }, [pathname, refetch])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const isLoggedIn = !!currentUser
  const isHome = pathname === '/'
  const routeLinks = BACKEND_ENABLED
    ? ROUTE_LINKS
    : ROUTE_LINKS.filter((link) => link.to !== '/articles')

  const handleLogo = () => {
    setIsOpen(false)
    if (isHome) scrollToTop()
    else router.navigate({ to: '/' })
  }

  const handleSectionLink = (section: Section) => {
    setIsOpen(false)
    setActiveSection(section)
    if (isHome) scrollToSection(section)
    else setNavigate(section)
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-stretch border-line md:border-x">
        <button
          type="button"
          onClick={handleLogo}
          className="flex h-16 items-center gap-2 px-4 md:border-r md:border-line md:px-6"
        >
          <img
            src="/brand/solvin-mark.png"
            alt=""
            aria-hidden="true"
            width={24}
            height={24}
            className="h-6 w-6 shrink-0"
          />
          <span className="text-lg font-semibold tracking-[-0.03em] text-ink">
            Solvin
          </span>
          <span className="label-mono ml-2 hidden text-ink-muted sm:inline">
            DIGITAL SYSTEMS
          </span>
        </button>

        <div className="ml-auto hidden items-stretch md:flex">
          {HOME_LINKS.map((link) =>
            isHome ? (
              <button
                key={link.section}
                type="button"
                onClick={() => handleSectionLink(link.section)}
                className={cn(
                  CELL,
                  'hover:text-ink',
                  activeSection === link.section
                    ? 'text-accent-strong'
                    : 'text-ink-muted',
                )}
              >
                <span aria-hidden="true" className="opacity-60">
                  {link.index}
                </span>
                {t(link.labelKey)}
              </button>
            ) : (
              <Link
                key={link.section}
                to="/"
                onClick={() => handleSectionLink(link.section)}
                className={cn(CELL, 'text-ink-muted hover:text-ink')}
              >
                <span aria-hidden="true" className="opacity-60">
                  {link.index}
                </span>
                {t(link.labelKey)}
              </Link>
            ),
          )}

          {routeLinks.map((link) => {
            const isActive = pathname.startsWith(link.match)
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  CELL,
                  isActive ? 'text-accent-strong' : 'text-ink-muted hover:text-ink',
                )}
              >
                <span aria-hidden="true" className="opacity-60">
                  {link.index}
                </span>
                {t(link.labelKey)}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex items-center gap-2 border-l border-line px-3 md:ml-0">
          <CoordinateReadout className="hidden xl:inline" />
          <ThemeToggle />
          <LanguageToggle />
          {isLoggedIn && (
            <Link
              to="/admin"
              aria-label="Admin dashboard"
              title="Admin dashboard"
              className="hidden h-8 w-8 items-center justify-center border border-line text-ink-muted hover:border-accent hover:text-accent-strong sm:flex"
            >
              <Settings size={14} aria-hidden="true" />
            </Link>
          )}
          <Link
            to="/start"
            className={cn(buttonClassName('primary', 'sm'), 'hidden lg:inline-flex')}
          >
            {t('nav.cta')}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          className="flex h-16 w-14 items-center justify-center border-l border-line text-ink-muted md:hidden"
        >
          {isOpen ? (
            <X size={18} aria-hidden="true" />
          ) : (
            <Menu size={18} aria-hidden="true" />
          )}
        </button>
      </div>

      {isOpen && (
        <div id="mobile-nav" className="border-t border-line bg-canvas md:hidden">
          <div className="flex flex-col">
            {HOME_LINKS.map((link) => (
              <button
                key={link.section}
                type="button"
                onClick={() => handleSectionLink(link.section)}
                className="flex h-12 items-center gap-3 border-b border-line px-4 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted"
              >
                <span aria-hidden="true" className="text-accent-strong">
                  {link.index}
                </span>
                {t(link.labelKey)}
              </button>
            ))}
            {routeLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex h-12 items-center gap-3 border-b border-line px-4 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted"
              >
                <span aria-hidden="true" className="text-accent-strong">
                  {link.index}
                </span>
                {t(link.labelKey)}
              </Link>
            ))}
            <div className="flex items-center justify-between gap-2 px-4 py-3">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LanguageToggle />
              </div>
              <Link
                to="/start"
                onClick={() => setIsOpen(false)}
                className={buttonClassName('primary', 'sm')}
              >
                {t('nav.cta')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
