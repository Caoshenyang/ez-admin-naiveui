<script setup lang="ts">
import { useLayoutStore } from '@/stores/modules/layout'
import { useRouter } from 'vue-router'

const layoutStore = useLayoutStore()
const router = useRouter()

const handleClick = () => {
  router.push('/')
}
</script>

<template>
  <div
    class="h-16 flex items-center justify-center px-4 border-b border-gray-200 cursor-pointer transition-all duration-300"
    @click="handleClick"
  >
    <template v-if="!layoutStore.isSidebarCollapsed">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-lg">E</span>
        </div>
        <span class="text-xl font-bold text-gray-800">EZ Admin</span>
      </div>
    </template>
    <template v-else>
      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span class="text-white font-bold text-lg">E</span>
      </div>
    </template>
  </div>
</template>
