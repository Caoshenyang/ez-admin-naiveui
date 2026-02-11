<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NSpace, NEl } from 'naive-ui'
import { useLayoutStore } from '@/stores/modules/layout'

const router = useRouter()
const layoutStore = useLayoutStore()

// Logo 点击跳转首页
const handleClick = () => {
  router.push('/')
}
</script>

<template>
  <n-el
    tag="div"
    class="h-15 flex items-center justify-center px-4 border-b border-slate-200 cursor-pointer active:scale-[0.98] transition-transform duration-150"
    @click="handleClick"
  >
    <n-space :size="8" class="overflow-hidden">
      <!-- Logo 图标 -->
      <n-el
        tag="div"
        class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary-500 shadow-sm"
      >
        <n-el tag="span" class="text-white font-bold text-lg">E</n-el>
      </n-el>

      <!-- 文字标签 -->
      <n-el
        tag="span"
        v-show="!layoutStore.isSidebarCollapsed"
        class="text-xl font-bold text-slate-900 font-display whitespace-nowrap transition-[opacity,transform] duration-200 ease-out"
      >
        EZ Admin
      </n-el>
    </n-space>
  </n-el>
</template>
