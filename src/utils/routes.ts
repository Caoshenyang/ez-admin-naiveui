import { useUserInfoStore } from '@/stores/modules/user'
import type { MenuTreeVO, RouteMeta } from '@/types'
import type { RouteRecordRaw } from 'vue-router'
import { logger } from '@/utils/logger'

/**
 * 获取组件导入函数
 */
function getComponentImporter(component?: string) {
  if (!component) return undefined

  // 处理动态导入路径，确保路径格式正确
  const normalizedPath = component.startsWith('/') ? component.slice(1) : component
  // 注意这里不要用别名 @/views/${normalizedPath}，使用 @ 会不生效
  return () => import(/* @vite-ignore */ `../views/${normalizedPath}`)
}

/**
 * 查找第一个实际的路由（有组件的路由）
 */
const findFirstActualRoute = (routes: RouteRecordRaw[]): RouteRecordRaw | null => {
  for (const route of routes) {
    // 如果路由有组件，返回它
    if (route.component) {
      return route
    }
    // 如果有子路由，递归查找
    if (route.children && route.children.length > 0) {
      const found = findFirstActualRoute(route.children)
      if (found) return found
    }
  }
  return null
}

/**
 * 转换单个菜单为路由配置
 */
function transformMenuToRoute(menu: MenuTreeVO, parentPath = ''): RouteRecordRaw | null {
  // 忽略按钮类型(menuType=3)
  if (menu.menuType === 3) return null

  // 处理路径拼接，确保格式正确
  const path = menu.routePath?.startsWith('/') ? menu.routePath.slice(1) : menu.routePath || ''
  const fullPath = parentPath ? `${parentPath}/${path}` : `/${path}`

  // 基础路由配置
  const route: RouteRecordRaw = {
    path: fullPath,
    name: menu.menuName,
    children: [],
  }

  if (menu.menuType === 1) {
    // 目录(menuType=1) - 创建容器路由，递归处理子项
    const children = menu.children
      ? menu.children
          .sort((a, b) => (a.menuSort || 0) - (b.menuSort || 0))
          .map((child) => transformMenuToRoute(child, fullPath))
          .filter((route): route is RouteRecordRaw => route !== null)
      : []

    // 查找第一个实际的路由（有组件的路由）用于重定向
    const firstActualRoute = findFirstActualRoute(children)

    Object.assign(route, {
      children,
      ...(firstActualRoute && { redirect: firstActualRoute.path }),
      meta: {
        title: menu.menuName,
        icon: menu.menuIcon,
        requiresPermission: true,
        showInMenu: true,
        order: menu.menuSort,
      } as RouteMeta,
    })
  } else if (menu.menuType === 2) {
    // 菜单(menuType=2) - 生成实际路由，不递归处理子项
    Object.assign(route, {
      component: getComponentImporter(menu.componentPath),
      meta: {
        title: menu.menuName,
        icon: menu.menuIcon,
        requiresPermission: true,
        showInMenu: true,
        order: menu.menuSort,
        keepAlive: false,
      } as RouteMeta,
    })
  }

  return route
}

/**
 * 过滤菜单树，移除按钮类型的菜单
 */
export const filterMenuTree = (menuTree: MenuTreeVO[]): MenuTreeVO[] => {
  return menuTree
    .filter((node) => node.menuType !== 3) // 过滤掉按钮类型
    .map((node) => ({
      ...node,
      children: node.children ? filterMenuTree(node.children) : [],
    }))
}

// 将菜单数据转换为路由配置
export const convertMenusToRoutes = (menus: MenuTreeVO[]): RouteRecordRaw[] => {
  if (!menus || menus.length === 0) {
    return []
  }

  // 过滤并排序顶级菜单，然后转换为路由
  return menus
    .filter((menu) => {
      const parentId = menu.parentId
      return !parentId || String(parentId) === '0'
    })
    .sort((a, b) => (a.menuSort || 0) - (b.menuSort || 0))
    .map((menu) => transformMenuToRoute(menu))
    .filter((route): route is RouteRecordRaw => route !== null)
}

// 生成用户路由配置（从后端菜单数据）
export const generateUserRoutes = async (): Promise<{
  routes: RouteRecordRaw[]
  success: boolean
}> => {
  try {
    // 从缓存中获取用户数据
    const userInfoStore = useUserInfoStore()
    const menus = userInfoStore.userInfo.menus

    // 将菜单数据转换为路由
    const routes = convertMenusToRoutes(menus)
    return { routes, success: true }
  } catch (error) {
    logger.error('获取用户菜单失败:', error)
    return { routes: [], success: false }
  }
}
