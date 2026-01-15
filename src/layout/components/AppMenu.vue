<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import { useSystemStore, MenuWidthEnum } from '@/stores/modules/system'
import { renderMenuIcon } from '@/utils/icon'

const router = useRouter()
const appStore = useAppStore()
const systemStore = useSystemStore()

const menuOptions = computed(() => {
  return appStore.menuRoutes.map((route) => {
    if (route.children && route.children.length > 0) {
      return {
        label: route.meta?.title || route.name,
        key: route.name as string,
        icon: route.meta?.icon ? renderMenuIcon(route.meta?.icon as string, systemStore.isCollapse) : undefined,
        children: route.children.map((child) => ({
          label: child.meta?.title || child.name,
          key: child.name as string,
          icon: child.meta?.icon ? renderMenuIcon(child.meta?.icon as string, systemStore.isCollapse) : undefined,
        })),
      }
    }
    return {
      label: route.meta?.title || route.name,
      key: route.name as string,
      icon: route.meta?.icon ? renderMenuIcon(route.meta?.icon as string, systemStore.isCollapse) : undefined,
    }
  })
})

function handleMenuKey(key: string) {
  router.push({ name: key })
}
</script>

<template>
  <n-menu
    :collapsed="systemStore.isCollapse"
    :collapsed-width="MenuWidthEnum.CLOSE"
    :options="menuOptions"
    @update:value="handleMenuKey"
  />
</template>
