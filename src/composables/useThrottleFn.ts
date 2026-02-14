/**
 * 节流函数 Composable
 *
 * 限制函数执行频率，在指定时间内只执行一次
 * 适用于：滚动事件、鼠标移动等高频触发场景
 */
import { ref, onUnmounted } from 'vue'

export type AnyFunction = (...args: unknown[]) => unknown

/**
 * 创建节流函数
 * @param fn 要节流的函数
 * @param ms 节流间隔（毫秒），默认 500ms
 * @returns 节流后的函数
 * @example
 * ```typescript
 * const throttledScroll = useThrottleFn(() => {
 *   console.log('滚动位置:', window.scrollY)
 * }, 200)
 *
 * window.addEventListener('scroll', throttledScroll)
 * // 每 200ms 最多执行一次
 * ```
 */
export function useThrottleFn<T extends AnyFunction>(fn: T, ms = 500): T {
  const timeoutId = ref<number>()
  const lastRun = ref(Date.now())

  const throttledFn = ((...args: Parameters<T>) => {
    const now = Date.now()
    const remaining = ms - (now - lastRun.value)

    if (remaining <= 0) {
      // 可以立即执行
      clearTimeout(timeoutId.value)
      fn(...args)
      lastRun.value = now
    } else {
      // 需要延迟执行
      clearTimeout(timeoutId.value)
      timeoutId.value = window.setTimeout(() => {
        fn(...args)
        lastRun.value = Date.now()
      }, remaining)
    }
  }) as T

  // 组件卸载时清理定时器
  onUnmounted(() => {
    clearTimeout(timeoutId.value)
  })

  return throttledFn
}
