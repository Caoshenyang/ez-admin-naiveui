/**
 * 菜单项类型
 */
export interface MenuItem {
  /** 菜单项唯一标识 */
  key: string
  /** 菜单显示名称 */
  label: string
  /** 菜单图标 */
  icon?: () => import('vue').Component
  /** 路由路径 */
  path?: string
  /** 是否隐藏 */
  hidden?: boolean
  /** 子菜单 */
  children?: MenuItem[]
  /** 外链地址 */
  url?: string
  /** 是否在当前窗口打开外链 */
  isTargetSelf?: boolean
  /** 路由名称（用于路由跳转） */
  name?: string
  /** 菜单元信息 */
  meta?: RouteMeta
}

/**
 * 路由元信息
 */
export interface RouteMeta {
  /** 页面标题 */
  title?: string
  /** 是否在菜单中隐藏 */
  hidden?: boolean
  /** 是否缓存页面 */
  keepAlive?: boolean
  /** 权限标识 */
  roles?: string[]
  /** 图标 */
  icon?: string
  /** 排序 */
  order?: number
  /** 是否在标签页中显示 */
  affix?: boolean
  /** 是否不显示面包屑 */
  noBreadcrumb?: boolean
}

/**
 * 面包屑项
 */
export interface BreadcrumbItem {
  /** 路由路径 */
  path: string
  /** 显示名称 */
  title: string
  /** 是否禁用点击 */
  disabled?: boolean
}

/**
 * 标签页项
 */
export interface TabItem {
  /** 路由路径 */
  path: string
  /** 页面标题 */
  title: string
  /** 路由名称 */
  name: string
  /** 是否固定（不可关闭） */
  affix?: boolean
  /** 查询参数 */
  query?: Record<string, unknown>
}

/**
 * 布局配置
 */
export interface LayoutConfig {
  /** 侧边栏是否折叠 */
  isSidebarCollapsed: boolean
  /** 侧边栏宽度 */
  sidebarWidth: number
  /** 侧边栏折叠后的宽度 */
  sidebarCollapsedWidth: number
  /** 是否显示标签页 */
  showTabs: boolean
  /** 是否显示面包屑 */
  showBreadcrumb: boolean
  /** 是否显示页脚 */
  showFooter: boolean
  /** 布局模式 */
  layoutMode: 'sidebar' | 'top-menu' | 'mix-menu'
  /** 主题模式 */
  themeMode: 'light' | 'dark' | 'auto'
}
