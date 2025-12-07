import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { to: '/', label: 'Home' },
    { to: '/', label: 'About', hash: 'about' },
    { to: '/', label: 'Services', hash: 'services' },
    { to: '/', label: 'Team', hash: 'team' },
    { to: '/', label: 'Portfolio', hash: 'portfolio' },
    { to: '/', label: 'Insights', hash: 'insights' },
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
        'bg-white/70 backdrop-blur-md border-b border-gray-100',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={scrollToTop}
          className="text-xl font-bold tracking-tight flex items-center gap-2 cursor-pointer"
        >
          <span className="text-[var(--color-dark-text)]">Solvin</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)]" />
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) =>
            link.label === 'Home' ? (
              <button
                key={link.label}
                onClick={scrollToTop}
                className="text-sm font-medium text-gray-600 hover:text-[var(--color-brand-primary)] transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ) : link.hash ? (
              <button
                key={link.label}
                onClick={() => handleScroll(link.hash!)}
                className="text-sm font-medium text-gray-600 hover:text-[var(--color-brand-primary)] transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-gray-600 hover:text-[var(--color-brand-primary)] transition-colors"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
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
            Let's Talk
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
                  key={link.label}
                  onClick={() => handleScroll(link.hash!)}
                  className="text-base font-medium text-gray-600 hover:text-[var(--color-brand-primary)] text-left"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-base font-medium text-gray-600 hover:text-[var(--color-brand-primary)]"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ),
            )}
            <Button
              className="w-full justify-center"
              onClick={() =>
                window.open('https://wa.me/6281234567890', '_blank')
              }
            >
              Let's Talk
            </Button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
