import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translations directly to avoid hydration mismatch
// HTTP backend loads async which causes SSR to render keys, client to render translations
import enCommon from './locales/en/common.json'
import idCommon from './locales/id/common.json'

const resources = {
  en: { common: enCommon },
  id: { common: idCommon },
}

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  supportedLngs: ['en', 'id'],
  defaultNS: 'common',
  ns: ['common'],

  interpolation: {
    escapeValue: false, // React already escapes
  },

  react: {
    useSuspense: false, // Disable suspense since translations are bundled
  },

  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',
})

export default i18n
