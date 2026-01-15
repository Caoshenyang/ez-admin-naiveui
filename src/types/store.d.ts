import type { Ref } from 'vue'

/**
 * 应用状态
 */
export interface AppState {
  /** 主题模式 */
  theme: 'light' | 'dark' | 'auto'
  /** 侧边栏折叠状态 */
  sidebarCollapsed: boolean
  /** 侧边栏宽度 */
  sidebarWidth: number
  /** 设备类型 */
  device: 'desktop' | 'mobile'
  /** 语言 */
  language: string
}

/**
 * 认证状态
 */
export interface AuthState {
  /** 访问令牌 */
  token: string
  /** 刷新令牌 */
  refreshToken?: string
  /** 用户信息 */
  userInfo: UserInfo | null
  /** 用户角色 */
  roles: string[]
  /** 用户权限 */
  permissions: string[]
}

/**
 * 权限状态
 */
export interface PermissionState {
  /** 所有路由 */
  routes: AppRouteRecordRaw[]
  /** 动态路由 */
  dynamicRoutes: AppRouteRecordRaw[]
  /** 已添加的路由 */
  addRoutes: AppRouteRecordRaw[]
  /** 菜单路由 */
  menuRoutes: AppRouteRecordRaw[]
  /** 路由是否已加载 */
  routesLoaded: boolean
}

/**
 * 标签页视图状态
 */
export interface TagsViewState {
  /** 访问过的页面 */
  visitedViews: TagView[]
  /** 缓存的页面 */
  cachedViews: Set<string>
}

/**
 * 标签页视图
 */
export interface TagView {
  name: string
  path: string
  title: string
  query?: Record<string, any>
  fullPath?: string
}

/**
 * 导入的用户信息类型
 */
import type { UserInfo } from './api'
import type { AppRouteRecordRaw } from './router'
