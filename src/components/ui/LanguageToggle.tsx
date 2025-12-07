import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language?.substring(0, 2) || 'en'

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'id' : 'en'
    i18n.changeLanguage(newLang)

    // Update HTML lang attribute
    document.documentElement.lang = newLang

    // Persist to localStorage
    localStorage.setItem('i18nextLng', newLang)
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
