import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AppRouteRecordRaw } from '@/types/router'
import { constantRoutes } from '@/router/asyncRoutes'
import type { BackendMenuItem } from '@/types/api'
import { transformBackendMenusToRoute } from '@/utils/router'

/**
 * 权限 Store
 */
export const usePermissionStore = defineStore('permission', () => {
  // State
  const routes = ref<AppRouteRecordRaw[]>([])
  const dynamicRoutes = ref<AppRouteRecordRaw[]>([])
  const addRoutes = ref<AppRouteRecordRaw[]>([])
  const menuRoutes = ref<AppRouteRecordRaw[]>([])
  const routesLoaded = ref(false)

  /**
   * 根据后端菜单生成路由
   */
  function generateRoutes(backendMenus: BackendMenuItem[]): AppRouteRecordRaw[] {
    let accessedRoutes: AppRouteRecordRaw[]

    // 将后端菜单转换为前端路由
    accessedRoutes = transformBackendMenusToRoute(backendMenus)

    // 添加 404 路由（必须在最后）
    accessedRoutes.push({
      path: '/:pathMatch(.*)*',
      redirect: '/404',
      meta: { hidden: true }
    } as AppRouteRecordRaw)

    dynamicRoutes.value = accessedRoutes
    addRoutes.value = constantRoutes.concat(accessedRoutes)
    routes.value = constantRoutes.concat(accessedRoutes)
    menuRoutes.value = filterHiddenRoutes(accessedRoutes)
    routesLoaded.value = true

    return accessedRoutes
  }

  /**
   * 过滤隐藏的路由（用于菜单显示）
   */
  function filterHiddenRoutes(routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
    const res: AppRouteRecordRaw[] = []

    routes.forEach(route => {
      if (!route.meta?.hidden) {
        const tmp = { ...route }
        if (tmp.children) {
          tmp.children = filterHiddenRoutes(tmp.children)
        }
        res.push(tmp)
      }
    })

    return res
  }

  /**
   * 重置路由
   */
  function resetRoutes() {
    routes.value = []
    dynamicRoutes.value = []
    addRoutes.value = []
    menuRoutes.value = []
    routesLoaded.value = false
  }

  return {
    // State
    routes,
    dynamicRoutes,
    addRoutes,
    menuRoutes,
    routesLoaded,
    // Actions
    generateRoutes,
    resetRoutes
  }
})
