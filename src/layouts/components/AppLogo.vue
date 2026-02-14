<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLayoutStore } from '@/stores/modules/layout'

const router = useRouter()
const layoutStore = useLayoutStore()

// Logo 点击跳转首页
function handleClick() {
  router.push('/')
}
</script>

<template>
  <div class="flex h-15 cursor-pointer items-center justify-center p-4" @click="handleClick">
    <div
      class="bg-primary-500 dark:bg-primary-dark-500 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm"
    >
      <span class="text-lg font-bold text-white">E</span>
    </div>

    <span
      v-show="!layoutStore.isSidebarCollapsed"
      class="text-primary dark:text-primary-dark font-display ml-2 text-xl font-bold whitespace-nowrap"
    >
      EZ Admin
    </span>
  </div>
</template>
