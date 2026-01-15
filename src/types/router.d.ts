import type { RouteRecordRaw } from 'vue-router'

/**
 * 扩展的路由元信息
 */
export interface RouteMeta {
  /** 菜单标题 */
  title: string
  /** 菜单图标 */
  icon?: string
  /** 是否隐藏菜单 */
  hidden?: boolean
  /** 角色权限 */
  roles?: string[]
  /** 权限标识 */
  permissions?: string[]
  /** 是否缓存页面 */
  keepAlive?: boolean
  /** 是否固定在标签栏 */
  affix?: boolean
  /** 是否不缓存 */
  noCache?: boolean
  /** 链接地址 */
  link?: string
}

/**
 * 扩展的路由记录
 */
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  meta?: RouteMeta
  children?: AppRouteRecordRaw[]
}
