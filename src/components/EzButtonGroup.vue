<script setup lang="ts">
/**
 * EzButtonGroup 按钮组容器组件
 *
 * 用途：将多个按钮组织在一起，常用于操作组
 * 使用场景：表单操作栏、工具栏、筛选组
 *
 * @example
 * <EzButtonGroup gap="2">
 *   <n-button>取消</n-button>
 *   <n-button type="primary">确定</n-button>
 * </EzButtonGroup>
 */
interface Props {
  gap?: string // 按钮间距，默认 '8px'
  align?: 'start' | 'end' | 'center' // 对齐方式
}

withDefaults(defineProps<Props>(), {
  gap: '8px',
  align: 'end'
})
</script>

<template>
  <div
    class="flex items-center"
    :class="{
      'justify-start': align === 'start',
      'justify-end': align === 'end',
      'justify-center': align === 'center'
    }"
    :style="{ gap }"
  >
    <slot />
  </div>
</template>
