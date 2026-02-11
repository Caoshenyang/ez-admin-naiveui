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
    const themeMode = ref<'light' | 'dark'>('light')

    // ========== Computed ==========
    /** NaiveUI 主题对象（用于 n-config-provider） */
    const naiveTheme = computed(() => (themeMode.value === 'dark' ? darkTheme : null))

    /** NaiveUI 主题覆盖配置（自定义颜色） */
    const themeOverrides = computed<GlobalThemeOverrides>(() =>
      themeMode.value === 'dark' ? createDarkTheme() : createLightTheme()
    )

    // ========== Actions ==========
    function toggleSidebar() {
      sidebarOpened.value = !sidebarOpened.value
    }

    function setSidebarOpened(opened: boolean) {
      sidebarOpened.value = opened
    }

    function toggleTheme() {
      themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
    }

    return {
      sidebarOpened,
      themeMode,
      naiveTheme,
      themeOverrides,
      toggleSidebar,
      setSidebarOpened,
      toggleTheme
    }
  },
  {
    persist: {
      key: 'app-store',
      storage: localStorage,
      pick: ['sidebarOpened', 'themeMode']
    }
  }
)
