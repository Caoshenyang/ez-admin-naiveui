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
    <!-- Logo 区域 -->
    <div
      class="group h-15 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-700 cursor-pointer active:scale-[0.98] transition-transform duration-150"
      @click="handleLogoClick"
    >
      <div class="flex items-center gap-2 overflow-hidden">
        <!-- Logo 图标 -->
        <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-[#5B6BF0] to-[#7C85F7] dark:from-[#818CF8] dark:to-[#A5B4FC] shadow-sm transition-transform duration-200 group-hover:scale-105">
          <span class="text-white font-bold text-lg">E</span>
        </div>

        <!-- 文字标签 -->
        <span
          v-show="!isCollapsed"
          class="text-xl font-bold text-slate-900 dark:text-slate-50 font-display whitespace-nowrap transition-[opacity,transform] duration-200 ease-out"
        >
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
