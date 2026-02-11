/**
 * 应用配置 Store
 * 使用 Setup Store 模式
 */
import type { GlobalThemeOverrides } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { createDarkTheme, createLightTheme } from '@/settings/naiveui-theme'

export const useAppStore = defineStore(
  'app',
  () => {
    // ========== State ==========
    const sidebarOpened = ref<boolean>(true)
    const isDark = ref<boolean>(false)

    // ========== Computed ==========
    /** NaiveUI 主题对象（用于 n-config-provider） */
    const naiveTheme = computed(() => (isDark.value ? darkTheme : null))

    /** NaiveUI 主题覆盖配置（自定义颜色） */
    const themeOverrides = computed<GlobalThemeOverrides>(() => (isDark.value ? createDarkTheme() : createLightTheme()))

    // ========== Actions ==========
    function toggleSidebar() {
      sidebarOpened.value = !sidebarOpened.value
    }

    function toggleTheme() {
      isDark.value = !isDark.value
    }

    return {
      sidebarOpened,
      isDark,
      naiveTheme,
      themeOverrides,
      toggleSidebar,
      toggleTheme
    }
  },
  {
    persist: {
      key: 'app-store',
      storage: localStorage,
      pick: ['sidebarOpened', 'isDark']
    }
  }
)
