/**
 * 本地存储工具
 * 封装 localStorage 和 sessionStorage，支持类型安全
 */

class Storage {
  private storage: globalThis.Storage

  constructor(storage: globalThis.Storage) {
    this.storage = storage
  }

  /**
   * 设置存储（支持泛型）
   * @param key 键名
   * @param value 值（支持任意类型）
   */
  set<T>(key: string, value: T): void {
    try {
      const data = JSON.stringify(value)
      this.storage.setItem(key, data)
    } catch (error) {
      console.error(`Storage.set error: ${key}`, error)
    }
  }

  /**
   * 获取存储（支持泛型）
   * @param key 键名
   * @param defaultValue 默认值（可选）
   * @returns 存储的值或默认值
   * @note 类型说明：由于 JSON.parse 返回 any，这里需要类型断言。
   *       调用者负责确保存储的数据类型与泛型参数 T 匹配。
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const data = this.storage.getItem(key)
      if (data === null) {
        return defaultValue ?? null
      }
      // JSON.parse 返回 any，需要断言为泛型类型 T
      // 调用者应确保存储的数据与 T 类型一致
      const parsed = JSON.parse(data)
      return parsed as T
    } catch (error) {
      console.error(`Storage.get error: ${key}`, error)
      return defaultValue ?? null
    }
  }

  /**
   * 移除存储
   * @param key 键名
   */
  remove(key: string): void {
    try {
      this.storage.removeItem(key)
    } catch (error) {
      console.error(`Storage.remove error: ${key}`, error)
    }
  }

  /**
   * 清空所有存储
   */
  clear(): void {
    try {
      this.storage.clear()
    } catch (error) {
      console.error('Storage.clear error', error)
    }
  }

  /**
   * 检查键是否存在
   * @param key 键名
   */
  has(key: string): boolean {
    return this.storage.getItem(key) !== null
  }
}

/** localStorage 实例 */
export const localStorage = new Storage(window.localStorage)

/** sessionStorage 实例 */
export const sessionStorage = new Storage(window.sessionStorage)
