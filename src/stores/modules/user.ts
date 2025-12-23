// userInfoStore.ts
import { defineStore } from 'pinia'

import router from '../../router'
import type { LoginDTO, UserInfoVO } from '@/types'
import { loginApi } from '@/api/login'


// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    isLogin: false, // 登录状态
    userInfo: {} as UserInfoVO, // 用户信息
  }),
  persist: {
    key: 'userInfoStore',
    storage: localStorage,
  },
  getters: {
    // 判断用户信息是否存在
    hasUserInfo: (state) => Object.keys(state.userInfo).length > 0,
    // 获取用户权限列表
    userPermissions: (state) => state.userInfo.permissions || [],
    // 获取用户角色列表
    userRoles: (state) => state.userInfo.roles || [],
    // 判断用户是否有某个权限
    hasPermission: (state) => (permissionKey: string) => {
      return state.userInfo.permissions?.some((p) => p.permissionKey === permissionKey) || false
    },
    // 判断用户是否有某个角色
    hasRole: (state) => (roleKey: string) => {
      return state.userInfo.roles?.some((r) => r.roleKey === roleKey) || false
    },
  },
  actions: {
    /**
     * 登录
     * @param loginFormData - 登录表单数据对象，包含用户名和密码等登录信息
     * @returns Promise<void> - 无返回值的异步操作
     */
    async login(loginFormData: LoginDTO) {
      // 基于Cookie/Session的登录，后端会设置session cookie
      await loginApi.login(loginFormData)
      this.isLogin = true
    },

    /**
     * 获取用户信息
    //  * @returns Promise<void> - 无返回值的异步操作
     */
    async getUserInfo() {
      const res = await loginApi.getUserInfo()
      // 这里的 res 已经是后端 data 字段中的用户信息
      this.userInfo = res
    },

    /**
     * 登出
     * @returns Promise<void> - 无返回值的异步操作
     */
    async logout() {
      try {
        await loginApi.logout()
      } catch (error) {
        console.error('登出失败:', error)
      } finally {
        this.isLogin = false
        this.userInfo = {} as UserInfoVO
        // 清除动态路由
        // routeManager.clearRoutes()
        // 登出后跳转到登录页面
        router.push('/login')
      }
    },
  },
})
