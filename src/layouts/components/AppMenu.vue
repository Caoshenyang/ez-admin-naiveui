<script setup lang="ts">
import { computed, h, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NMenu, NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import type { FrontendMenuItem } from '@/types/menu'
import { useLayoutStore } from '@/stores/modules/layout'
import { useMenuStore } from '@/stores/modules/menu'

const router = useRouter()
const route = useRoute()
const layoutStore = useLayoutStore()
const menuStore = useMenuStore()

// 使用合并后的菜单（静态首页 + 动态菜单）
const menuOptions = computed<MenuOption[]>(() => {
  return transformMenuOptions(menuStore.mergedMenus)
})

// 转换菜单选项
function transformMenuOptions(menus: FrontendMenuItem[]): MenuOption[] {
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

// 处理菜单点击
const handleUpdateValue = (key: string) => {
  const menu = menuStore.findMenuByKey(key, menuStore.mergedMenus)
  if (menu?.path) {
    router.push(menu.path)
  }
  layoutStore.setActiveMenuKey(key)
}

// 处理子菜单展开/收起
const handleUpdateExpandedKeys = (keys: Array<string | number>) => {
  layoutStore.setOpenedMenuKeys(keys as string[])
}

const activeKey = computed(() => layoutStore.activeMenuKey) // 当前激活的菜单 key
const expandedKeys = computed(() => layoutStore.openedMenuKeys) // 展开的子菜单 keys
const collapsed = computed(() => layoutStore.isSidebarCollapsed) // 是否折叠

// 监听路由变化，自动高亮对应菜单
watch(
  () => route.path,
  (path) => {
    const menu = menuStore.findMenuByPath(path)
    if (menu?.key) {
      layoutStore.setActiveMenuKey(menu.key)
    }
  },
  { immediate: true }
)
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
