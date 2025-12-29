/**
 * 日志工具类
 * 统一管理日志输出，生产环境自动禁用控制台输出
 */

const isDevelopment = import.meta.env.MODE === 'development'

/**
 * 日志工具
 */
export const logger = {
  /**
   * 普通日志（开发环境可见）
   */
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },

  /**
   * 信息日志（开发环境可见）
   */
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },

  /**
   * 警告日志（开发环境可见）
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },

  /**
   * 错误日志（开发环境可见）
   * 注意：生产环境的错误也可以选择保留，便于监控
   */
  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error(...args)
    }
    // 生产环境可以在这里集成错误上报服务
    // 例如：Sentry, LogRocket 等
  },

  /**
   * 调试日志（开发环境可见）
   */
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args)
    }
  },
}

export default logger

