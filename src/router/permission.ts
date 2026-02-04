/**
 * 路由守卫
 */
import router from './index'
import { useUserStore } from '@/stores/modules/user'
import { useMenuStore } from '@/stores/modules/menu'
import { loadingBar, message } from '@/hooks/useNaiveApi'
import { convertMenusToRoutes, convertMenusToMenuOptions } from '@/utils/route'
import { notFoundRoute } from './routes'

// 白名单路由（不需要登录即可访问）
const whiteList = ['/login']

// 是否已加载过动态路由
let hasDynamicRoutes = false

router.beforeEach(async (to, _from, next) => {
  console.log(`🔍 路由守卫触发: ${to.path}`)
  loadingBar.start()

  const userStore = useUserStore()
  const menuStore = useMenuStore()
  const hasToken = userStore.isLoggedIn

  if (hasToken) {
    // 已登录访问登录页，重定向到首页
    if (to.path === '/login') {
      next({ path: '/' })
      loadingBar.finish()
      return
    }

    // 已加载动态路由，直接放行
    if (hasDynamicRoutes) {
      next()
      return
    }

    // 首次加载：生成并注册动态路由
    try {
      // 1. 获取用户信息
      await userStore.getUserInfo()
      const backendMenus = userStore.userInfo?.menus || []

      // 2. 检查权限
      if (backendMenus.length === 0) {
        message.warning('当前账号无菜单权限，请联系管理员')
        await userStore.logout()
        next('/login')
        loadingBar.finish()
        return
      }

      // 3. 转换为前端菜单并缓存
      const frontendMenus = convertMenusToMenuOptions(backendMenus)
      menuStore.setDynamicMenus(frontendMenus, true)

      // 4. 生成动态路由
      const dynamicRoutes = convertMenusToRoutes(backendMenus)

      // 5. 注册动态路由到 Layout 下
      dynamicRoutes.forEach((route) => {
        router.addRoute('Layout', route)
      })

      // 6. 注册 404 路由
      router.addRoute(notFoundRoute)

      // 7. 标记已加载
      hasDynamicRoutes = true

      // 8. hack方法：确保 addRoutes 完成后重新导航
      next({ ...to, replace: true })
    } catch (error) {
      userStore.resetUserState()
      menuStore.clearMenus()
      message.error('加载用户信息失败，请重新登录')
      next(`/login?redirect=${to.fullPath}`)
      loadingBar.finish()
    }
  } else {
    // 未登录：白名单放行，其他跳转登录
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`)
    }
    loadingBar.finish()
  }
})

router.afterEach(() => {
  loadingBar.finish()
})

// 重置路由守卫状态（用于登出后）
export function resetPermissionGuard() {
  hasDynamicRoutes = false
}
