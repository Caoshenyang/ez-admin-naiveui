/**
 * 自定义指令统一导出
 */
import type { App } from 'vue'
import { auth, copy, debounce, throttle, longpress } from './auth'

export default function installDirectives(app: App) {
  // 权限指令
  app.directive('auth', auth)

  // 复制指令
  app.directive('copy', copy)

  // 防抖指令
  app.directive('debounce', debounce)

  // 节流指令
  app.directive('throttle', throttle)

  // 长按指令
  app.directive('longpress', longpress)
}
