/**
 * 防抖函数 Composable
 *
 * 延迟执行函数，如果在延迟时间内再次调用则重置计时器
 * 适用于：搜索框输入、窗口 resize 等场景
 */
import { ref, onUnmounted } from 'vue'

export type AnyFunction = (...args: any[]) => any

/**
 * 创建防抖函数
 * @param fn 要防抖的函数
 * @param ms 延迟时间（毫秒），默认 500ms
 * @returns 防抖后的函数
 * @example
 * ```typescript
 * const debouncedSearch = useDebounceFn((keyword: string) => {
 *   console.log('搜索:', keyword)
 * }, 300)
 *
 * // 连续调用只会执行最后一次
 * debouncedSearch('a')
 * debouncedSearch('ab')
 * debouncedSearch('abc') // 300ms 后执行
 * ```
 */
export function useDebounceFn<T extends AnyFunction>(fn: T, ms = 500): T {
  const timeoutId = ref<number>()

  const debouncedFn = ((...args: Parameters<T>) => {
    clearTimeout(timeoutId.value)
    timeoutId.value = window.setTimeout(() => {
      fn(...args)
    }, ms)
  }) as T

  // 组件卸载时清理定时器
  onUnmounted(() => {
    clearTimeout(timeoutId.value)
  })

  return debouncedFn
}
