<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NLayoutSider, NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { useLayoutStore } from '@/stores/modules/layout'
import { useMenuStore } from '@/stores/modules/menu'

const router = useRouter()
const route = useRoute()
const layoutStore = useLayoutStore()
const menuStore = useMenuStore()

// 是否折叠侧边栏
const isCollapsed = computed(() => layoutStore.isSidebarCollapsed)

// 直接使用合并后的菜单（已经是 NaiveUI Menu 格式）
const menuOptions = computed<MenuOption[]>(() => menuStore.mergedMenus)

const activeKey = computed(() => layoutStore.activeMenuKey) // 当前激活的菜单 key

// 监听路由变化，自动高亮对应菜单
watch(
  () => route.path,
  (path) => {
    const menuKey = menuStore.findMenuKeyByPath(path)
    if (menuKey) {
      layoutStore.setActiveMenuKey(menuKey)
    }
  },
  { immediate: true }
)

// Logo 点击跳转首页
const handleLogoClick = () => {
  router.push('/')
}

// 处理菜单点击
const handleMenuUpdate = (key: string) => {
  layoutStore.setActiveMenuKey(key)

  // 根据菜单 key 查找对应路径
  // 首页特殊处理
  if (key === 'home') {
    router.push('/')
    return
  }

  // 从动态菜单映射中查找
  const path = menuStore.menuPathMap.get(key)
  if (path) {
    router.push(path)
  }
}
</script>

<template>
  <n-layout-sider bordered :collapsed="isCollapsed" :collapsed-width="64" :width="240" collapse-mode="width">
    <!-- Logo 区域（使用 Tailwind） -->
    <div
      class="h-15 flex items-center justify-center px-4 border-b border-slate-200 cursor-pointer transition-colors hover:bg-slate-50"
      @click="handleLogoClick"
    >
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <span class="text-white font-bold text-lg">E</span>
        </div>
        <span v-show="!isCollapsed" class="text-xl font-bold text-slate-900 font-display transition-all duration-200">
          EZ Admin
        </span>
      </div>
    </div>

    <!-- 菜单区域（NaiveUI NMenu + Tailwind 样式） -->
    <n-menu
      accordion
      :collapsed="isCollapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :value="activeKey"
      @update:value="handleMenuUpdate"
    />
  </n-layout-sider>
</template>

<style scoped></style>
