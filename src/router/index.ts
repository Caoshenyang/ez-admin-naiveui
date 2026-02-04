import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes, asyncRoutes } from './routes'

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes, ...asyncRoutes],
  scrollBehavior: () => ({ top: 0 }),
})

/**
 * 动态添加路由
 * @param routes 动态路由配置
 */
export function addRoutes(routes: RouteRecordRaw[]) {
  routes.forEach(route => {
    router.addRoute(route)
  })
}

/**
 * 重置路由
 * 使用 Vue Router 4 的 removeRoute API 移除所有动态路由
 */
export function resetRouter() {
  // 获取所有当前路由
  const allRoutes = router.getRoutes()

  // 获取所有需要保留的基础路由名称
  const constantRouteNames = new Set(constantRoutes.map(r => r.name))

  // 删除所有不在 constantRoutes 中的路由
  allRoutes.forEach((route) => {
    const { name } = route
    if (name && !constantRouteNames.has(name)) {
      router.removeRoute(name)
    }
  })
}

export default router
