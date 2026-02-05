<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { NLayout, NLayoutContent, NLayoutSider } from 'naive-ui'
import AppLogo from './components/AppLogo.vue'
import AppMenu from './components/AppMenu.vue'
import AppTopBar from './components/AppTopBar.vue'
import AppWorkTab from './components/AppWorkTab.vue'
import { useLayoutStore } from '@/stores/modules/layout'
import { MenuWidthEnum } from '@/enums/menu'

const route = useRoute()
const layoutStore = useLayoutStore()

const menuCollapsedWidth = computed(() => MenuWidthEnum.CLOSE) // 菜单折叠宽度配置
const menuWidth = computed(() => MenuWidthEnum.OPEN) // 菜单展开宽度配置
const isCollapsed = computed(() => layoutStore.isSidebarCollapsed) // 是否折叠侧边栏

// 检测是否正在加载动态路由
const isRouteLoading = computed(() => route.name === 'TempWildcard')

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
    const openedKeys = matched.map(item => item.path).filter(Boolean)
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
  <div class="h-screen w-screen overflow-hidden">
    <n-layout has-sider class="h-full w-full">
      <!-- 侧边栏 -->
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="menuCollapsedWidth"
        :width="menuWidth"
        :native-scrollbar="false"
        :collapsed="isCollapsed"
        class="transition-all duration-300"
      >
        <AppLogo />
        <AppMenu />
      </n-layout-sider>

      <!-- 主体区域 -->
      <n-layout class="h-full w-full">
        <!-- 顶部导航 -->
        <n-layout-header bordered>
          <AppTopBar />
        </n-layout-header>

        <!-- 标签页 -->
        <AppWorkTab />

        <!-- 内容区域 -->
        <n-layout-content content-style="padding: 24px;" class="bg-gray-50">
          <!-- 动态路由加载遮罩 -->
          <div v-if="isRouteLoading" class="flex h-full items-center justify-center">
            <div class="text-center">
              <div class="mb-4">
                <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
              </div>
              <p class="text-gray-600">正在加载路由，请稍候...</p>
            </div>
          </div>

          <!-- 正常内容 -->
          <router-view v-else v-slot="{ Component, route }">
            <transition name="fade-slide" mode="out-in">
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<style scoped>
/* 页面切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
