<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { NMenu, NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import type { MenuItem } from '@/types/layout'
import { useLayoutStore } from '@/stores/modules/layout'
import { menuConfig } from '@/config/menu'

const router = useRouter()
const layoutStore = useLayoutStore()

// 将菜单配置转换为 NaiveUI 菜单选项
const menuOptions = computed<MenuOption[]>(() => {
  return transformMenuOptions(menuConfig)
})

// 转换菜单选项
function transformMenuOptions(menus: MenuItem[]): MenuOption[] {
  return menus.map((menu) => {
    const option: MenuOption = {
      label: menu.label,
      key: menu.key,
      icon: menu.icon
        ? () =>
            h(NIcon, null, {
              default: () => h(menu.icon!)
            })
        : undefined
    }

    // 处理子菜单
    if (menu.children && menu.children.length > 0) {
      option.children = transformMenuOptions(menu.children)
    }

    return option
  })
}

// 处理菜单更新
const handleUpdateValue = (key: string) => {
  layoutStore.setActiveMenuKey(key)

  // 根据菜单 key 查找对应的路由
  const findMenuBykey = (menus: MenuItem[], key: string): MenuItem | null => {
    for (const menu of menus) {
      if (menu.key === key) {
        return menu
      }
      if (menu.children) {
        const found = findMenuBykey(menu.children, key)
        if (found) return found
      }
    }
    return null
  }

  const menu = findMenuBykey(menuConfig, key)
  if (menu && menu.path) {
    router.push(menu.path)
  }
}

// 处理子菜单展开/收起
const handleUpdateExpandedKeys = (keys: Array<string | number>) => {
  layoutStore.setOpenedMenuKeys(keys as string[])
}

const activeKey = computed(() => layoutStore.activeMenuKey) // 当前激活的菜单 key
const expandedKeys = computed(() => layoutStore.openedMenuKeys) // 展开的子菜单 keys
const collapsed = computed(() => layoutStore.isSidebarCollapsed) // 是否折叠
</script>

<template>
  <div class="flex-1 overflow-y-auto py-4">
    <NMenu
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :value="activeKey"
      :expanded-keys="expandedKeys"
      @update:value="handleUpdateValue"
      @update:expanded-keys="handleUpdateExpandedKeys"
    />
  </div>
</template>
