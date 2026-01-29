/**
 * Loading 状态管理 Store
 * 使用 Setup Store 模式
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoadingKey, LoadingState, LoadingOptions } from '../types/loading'

export const useLoadingStore = defineStore('loading', () => {
  // ========== State ==========
  /**
   * Loading 状态集合
   * 存储所有正在加载中的 key
   */
  const loadingSet = ref<LoadingState>(new Set<LoadingKey>())

  /**
   * 全局 Loading 状态
   */
  const globalLoading = ref<boolean>(false)

  /**
   * 加载提示文本
   */
  const loadingText = ref<string>('加载中...')

  // ========== Getters ==========
  /**
   * 是否有任何 loading 在进行中
   */
  const isLoading = computed(() => loadingSet.value.size > 0)

  /**
   * Loading 数量
   */
  const loadingCount = computed(() => loadingSet.value.size)

  /**
   * 全局加载状态（包括是否有全局 loading 或有任何 loading 在进行）
   */
  const isGlobalLoading = computed(() => globalLoading.value || loadingSet.value.size > 0)

  // ========== Actions ==========
  /**
   * 开始 loading
   * @param options Loading 配置选项
   */
  function start(options: LoadingOptions | LoadingKey) {
    const key = typeof options === 'string' ? options : options.key
    const config: Partial<LoadingOptions> = typeof options === 'string' ? {} : options

    // 添加到 loading 集合
    loadingSet.value.add(key)

    // 如果是全局 loading，设置全局状态
    if (config.global) {
      globalLoading.value = true
      if (config.text) {
        loadingText.value = config.text
      }
    }
  }

  /**
   * 结束 loading
   * @param key Loading 标识
   */
  function stop(key?: LoadingKey) {
    if (key) {
      // 移除指定的 loading
      loadingSet.value.delete(key)

      // 如果没有全局 loading 了，重置全局状态
      if (globalLoading.value && !Array.from(loadingSet.value).some((k) => k.startsWith('global:'))) {
        globalLoading.value = false
        loadingText.value = '加载中...'
      }
    } else {
      // 清空所有 loading
      loadingSet.value.clear()
      globalLoading.value = false
      loadingText.value = '加载中...'
    }
  }

  /**
   * 清空所有 loading
   */
  function clear() {
    loadingSet.value.clear()
    globalLoading.value = false
    loadingText.value = '加载中...'
  }

  /**
   * 检查指定的 key 是否在 loading 中
   * @param key Loading 标识
   */
  function check(key: LoadingKey): boolean {
    return loadingSet.value.has(key)
  }

  /**
   * 异步操作包装函数
   * 自动管理 loading 状态
   * @param key Loading 标识
   * @param promise 异步操作
   * @param options Loading 配置
   */
  async function wrap<T>(key: LoadingKey, promise: Promise<T>, options?: Omit<LoadingOptions, 'key'>): Promise<T> {
    try {
      start({ ...options, key })
      return await promise
    } finally {
      stop(key)
    }
  }

  return {
    // State
    loadingSet,
    globalLoading,
    loadingText,
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
