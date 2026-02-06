/**
 * 用户 Store
 * 使用 Setup Store 模式
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CurrentUserVO, LoginReq, LoginVO } from '../types/user'
import { authApi } from '@/api'
import { resetRouter } from '@/router'
import { resetPermissionGuard } from '@/router/permission'
import { useMenuStore } from './menu'
import { useLayoutStore } from './layout'

export const useUserStore = defineStore( 'user', () => {

    // ========== State ==========
    const token = ref<string>('')
    const userInfo = ref<CurrentUserVO | null>(null)

    // ========== Getters ==========
    const isLoggedIn = computed(() => !!token.value) // 是否已登录
    const username = computed(() => userInfo.value?.username ?? '') // 获取用户名
    const nickname = computed(() => userInfo.value?.nickname ?? '') // 获取昵称
    const avatar = computed(() => userInfo.value?.avatar ?? '') // 获取头像
    const roles = computed(() => userInfo.value?.roleLabels ?? []) // 获取角色列表
    const permissions = computed(() => userInfo.value?.permissions ?? []) // 获取权限列表

    // ========== Methods ==========
    const hasRole = (role: string) => roles.value.includes(role) // 检查是否有指定角色
    const hasPermission = (permission: string) => permissions.value.includes(permission) // 检查是否有指定权限
    const hasAnyRole = (roleList: string[]) => roleList.some((role) => roles.value.includes(role)) // 检查是否有任意一个角色
    const hasAnyPermission = (permissionList: string[]) =>
      permissionList.some((permission) => permissions.value.includes(permission)) // 检查是否有任意一个权限

    // ========== Actions ==========
    async function login(params: LoginReq) {
      const res: LoginVO = await authApi.login(params)
      token.value = res.token // 保存 token
    }

    // 用户登出
    async function logout() {
      try {
        await authApi.logout() // 调用登出接口
      } finally {
        // 清除菜单
        const menuStore = useMenuStore()
        menuStore.clearMenus()

        // 清除所有标签页数据并重置布局配置（包括内存和 localStorage）
        const layoutStore = useLayoutStore()
        layoutStore.clearAllTabs()
        layoutStore.resetLayoutConfig() // 重置布局配置为默认值

        resetRouter() // 重置路由
        resetPermissionGuard() // 重置路由守卫状态
        resetUserState() // 清除本地状态
      }
    }

    // 获取用户信息
    async function getUserInfo() {
      const res = await authApi.getUserInfo()
      userInfo.value = res
      return res
    }

    // 重置用户状态
    function resetUserState() {
      token.value = ''
      userInfo.value = null
    }

    return {
      // State
      token,
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
      pick: ['token', 'userInfo'] // 持久化所有用户相关信息
    }
  }
)
