<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePermissionStore } from '@/stores/permission'
import { NMenu, NIcon } from 'naive-ui'

const router = useRouter()
const route = useRoute()
const permissionStore = usePermissionStore()

const menuRoutes = computed(() => permissionStore.menuRoutes)
const activeKey = computed(() => route.name as string)
const collapsed = computed(() => permissionStore.menuRoutes.length === 0)

function renderIcon(icon: string) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

function handleMenuUpdate(key: string) {
  router.push({ name: key })
}

function transformRoutes(routes: any[]): any[] {
  return routes
    .filter(route => !route.meta?.hidden)
    .map(route => ({
      key: route.name,
      label: route.meta?.title,
      icon: route.meta?.icon ? renderIcon(route.meta.icon) : undefined,
      children: route.children ? transformRoutes(route.children) : undefined
    }))
}

const menuOptions = computed(() => transformRoutes(menuRoutes.value))
</script>

<template>
  <div class="sidebar">
    <div class="logo">
      <h2 v-if="!collapsed">后台管理</h2>
    </div>
    <n-menu
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :value="activeKey"
      @update:value="handleMenuUpdate"
    />
  </div>
</template>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--n-border-color);
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
</style>
