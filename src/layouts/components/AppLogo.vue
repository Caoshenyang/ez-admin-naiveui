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
  <div class="h-15 p-10 flex items-center justify-center px-4 cursor-pointer" @click="handleClick">
    <div
      class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary-500 dark:bg-primary-dark-500 shadow-sm"
    >
      <span class="text-white font-bold text-lg">E</span>
    </div>

    <span
      v-show="!layoutStore.isSidebarCollapsed"
      class="ml-2 text-xl font-bold text-primary dark:text-primary-dark font-display whitespace-nowrap"
    >
      EZ Admin
    </span>
  </div>
</template>
