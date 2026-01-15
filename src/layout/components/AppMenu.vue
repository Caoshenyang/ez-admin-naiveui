<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'

const router = useRouter()
const appStore = useAppStore()

const menuOptions = computed(() => {
  return appStore.menuRoutes.map((route) => {
    if (route.children && route.children.length > 0) {
      return {
        label: route.meta?.title || route.name,
        key: route.name as string,
        icon: route.meta?.icon || undefined,
        children: route.children.map((child) => ({
          label: child.meta?.title || child.name,
          key: child.name as string,
          icon: child.meta?.icon || undefined,
        })),
      }
    }
    return {
      label: route.meta?.title || route.name,
      key: route.name as string,
      icon: route.meta?.icon || undefined,
    }
  })
})

function handleMenuKey(key: string) {
  router.push({ name: key })
}
</script>

<template>
  <n-menu
    :collapsed="false"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="menuOptions"
    @update:value="handleMenuKey"
  />
</template>
