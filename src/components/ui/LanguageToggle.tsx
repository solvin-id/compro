'use client'

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useState, useEffect } from 'react'

export function LanguageToggle() {
  const [mounted, setMounted] = useState(false)
  const { i18n } = useTranslation()
  const currentLang = i18n.language?.substring(0, 2) || 'en'

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'id' : 'en'
    i18n.changeLanguage(newLang)
    document.documentElement.lang = newLang
    localStorage.setItem('i18nextLng', newLang)
  }

  if (!mounted) {
    return (
      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700"
        aria-label="Toggle language"
      >
        <Globe size={16} className="text-gray-500" />
        <span className="uppercase">en</span>
      </button>
    )
  }

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
      aria-label={`Switch language to ${currentLang === 'en' ? 'Indonesian' : 'English'}`}
    >
      <Globe size={16} className="text-gray-500" />
      <span className="uppercase">{currentLang}</span>
    </motion.button>
  )
}
