/**
 * 菜单 Store
 * 管理静态首页和动态业务菜单的合并逻辑
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FrontendMenuItem } from '@/types/menu'
import { localStorage } from '@/utils/storage'

const CACHE_KEY = 'dynamic-menus'
const CACHE_EXPIRE_KEY = 'dynamic-menus-expire'
const CACHE_DURATION = 1000 * 60 * 30 // 30 分钟

/**
 * 静态菜单配置（前端固定，如首页）
 */
const staticMenus: FrontendMenuItem[] = [
  {
    key: 'home',
    label: '首页',
    path: '/',
    order: 0, // 确保首页在最前面
  },
]

export const useMenuStore = defineStore('menu', () => {
  // ========== State ==========
  const dynamicMenus = ref<FrontendMenuItem[]>([]) // 动态菜单（从后端加载）
  const menuLoaded = ref(false) // 是否已加载菜单

  // ========== Getters ==========
  // 合并后的菜单列表（静态首页 + 动态菜单）
  const mergedMenus = computed(() => {
    return [...staticMenus, ...dynamicMenus.value].sort((a, b) => (a.order || 0) - (b.order || 0))
  })

  // ========== Actions ==========
  // 从缓存加载菜单
  function loadMenusFromCache(): FrontendMenuItem[] | null {
    const expire = localStorage.get<number>(CACHE_EXPIRE_KEY)
    if (expire && Date.now() > expire) {
      clearMenusCache() // 缓存过期
      return null
    }
    return localStorage.get<FrontendMenuItem[]>(CACHE_KEY)
  }

  // 保存菜单到缓存
  function saveMenusToCache(menus: FrontendMenuItem[]) {
    localStorage.set(CACHE_KEY, menus)
    localStorage.set(CACHE_EXPIRE_KEY, Date.now() + CACHE_DURATION)
  }

  // 清除菜单缓存
  function clearMenusCache() {
    localStorage.remove(CACHE_KEY)
    localStorage.remove(CACHE_EXPIRE_KEY)
  }

  // 设置动态菜单
  function setDynamicMenus(menus: FrontendMenuItem[], useCache = true) {
    dynamicMenus.value = menus
    menuLoaded.value = true
    if (useCache) {
      saveMenusToCache(menus)
    }
  }

  // 清空菜单（登出时调用）
  function clearMenus() {
    dynamicMenus.value = []
    menuLoaded.value = false
    clearMenusCache()
  }

  // 根据 key 查找菜单
  function findMenuByKey(key: string, menus: FrontendMenuItem[]): FrontendMenuItem | null {
    for (const menu of menus) {
      if (menu.key === key) return menu
      if (menu.children) {
        const found = findMenuByKey(key, menu.children)
        if (found) return found
      }
    }
    return null
  }

  // 根据路径查找菜单
  function findMenuByPath(path: string): FrontendMenuItem | null {
    function search(menus: FrontendMenuItem[]): FrontendMenuItem | null {
      for (const menu of menus) {
        if (menu.path === path) return menu
        if (menu.children) {
          const found = search(menu.children)
          if (found) return found
        }
      }
      return null
    }
    return search(mergedMenus.value)
  }

  return {
    // State
    dynamicMenus,
    menuLoaded,
    // Getters
    mergedMenus,
    // Actions
    setDynamicMenus,
    clearMenus,
    loadMenusFromCache,
    findMenuByKey,
    findMenuByPath
  }
})
