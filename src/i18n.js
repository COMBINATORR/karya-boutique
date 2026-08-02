import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationRU from './locales/ru.json'
import translationKK from './locales/kk.json'

const resources = {
  ru: { translation: translationRU },
  kk: { translation: translationKK },
}

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('karya-lang') || 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: true,
  },
})

export default i18n
