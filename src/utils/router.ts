import type { AppRouteRecordRaw } from '@/types/router'
import type { BackendMenuItem } from '@/types/api'

/**
 * 将后端菜单转换为前端路由
 */
export function transformBackendMenuToRoute(menu: BackendMenuItem): AppRouteRecordRaw {
  const route: AppRouteRecordRaw = {
    path: menu.routePath || `/${menu.menuId}`,
    name: menu.menuName,
    component: loadComponent(menu.componentPath, menu.menuType),
    redirect: menu.redirect || undefined,
    meta: {
      title: menu.menuName,
      icon: menu.menuIcon,
      hidden: menu.hidden || false,
      permissions: menu.menuPerm ? [menu.menuPerm] : undefined,
      keepAlive: true
    }
  }

  // 递归处理子菜单
  if (menu.children && menu.children.length > 0) {
    // 过滤掉按钮类型（menuType=3）并转换
    const childRoutes = menu.children
      .filter(child => child.menuType !== 3)
      .map(child => transformBackendMenuToRoute(child))

    // 如果有子路由，添加到路由中
    if (childRoutes.length > 0) {
      route.children = childRoutes

      // 如果是目录类型且有子路由，重定向到第一个子路由
      if (menu.menuType === 1 && childRoutes.length > 0) {
        route.redirect = childRoutes[0].path
      }
    }
  }

  return route
}

/**
 * 动态加载组件
 */
function loadComponent(componentPath: string | undefined, menuType: number) {
  // 菜单类型：1 目录 2 菜单 3 按钮
  if (menuType === 1) {
    // 目录类型，使用布局组件
    return () => import('@/layouts/DefaultLayout.vue')
  }

  if (componentPath) {
    // 如果有组件路径，动态导入
    // 这里需要根据后端返回的组件路径映射到实际的组件文件
    // 例如：/system/user/UserManagement.vue -> views/system/user/UserManagement.vue
    const path = componentPath.replace(/^\//, '').replace(/\.vue$/, '')
    return () => import(`@/views/${path}.vue`)
  }

  // 默认返回布局组件
  return () => import('@/layouts/DefaultLayout.vue')
}

/**
 * 将后端菜单列表转换为前端路由列表
 */
export function transformBackendMenusToRoute(menus: BackendMenuItem[]): AppRouteRecordRaw[] {
  if (!menus || menus.length === 0) {
    return []
  }

  // 过滤出顶级菜单（parentId 为 0 或 null）
  const topLevelMenus = menus.filter(menu => !menu.parentId || menu.parentId === 0)

  // 转换为路由
  return topLevelMenus
    .filter(menu => menu.menuType !== 3) // 过滤掉按钮类型
    .map(menu => transformBackendMenuToRoute(menu))
}

/**
 * 根据权限过滤路由
 */
export function filterRoutesByPermissions(
  routes: AppRouteRecordRaw[],
  permissions: string[]
): AppRouteRecordRaw[] {
  const filteredRoutes: AppRouteRecordRaw[] = []

  routes.forEach(route => {
    const routeCopy = { ...route }

    // 检查路由权限
    if (route.meta?.permissions) {
      const hasPermission = route.meta.permissions.some(perm =>
        permissions.includes(perm)
      )

      if (!hasPermission) {
        return
      }
    }

    // 递归处理子路由
    if (route.children && route.children.length > 0) {
      routeCopy.children = filterRoutesByPermissions(route.children, permissions)
    }

    filteredRoutes.push(routeCopy)
  })

  return filteredRoutes
}
