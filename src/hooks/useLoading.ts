/**
 * Loading 状态管理组合式函数
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useLoadingStore } from '@/stores/modules/loading'
import type { LoadingKey, LoadingOptions } from '@/stores/types/loading'

/**
 * Loading 状态管理 Hook
 * @param prefix Loading key 前缀，用于区分不同的模块
 *
 * @example
 * // 基础使用
 * const { isLoading, startLoading, stopLoading } = useLoading()
 *
 * @example
 * // 带前缀使用
 * const { isLoading, startLoading } = useLoading('user')
 * startLoading('fetch') // key 为 'user:fetch'
 *
 * @example
 * // 异步包装
 * const { wrapLoading } = useLoading('api')
 * const data = await wrapLoading('getUser', getUserInfo())
 */
export function useLoading(prefix?: string) {
  const loadingStore = useLoadingStore()
  const { isLoading, loadingCount, isGlobalLoading, loadingText } = storeToRefs(loadingStore)

  /**
   * 生成完整的 loading key
   */
  const getKey = (key: LoadingKey): LoadingKey => {
    return prefix ? `${prefix}:${key}` : key
  }

  /**
   * 开始 loading
   */
  const startLoading = (key: LoadingKey = 'default', options?: Omit<LoadingOptions, 'key'>) => {
    loadingStore.start({
      key: getKey(key),
      ...options
    })
  }

  /**
   * 结束 loading
   */
  const stopLoading = (key: LoadingKey = 'default') => {
    loadingStore.stop(getKey(key))
  }

  /**
   * 清空指定前缀的所有 loading
   */
  const clearLoading = () => {
    if (prefix) {
      const { loadingSet } = storeToRefs(loadingStore)
      const keysToDelete = Array.from(loadingSet.value).filter(key => key.startsWith(`${prefix}:`))
      keysToDelete.forEach(key => loadingStore.stop(key))
    } else {
      loadingStore.clear()
    }
  }

  /**
   * 检查指定 key 是否在 loading 中
   */
  const checkLoading = (key: LoadingKey): boolean => {
    return loadingStore.check(getKey(key))
  }

  /**
   * 异步操作包装
   */
  const wrapLoading = async <T>(
    key: LoadingKey = 'default',
    promise: Promise<T>,
    options?: Omit<LoadingOptions, 'key'>
  ): Promise<T> => {
    return loadingStore.wrap(getKey(key), promise, options)
  }

  /**
   * 检查当前前缀下是否有任何 loading 在进行中
   */
  const isPrefixLoading = computed(() => {
    if (!prefix) return isLoading.value
    const { loadingSet } = storeToRefs(loadingStore)
    return Array.from(loadingSet.value).some(key => key.startsWith(`${prefix}:`))
  })

  return {
    // State
    isLoading,
    isGlobalLoading,
    isPrefixLoading,
    loadingCount,
    loadingText,
    // Actions
    startLoading,
    stopLoading,
    clearLoading,
    checkLoading,
    wrapLoading
  }
}
