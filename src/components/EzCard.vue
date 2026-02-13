<script setup lang="ts">
/**
 * EzCard 卡片容器组件
 *
 * 用途：封装卡片布局，自动支持暗色模式和悬停效果
 * 使用场景：内容分组、数据展示、表单容器
 *
 * @example
 * <EzCard hoverable>
 *   <n-form>...</n-form>
 * </EzCard>
 */
interface Props {
  padding?: string // 内边距，默认 '20px'
  hoverable?: boolean // 是否显示悬停效果
}

withDefaults(defineProps<Props>(), {
  padding: '20px',
  hoverable: false
})
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm transition-all"
    :class="{ 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer': hoverable }"
    :style="{ padding }"
  >
    <slot />
  </div>
</template>
