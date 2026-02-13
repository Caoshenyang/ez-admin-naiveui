/**
 * 主题管理 Store
 *
 * 核心功能：
 * - 双态主题模式（light/dark）
 * - 平滑的过渡动画（300ms）
 * - 持久化到 localStorage
 * - 防闪烁初始化（index.html 预加载脚本）
 */
import type { GlobalThemeOverrides } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { createLightTheme, createDarkTheme } from '@/settings/naiveui-theme'

export const useThemeStore = defineStore(
  'theme',
  () => {
    // ========== State ==========
    const isDark = ref<boolean>(false)

    // ========== Computed ==========
    const naiveTheme = computed(() => (isDark.value ? darkTheme : null))

    const themeOverrides = computed<GlobalThemeOverrides>(() => {
      return isDark.value ? createDarkTheme() : createLightTheme()
    })

    // ========== Internal Methods ==========
    /**
     * 应用主题到 DOM（带过渡动画）
     */
    function applyThemeToDOM() {
      const html = document.documentElement

      // 添加过渡类
      html.classList.add('theme-transitioning')

      // 切换 dark 类
      if (isDark.value) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }

      // 300ms 后移除过渡类
      setTimeout(() => {
        html.classList.remove('theme-transitioning')
      }, 300)
    }

    // ========== Public Actions ==========
    /**
     * 切换主题（light ↔ dark）
     */
    function toggleTheme() {
      isDark.value = !isDark.value
      applyThemeToDOM()
    }

    /**
     * 设置主题模式
     */
    function setTheme(dark: boolean) {
      if (isDark.value !== dark) {
        isDark.value = dark
        applyThemeToDOM()
      }
    }

    // ========== Return ==========
    return {
      // State
      isDark,

      // Computed
      naiveTheme,
      themeOverrides,

      // Actions
      toggleTheme,
      setTheme
    }
  },
  {
    persist: {
      key: 'theme-store',
      storage: localStorage,
      pick: ['isDark']
    }
  }
)
