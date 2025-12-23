import { darkTheme } from 'naive-ui'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 菜单宽度枚举
export const MenuWidthEnum = {
  OPEN: 240,
  CLOSE: 64,
} as const

export const useSystemStore = defineStore('system', () => {
  // 菜单折叠状态
  const isCollapse = ref(false)
  // 黑夜模式状态
  const isNight = ref(false)

  // 切换菜单折叠状态
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }

  // 设置菜单折叠状态
  const setCollapse = (value: boolean) => {
    isCollapse.value = value
  }

  // 切换菜单折叠状态（兼容旧方法名）
  const switchFolding = () => {
    toggleCollapse()
  }

  // 切换黑夜模式
  const switchNight = () => {
    isNight.value = !isNight.value
  }

  const getTheme = computed(() => (isNight.value ? darkTheme : null))

  const getLogo = computed(() => new URL('@/assets/logo.svg', import.meta.url).href)

  return {
    isCollapse,
    isNight,
    toggleCollapse,
    setCollapse,
    switchFolding,
    switchNight,
    getTheme,
    getLogo
  }
})
