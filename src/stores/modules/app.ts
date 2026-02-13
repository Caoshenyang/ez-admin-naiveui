/**
 * 应用配置 Store
 * 使用 Setup Store 模式
 */
export const useAppStore = defineStore(
  'app',
  () => {
    // ========== State ==========
    const sidebarOpened = ref<boolean>(true)

    // ========== Actions ==========
    function toggleSidebar() {
      sidebarOpened.value = !sidebarOpened.value
    }

    return {
      sidebarOpened,
      toggleSidebar
    }
  },
  {
    persist: {
      key: 'app-store',
      storage: localStorage,
      pick: ['sidebarOpened']
    }
  }
)
