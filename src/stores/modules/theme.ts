/**
 * 主题管理 Store - 极简版
 */
import { createNaiveTheme } from '@/settings/naiveui-theme'
import { darkTheme, type GlobalThemeOverrides } from 'naive-ui'

export const useThemeStore = defineStore(
  'theme',
  () => {
    // 直接从 DOM 读取初始状态，与 index.html 预加载脚本保持一致
    const isDark = ref(document.documentElement.classList.contains('dark'))

    // NaiveUI 主题配置
    const naiveTheme = computed(() => (isDark.value ? darkTheme : null))

    // 主题覆盖配置（根据主题状态传递参数）
    const themeOverrides = computed<GlobalThemeOverrides>(() => {
      // 显式依赖 isDark 以触发重新计算，并传递给 createNaiveTheme
      void isDark.value
      return createNaiveTheme(isDark.value)
    })

    // 切换主题（带 300ms 过渡动画）
    function toggleTheme() {
      isDark.value = !isDark.value
      const html = document.documentElement
      html.classList.add('theme-transitioning')
      html.classList.toggle('dark', isDark.value)
      setTimeout(() => html.classList.remove('theme-transitioning'), 300)
    }

    return { isDark, naiveTheme, themeOverrides, toggleTheme }
  },
  {
    persist: {
      key: 'theme-store',
      storage: localStorage,
      pick: ['isDark']
    }
  }
)
