<template>
  <n-breadcrumb>
    <n-breadcrumb-item v-for="item in breadcrumbs" :key="item.name">
      {{ item.title }}
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 面包屑数据
const breadcrumbs = computed(() => {
  const matched = route.matched
  return matched.map(item => ({
    name: item.name,
    title: item.meta?.title || item.name
  }))
})
</script>

<style scoped>

</style>
