<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import AppHeader from './components/Header.vue'
import AppSidebar from './components/Sidebar.vue'
import AppMain from './components/Main.vue'

const appStore = useAppStore()

const isMobile = computed(() => appStore.device === 'mobile')
const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)
</script>

<template>
  <n-layout has-sider position="absolute" class="app-layout">
    <n-layout-sider
      bordered
      show-trigger
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :native-scrollbar="false"
      :collapsed="sidebarCollapsed"
      @collapse="appStore.setSidebarCollapsed(true)"
      @expand="appStore.setSidebarCollapsed(false)"
    >
      <AppSidebar />
    </n-layout-sider>

    <n-layout :native-scrollbar="false">
      <AppHeader />

      <AppMain />
    </n-layout>
  </n-layout>
</template>
