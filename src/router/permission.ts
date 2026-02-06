/**
 * 路由守卫
 */
import router from './index'
import { useUserStore } from '@/stores/modules/user'
import { useMenuStore } from '@/stores/modules/menu'
import { loadingBar, message } from '@/hooks/useNaiveApi'
import { convertMenusToRoutes, convertMenusToMenuOptions, buildMenuPathMap } from '@/utils/route'
import { notFoundRoute } from './routes'

// 白名单路由（不需要登录即可访问）
const whiteList = ['/login']

// 是否已加载过动态路由
let hasDynamicRoutes = false

// 是否为手动刷新（跳过 loadingBar）
let isManualRefresh = false

router.beforeEach(async (to, from, next) => {
  // 如果是刷新操作且路径相同，跳过 loadingBar
  if (isManualRefresh && to.path === from.path) {
    isManualRefresh = false
    next()
    return
  }

  loadingBar.start()
  const userStore = useUserStore()
  const menuStore = useMenuStore()
  const isLoggedIn = userStore.isLoggedIn

  if (isLoggedIn) {
    // 已登录访问登录页，重定向到首页
    if (to.path === '/login') {
      next({ path: '/' })
      loadingBar.finish()
      return
    }

    // 快速路径：已加载动态路由，直接放行
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

      // 3. 转换为 NaiveUI Menu 配置并缓存
      const menuOptions = convertMenusToMenuOptions(backendMenus)
      const pathMap = buildMenuPathMap(backendMenus)
      menuStore.setDynamicMenus(menuOptions, pathMap, true)

      // 4. 生成动态路由
      const dynamicRoutes = convertMenusToRoutes(backendMenus)
      console.log('生成的动态路由:', dynamicRoutes)

      // 5. 注册动态路由到 Layout 下
      dynamicRoutes.forEach((route) => {
        router.addRoute('Layout', route)
      })

      // 6. 移除临时通配路由（避免冲突）
      router.removeRoute('TempWildcard')

      // 7. 注册 404 路由（必须在所有路由之后）
      router.addRoute(notFoundRoute)

      // 8. 标记已加载
      hasDynamicRoutes = true

      // 9. hack 方法：确保 addRoutes 完成后重新导航
      // 注意：不能使用 next({ ...to, replace: true })，因为 to.name 是 'TempWildcard'
      // 移除 TempWildcard 后会导致 "No match for" 错误
      // 只传递 path，让 Vue Router 重新匹配
      next({ path: to.path, query: to.query, hash: to.hash, replace: true })
    } catch (error) {
      console.error('加载动态路由失败:', error)
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

// 手动刷新页面（不触发 loadingBar）
export function manualRefresh() {
  isManualRefresh = true
  router.go(0)
}
