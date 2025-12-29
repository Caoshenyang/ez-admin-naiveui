import router, { STATIC_ROUTE_NAMES } from '@/router'
import { generateUserRoutes } from '@/utils/routes'
import { logger } from '@/utils/logger'

/**
 * 动态路由管理器
 */
export class RouteManager {
  private static instance: RouteManager
  private isRoutesLoaded = false
  private isLoading = false

  private constructor() {}

  static getInstance(): RouteManager {
    if (!RouteManager.instance) {
      RouteManager.instance = new RouteManager()
    }
    return RouteManager.instance
  }

  /**
   * 执行路由加载的核心逻辑
   */
  private async doLoadRoutes() {
    try {
      // 获取用户路由（总是成功，不会抛出异常）
      const { routes: userRoutes, success } = await generateUserRoutes()
      if (success) {
        logger.log('✅ 动态路由组装完成', userRoutes)
      } else {
        logger.warn('⚠️ 动态路由加载失败，使用默认路由', userRoutes)
      }
      // 通过路由名称找到布局路由并插入子节点
      const layoutRoute = router.getRoutes().find((r) => r.name === 'Main')
      if (layoutRoute) {
        userRoutes.forEach((route) => {
          router.addRoute('Main', route)
        })
        logger.log('✅ 路由添加成功', router.getRoutes())
      } else {
        logger.error('❌ 添加路由失败:', '未找到 Main 布局路由，无法插入子路由')
      }
      this.isRoutesLoaded = true
    } catch (error) {
      logger.error('❌ 路由加载过程中发生意外错误:', error)
      // 即使发生意外错误，也要确保路由状态为已加载，避免死循环
      this.isRoutesLoaded = true
    }
  }

  /**
   * 加载动态路由（从后端获取菜单数据）
   */
  async loadRoutes() {
    if (this.isRoutesLoaded || this.isLoading) {
      logger.log('路由已加载或正在加载中，跳过')
      return
    }

    this.isLoading = true
    logger.log('开始加载动态路由...')

    // 创建超时Promise (10秒超时)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('路由加载超时，请检查网络连接或联系管理员'))
      }, 10000)
    })

    try {
      // 使用Promise.race实现超时控制
      await Promise.race([this.doLoadRoutes(), timeoutPromise])
    } catch (timeoutError) {
      logger.error('❌ 路由加载超时:', timeoutError)
      // 超时后强制设置加载状态，避免死循环
      this.isRoutesLoaded = true
      throw timeoutError // 重新抛出错误，让调用方处理
    } finally {
      this.isLoading = false
    }
  }

  /**
   * 清除动态路由
   */
  clearRoutes() {
    // 获取所有路由
    const allRoutes = router.getRoutes()

    // 移除所有非静态路由
    allRoutes.forEach((route) => {
      if (
        route.name &&
        !STATIC_ROUTE_NAMES.includes(route.name as (typeof STATIC_ROUTE_NAMES)[number])
      ) {
        router.removeRoute(route.name)
      }
    })

    this.isRoutesLoaded = false
  }

  /**
   * 重置路由（用于重新加载）
   */
  resetRoutes() {
    this.clearRoutes()
  }

  /**
   * 检查路由是否已加载
   */
  isLoaded(): boolean {
    return this.isRoutesLoaded
  }

  /**
   * 强制设置路由为已加载状态（仅在异常情况下使用）
   */
  forceSetLoaded(): void {
    this.isRoutesLoaded = true
    logger.log('🔧 已强制设置路由状态为已加载')
  }
}

export const routeManager = RouteManager.getInstance()
