/**
 * 用户 Store
 * 使用 Setup Store 模式
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, LoginParams } from '../types/user'

export const useUserStore = defineStore(
  'user',
  () => {
    // ========== State ==========
    const token = ref<string>('')
    const refreshToken = ref<string>('')
    const userInfo = ref<UserInfo | null>(null)

    // ========== Getters ==========
    /**
     * 是否已登录
     */
    const isLoggedIn = computed(() => !!token.value)

    /**
     * 获取用户名
     */
    const username = computed(() => userInfo.value?.username ?? '')

    /**
     * 获取昵称
     */
    const nickname = computed(() => userInfo.value?.nickname ?? '')

    /**
     * 获取头像
     */
    const avatar = computed(() => userInfo.value?.avatar ?? '')

    /**
     * 获取角色列表
     */
    const roles = computed(() => userInfo.value?.roles ?? [])

    /**
     * 获取权限列表
     */
    const permissions = computed(() => userInfo.value?.permissions ?? [])

    /**
     * 检查是否有指定角色
     * @param role 角色
     */
    const hasRole = (role: string) => {
      return roles.value.includes(role)
    }

    /**
     * 检查是否有指定权限
     * @param permission 权限
     */
    const hasPermission = (permission: string) => {
      return permissions.value.includes(permission)
    }

    /**
     * 检查是否有任意一个角色
     * @param roleList 角色列表
     */
    const hasAnyRole = (roleList: string[]) => {
      return roleList.some((role) => roles.value.includes(role))
    }

    /**
     * 检查是否有任意一个权限
     * @param permissionList 权限列表
     */
    const hasAnyPermission = (permissionList: string[]) => {
      return permissionList.some((permission) => permissions.value.includes(permission))
    }

    // ========== Actions ==========
    /**
     * 设置 Token
     * @param tokenValue Token
     */
    function setToken(tokenValue: string) {
      token.value = tokenValue
    }

    /**
     * 设置刷新 Token
     * @param tokenValue 刷新 Token
     */
    function setRefreshToken(tokenValue: string) {
      refreshToken.value = tokenValue
    }

    /**
     * 设置用户信息
     * @param info 用户信息
     */
    function setUserInfo(info: UserInfo) {
      userInfo.value = info
    }

    /**
     * 登录
     * @param params 登录参数
     */
    async function login(params: LoginParams) {
      console.log('login params', params)
      // TODO: 实现登录逻辑
      // const res = await apiLogin(params)
      // token.value = res.token
      // refreshToken.value = res.refreshToken
      // userInfo.value = res.userInfo
    }

    /**
     * 登出
     */
    async function logout() {
      // TODO: 实现登出逻辑
      // await apiLogout()
      token.value = ''
      refreshToken.value = ''
      userInfo.value = null
    }

    /**
     * 获取用户信息
     */
    async function getUserInfo() {
      // TODO: 实现获取用户信息逻辑
      // const res = await apiGetUserInfo()
      // userInfo.value = res
    }

    /**
     * 重置用户状态
     */
    function resetUserState() {
      token.value = ''
      refreshToken.value = ''
      userInfo.value = null
    }

    return {
      // State
      token,
      refreshToken,
      userInfo,
      // Getters
      isLoggedIn,
      username,
      nickname,
      avatar,
      roles,
      permissions,
      hasRole,
      hasPermission,
      hasAnyRole,
      hasAnyPermission,
      // Actions
      setToken,
      setRefreshToken,
      setUserInfo,
      login,
      logout,
      getUserInfo,
      resetUserState
    }
  },
  {
    // ========== 持久化配置 ==========
    persist: {
      key: 'user-store',
      storage: localStorage,
      pick: ['token', 'refreshToken', 'userInfo'] // 持久化所有用户相关信息
    }
  }
)
