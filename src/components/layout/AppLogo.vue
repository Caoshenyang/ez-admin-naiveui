<!-- logo 组件 -->
<script setup lang="ts">
import router, { ROUTE_PATHS } from '@/router'
import { useSystemStore } from '@/stores/modules/system'
const systemStore = useSystemStore()

const handleClick = () => {
  router.push(ROUTE_PATHS.HOME)
}
</script>
<template>
  <div
    class="select-none flex justify-center items-center gap-2 pt-4 pb-4 cursor-pointer border-r-0"
    @click="handleClick"
  >
    <n-image class="w-8 h-8" preview-disabled :src="systemStore.getLogo" fit="contain" />
    <span
      v-if="!systemStore.isCollapse"
      class="text-lg font-medium text-gray-800 whitespace-nowrap"
    >
      EZ-ADMIN
    </span>
  </div>
</template>
<style scoped lang="scss"></style>
