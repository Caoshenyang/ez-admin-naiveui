<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { NLayout, NLayoutContent, NDrawer } from 'naive-ui'
import AppSidebar from './components/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'
import AppWorkTab from './components/AppWorkTab.vue'
import { useLayoutStore } from '@/stores/modules/layout'

const route = useRoute()
const layoutStore = useLayoutStore()

// 移动端侧边栏状态
const mobileSidebarOpen = computed({
  get: () => layoutStore.mobileSidebarOpen,
  set: (val) => layoutStore.setMobileSidebarOpen(val)
})

// 响应式处理
const handleResize = () => {
  const width = window.innerWidth
  if (width < 768) {
    layoutStore.setDevice('mobile')
    layoutStore.setSidebarCollapsed(true)
  } else {
    layoutStore.setDevice('desktop')
  }
}

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

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="h-screen w-screen overflow-hidden bg-slate-50">
    <n-layout has-sider class="h-full w-full">
      <!-- 侧边栏（桌面端固定显示） -->
      <app-sidebar class="hidden md:block shrink-0" />

      <!-- 主体区域 -->
      <div class="flex flex-col h-full overflow-hidden flex-1 min-w-0">
        <!-- 顶部导航 -->
        <app-header />

        <!-- 标签页 -->
        <app-work-tab />

        <!-- 内容区域 -->
        <n-layout-content :native-scrollbar="false" class="flex-1">
          <div class="p-6 min-h-full">
            <router-view v-slot="{ Component, route: routeMeta }">
              <transition name="fade-slide" mode="out-in">
                <component :is="Component" :key="routeMeta.path" />
              </transition>
            </router-view>
          </div>
        </n-layout-content>
      </div>
    </n-layout>

    <!-- 移动端抽屉式侧边栏 -->
    <n-drawer v-model:show="mobileSidebarOpen" :width="240" placement="left" class="md:hidden">
      <app-sidebar />
    </n-drawer>
  </div>
</template>

<style scoped>
/* 页面切换动画 - 已在 index.css 中定义，这里保留 scoped 以防未来需要 */
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
