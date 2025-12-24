import { loadingBar, message } from '@/hooks/useMessagehook'
import router, { ROUTE_PATHS } from '@/router'
import { useUserInfoStore } from '@/stores/modules/user'
import type { RouteMeta } from '@/types/common'
import { routeManager } from '@/utils/routeManager'

/** 白名单路由，用户无需登录即可访问 */
const WHITE_LIST = [ROUTE_PATHS.LOGIN]

/**
 * 检查路径是否在白名单中
 * @param path 路由路径
 * @returns 是否在白名单中
 */
const isInWhiteList = (path: string): boolean => {
  return WHITE_LIST.includes(path.split('?')[0] as (typeof WHITE_LIST)[number])
}

/**
 * 处理用户访问路由前的权限检查
 * 按照正常的思考逻辑：先检查登录状态，再处理各种情况
 */
router.beforeEach(async (to, from, next) => {
  loadingBar.start()

  try {
    const userStore = useUserInfoStore()

    // 第一步：检查用户是否已登录
    if (userStore.isLogin) {
      // 已登录用户的情况

      // 如果已登录用户访问登录页，直接跳转到首页
      if (to.path === ROUTE_PATHS.LOGIN) {
        next(ROUTE_PATHS.HOME)
        return
      }

      // 确保用户信息已获取（Session认证）
      if (!userStore.hasUserInfo) {
        try {
          await userStore.getUserInfo()
        } catch (error) {
          console.error('获取用户信息失败:', error)
          userStore.logout()
          next(ROUTE_PATHS.LOGIN)
          return
        }
      }

      // 确保动态路由已加载（页面刷新后需要重新加载）
      if (!routeManager.isLoaded()) {
        console.log('🔄 开始加载动态路由...')

        try {
          await routeManager.loadRoutes()
          console.log('✅ 动态路由加载完成')
          // 动态路由加载完成后，重新导航到目标路由以确保路由匹配生效
          return next(to.fullPath)
        } catch (error) {
          console.error('❌ 动态路由加载失败:', error)
          message.error((error as Error).message || '路由加载失败，请稍后重试')
          next('/error')
          return
        }
      }

      // 设置页面标题
      const routeMeta = to.meta as RouteMeta
      if (routeMeta.title) {
        document.title = `${routeMeta.title} - EZ-ADMIN`
      }

      // 放行已登录用户的正常访问
      next()
    } else {
      // 未登录用户的情况

      // 检查是否是白名单路由（无需登录）
      if (isInWhiteList(to.path)) {
        next()
        return
      }

      // 非白名单路由需要登录，跳转到登录页
      const redirectPath =
        to.fullPath !== ROUTE_PATHS.HOME ? `?redirect=${encodeURIComponent(to.fullPath)}` : ''
      next(`${ROUTE_PATHS.LOGIN}${redirectPath}`)
    }
  } catch (error) {
    console.error('路由权限检查异常:', error)
    loadingBar.error()
    next('/404')
  } finally {
    // 延迟关闭进度条以提升用户体验
    setTimeout(() => {
      loadingBar.finish()
    }, 100)
  }
})
