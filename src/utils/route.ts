/**
 * 路由工具函数
 * 用于处理动态路由的转换和组件加载
 */
import type { RouteRecordRaw } from 'vue-router'
import type { MenuTreeVO } from '@/stores/types/user'
import type { FrontendMenuItem } from '@/types/menu'
import { getIconComponent } from '@/config/icons'

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

/**
 * 将后端菜单数据转换为前端菜单配置（用于 NaiveUI Menu）
 * @param menus 后端菜单树数据
 * @returns 前端菜单配置
 */
export function convertMenusToMenuOptions(menus: MenuTreeVO[]): FrontendMenuItem[] {
  const result: FrontendMenuItem[] = []

  menus.forEach((menu) => {
    // 跳过隐藏的菜单（visible 为 false 时隐藏，undefined 或 true 时显示）
    if (menu.visible === false || menu.status !== 1) {
      console.log(`⏭️  跳过隐藏/停用菜单: ${menu.menuName} (visible: ${menu.visible}, status: ${menu.status})`)
      return
    }

    const menuItem: FrontendMenuItem = {
      key: menu.menuLabel || menu.menuId!,
      label: menu.menuName!,
      icon: getIconComponent(menu.menuIcon),
      path: menu.routePath,
      order: menu.menuSort,
      name: menu.routeName
    }

    // 递归处理子菜单
    if (menu.children?.length) {
      const children = convertMenusToMenuOptions(menu.children)
      if (children.length > 0) {
        menuItem.children = children
      }
    }

    // 只添加有实际内容的菜单（目录或有路由的菜单）
    if (menu.menuType === 1 || menu.menuType === 2) {
      console.log(`✅ 添加菜单: ${menu.menuName} (type: ${menu.menuType}, path: ${menu.routePath})`)
      result.push(menuItem)
    } else {
      console.log(`⏭️  跳过按钮类型菜单: ${menu.menuName} (type: ${menu.menuType})`)
    }
  })

  return result
}
