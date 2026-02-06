/**
 * 路由工具函数
 * 用于处理动态路由的转换和组件加载
 */
import type { RouteRecordRaw } from 'vue-router'
import type { MenuTreeVO } from '@/stores/types/user'
import type { MenuOption } from 'naive-ui'
import { h } from 'vue'
import { Icon } from '@iconify/vue'

/**
 * 将后端菜单数据转换为路由配置
 * @param menus 后端菜单树数据
 * @returns 路由配置
 */
export function convertMenusToRoutes(menus: MenuTreeVO[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []

  menus.forEach((menu) => {
    // 处理路由路径：去除开头的斜杠（父路由用）
    let path = ''
    if (menu.routePath) {
      path = menu.routePath.startsWith('/') ? menu.routePath.slice(1) : menu.routePath
    }

    // 如果有子菜单，递归处理
    if (menu.children?.length) {
      const childRoutes = convertMenusToRoutes(menu.children)

      // 如果有 routePath，生成父级路由（目录）
      if (path) {
        // 找到第一个有 componentPath 的子路由
        const firstChildRoute = childRoutes.find((r) => r.component)

        const route: RouteRecordRaw = {
          path,
          name: menu.routeName || menu.menuId,
          redirect: firstChildRoute ? firstChildRoute.path : undefined, // 重定向到第一个有组件的子路由
          meta: {
            title: menu.menuName,
            icon: menu.menuIcon,
            hidden: menu.visible === false // 只有明确为 false 时才隐藏
          },
          children: childRoutes
        }
        routes.push(route)
      } else {
        // 如果没有 path，直接添加子路由
        routes.push(...childRoutes)
      }
    }
    // 如果有 componentPath，生成页面路由（叶子节点）
    // 子路由保持完整路径（以 / 开头）
    else if (menu.componentPath && menu.routePath) {
      const route: RouteRecordRaw = {
        path: menu.routePath, // 保持完整路径，如 /system/user
        name: menu.routeName || menu.menuId,
        component: loadViewComponent(menu.componentPath),
        meta: {
          title: menu.menuName,
          icon: menu.menuIcon,
          hidden: menu.visible === false, // 只有明确为 false 时才隐藏
          keepAlive: false,
          affix: false,
          order: menu.menuSort
        }
      }
      routes.push(route)
    }
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

  return () => import('@/views/error/NotFoundPage.vue')
}

/**
 * 将后端菜单数据转换为 NaiveUI Menu 配置
 * @param menus 后端菜单树数据
 * @returns NaiveUI Menu 配置
 */
export function convertMenusToMenuOptions(menus: MenuTreeVO[]): MenuOption[] {
  const result: MenuOption[] = []

  menus.forEach((menu) => {
    // 跳过隐藏的菜单（visible 为 false 时隐藏，undefined 或 true 时显示）
    // 跳过停用的菜单（status 明确不为 1 时跳过，undefined 或 1 时显示）
    if (menu.visible === false || (menu.status !== undefined && menu.status !== 1)) {
      return
    }

    const menuItem: MenuOption = {
      key: menu.menuLabel || menu.menuId!,
      label: menu.menuName!,
      icon: menu.menuIcon ? () => h(Icon, { icon: menu.menuIcon as string }) : undefined
    }

    // 递归处理子菜单
    if (menu.children?.length) {
      const children = convertMenusToMenuOptions(menu.children)
      if (children.length > 0) {
        menuItem.children = children
      }
    }

    // 判断是否添加菜单
    // menuType: 1=目录, 2=页面, 3=按钮
    // 如果 menuType 为空但有 routePath，默认视为有效菜单
    const isValidMenu =
      menu.menuType === 1 || // 目录
      menu.menuType === 2 || // 页面
      ((menu.menuType === undefined || menu.menuType === null) && menu.routePath) // 无类型但有路径

    if (isValidMenu) {
      result.push(menuItem)
    }
  })

  return result
}

/**
 * 获取菜单的路径映射（用于路由跳转）
 * @param menus 后端菜单树数据
 * @returns key 到 path 的映射
 */
export function buildMenuPathMap(menus: MenuTreeVO[]): Map<string, string> {
  const pathMap = new Map<string, string>()

  function buildMap(items: MenuTreeVO[]) {
    items.forEach((menu) => {
      const key = menu.menuLabel || menu.menuId!
      if (menu.routePath) {
        pathMap.set(key, menu.routePath)
      }
      if (menu.children?.length) {
        buildMap(menu.children)
      }
    })
  }

  buildMap(menus)
  return pathMap
}
