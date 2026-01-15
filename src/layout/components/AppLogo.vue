<script setup lang="ts">
import { computed } from 'vue'
import { useSystemStore } from '@/stores/modules/system'

const systemStore = useSystemStore()

const logoText = computed(() => (systemStore.isCollapse ? 'Admin' : 'Admin System'))
</script>

<template>
  <div class="flex h-16 items-center justify-center border-b border-gray-200 px-4">
    <div class="flex items-center gap-2">
      <EzIconRender icon="mdi:hexagon" :size="32" class="text-primary" />
      <h1 v-show="!systemStore.isCollapse" class="text-xl font-bold text-gray-800 transition-all">
        {{ logoText }}
      </h1>
    </div>
  </div>
</template>
