/**
 * Loading 状态管理 Store
 * 使用 Setup Store 模式
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoadingKey, LoadingState, LoadingOptions } from '../types/loading'

export const useLoadingStore = defineStore('loading', () => {
  // ========== State ==========
  const loadingSet = ref<LoadingState>(new Set<LoadingKey>()) // Loading 状态集合，存储所有正在加载中的 key
  const globalLoading = ref<boolean>(false) // 全局 Loading 状态
  const loadingText = ref<string>('加载中...') // 加载提示文本
  const loadingError = ref<boolean>(false) // Loading 错误状态

  // ========== Getters ==========
  const isLoading = computed(() => loadingSet.value.size > 0) // 是否有任何 loading 在进行中
  const loadingCount = computed(() => loadingSet.value.size) // Loading 数量
  const isGlobalLoading = computed(() => globalLoading.value || loadingSet.value.size > 0) // 全局加载状态（包括是否有全局 loading 或有任何 loading 在进行）

  // ========== Actions ==========
  // 开始 loading
  function start(options: LoadingOptions | LoadingKey) {
    const key = typeof options === 'string' ? options : options.key
    const config: Partial<LoadingOptions> = typeof options === 'string' ? {} : options

    // 添加到 loading 集合
    loadingSet.value.add(key)

    // 如果是全局 loading，设置全局状态
    if (config.global) {
      globalLoading.value = true
      loadingError.value = false // 重置错误状态
      if (config.text) {
        loadingText.value = config.text
      }
      if (config.error) {
        loadingError.value = true
      }
    }
  }

  // 结束 loading
  function stop(key?: LoadingKey, isError?: boolean) {
    if (key) {
      // 移除指定的 loading
      loadingSet.value.delete(key)

      // 如果当前停止的 loading 设置了全局状态，且没有其他全局 loading，重置全局状态
      // 只要 loadingSet 为空或没有显式设置 global 的 loading，就重置
      if (globalLoading.value && loadingSet.value.size === 0) {
        globalLoading.value = false
        loadingText.value = '加载中...'
        loadingError.value = isError || false
      }
    } else {
      // 清空所有 loading
      loadingSet.value.clear()
      globalLoading.value = false
      loadingText.value = '加载中...'
      loadingError.value = false
    }
  }

  // 清空所有 loading
  function clear() {
    loadingSet.value.clear()
    globalLoading.value = false
    loadingText.value = '加载中...'
    loadingError.value = false
  }

  // 检查指定的 key 是否在 loading 中
  function check(key: LoadingKey): boolean {
    return loadingSet.value.has(key)
  }

  // 异步操作包装函数，自动管理 loading 状态
  async function wrap<T>(key: LoadingKey, promise: Promise<T>, options?: Omit<LoadingOptions, 'key'>): Promise<T> {
    try {
      start({ ...options, key })
      return await promise
    } catch (error) {
      // 发生错误时标记错误状态
      if (options?.global) {
        loadingError.value = true
      }
      throw error
    } finally {
      // 根据是否有错误决定是否传递错误状态
      const hasError = loadingError.value
      stop(key, hasError)
    }
  }

  return {
    // State
    loadingSet,
    globalLoading,
    loadingText,
    loadingError,
    // Getters
    isLoading,
    loadingCount,
    isGlobalLoading,
    // Actions
    start,
    stop,
    clear,
    check,
    wrap
  }
})
