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
  <div
    class="h-15 flex items-center justify-center px-4 border-b border-slate-200 cursor-pointer hover:shadow-sm active:scale-[0.98] transition-all duration-200 ease-out"
    @click="handleClick"
  >
    <div class="flex items-center gap-2 overflow-hidden">
      <!-- Logo 图标 -->
      <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary-500 shadow-sm">
        <span class="text-white font-bold text-lg">E</span>
      </div>

      <!-- 文字标签 -->
      <span
        v-show="!layoutStore.isSidebarCollapsed"
        class="text-xl font-bold text-slate-900 dark:text-slate-300 font-display whitespace-nowrap transition-[opacity,transform] duration-200 ease-out"
      >
        EZ Admin
      </span>
    </div>
  </div>
</template>
