<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { NLayout, NLayoutSider, NLayoutHeader, NLayoutContent } from 'naive-ui'
import AppSidebar from './components/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'
import AppWorkTab from './components/AppWorkTab.vue'
import { useLayoutStore } from '@/stores/modules/layout'
import { MenuWidthEnum } from '@/enums/menu'

const route = useRoute()
const layoutStore = useLayoutStore()

// 监听路由变化，更新菜单状态
watch(
  () => route.path,
  (path) => {
    // 更新当前激活的菜单
    layoutStore.setActiveMenuKey(path)

    // 更新打开的子菜单
    const matched = route.matched
    const openedKeys = matched.map((item) => item.path).filter(Boolean)
    layoutStore.setOpenedMenuKeys(openedKeys)
  },
  { immediate: true }
)
</script>

<template>
  <n-layout has-sider class="h-screen">
    <!-- 侧边栏 -->
    <n-layout-sider
      bordered
      :collapsed="layoutStore.isSidebarCollapsed"
      :collapsed-width="MenuWidthEnum.CLOSE"
      :width="MenuWidthEnum.OPEN"
      collapse-mode="width"
    >
      <app-sidebar />
    </n-layout-sider>

    <!-- 主体区域 -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <!-- 顶部导航 -->
      <n-layout-header bordered class="shrink-0">
        <app-header />
      </n-layout-header>

      <!-- 标签页 -->
      <n-layout-header bordered class="shrink-0">
        <app-work-tab />
      </n-layout-header>

      <!-- 内容区域 -->
      <n-layout-content :native-scrollbar="false" class="flex-1 overflow-hidden">
        <div class="h-full overflow-auto p-6">
          <router-view v-slot="{ Component }">
            <transition name="fade-slide" mode="out-in">
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </div>
      </n-layout-content>
    </div>
  </n-layout>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
