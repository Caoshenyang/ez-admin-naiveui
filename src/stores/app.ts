import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { AppState } from '@/types/store'
import { storage } from '@/utils/storage'
import { getDefaultLocale } from '@/locales'

const THEME_KEY = 'ez_admin_theme'
const SIDEBAR_COLLAPSED_KEY = 'ez_admin_sidebar_collapsed'
const LANGUAGE_KEY = 'ez_admin_language'

export const useAppStore = defineStore('app', () => {
  // State
  const theme = ref<AppState['theme']>((storage.get(THEME_KEY) as AppState['theme']) || 'light')
  const sidebarCollapsed = ref<boolean>(storage.get(SIDEBAR_COLLAPSED_KEY) || false)
  const sidebarWidth = ref<number>(240)
  const device = ref<AppState['device']>('desktop')
  const language = ref<string>(storage.get(LANGUAGE_KEY) || getDefaultLocale())

  // Actions
  /**
   * 设置主题
   */
  function setTheme(newTheme: AppState['theme']) {
    theme.value = newTheme
    storage.set(THEME_KEY, newTheme)
    applyTheme(newTheme)
  }

  /**
   * 切换主题
   */
  function toggleTheme() {
    const themeMap = { light: 'dark', dark: 'light', auto: 'light' }
    setTheme(themeMap[theme.value] as AppState['theme'])
  }

  /**
   * 应用主题
   */
  function applyTheme(currentTheme: AppState['theme']) {
    const html = document.documentElement
    if (currentTheme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  /**
   * 切换侧边栏
   */
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
    storage.set(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed.value)
  }

  /**
   * 设置侧边栏折叠状态
   */
  function setSidebarCollapsed(collapsed: boolean) {
    sidebarCollapsed.value = collapsed
    storage.set(SIDEBAR_COLLAPSED_KEY, collapsed)
  }

  /**
   * 设置设备类型
   */
  function setDevice(newDevice: AppState['device']) {
    device.value = newDevice
    // 移动端默认折叠侧边栏
    if (newDevice === 'mobile') {
      setSidebarCollapsed(true)
    }
  }

  /**
   * 设置语言
   */
  function setLanguage(newLanguage: string) {
    language.value = newLanguage
    storage.set(LANGUAGE_KEY, newLanguage)
  }

  // 初始化主题
  function initTheme() {
    applyTheme(theme.value)
  }

  // 监听主题变化
  watch(theme, newTheme => {
    applyTheme(newTheme)
  })

  return {
    // State
    theme,
    sidebarCollapsed,
    sidebarWidth,
    device,
    language,
    // Actions
    setTheme,
    toggleTheme,
    toggleSidebar,
    setSidebarCollapsed,
    setDevice,
    setLanguage,
    initTheme
  }
})
