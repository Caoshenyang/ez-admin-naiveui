import { ref } from 'vue'
import { defineStore } from 'pinia'

export enum MenuWidthEnum {
  CLOSE = 64,
  OPEN = 240,
}

export const useSystemStore = defineStore('system', () => {
  const isCollapse = ref(false)

  function toggleCollapse() {
    isCollapse.value = !isCollapse.value
  }

  function setCollapse(value: boolean) {
    isCollapse.value = value
  }

  return {
    isCollapse,
    toggleCollapse,
    setCollapse,
  }
})
