import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

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
    escapeValue: false,
  },

  react: {
    useSuspense: false,
  },

  debug: process.env.NODE_ENV === 'development',
})

export default i18n
