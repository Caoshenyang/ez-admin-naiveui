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

// 菜单宽度配置
const menuCollapsedWidth = computed(() => MenuWidthEnum.CLOSE)
const menuWidth = computed(() => MenuWidthEnum.OPEN)

// 是否折叠侧边栏
const isCollapsed = computed(() => layoutStore.isSidebarCollapsed)

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
          <router-view v-slot="{ Component, route }">
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
