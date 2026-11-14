'use client'

import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { useEffect, useState } from 'react'

export function LanguageToggle() {
  const [mounted, setMounted] = useState(false)
  const { i18n } = useTranslation()
  const currentLang = i18n.language?.substring(0, 2) || 'en'

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'id' : 'en'
    i18n.changeLanguage(nextLang)
    document.documentElement.lang = nextLang
    localStorage.setItem('i18nextLng', nextLang)
  }

  const className =
    'flex h-8 items-center gap-1.5 border border-line bg-surface px-2 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted hover:border-accent hover:text-accent-strong'

  if (!mounted) {
    return (
      <button type="button" className={className} aria-label="Toggle language">
        <Globe size={14} aria-hidden="true" />
        <span>en</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={className}
      aria-label={`Switch language to ${currentLang === 'en' ? 'Indonesian' : 'English'}`}
    >
      <Globe size={14} aria-hidden="true" />
      <span>{currentLang}</span>
    </button>
  )
}
