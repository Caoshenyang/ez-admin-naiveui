<!--
  EzIcon - Iconify 图标组件
  支持离线使用、按需加载、旋转动画等
-->
<script setup lang="ts">
import { computed } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'
import type { EzIconProps } from '@/types/icon'

const props = withDefaults(defineProps<EzIconProps>(), {
  size: 18,
  spin: false
})

// 计算图标样式
const iconStyle = computed(() => {
  const style: Record<string, string> = {}
  if (typeof props.size === 'number') {
    style.fontSize = `${props.size}px`
  } else {
    style.fontSize = props.size
  }
  if (props.color) {
    style.color = props.color
  }
  return style
})

// 图标翻转
const flipValue = computed(() => {
  if (!props.flip) return undefined
  return props.flip === 'both' ? 'horizontal,vertical' : props.flip
})
</script>

<template>
  <IconifyIcon
    :icon="props.icon"
    :class="['ez-icon', { 'animate-spin': spin }]"
    :style="iconStyle"
    :flip="flipValue"
    :rotate="rotate"
  />
</template>

<style scoped>
.ez-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
