<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLayoutStore } from '@/stores/modules/layout'

// 面包屑项类型定义
interface BreadcrumbItem {
  name: string
  path: string
}

const route = useRoute()
const router = useRouter()
const layoutStore = useLayoutStore()

// 是否显示面包屑（默认 true）
const showBreadcrumb = computed(() => layoutStore.showBreadcrumb ?? true)

// 面包屑数据（根据当前路由生成）
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const matched = route.matched

  // 去除 Layout 父路由，过滤没有 title 或 hidden 的路由
  const list = matched
    .slice(1)
    .filter((item) => item.meta?.title && !item.meta.hidden)
    .map<BreadcrumbItem>((item) => ({
      name: String(item.meta?.title || item.name || '未知页面'),
      path: item.path === '' ? '/' : item.path // 空字符串转为 /
    }))

  // 如果没有面包屑项（理论上不会发生），默认显示首页
  return list.length > 0 ? list : [{ name: '首页', path: '/' }]
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
      :class="{
        'cursor-pointer transition-colors hover:text-primary': index < breadcrumbs.length - 1,
        'cursor-default text-foreground/60': index === breadcrumbs.length - 1
      }"
      @click="handleBreadcrumbClick(item.path, index)"
    >
      {{ item.name }}
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>
