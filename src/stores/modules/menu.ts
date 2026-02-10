/**
 * 菜单 Store
 * 管理静态首页和动态业务菜单的合并逻辑
 */
import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'
import type { MenuOption } from 'naive-ui'
import { h } from 'vue'
import { Icon } from '@iconify/vue'
import { localStorage } from '@/utils/storage'

const CACHE_KEY = 'dynamic-menus'
const CACHE_EXPIRE_KEY = 'dynamic-menus-expire'
const CACHE_DURATION = 1000 * 60 * 30 // 30 分钟

/**
 * 静态菜单配置（前端固定，如首页）
 */
const staticMenus: MenuOption[] = [
  {
    key: 'home',
    label: '首页',
    icon: () => h(Icon, { icon: 'mdi:home-outline' })
  }
]

export const useMenuStore = defineStore('menu', () => {
  // ========== State ==========
  // 使用 shallowRef 避免深层递归导致的类型推断问题
  const dynamicMenus = shallowRef<MenuOption[]>([]) // 动态菜单（从后端加载）
  const menuPathMap = shallowRef<Map<string, string>>(new Map()) // 菜单 key 到路径的映射
  const menuLoaded = ref(false) // 是否已加载菜单

  // ========== Getters ==========
  // 合并后的菜单列表（静态首页 + 动态菜单）
  const mergedMenus = computed<MenuOption[]>(() => {
    return [...staticMenus, ...dynamicMenus.value]
  })

  // ========== Actions ==========
  // 从缓存加载菜单数据
  function loadMenusFromCache(): { menus: MenuOption[]; pathMap: Map<string, string> } | null {
    const expire = localStorage.get<number>(CACHE_EXPIRE_KEY)
    if (expire && Date.now() > expire) {
      clearMenusCache() // 缓存过期
      return null
    }

    const menus = localStorage.get<MenuOption[]>(CACHE_KEY)
    const pathMapData = localStorage.get<Record<string, string>>(`${CACHE_KEY}-path-map`)

    // 明确类型守卫，确保 menus 和 pathMapData 都存在
    if (menus !== null && menus !== undefined && pathMapData !== null && pathMapData !== undefined) {
      return {
        menus,
        pathMap: new Map(Object.entries(pathMapData))
      }
    }
    return null
  }

  // 保存菜单数据到缓存
  function saveMenusToCache(menus: MenuOption[], pathMap: Map<string, string>): void {
    localStorage.set(CACHE_KEY, menus)
    // Map 转 plain object 存储
    localStorage.set(`${CACHE_KEY}-path-map`, Object.fromEntries(pathMap))
    localStorage.set(CACHE_EXPIRE_KEY, Date.now() + CACHE_DURATION)
  }

  // 清除菜单缓存
  function clearMenusCache(): void {
    localStorage.remove(CACHE_KEY)
    localStorage.remove(`${CACHE_KEY}-path-map`)
    localStorage.remove(CACHE_EXPIRE_KEY)
  }

  // 设置动态菜单
  function setDynamicMenus(menus: MenuOption[], pathMap: Map<string, string>, useCache = true): void {
    dynamicMenus.value = menus
    menuPathMap.value = pathMap
    menuLoaded.value = true
    if (useCache) {
      saveMenusToCache(menus, pathMap)
    }
  }

  // 清空菜单（登出时调用）
  function clearMenus(): void {
    dynamicMenus.value = []
    menuPathMap.value = new Map()
    menuLoaded.value = false
    clearMenusCache()
  }

  // 根据路径查找菜单 key
  function findMenuKeyByPath(path: string): string | null {
    // 首页特殊处理（首页路由为根路径）
    if (path === '/' || path === '') return 'home'

    // 从动态菜单映射中查找
    for (const [key, menuPath] of menuPathMap.value) {
      if (menuPath === path) return key
    }

    return null
  }

  return {
    // State
    dynamicMenus,
    menuPathMap,
    menuLoaded,
    // Getters
    mergedMenus,
    // Actions
    setDynamicMenus,
    clearMenus,
    loadMenusFromCache,
    findMenuKeyByPath
  }
})
