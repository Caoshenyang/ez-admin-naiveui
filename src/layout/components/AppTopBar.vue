<script setup lang="ts">
import { useSystemStore } from '@/stores/modules/system'

const systemStore = useSystemStore()

function handleToggle() {
  systemStore.toggleCollapse()
}
</script>

<template>
  <div class="flex h-16 items-center justify-between border-b border-gray-200 px-6">
    <!-- 左侧：折叠按钮 -->
    <div class="flex items-center">
      <n-button quaternary size="small" @click="handleToggle">
        <template #icon>
          <EzIconRender :icon="systemStore.isCollapse ? 'ep:expand' : 'ep:fold'" :size="20" />
        </template>
      </n-button>
    </div>

    <!-- 右侧：用户信息占位 -->
    <div class="flex items-center gap-4"> 
      <div class="h-8 w-8 rounded-full bg-gray-300"></div>
    </div>
  </div>
</template>
