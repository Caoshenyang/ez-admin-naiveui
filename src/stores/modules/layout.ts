import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LayoutConfig, TabItem } from '@/types/layout'
import { localStorage } from '@/utils/storage'

/**
 * 布局 Store
 * 使用 Setup Store 模式
 */
export const useLayoutStore = defineStore('layout', () => {
  // ==================== 常量 ====================
  const HOME_PATH = '' // 首页路径（首页路由在 Layout children 中，path 为空字符串）

  // ==================== 状态 ====================
  const isSidebarCollapsed = ref(false) // 侧边栏是否折叠
  const device = ref<'desktop' | 'mobile'>('desktop') // 设备类型
  const mobileSidebarOpen = ref(false) // 移动端侧边栏是否打开
  const openedMenuKeys = ref<string[]>([]) // 打开的菜单 keys
  const activeMenuKey = ref<string>('') // 选中的菜单 key

  // 从本地存储读取标签页数据（排除 affix 固定标签页）
  const savedTabs = localStorage.get<TabItem[]>('layout-tabs')
  const savedActiveTab = localStorage.get<string>('layout-active-tab')

  // 过滤掉固定标签页（如首页），因为它们应该始终存在
  let filteredSavedTabs = savedTabs ? savedTabs.filter(t => !t.affix) : []

  // 清理重复的首页（如果有多个 path 为首页的标签页，只保留 affix 为 true 的）
  const homePages = filteredSavedTabs.filter(t => t.path === HOME_PATH)
  if (homePages.length > 0) {
    // 如果 localStorage 中有首页（脏数据），全部移除
    filteredSavedTabs = filteredSavedTabs.filter(t => t.path !== HOME_PATH)
  }

  const tabs = ref<TabItem[]>(filteredSavedTabs) // 打开的标签页列表
  const activeTab = ref<string>(savedActiveTab || '') // 当前激活的标签页

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

  // 从本地存储读取配置
  const savedConfig = localStorage.get<LayoutConfig>('layout-config')
  const layoutConfig = ref<LayoutConfig>({ ...defaultConfig, ...savedConfig })

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
  // 保存标签页数据到本地存储（只保存非固定标签页）
  const saveTabs = () => {
    // 过滤掉固定标签页（如首页），因为它们应该始终存在，不需要持久化
    const nonAffixTabs = tabs.value.filter(t => !t.affix)
    localStorage.set('layout-tabs', nonAffixTabs)
    localStorage.set('layout-active-tab', activeTab.value)
  }
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
    const normalizedPath = (tab.path === '/' || tab.path === '') ? HOME_PATH : tab.path

    // 检查当前标签页是否已存在（使用统一后的路径）
    const existTab = tabs.value.find((t) => t.path === normalizedPath)
    if (existTab) {
      // 标签页已存在，只更新激活状态
      activeTab.value = normalizedPath
      saveTabs()
      return
    }

    // 如果添加的不是首页，先确保首页存在（只检查 path，不检查 affix）
    if (normalizedPath !== HOME_PATH) {
      const homeTab = tabs.value.find(t => t.path === HOME_PATH)
      if (!homeTab) {
        // 首页不存在，先添加首页到第一位
        tabs.value.unshift({
          path: HOME_PATH,
          title: '首页',
          name: 'Home',
          affix: true
        })
      }
    }

    // 添加新标签页（使用统一后的路径）
    if (tab.affix && normalizedPath === HOME_PATH) {
      tabs.value.unshift({
        path: HOME_PATH,
        title: tab.title,
        name: tab.name,
        affix: true
      })
    } else {
      tabs.value.push({
        ...tab,
        path: normalizedPath
      })
    }
    activeTab.value = normalizedPath
    // 确保首页在第一位
    ensureHomeFirst()
    saveTabs()
  }

  // 移除标签页
  const removeTab = (path: string) => {
    const index = tabs.value.findIndex((t) => t.path === path)
    if (index > -1) {
      tabs.value.splice(index, 1)
      // 如果关闭的是当前激活的标签页，则激活最后一个标签页
      if (activeTab.value === path && tabs.value.length > 0) {
        const lastTab = tabs.value[tabs.value.length - 1]
        if (lastTab) {
          activeTab.value = lastTab.path
        }
      }
      saveTabs()
    }
  }

  // 关闭其他标签页
  const closeOtherTabs = (path: string) => {
    tabs.value = tabs.value.filter((t) => t.path === path || t.affix)
    activeTab.value = path
    ensureHomeFirst() // 确保首页在第一位
    saveTabs()
  }

  // 关闭所有标签页
  const closeAllTabs = () => {
    tabs.value = tabs.value.filter((t) => t.affix)
    if (tabs.value.length > 0) {
      const firstTab = tabs.value[0]
      if (firstTab) {
        activeTab.value = firstTab.path
      }
    }
    saveTabs()
  }

  // 关闭左侧标签页
  const closeLeftTabs = (path: string) => {
    const index = tabs.value.findIndex((t) => t.path === path)
    if (index > -1) {
      const leftTabs = tabs.value.slice(0, index)
      const homeTab = leftTabs.find(t => t.path === HOME_PATH && t.affix)

      // 如果左侧有首页，保留首页
      if (homeTab) {
        tabs.value = [homeTab, ...tabs.value.slice(index)]
      } else {
        tabs.value = tabs.value.slice(index)
      }
      ensureHomeFirst() // 确保首页在第一位
      saveTabs()
    }
  }

  // 关闭右侧标签页
  const closeRightTabs = (path: string) => {
    const index = tabs.value.findIndex((t) => t.path === path)
    if (index > -1) {
      tabs.value = tabs.value.slice(0, index + 1)
    }
    ensureHomeFirst() // 确保首页在第一位
    saveTabs()
  }

  /**
   * 确保首页始终在第一位
   */
  const ensureHomeFirst = () => {
    const homeIndex = tabs.value.findIndex(t => t.path === HOME_PATH && t.affix)
    if (homeIndex > 0) {
      const [homeTab] = tabs.value.splice(homeIndex, 1)
      if (homeTab) {
        tabs.value.unshift(homeTab)
      }
    }
  }

  // 设置当前激活的标签页
  const setActiveTab = (path: string) => {
    activeTab.value = path
    saveTabs()
  }

  // 更新布局配置
  const updateLayoutConfig = (config: Partial<LayoutConfig>) => {
    layoutConfig.value = { ...layoutConfig.value, ...config }
    // 保存到本地存储
    localStorage.set('layout-config', layoutConfig.value)
  }

  // 重置布局配置
  const resetLayoutConfig = () => {
    layoutConfig.value = { ...defaultConfig }
    localStorage.set('layout-config', defaultConfig)
  }

  // 清除标签页数据（退出登录时调用）
  const clearTabs = () => {
    tabs.value = []
    activeTab.value = ''
    localStorage.remove('layout-tabs')
    localStorage.remove('layout-active-tab')
  }

  // 清除当前激活标签页（退出登录时调用，保留标签页列表但重置激活状态）
  const clearActiveTab = () => {
    activeTab.value = ''
    localStorage.remove('layout-active-tab')
  }

  // 清理所有标签页数据（用于修复旧数据问题）
  const cleanupTabsData = () => {
    // 移除所有 path 为空的标签页（可能存在多个首页）
    tabs.value = tabs.value.filter(t => t.path !== HOME_PATH || t.affix === true)
    // 如果没有首页，添加一个
    if (!tabs.value.find(t => t.path === HOME_PATH)) {
      tabs.value.unshift({
        path: HOME_PATH,
        title: '首页',
        name: 'Home',
        affix: true
      })
    }
    ensureHomeFirst()
    saveTabs()
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
    ensureHomeFirst,
    clearTabs,
    clearActiveTab,
    cleanupTabsData,
    updateLayoutConfig,
    resetLayoutConfig
  }
})
