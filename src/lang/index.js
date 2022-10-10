import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementViLocale from 'element-ui/lib/locale/lang/vi'
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import viLocale from './vi'
import enLocale from './en'
import vi from 'ff24-js/src/lang/vi'
import en from 'ff24-js/src/lang/en'

Vue.use(VueI18n)

export function getMessages() {
  return {
    vi: {
      ...vi,
      ...viLocale,
      ...elementViLocale      
    },
    en: {
      ...en,
      ...enLocale,
      ...elementEnLocale     
    }
  }
}

export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = 'vi'
  const locales = Object.keys(getMessages())
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'vi'
}

const i18n = new VueI18n({
  locale: getLanguage(),
  messages: getMessages(),
  silentTranslationWarn: false
})

// Hot updates
if (module.hot) {
  module.hot.accept(['./vi', './en'], function() {
    i18n.setLocaleMessage('vi', require('./vi').default)
    i18n.setLocaleMessage('en', require('./en').default)
  })
}
export default i18n
