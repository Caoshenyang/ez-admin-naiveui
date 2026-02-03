/**
 * 路由守卫
 * 用于控制页面访问权限和动态路由加载
 */
import router from './index'
import { useUserStore } from '@/stores/modules/user'
import { loadingBar } from '@/hooks/useNaiveApi'
import type { RouteRecordRaw } from 'vue-router'
import type { MenuTreeVO } from '@/stores/types/user'

/**
 * 白名单路由（不需要登录即可访问）
 */
const whiteList = ['/login', '/loading']

/**
 * 是否已获取过用户信息和菜单
 */
let hasGetInfo = false

/**
 * 将后端菜单数据转换为路由配置
 * @param menus 后端菜单树数据
 * @returns 路由配置
 */
function convertMenusToRoutes(menus: MenuTreeVO[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []

  menus.forEach((menu) => {
    // 递归处理子菜单
    if (menu.children?.length) {
      const childRoutes = convertMenusToRoutes(menu.children)
      routes.push(...childRoutes)
    }

    // 只处理有 componentPath 和 routePath 的菜单
    if (!menu.componentPath || !menu.routePath) {
      return
    }

    // 去掉路径开头的 /
    const path = menu.routePath.startsWith('/') ? menu.routePath.slice(1) : menu.routePath

    const route: RouteRecordRaw = {
      path,
      name: menu.routeName || menu.menuId,
      component: loadViewComponent(menu.componentPath),
      meta: {
        title: menu.menuName,
        icon: menu.menuIcon,
        hidden: !menu.visible,
        keepAlive: false,
        affix: false,
        order: menu.menuSort
      }
    }

    routes.push(route)
  })

  return routes
}

/**
 * 动态加载视图组件
 * @param componentPath 组件路径（相对于 views 目录）
 * @returns 组件
 */
function loadViewComponent(componentPath: string | undefined) {
  if (!componentPath) {
    return () => import('@/views/error/NotFoundPage.vue')
  }

  // 使用 Vite 的 import.meta.glob 动态导入组件
  const modules = import.meta.glob('../views/**/*.vue')

  // 标准化组件路径：去除首尾空格，确保以 .vue 结尾
  let normalizedPath = componentPath.trim()
  if (!normalizedPath.endsWith('.vue')) {
    normalizedPath += '.vue'
  }

  // 移除开头的斜杠或 views/
  normalizedPath = normalizedPath.replace(/^(\/+)?(views\/+)?/, '')

  const key = `../views/${normalizedPath}`

  if (modules[key]) {
    return modules[key]
  }

  console.warn(`组件不存在: ${key}`)
  return () => import('@/views/error/NotFoundPage.vue')
}

router.beforeEach(async (to, from, next) => {
  // 开始加载进度条
  loadingBar.start()

  const userStore = useUserStore()
  const hasToken = userStore.isLoggedIn

  if (hasToken) {
    // 已登录
    if (to.path === '/login') {
      // 如果已登录，访问登录页时重定向到首页
      next({ path: '/' })
      loadingBar.finish()
    } else {
      // 检查是否已获取用户信息
      if (!hasGetInfo) {
        // 如果第一次访问且不是加载页，先重定向到加载页避免路由警告
        if (to.path !== '/loading') {
          next({ path: '/loading', query: { redirect: to.fullPath } })
          loadingBar.finish()
          return
        }

        try {
          // 获取用户信息和菜单
          await userStore.getUserInfo()
          hasGetInfo = true

          // 根据菜单动态生成路由
          const menus = userStore.userInfo?.menus || []
          const dynamicRoutes = convertMenusToRoutes(menus)

          // 动态添加路由到 Layout 的 children 中
          dynamicRoutes.forEach((route) => {
            router.addRoute('Layout', route)
          })

          // 加载完成后，跳转到目标页面（默认首页）
          const redirect = (to.query.redirect as string) || '/'
          next({ path: redirect, replace: true })
        } catch (error) {
          // 获取用户信息失败，清除 token 并跳转到登录页
          console.error('获取用户信息失败:', error)
          userStore.resetUserState()
          hasGetInfo = false
          next(`/login?redirect=${to.path}`)
          loadingBar.error()
        }
      } else {
        next()
      }
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      // 在白名单中，直接放行
      next()
    } else {
      // 不在白名单中，重定向到登录页
      next(`/login?redirect=${to.path}`)
      loadingBar.error()
    }
  }
})

router.afterEach(() => {
  // 结束加载进度条
  loadingBar.finish()
})

/**
 * 重置路由守卫状态
 * 用于登出后清除动态路由
 */
export function resetPermissionGuard() {
  hasGetInfo = false
}
