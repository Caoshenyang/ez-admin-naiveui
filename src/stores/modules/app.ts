/**
 * 应用配置 Store
 * 使用 Setup Store 模式
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DeviceType } from '../types/app'

export const useAppStore = defineStore('app', () => {
  // ========== State ==========
  const sidebarOpened = ref<boolean>(true)
  const device = ref<DeviceType>('desktop')

  // ========== Actions ==========
  /**
   * 切换侧边栏打开状态
   */
  function toggleSidebar() {
    sidebarOpened.value = !sidebarOpened.value
  }

  /**
   * 设置侧边栏打开状态
   * @param opened 打开状态
   */
  function setSidebarOpened(opened: boolean) {
    sidebarOpened.value = opened
  }

  /**
   * 设置设备类型
   * @param deviceValue 设备类型
   */
  function setDevice(deviceValue: DeviceType) {
    device.value = deviceValue
  }

  /**
   * 关闭侧边栏（移动端使用）
   */
  function closeSidebar() {
    sidebarOpened.value = false
  }

  /**
   * 打开侧边栏
   */
  function openSidebar() {
    sidebarOpened.value = true
  }

  return {
    // State
    sidebarOpened,
    device,
    // Actions
    toggleSidebar,
    setSidebarOpened,
    setDevice,
    closeSidebar,
    openSidebar
  }
}, {
  // ========== 持久化配置 ==========
  persist: {
    key: 'app-store',
    storage: localStorage,
    pick: ['sidebarOpened'] // 只持久化侧边栏状态
  }
})
