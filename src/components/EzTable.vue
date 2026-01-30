<script setup lang="ts">
import { ref, type CSSProperties } from 'vue'
import { NDataTable } from 'naive-ui'
import EzTableToolbar from './table/EzTableToolbar.vue'
import type { ToolbarConfig } from '@/types/table'

/**
 * EzTable 极简表格组件
 * 直接透传 NaiveUI DataTable，仅添加美化工具栏
 */

const props = defineProps<{
  /** 工具栏配置 */
  toolbar?: ToolbarConfig
  /** 容器类名 */
  class?: string
  /** 容器样式 */
  style?: CSSProperties
}>()

const tableRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

/** 处理刷新 */
const handleRefresh = () => {
  props.toolbar?.onRefresh?.()
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
    :class="['ez-table', 'flex', 'flex-col', 'bg-white', 'rounded-lg', 'overflow-hidden', props.class]"
    :style="props.style"
  >
    <!-- 工具栏 -->
    <EzTableToolbar
      v-if="toolbar && Object.keys(toolbar).length > 0"
      :toolbar="toolbar"
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

    <!-- 表格主体 -->
    <div class="ez-table-body flex-1 overflow-auto">
      <n-data-table v-bind="$attrs" />
    </div>
  </div>
</template>

<style>
.ez-table-fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 9999 !important;
}
</style>
