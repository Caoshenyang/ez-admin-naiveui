<script setup lang="ts">
/**
 * EzPage 页面容器组件
 *
 * 用途：封装页面级别的布局容器，自动支持暗色模式
 * 使用场景：页面根容器、内容区域
 *
 * @example
 * <EzPage padding="24px">
 *   <n-h1>页面标题</n-h1>
 *   <EzCard>内容</EzCard>
 * </EzPage>
 */
interface Props {
  padding?: string // 内边距，默认 '24px'
}

withDefaults(defineProps<Props>(), {
  padding: '24px'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors" :style="{ padding }">
    <slot />
  </div>
</template>
