<template>
  <div>
    <!-- 首页 -->
     首页
  </div>
</template>

<script setup lang="ts">
import { useUserInfoStore } from '@/stores/modules/user';

// 首页逻辑
const userInfoStore = useUserInfoStore()
</script>

<style scoped>
/* 首页样式 */
</style>
