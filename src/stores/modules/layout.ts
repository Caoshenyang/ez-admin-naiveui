import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LayoutConfig, TabItem } from '@/types/layout'

/**
 * 布局 Store
 * 使用 Setup Store 模式
 */
export const useLayoutStore = defineStore(
  'layout',
  () => {
    // ==================== 常量 ====================
    const HOME_PATH = '/' // 首页路径

    // ==================== 状态 ====================
    const isSidebarCollapsed = ref(false) // 侧边栏是否折叠
    const device = ref<'desktop' | 'mobile'>('desktop') // 设备类型
    const mobileSidebarOpen = ref(false) // 移动端侧边栏是否打开
    const openedMenuKeys = ref<string[]>([]) // 打开的菜单 keys
    const activeMenuKey = ref<string>('') // 选中的菜单 key

    // 初始化标签页：默认包含首页（首页永远存在，不可关闭）
    const tabs = ref<TabItem[]>([
      {
        path: HOME_PATH,
        title: '首页',
        name: 'Home',
        affix: true
      }
    ])
    const activeTab = ref<string>(HOME_PATH) // 当前激活的标签页

    // ==================== 默认配置 ====================
    const defaultConfig: LayoutConfig = {
      isSidebarCollapsed: false,
      sidebarWidth: 240,
      sidebarCollapsedWidth: 64,
      showTabs: true,
      showBreadcrumb: true,
      showFooter: true,
      layoutMode: 'sidebar',
      themeMode: 'light'
    }

    const layoutConfig = ref<LayoutConfig>({ ...defaultConfig })

    // ==================== Getters ====================
    // 当前侧边栏宽度
    const sidebarWidth = computed(() =>
      isSidebarCollapsed.value ? layoutConfig.value.sidebarCollapsedWidth : layoutConfig.value.sidebarWidth
    )

    const showTabs = computed(() => layoutConfig.value.showTabs) // 是否显示标签页
    const showBreadcrumb = computed(() => layoutConfig.value.showBreadcrumb) // 是否显示面包屑
    const showFooter = computed(() => layoutConfig.value.showFooter) // 是否显示页脚
    const layoutMode = computed(() => layoutConfig.value.layoutMode) // 布局模式
    const themeMode = computed(() => layoutConfig.value.themeMode) // 主题模式

    // ==================== Actions ====================
    // 切换侧边栏折叠状态
    const toggleSidebar = () => {
      isSidebarCollapsed.value = !isSidebarCollapsed.value
    }

    // 设置侧边栏折叠状态
    const setSidebarCollapsed = (collapsed: boolean) => {
      isSidebarCollapsed.value = collapsed
    }

    // 设置设备类型
    const setDevice = (deviceType: 'desktop' | 'mobile') => {
      device.value = deviceType
      // 移动端默认折叠侧边栏
      if (deviceType === 'mobile') {
        isSidebarCollapsed.value = true
        mobileSidebarOpen.value = false
      }
    }

    // 设置移动端侧边栏打开状态
    const setMobileSidebarOpen = (open: boolean) => {
      mobileSidebarOpen.value = open
    }

    // 设置打开的菜单 keys
    const setOpenedMenuKeys = (keys: string[]) => {
      openedMenuKeys.value = keys
    }

    // 设置当前选中的菜单 key
    const setActiveMenuKey = (key: string) => {
      activeMenuKey.value = key
    }

    // 添加标签页
    const addTab = (tab: TabItem) => {
      // 统一首页路径：将 '/' 和 '' 都视为首页
      const normalizedPath = tab.path === '/' || tab.path === '' ? HOME_PATH : tab.path

      // 如果是首页，直接激活即可（首页永远存在）
      if (normalizedPath === HOME_PATH) {
        activeTab.value = HOME_PATH
        return
      }

      // 检查标签页是否已存在
      const existTab = tabs.value.find((t) => t.path === normalizedPath)
      if (existTab) {
        activeTab.value = normalizedPath
        return
      }

      // 添加新标签页
      tabs.value.push({
        ...tab,
        path: normalizedPath
      })
      activeTab.value = normalizedPath
    }

    // 移除标签页
    const removeTab = (path: string) => {
      // 不允许删除首页
      if (path === HOME_PATH) return

      const index = tabs.value.findIndex((t) => t.path === path)
      if (index > -1) {
        tabs.value.splice(index, 1)
        // 如果关闭的是当前激活的标签页，则激活最后一个标签页（或首页）
        if (activeTab.value === path) {
          const lastTab = tabs.value[tabs.value.length - 1]
          activeTab.value = lastTab ? lastTab.path : HOME_PATH
        }
      }
    }

    // 关闭其他标签页
    const closeOtherTabs = (path: string) => {
      // 保留首页和当前标签页
      tabs.value = tabs.value.filter((t) => t.path === path || t.path === HOME_PATH)
      activeTab.value = path
    }

    // 关闭所有标签页（只保留首页）
    const closeAllTabs = () => {
      tabs.value = tabs.value.filter((t) => t.path === HOME_PATH)
      activeTab.value = HOME_PATH
    }

    // 关闭左侧标签页
    const closeLeftTabs = (path: string) => {
      // 不允许关闭首页（首页在第一位）
      if (path === HOME_PATH) return

      const index = tabs.value.findIndex((t) => t.path === path)
      if (index > -1) {
        // 保留首页和当前标签页及其右侧的标签页
        // 首页永远在第一位，使用非空断言
        const homeTab = tabs.value[0]
        if (homeTab) {
          tabs.value = [homeTab, ...tabs.value.slice(index)]
        }
      }
    }

    // 关闭右侧标签页
    const closeRightTabs = (path: string) => {
      const index = tabs.value.findIndex((t) => t.path === path)
      if (index > -1) {
        tabs.value = tabs.value.slice(0, index + 1)
      }
    }

    // 设置当前激活的标签页
    const setActiveTab = (path: string) => {
      activeTab.value = path
    }

    // 更新布局配置
    const updateLayoutConfig = (config: Partial<LayoutConfig>) => {
      layoutConfig.value = { ...layoutConfig.value, ...config }
    }

    // 重置布局配置
    const resetLayoutConfig = () => {
      layoutConfig.value = { ...defaultConfig }
      // 直接清除 localStorage 确保彻底重置
      localStorage.removeItem('layout-store')
    }

    // 清除所有标签页数据（退出登录时调用，重置为只有首页）
    const clearAllTabs = () => {
      tabs.value = [
        {
          path: HOME_PATH,
          title: '首页',
          name: 'Home',
          affix: true
        }
      ]
      activeTab.value = HOME_PATH
    }

    return {
      // 状态
      isSidebarCollapsed,
      device,
      mobileSidebarOpen,
      openedMenuKeys,
      activeMenuKey,
      tabs,
      activeTab,
      layoutConfig,

      // Getters
      sidebarWidth,
      showTabs,
      showBreadcrumb,
      showFooter,
      layoutMode,
      themeMode,

      // Actions
      toggleSidebar,
      setSidebarCollapsed,
      setDevice,
      setMobileSidebarOpen,
      setOpenedMenuKeys,
      setActiveMenuKey,
      addTab,
      removeTab,
      closeOtherTabs,
      closeAllTabs,
      closeLeftTabs,
      closeRightTabs,
      setActiveTab,
      clearAllTabs,
      updateLayoutConfig,
      resetLayoutConfig
    }
  },
  {
    // ========== 持久化配置 ==========
    persist: {
      key: 'layout-store',
      storage: localStorage,
      pick: ['layoutConfig'] // 只持久化布局配置，不持久化标签页（标签页是会话级别的）
    }
  }
)
