<template>
  <n-breadcrumb>
    <n-breadcrumb-item
      v-for="item in breadcrumbs"
      :key="item.name"
      clickable
      @click="handleClick(item.path)"
    >
      <span class="font-semibold">{{ item.title }}</span>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 处理面包屑点击导航
const handleClick = (path: string) => {
  router.push(path)
}

// 面包屑数据
const breadcrumbs = computed(() => {
  const matched = route.matched
  // 去除根节点（第一个匹配的路由）
  return matched.slice(1).map((item) => ({
    name: item.name,
    title: item.meta?.title || item.name,
    path: item.path,
  }))
})
</script>

<style scoped lang="scss"></style>
