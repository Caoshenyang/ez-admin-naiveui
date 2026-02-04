/**
 * 路由守卫
 * 用于控制页面访问权限和动态路由加载
 */
import router from './index'
import { useUserStore } from '@/stores/modules/user'
import { loadingBar } from '@/hooks/useNaiveApi'

// 白名单路由（不需要登录即可访问）
const whiteList = ['/login', '/loading']

// 是否已获取过用户信息和菜单
let hasGetInfo = false

// 设置已获取用户信息标志
export function setHasGetInfo(value: boolean) {
  hasGetInfo = value
}

// 重新导出路由转换函数
export { convertMenusToRoutes } from '@/utils/route'

router.beforeEach((to, _from, next) => {
  loadingBar.start()

  const userStore = useUserStore()
  const hasToken = userStore.isLoggedIn

  if (hasToken) {
    // 已登录访问登录页，重定向到首页
    if (to.path === '/login') {
      next({ path: '/' })
      return
    }

    // 已获取用户信息，直接放行
    if (hasGetInfo) {
      next()
      return
    }

    // 未获取用户信息，重定向到 loading 页（由组件处理加载逻辑）
    if (to.path !== '/loading') {
      next({ path: '/loading', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    // 未登录，白名单直接放行，否则重定向到登录页
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  loadingBar.finish()
})

// 重置路由守卫状态（用于登出后）
export function resetPermissionGuard() {
  hasGetInfo = false
}
