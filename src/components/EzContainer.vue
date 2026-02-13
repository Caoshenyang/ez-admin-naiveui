<script setup lang="ts">
/**
 * EzContainer 内容容器组件
 *
 * 用途：居中容器，限制最大宽度，常用于页面内容区域
 * 使用场景：页面主体内容、限制宽度的内容区域
 *
 * @example
 * <EzContainer>
 *   <EzCard>内容</EzCard>
 * </EzContainer>
 */
interface Props {
  maxWidth?: string // 最大宽度，默认 '1200px'
}

withDefaults(defineProps<Props>(), {
  maxWidth: '1200px'
})
</script>

<template>
  <div class="container mx-auto px-4 md:px-6" :style="{ maxWidth }">
    <slot />
  </div>
</template>
