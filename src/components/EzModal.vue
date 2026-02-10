<!--
  EzModal - 弹窗组件
  基于 NaiveUI Modal 的极简封装
-->
<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { NModal } from 'naive-ui'
import type { EzModalEmits, EzModalProps } from '@/types/modal'

const props = withDefaults(defineProps<EzModalProps>(), {
  show: false,
  maskClosable: true,
  closable: true,
  positiveText: '确定',
  negativeText: '取消',
  showAction: true,
  positiveType: 'success',
  negativeType: 'default'
})

const emit = defineEmits<EzModalEmits>()

/** 内部显示状态 */
const innerShow = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

/** 处理确认点击 */
const handlePositiveClick = () => {
  emit('positiveClick')
}

/** 处理取消点击 */
const handleNegativeClick = () => {
  emit('negativeClick')
  innerShow.value = false
}

/** 处理关闭 */
const handleClose = () => {
  emit('close')
  innerShow.value = false
}

/** 计算弹窗样式 */
const modalStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = { ...props.style }

  // 根据尺寸预设设置宽度
  const sizeWidthMap: Record<string, string> = {
    small: '400px',
    medium: '600px',
    large: '800px',
    huge: '1200px'
  }

  if (props.size && !props.width) {
    style.width = sizeWidthMap[props.size]
  } else if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  return style
})
</script>

<template>
  <n-modal
    v-model:show="innerShow"
    :style="modalStyle"
    :mask-closable="maskClosable"
    :closable="closable"
    v-bind="$attrs"
    :class="props.class"
    preset="card"
    :title="title"
    :positive-text="showAction ? positiveText : undefined"
    :negative-text="showAction ? negativeText : undefined"
    :positive-button-props="{ type: positiveType }"
    :negative-button-props="{ type: negativeType }"
    @positive-click="handlePositiveClick"
    @negative-click="handleNegativeClick"
    @close="handleClose"
  >
    <slot>
      <!-- 默认插槽内容 -->
    </slot>

    <!-- 自定义头部 -->
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <!-- 自定义操作按钮 -->
    <template v-if="$slots.action" #action>
      <slot name="action" />
    </template>

    <!-- 自定义关闭图标 -->
    <template v-if="$slots.close" #close>
      <slot name="close" />
    </template>
  </n-modal>
</template>
