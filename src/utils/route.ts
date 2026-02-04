/**
 * 路由工具函数
 * 用于处理动态路由的转换和组件加载
 */
import type { RouteRecordRaw } from 'vue-router'
import type { MenuTreeVO } from '@/stores/types/user'

/**
 * 将后端菜单数据转换为路由配置
 * @param menus 后端菜单树数据
 * @returns 路由配置
 */
export function convertMenusToRoutes(menus: MenuTreeVO[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []

  menus.forEach((menu) => {
    // 递归处理子菜单
    if (menu.children?.length) {
      const childRoutes = convertMenusToRoutes(menu.children)
      routes.push(...childRoutes)
    }

    // 只处理有 componentPath 和 routePath 的菜单
    if (!menu.componentPath || !menu.routePath) {
      return
    }

    // 确保路径以 / 开头（子路由的绝对路径）
    const path = menu.routePath.startsWith('/') ? menu.routePath : `/${menu.routePath}`

    const route: RouteRecordRaw = {
      path,
      name: menu.routeName || menu.menuId,
      component: loadViewComponent(menu.componentPath),
      meta: {
        title: menu.menuName,
        icon: menu.menuIcon,
        hidden: !menu.visible,
        keepAlive: false,
        affix: false,
        order: menu.menuSort
      }
    }

    routes.push(route)
  })

  return routes
}

/**
 * 动态加载视图组件
 * @param componentPath 组件路径（相对于 views 目录）
 * @returns 组件
 */
export function loadViewComponent(componentPath: string | undefined) {
  if (!componentPath) {
    return () => import('@/views/error/NotFoundPage.vue')
  }

  // 使用 Vite 的 import.meta.glob 动态导入组件
  const modules = import.meta.glob('../views/**/*.vue')

  // 标准化组件路径：去除首尾空格，确保以 .vue 结尾
  let normalizedPath = componentPath.trim()
  if (!normalizedPath.endsWith('.vue')) {
    normalizedPath += '.vue'
  }

  // 移除开头的斜杠或 views/
  normalizedPath = normalizedPath.replace(/^(\/+)?(views\/+)?/, '')

  const key = `../views/${normalizedPath}`

  if (modules[key]) {
    return modules[key]
  }

  console.warn(`组件不存在: ${key}`)
  return () => import('@/views/error/NotFoundPage.vue')
}
