import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LayoutConfig, MenuItem, TabItem } from '@/types/layout'
import { localStorage } from '@/utils/storage'

/**
 * 布局 Store
 * 使用 Setup Store 模式
 */
export const useLayoutStore = defineStore('layout', () => {
  // ==================== 状态 ====================
  const isSidebarCollapsed = ref(false) // 侧边栏是否折叠
  const device = ref<'desktop' | 'mobile'>('desktop') // 设备类型
  const mobileSidebarOpen = ref(false) // 移动端侧边栏是否打开
  const openedMenuKeys = ref<string[]>([]) // 打开的菜单 keys
  const activeMenuKey = ref<string>('') // 选中的菜单 key
  const tabs = ref<TabItem[]>([]) // 打开的标签页列表
  const activeTab = ref<string>('') // 当前激活的标签页

  // ==================== 默认配置 ====================
  const defaultConfig: LayoutConfig = {
    isSidebarCollapsed: false,
    sidebarWidth: 240,
    sidebarCollapsedWidth: 64,
    showTabs: true,
    showBreadcrumb: true,
    showFooter: true,
    layoutMode: 'sidebar',
    themeMode: 'light',
  }

  // 从本地存储读取配置
  const savedConfig = localStorage.get<LayoutConfig>('layout-config')
  const layoutConfig = ref<LayoutConfig>({ ...defaultConfig, ...savedConfig })

  // ==================== Getters ====================
  // 当前侧边栏宽度
  const sidebarWidth = computed(() =>
    isSidebarCollapsed.value
      ? layoutConfig.value.sidebarCollapsedWidth
      : layoutConfig.value.sidebarWidth
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
    // 检查是否已存在
    const existTab = tabs.value.find(t => t.path === tab.path)
    if (!existTab) {
      tabs.value.push(tab)
    }
    activeTab.value = tab.path
  }

  // 移除标签页
  const removeTab = (path: string) => {
    const index = tabs.value.findIndex(t => t.path === path)
    if (index > -1) {
      tabs.value.splice(index, 1)
      // 如果关闭的是当前激活的标签页，则激活最后一个标签页
      if (activeTab.value === path && tabs.value.length > 0) {
        activeTab.value = tabs.value[tabs.value.length - 1].path
      }
    }
  }

  // 关闭其他标签页
  const closeOtherTabs = (path: string) => {
    tabs.value = tabs.value.filter(t => t.path === path || t.affix)
    activeTab.value = path
  }

  // 关闭所有标签页
  const closeAllTabs = () => {
    tabs.value = tabs.value.filter(t => t.affix)
    if (tabs.value.length > 0) {
      activeTab.value = tabs.value[0].path
    }
  }

  // 关闭左侧标签页
  const closeLeftTabs = (path: string) => {
    const index = tabs.value.findIndex(t => t.path === path)
    if (index > -1) {
      tabs.value = tabs.value.slice(index)
    }
  }

  // 关闭右侧标签页
  const closeRightTabs = (path: string) => {
    const index = tabs.value.findIndex(t => t.path === path)
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
    // 保存到本地存储
    localStorage.set('layout-config', layoutConfig.value)
  }

  // 重置布局配置
  const resetLayoutConfig = () => {
    layoutConfig.value = { ...defaultConfig }
    localStorage.set('layout-config', defaultConfig)
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
    updateLayoutConfig,
    resetLayoutConfig,
  }
})
