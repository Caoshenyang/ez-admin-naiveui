<script setup lang="ts">
import { ref, type CSSProperties } from 'vue'
import { NDataTable } from 'naive-ui'
import EzTableToolbar from './table/EzTableToolbar.vue'
import type { ToolbarConfig } from '@/types/table'

/**
 * EzTable 组件 Props
 * 只定义我们自定义的配置，其他 props 通过 $attrs 透传给 NDataTable
 */
interface EzTableProps {
  /** 工具栏配置 */
  toolbar?: ToolbarConfig
  /** 容器类名 */
  class?: string
  /** 容器样式 */
  style?: CSSProperties
}

defineProps<EzTableProps>()

const tableRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

/** 处理刷新 */
const handleRefresh = () => {
  // 通过 emit 触发父组件的刷新
}

/** 处理全屏切换 */
const handleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (tableRef.value) {
    tableRef.value.classList.toggle('ez-table-fullscreen', isFullscreen.value)
    document.body.style.overflow = isFullscreen.value ? 'hidden' : ''
  }
}
</script>

<template>
  <div
    ref="tableRef"
    :class="['ez-table', 'flex', 'flex-col', 'bg-white', 'rounded-lg', 'overflow-hidden', $props.class]"
    :style="$props.style"
  >
    <!-- 工具栏 -->
    <EzTableToolbar
      v-if="$props.toolbar && Object.keys($props.toolbar).length > 0"
      :toolbar="$props.toolbar"
      :is-fullscreen="isFullscreen"
      @refresh="handleRefresh"
      @fullscreen="handleFullscreen"
    >
      <template v-if="$slots['toolbar-left']" #left>
        <slot name="toolbar-left" />
      </template>
      <template v-if="$slots['toolbar-right']" #right>
        <slot name="toolbar-right" />
      </template>
    </EzTableToolbar>

    <!-- 表格主体 - 使用 v-bind="$attrs" 透传所有 DataTable props -->
    <div class="ez-table-body flex-1 overflow-auto">
      <n-data-table v-bind="$attrs">
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData || {}" />
        </template>
      </n-data-table>
    </div>
  </div>
</template>

<style scoped>
.ez-table-fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 9999 !important;
}
</style>
