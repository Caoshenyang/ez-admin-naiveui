<script setup lang="ts">
// Dashboard 首页
import { ref } from 'vue'
import EzIconRender from '@/components/EzIconRender.vue'
import EzIconPicker from '@/components/EzIconPicker.vue'

const selectedIcon = ref('')
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
    <p class="mt-4 text-gray-600">欢迎使用后台管理系统</p>
    IconRender 组件示例：
    <div class="mt-4 space-x-4">
      <!-- 使用 Iconify 图标 -->
      <EzIconRender icon="mdi-light:home" :size="24" />
      <EzIconRender icon="material-symbols:add-home-work" :size="24" />
      <EzIconRender icon="iconify:logos:naive-ui" :size="24" />
    </div>
    Iconpicker 组件示例（待实现）：
    <div class="mt-4">
      <EzIconPicker v-model="selectedIcon" />
    </div>
  </div>
</template>
