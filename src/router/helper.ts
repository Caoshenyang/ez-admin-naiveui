import type { RouteRecordRaw } from 'vue-router'
import type { MenuVO } from './types'

/**
 * 组件映射表
 * 将后端返回的组件路径映射到实际组件
 */
const modules = import.meta.glob('../views/**/*.vue')

/**
 * 根据组件路径动态加载组件
 * @param componentPath 组件路径，如 'system/user/index'
 * @returns 组件
 */
export function loadComponent(componentPath: string) {
  const key = `../views/${componentPath}.vue`

  if (modules[key]) {
    return modules[key]
  }

  console.warn(`组件不存在: ${key}`)
  return () => import('../views/error/NotFoundPage.vue')
}

/**
 * 将后端菜单数据转换为路由配置
 * @param menu 后端菜单数据
 * @returns 路由配置
 */
export function menuToRoute(menu: MenuVO): RouteRecordRaw {
  const route: RouteRecordRaw = {
    path: menu.path,
    name: menu.menuId.toString(),
    component: loadComponent(menu.component),
    meta: {
      title: menu.title,
      icon: menu.icon,
      hidden: menu.hidden,
      keepAlive: menu.keepAlive,
      affix: menu.affix,
      permissions: menu.permissions,
      order: menu.order,
    },
    children: menu.children && menu.children.length > 0
      ? menu.children.map(menuToRoute)
      : undefined,
  }

  return route
}
