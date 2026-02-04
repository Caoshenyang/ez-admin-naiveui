/**
 * 路由守卫
 * 用于控制页面访问权限和动态路由加载
 */
import router from './index'
import { useUserStore } from '@/stores/modules/user'
import { useMenuStore } from '@/stores/modules/menu'
import { loadingBar, message } from '@/hooks/useNaiveApi'
import { convertMenusToRoutes, convertMenusToMenuOptions } from '@/utils/route'

// 白名单路由（不需要登录即可访问）
const whiteList = ['/login']

// 是否已获取过用户信息和菜单
let hasGetInfo = false

// 设置已获取用户信息标志
export function setHasGetInfo(value: boolean) {
  hasGetInfo = value
}

// 重新导出路由转换函数
export { convertMenusToRoutes } from '@/utils/route'

router.beforeEach(async (to, _from, next) => {
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

    // 已加载用户信息和菜单，直接放行
    if (hasGetInfo) {
      next()
      return
    }

    // 首次加载：获取用户信息并初始化动态菜单
    try {
      // 1. 尝试从缓存加载菜单
      const cachedMenus = menuStore.loadMenusFromCache()

      if (cachedMenus) {
        // 使用缓存菜单
        menuStore.setDynamicMenus(cachedMenus, false)
        console.log('✅ 使用缓存菜单')
      } else {
        // 2. 从服务器加载用户信息（包含菜单数据）
        await userStore.getUserInfo()
        const backendMenus = userStore.userInfo?.menus || []
        console.log('🔍 后端返回的菜单数据:', backendMenus)

        // 3. 检查用户是否有菜单权限
        if (backendMenus.length === 0) {
          message.warning('当前账号无菜单权限，请联系管理员')
          await userStore.logout()
          next('/login')
          return
        }

        // 4. 将后端菜单转换为前端菜单配置
        const frontendMenus = convertMenusToMenuOptions(backendMenus)
        console.log('🔍 转换后的前端菜单:', frontendMenus)
        menuStore.setDynamicMenus(frontendMenus, true)

        // 5. 将后端菜单转换为路由配置并注册到 Layout 下
        const dynamicRoutes = convertMenusToRoutes(backendMenus)
        dynamicRoutes.forEach((route) => {
          router.addRoute('Layout', route)
        })
        console.log('✅ 动态路由已注册:', dynamicRoutes.length)
      }

      // 6. 标记已加载（确保路由已注册）
      hasGetInfo = true

      // 7. 重新导航到目标页面（因为 addRoute 是异步的）
      next({ ...to, replace: true })
    } catch (error) {
      console.error('❌ 加载用户信息失败:', error)
      userStore.resetUserState()
      menuStore.clearMenus()
      message.error('加载用户信息失败，请重新登录')
      next(`/login?redirect=${to.path}`)
    }
  } else {
    // 未登录：白名单放行，其他跳转登录
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
