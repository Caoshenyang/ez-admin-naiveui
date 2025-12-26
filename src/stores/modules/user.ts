// userInfoStore.ts
import { defineStore } from 'pinia'

import router from '../../router'
import type { LoginDTO, UserInfoVO, WorkTab } from '@/types'
import { loginApi } from '@/api/login'
import { routeManager } from '@/utils/routeManager'

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    isLogin: false, // 登录状态
    userInfo: {} as UserInfoVO, // 用户信息
    workTabList: [] as WorkTab[], // 工作标签页列表
  }),
  persist: {
    key: 'userInfoStore',
    storage: localStorage,
  },
  getters: {
    // 判断用户信息是否存在
    hasUserInfo: (state) => Object.keys(state.userInfo).length > 0,

    // 获取原始菜单数据
    menuList: (state) => state.userInfo.menus || [],
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
        routeManager.clearRoutes()
        // 登出后跳转到登录页面
        router.push('/login')
      }
    },

    /**
     * 添加工作标签页
     * @param tab - 标签页信息
     */
    addWorkTab(tab: WorkTab) {
      // 检查是否已存在相同的标签页
      const existingTab = this.workTabList.find((t: WorkTab) => t.path === tab.path)
      if (!existingTab) {
        this.workTabList.push(tab)
      }
    },

    /**
     * 移除工作标签页
     * @param path - 标签页路径
     */
    removeWorkTab(path: string) {
      // 不允许删除固定的标签页
      this.workTabList = this.workTabList.filter(
        (tab: WorkTab) => !(tab.path === path && !tab.fixed),
      )
    },

    /**
     * 清空工作标签页（保留固定的）
     */
    clearWorkTabs() {
      this.workTabList = this.workTabList.filter((tab) => tab.fixed)
    },

    /**
     * 设置工作标签页列表
     * @param tabs - 标签页列表
     */
    setWorkTabs(tabs: WorkTab[]) {
      this.workTabList = tabs
    },
  },
})
