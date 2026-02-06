<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLayoutStore } from '@/stores/modules/layout'

const route = useRoute()
const router = useRouter()
const layoutStore = useLayoutStore()

// 是否显示面包屑
const showBreadcrumb = computed(() => {
  const value = layoutStore.showBreadcrumb
  // 如果配置未初始化（undefined），默认显示面包屑
  return value ?? true
})

// 面包屑数据（根据当前路由生成）
const breadcrumbs = computed(() => {
  const matched = route.matched
  // 去除根节点（Layout）并过滤没有 title 的路由
  // 直接使用 item.path，它已经是完整路径了
  return matched
    .slice(1)
    .filter((item) => item.meta?.title && !item.meta.hidden)
    .map((item) => ({
      name: item.meta?.title || item.name,
      path: item.path
    }))
})

// 处理面包屑点击
function handleBreadcrumbClick(path: string, index: number) {
  // 最后一项（当前页面）不可点击
  if (index < breadcrumbs.value.length - 1) {
    router.push(path)
  }
}
</script>

<template>
  <n-breadcrumb v-if="showBreadcrumb" class="text-sm flex-1">
    <n-breadcrumb-item
      v-for="(item, index) in breadcrumbs"
      :key="item.path"
      :class="{ 'cursor-pointer transition-colors': index < breadcrumbs.length - 1 }"
      @click="handleBreadcrumbClick(item.path, index)"
    >
      {{ item.name }}
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>
