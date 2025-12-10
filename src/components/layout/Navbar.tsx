'use client'
import { Section, useNavigateStore } from '@/hooks/useNavigateStore'
import { RenderIf } from '@/lib/render-if'
import { Link, useLocation, useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'
import { LanguageToggle } from '../ui/LanguageToggle'
import { ThemeToggle } from '../ui/ThemeToggle'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const setNavigate = useNavigateStore((state) => state.setSection)
  const router = useRouter()
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const links = [
    { to: '/', labelKey: 'nav.home', hash: 'home' as Section },
    { to: '/', labelKey: 'nav.about', hash: 'about' as Section },
    { to: '/', labelKey: 'nav.services', hash: 'services' as Section },
    { to: '/', labelKey: 'nav.team', hash: 'team' as Section },
    { to: '/', labelKey: 'nav.portfolio', hash: 'portfolio' as Section },
    { to: '/', labelKey: 'nav.insights', hash: 'insights' as Section },
  ]

  const handleScroll = (id: string) => {
    // @ts-ignore
    if (globalThis.window.lenis) {
      // @ts-ignore
      globalThis.window.lenis.scrollTo(`#${id}`)
    } else {
      const element = document.getElementById(id)
      element?.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  const scrollToTop = () => {
    if (pathname !== '/') {
      router.navigate({ to: '/' })
      return
    }

    // @ts-ignore
    if (globalThis.window.lenis) {
      // @ts-ignore
      globalThis.window.lenis.scrollTo(0)
    } else {
      globalThis.window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        'bg-background/70 backdrop-blur-md border-b border-border',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={scrollToTop}
          className="text-xl font-bold tracking-tight flex items-center gap-2 cursor-pointer"
        >
          <span className="text-foreground">Solvin</span>
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Fragment key={link.labelKey}>
              <RenderIf
                condition={link.labelKey === 'nav.home' && pathname === link.to}
              >
                <button
                  onClick={scrollToTop}
                  className="text-sm font-medium text-muted-foreground hover:text-brand-primary transition-colors cursor-pointer"
                >
                  {t(link.labelKey)}
                </button>
              </RenderIf>
              <RenderIf
                condition={
                  !!link.hash &&
                  link.labelKey !== 'nav.home' &&
                  pathname === link.to
                }
              >
                <button
                  onClick={() => handleScroll(link.hash!)}
                  className="text-sm font-medium text-muted-foreground hover:text-brand-primary transition-colors cursor-pointer"
                >
                  {t(link.labelKey)}
                </button>
              </RenderIf>
              <RenderIf condition={pathname !== link.to}>
                <Link
                  to={link.to}
                  onClick={() => setNavigate(link.hash)}
                  className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
                >
                  {t(link.labelKey)}
                </Link>
              </RenderIf>
            </Fragment>
          ))}
        </div>

        {/* Right side: Theme + Language Toggle + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <LanguageToggle />
          <Button
            asMotion
            onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                '0 0 0 0px rgba(37, 99, 235, 0)',
                '0 0 0 4px rgba(37, 99, 235, 0.1)',
                '0 0 0 0px rgba(37, 99, 235, 0)',
              ],
            }}
            transition={{
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
                delay: 3,
              },
            }}
          >
            {t('nav.cta')}
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background/5 backdrop-blur-md border-b border-border overflow-hidden"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((link, i) =>
              link.hash ? (
                <motion.button
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.1 * i, delay: 0.015 * i }}
                  key={link.labelKey}
                  onClick={() => handleScroll(link.hash!)}
                  className="text-base font-medium text-gray-600 hover:text-brand-primary text-left"
                >
                  {t(link.labelKey)}
                </motion.button>
              ) : (
                <motion.span
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.1 * i, delay: 0.015 * i }}
                  key={link.labelKey}
                >
                  <Link
                    to={link.to}
                    className="text-base font-medium text-gray-600 hover:text-brand-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {t(link.labelKey)}
                  </Link>
                </motion.span>
              ),
            )}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex gap-2">
                <ThemeToggle />
                <LanguageToggle />
              </div>
              <Button
                onClick={() =>
                  window.open('https://wa.me/6281234567890', '_blank')
                }
              >
                {t('nav.cta')}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
