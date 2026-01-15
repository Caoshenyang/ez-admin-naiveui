import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'

// 白名单路由
const whiteList = ['/login', '/404']

/**
 * 设置路由守卫
 */
export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const permissionStore = usePermissionStore()

    // 设置页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE || 'Easy Admin'}`
    }

    // Cookie 认证模式：通过检查用户信息判断登录状态
    if (authStore.userInfo) {
      // 已登录
      if (to.path === '/login') {
        // 已登录，跳转到首页
        next({ path: '/' })
      } else {
        // 检查路由是否已加载
        if (!permissionStore.routesLoaded) {
          // 使用后端返回的菜单数据生成路由
          const backendMenus = authStore.userInfo.menus || []
          const accessRoutes = permissionStore.generateRoutes(backendMenus)

          // 动态添加路由
          accessRoutes.forEach(route => {
            router.addRoute(route as any)
          })

          // 确保添加路由完成后再跳转
          next({ ...to, replace: true })
        } else {
          next()
        }
      }
    } else {
      // 未登录 - 尝试获取用户信息（可能已有 Cookie）
      if (whiteList.includes(to.path)) {
        next()
      } else {
        try {
          // 尝试获取用户信息
          await authStore.getInfo()

          // 获取成功，使用后端返回的菜单数据生成路由
          const backendMenus = authStore.userInfo.menus || []
          const accessRoutes = permissionStore.generateRoutes(backendMenus)

          // 动态添加路由
          accessRoutes.forEach(route => {
            router.addRoute(route as any)
          })

          // 确保添加路由完成后再跳转
          next({ ...to, replace: true })
        } catch (error) {
          // 获取用户信息失败，跳转登录页
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  })

  router.afterEach(() => {
    // 完成加载
    // 可以在这里关闭 loading
  })

  router.onError((error) => {
    console.error('Router error:', error)
  })
}
