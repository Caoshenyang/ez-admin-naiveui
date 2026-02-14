/**
 * 响应式本地存储 Composable
 *
 * 使用 watch 监听数据变化，自动同步到 localStorage/sessionStorage
 */
import { ref, watch, type Ref } from 'vue'
import { localStorage, sessionStorage } from '@/utils/storageUtils'

export type StorageType = 'localStorage' | 'sessionStorage'

/**
 * 创建响应式本地存储（localStorage）
 * @param key 存储键名
 * @param defaultValue 默认值
 * @returns 响应式数据
 * @example
 * ```typescript
 * const token = useLocalStorage('token', '')
 * token.value = 'new-token' // 自动保存到 localStorage
 * ```
 */
export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const value = ref<T>(localStorage.get<T>(key) ?? defaultValue)

  watch(
    value,
    (newValue) => {
      localStorage.set(key, newValue)
    },
    { deep: true }
  )

  return value as Ref<T>
}

/**
 * 创建响应式本地存储（sessionStorage）
 * @param key 存储键名
 * @param defaultValue 默认值
 * @returns 响应式数据
 * @example
 * ```typescript
 * const tempData = useSessionStorage('temp-data', {})
 * tempData.value = { foo: 'bar' } // 自动保存到 sessionStorage
 * ```
 */
export function useSessionStorage<T>(key: string, defaultValue: T): Ref<T> {
  const value = ref<T>(sessionStorage.get<T>(key) ?? defaultValue)

  watch(
    value,
    (newValue) => {
      sessionStorage.set(key, newValue)
    },
    { deep: true }
  )

  return value as Ref<T>
}

/**
 * 通用响应式存储（支持选择 localStorage 或 sessionStorage）
 * @param type 存储类型
 * @param key 存储键名
 * @param defaultValue 默认值
 * @returns 响应式数据
 * @example
 * ```typescript
 * const theme = useStorage('localStorage', 'theme', 'light')
 * ```
 */
export function useStorage<T>(type: 'localStorage', key: string, defaultValue: T): Ref<T>
export function useStorage<T>(type: 'sessionStorage', key: string, defaultValue: T): Ref<T>
export function useStorage<T>(type: StorageType, key: string, defaultValue: T): Ref<T> {
  return type === 'localStorage' ? useLocalStorage<T>(key, defaultValue) : useSessionStorage<T>(key, defaultValue)
}
