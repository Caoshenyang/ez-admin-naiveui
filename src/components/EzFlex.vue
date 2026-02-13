<script setup lang="ts">
/**
 * EzFlex Flex 布局容器组件
 *
 * 用途：快速创建 Flex 布局，支持响应式和对齐方式
 * 使用场景：水平排列、垂直居中、两端对齐等
 *
 * @example
 * <EzFlex justify="between" align="center" gap="4">
 *   <div>左侧</div>
 *   <div>右侧</div>
 * </EzFlex>
 */
interface Props {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse' // 方向
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' // 主轴对齐
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch' // 交叉轴对齐
  gap?: string // 间距，Tailwind 间距类名，如 '4'、'6'
  wrap?: boolean // 是否换行
}

withDefaults(defineProps<Props>(), {
  direction: 'row',
  justify: 'start',
  align: 'start',
  gap: '0',
  wrap: false
})
</script>

<template>
  <div
    class="flex"
    :class="{
      'flex-row': direction === 'row',
      'flex-col': direction === 'col',
      'flex-row-reverse': direction === 'row-reverse',
      'flex-col-reverse': direction === 'col-reverse',
      'justify-start': justify === 'start',
      'justify-end': justify === 'end',
      'justify-center': justify === 'center',
      'justify-between': justify === 'between',
      'justify-around': justify === 'around',
      'justify-evenly': justify === 'evenly',
      'items-start': align === 'start',
      'items-end': align === 'end',
      'items-center': align === 'center',
      'items-baseline': align === 'baseline',
      'items-stretch': align === 'stretch',
      'flex-wrap': wrap
    }"
    :style="{ gap: gap !== '0' ? `var(--spacing-${gap})` : undefined }"
  >
    <slot />
  </div>
</template>
