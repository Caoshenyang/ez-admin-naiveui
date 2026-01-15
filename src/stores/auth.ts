import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types/api'
import type { LoginParams } from '@/types/api'
import { login as loginApi, logout as logoutApi, getUserInfo } from '@/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const userInfo = ref<UserInfo | null>(null)
  const permissions = ref<string[]>([])

  // Getters
  const isLoggedIn = computed(() => !!userInfo.value)
  const isAdmin = computed(() => permissions.value.includes('sys:admin'))

  // Actions
  /**
   * 用户登录
   */
  async function login(params: LoginParams) {
    try {
      await loginApi(params)

      // 登录成功后获取用户信息
      await getInfo()
    } catch (error) {
      throw error
    }
  }

  /**
   * 获取用户信息
   */
  async function getInfo() {
    try {
      const data = await getUserInfo()
      userInfo.value = data
      permissions.value = data.permissions || []

      return data
    } catch (error) {
      // 获取用户信息失败，清除状态
      resetState()
      throw error
    }
  }

  /**
   * 用户登出
   */
  async function logout() {
    try {
      await logoutApi()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      resetState()
      router.push('/login')
    }
  }

  /**
   * 重置状态
   */
  function resetState() {
    userInfo.value = null
    permissions.value = []
  }

  return {
    // State
    userInfo,
    permissions,
    // Getters
    isLoggedIn,
    isAdmin,
    // Actions
    login,
    getInfo,
    logout,
    resetState
  }
})

// 配置持久化
if (import.meta.env.VITE_USE_PERSIST === 'true') {
  // 注意：实际使用时需要安装 pinia-plugin-persistedstate 并在 main.ts 中配置
  // 这里只是示例
}
