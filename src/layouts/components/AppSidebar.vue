<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NLayoutSider, NMenu } from 'naive-ui'
import { Icon } from '@iconify/vue'
import type { MenuOption } from 'naive-ui'
import type { FrontendMenuItem } from '@/types/menu'
import { useLayoutStore } from '@/stores/modules/layout'
import { useMenuStore } from '@/stores/modules/menu'

const router = useRouter()
const route = useRoute()
const layoutStore = useLayoutStore()
const menuStore = useMenuStore()

// 是否折叠侧边栏
const isCollapsed = computed(() => layoutStore.isSidebarCollapsed)

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
      icon: menu.icon ? () => h(Icon, { icon: menu.icon as string }) : undefined
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

// Logo 点击跳转首页
const handleLogoClick = () => {
  router.push('/')
}
</script>

<template>
  <n-layout-sider
    :collapsed="isCollapsed"
    :collapsed-width="64"
    :width="240"
    collapse-mode="width"
    bordered
    show-trigger
    class="bg-white border-r border-slate-200"
  >
    <!-- Logo 区域（使用 Tailwind） -->
    <div
      class="h-[60px] flex items-center justify-center px-4 border-b border-slate-200 cursor-pointer transition-colors hover:bg-slate-50"
      @click="handleLogoClick"
    >
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span class="text-white font-bold text-lg">E</span>
        </div>
        <span
          v-show="!isCollapsed"
          class="text-xl font-bold text-slate-900 font-display transition-all duration-200"
        >
          EZ Admin
        </span>
      </div>
    </div>

    <!-- 菜单区域（NaiveUI NMenu + Tailwind 样式） -->
    <div class="py-4 px-2 custom-scrollbar overflow-y-auto h-[calc(100%-60px)]">
      <n-menu
        :collapsed="isCollapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :value="activeKey"
        :expanded-keys="expandedKeys"
        @update:value="handleUpdateValue"
        @update:expanded-keys="handleUpdateExpandedKeys"
        class="border-r-0"
      />
    </div>
  </n-layout-sider>
</template>

<style scoped>
/* 激活菜单项：左侧蓝色条 + 浅蓝背景 */
:deep(.n-menu-item.n-menu-item--selected) {
  background-color: #eff6ff; /* bg-blue-50 */
  border-left: 3px solid #2563eb; /* blue-600 */
}

/* 折叠状态下激活菜单项的样式调整 */
:deep(.n-layout-sider--collapsed .n-menu-item.n-menu-item--selected) {
  border-left: none;
  border-left: 3px solid #2563eb;
}

/* 悬停效果 */
:deep(.n-menu-item:hover) {
  background-color: #f8fafc; /* bg-slate-50 */
}

/* 子菜单标题样式 */
:deep(.n-submenu-item) {
  padding-left: 13px;
}

:deep(.n-submenu-item .n-submenu-item-content__icon) {
  font-size: 20px;
}

/* 图标尺寸统一 */
:deep(.n-menu-item .n-menu-item-content__icon) {
  font-size: 20px;
}

/* 折叠状态下的图标居中 */
:deep(.n-layout-sider--collapsed .n-menu-item) {
  padding-left: 0;
  padding-right: 0;
}

:deep(.n-layout-sider--collapsed .n-menu-item .n-menu-item-content) {
  padding-left: 0;
  padding-right: 0;
  justify-content: center;
}

:deep(.n-layout-sider--collapsed .n-menu-item .n-menu-item-content__icon) {
  margin-right: 0;
}

/* 折叠状态下移除激活状态的左边框 */
:deep(.n-layout-sider--collapsed .n-menu-item.n-menu-item--selected) {
  border-left: none;
  background-color: #eff6ff;
}
</style>
