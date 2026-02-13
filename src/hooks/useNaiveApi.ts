/**
 * NaiveUI 离散式 API 封装
 *
 * 主题支持：
 * - 使用 createDiscreteApi 创建独立的消息、对话框等组件
 * - 复用 naiveui-theme.ts 的完整主题配置
 * - 支持亮色/暗色模式自动切换
 */
import { computed } from 'vue'
import { createDiscreteApi, darkTheme } from 'naive-ui'
import { createNaiveTheme } from '@/settings/naiveui-theme'

/**
 * 创建响应式的主题配置
 * 直接复用 naiveui-theme.ts 的配置
 */
const themeConfig = computed(() => {
  const isDark = document.documentElement.classList.contains('dark')
  return {
    theme: isDark ? darkTheme : null,
    themeOverrides: createNaiveTheme()
  }
})

/**
 * 创建离散式 API（带动态主题支持）
 */
const {
  message: naiveMessage,
  notification,
  dialog,
  loadingBar,
  modal
} = createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar', 'modal'], {
  configProviderProps: themeConfig
})

/**
 * 环境检测
 */
const isDevelopment = import.meta.env.MODE === 'development'

/**
 * 扩展的消息工具，集成日志功能
 */
export const message = {
  /**
   * 成功消息（开发环境自动打印日志)
   */
  success: (content: string, duration = 3000) => {
    if (isDevelopment) {
      console.log(`[MESSAGE SUCCESS] ${content}`)
    }
    return naiveMessage.success(content, { duration })
  },

  /**
   * 信息消息（开发环境自动打印日志)
   */
  info: (content: string, duration = 3000) => {
    if (isDevelopment) {
      console.info(`[MESSAGE INFO] ${content}`)
    }
    return naiveMessage.info(content, { duration })
  },

  /**
   * 警告消息（开发环境自动打印日志)
   */
  warning: (content: string, duration = 3000) => {
    if (isDevelopment) {
      console.warn(`[MESSAGE WARNING] ${content}`)
    }
    return naiveMessage.warning(content, { duration })
  },

  /**
   * 错误消息（开发环境自动打印日志)
   */
  error: (content: string, duration = 3000) => {
    if (isDevelopment) {
      console.error(`[MESSAGE ERROR] ${content}`)
    }
    return naiveMessage.error(content, { duration })
  },

  /**
   * 加载消息
   */
  loading: (content: string) => {
    return naiveMessage.loading(content)
  }
}

/**
 * 日志工具（与 message 集成)
 */
export const logger = {
  /**
   * 普通日志（开发环境可见)
   */
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log('[LOGGER]', ...args)
    }
  },

  /**
   * 信息日志（开发环境可见)
   */
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info('[LOGGER]', ...args)
    }
  },

  /**
   * 警告日志（开发环境可见）
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn('[LOGGER]', ...args)
    }
  },

  /**
   * 错误日志（开发环境可见）
   * 注意：生产环境的错误也可以选择保留，便于监控
   */
  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error('[LOGGER]', ...args)
    }
    // 生产环境可以在这里集成错误上报服务
    // 例如：Sentry, LogRocket 等
  },

  /**
   * 调试日志（开发环境可见）
   */
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug('[LOGGER]', ...args)
    }
  }
}

/**
 * 导出所有 NaiveUI 离散式 API
 */
export { notification, dialog, loadingBar, modal }

/**
 * 默认导出（便于批量导入)
 */
export default {
  message,
  notification,
  dialog,
  loadingBar,
  modal,
  logger
}
