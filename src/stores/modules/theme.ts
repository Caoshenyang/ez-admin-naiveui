/**
 * 主题管理 Store - 极简版
 */
import type { GlobalThemeOverrides } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { createLightTheme, createDarkTheme } from '@/settings/naiveui-theme'

export const useThemeStore = defineStore(
  'theme',
  () => {
    // 直接从 DOM 读取初始状态，与 index.html 预加载脚本保持一致
    const isDark = ref(document.documentElement.classList.contains('dark'))

    // NaiveUI 主题配置
    const naiveTheme = computed(() => (isDark.value ? darkTheme : null))
    const themeOverrides = computed<GlobalThemeOverrides>(() =>
      isDark.value ? createDarkTheme() : createLightTheme()
    )

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
