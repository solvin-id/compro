import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'
import { LanguageToggle } from '../ui/LanguageToggle'
import { ThemeToggle } from '../ui/ThemeToggle'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  const links = [
    { to: '/', labelKey: 'nav.home' },
    { to: '/', labelKey: 'nav.about', hash: 'about' },
    { to: '/', labelKey: 'nav.services', hash: 'services' },
    { to: '/', labelKey: 'nav.team', hash: 'team' },
    { to: '/', labelKey: 'nav.portfolio', hash: 'portfolio' },
    { to: '/', labelKey: 'nav.insights', hash: 'insights' },
  ]

  const handleScroll = (id: string) => {
    // @ts-ignore
    if (window.lenis) {
      // @ts-ignore
      window.lenis.scrollTo(`#${id}`)
    } else {
      const element = document.getElementById(id)
      element?.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  const scrollToTop = () => {
    // @ts-ignore
    if (window.lenis) {
      // @ts-ignore
      window.lenis.scrollTo(0)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
          {links.map((link) =>
            link.labelKey === 'nav.home' ? (
              <button
                key={link.labelKey}
                onClick={scrollToTop}
                className="text-sm font-medium text-muted-foreground hover:text-brand-primary transition-colors cursor-pointer"
              >
                {t(link.labelKey)}
              </button>
            ) : link.hash ? (
              <button
                key={link.labelKey}
                onClick={() => handleScroll(link.hash!)}
                className="text-sm font-medium text-muted-foreground hover:text-brand-primary transition-colors cursor-pointer"
              >
                {t(link.labelKey)}
              </button>
            ) : (
              <Link
                key={link.labelKey}
                to={link.to}
                className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
              >
                {t(link.labelKey)}
              </Link>
            ),
          )}
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
          className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((link) =>
              link.hash ? (
                <button
                  key={link.labelKey}
                  onClick={() => handleScroll(link.hash!)}
                  className="text-base font-medium text-gray-600 hover:text-brand-primary text-left"
                >
                  {t(link.labelKey)}
                </button>
              ) : (
                <Link
                  key={link.labelKey}
                  to={link.to}
                  className="text-base font-medium text-gray-600 hover:text-brand-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {t(link.labelKey)}
                </Link>
              ),
            )}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <LanguageToggle />
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
