import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'

/**
 * 支持的语言列表
 */
export const supportLocales = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' }
]

/**
 * 获取默认语言
 */
export function getDefaultLocale(): string {
  const saved = localStorage.getItem('locale')
  if (saved) return saved

  const browserLang = navigator.language
  return supportLocales.some(locale => locale.value === browserLang) ? browserLang : 'zh-CN'
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

export default i18n
