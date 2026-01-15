<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import EzIconRender from '@/components/EzIconRender.vue'

const router = useRouter()
const appStore = useAppStore()

const menuOptions = computed(() => {
  return appStore.menuRoutes.map((route) => {
    const renderIcon = (icon: string) => {
      if (!icon) return undefined
      return () => h(EzIconRender, { icon, size: 18 })
    }

    if (route.children && route.children.length > 0) {
      return {
        label: route.meta?.title || route.name,
        key: route.name as string,
        icon: renderIcon(route.meta?.icon as string),
        children: route.children.map((child) => ({
          label: child.meta?.title || child.name,
          key: child.name as string,
          icon: renderIcon(child.meta?.icon as string),
        })),
      }
    }
    return {
      label: route.meta?.title || route.name,
      key: route.name as string,
      icon: renderIcon(route.meta?.icon as string),
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
