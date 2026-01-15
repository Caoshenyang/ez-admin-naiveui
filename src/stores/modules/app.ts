import { computed } from 'vue'
import { defineStore } from 'pinia'
import { routes } from '@/router'

export const useAppStore = defineStore('app', () => {
  const menuRoutes = computed(() => {
    return routes[0].children || []
  })

  return {
    menuRoutes,
  }
})
