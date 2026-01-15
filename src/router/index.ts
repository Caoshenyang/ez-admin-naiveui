import { createRouter, createWebHistory } from 'vue-router'
import type { AppRouteRecordRaw } from '@/types/router'
import { constantRoutes } from './asyncRoutes'
import { setupRouterGuard } from './guards'

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes as any,
  scrollBehavior: () => ({ top: 0 })
})

/**
 * 设置路由守卫
 */
export function setupRouter(app: any) {
  setupRouterGuard(router)
  app.use(router)
}

export default router
