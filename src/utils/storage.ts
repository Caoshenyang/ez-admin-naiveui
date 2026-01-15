/**
 * 本地存储封装
 */
export const storage = {
  /**
   * 设置 localStorage
   */
  set(key: string, value: any): void {
    try {
      const data = JSON.stringify(value)
      localStorage.setItem(key, data)
    } catch (error) {
      console.error('localStorage set error:', error)
    }
  },

  /**
   * 获取 localStorage
   */
  get<T = any>(key: string): T | null {
    try {
      const data = localStorage.getItem(key)
      if (data) {
        return JSON.parse(data) as T
      }
      return null
    } catch (error) {
      console.error('localStorage get error:', error)
      return null
    }
  },

  /**
   * 删除 localStorage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('localStorage remove error:', error)
    }
  },

  /**
   * 清空 localStorage
   */
  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('localStorage clear error:', error)
    }
  },

  /**
   * 设置 sessionStorage
   */
  setSession(key: string, value: any): void {
    try {
      const data = JSON.stringify(value)
      sessionStorage.setItem(key, data)
    } catch (error) {
      console.error('sessionStorage set error:', error)
    }
  },

  /**
   * 获取 sessionStorage
   */
  getSession<T = any>(key: string): T | null {
    try {
      const data = sessionStorage.getItem(key)
      if (data) {
        return JSON.parse(data) as T
      }
      return null
    } catch (error) {
      console.error('sessionStorage get error:', error)
      return null
    }
  },

  /**
   * 删除 sessionStorage
   */
  removeSession(key: string): void {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error('sessionStorage remove error:', error)
    }
  },

  /**
   * 清空 sessionStorage
   */
  clearSession(): void {
    try {
      sessionStorage.clear()
    } catch (error) {
      console.error('sessionStorage clear error:', error)
    }
  }
}
