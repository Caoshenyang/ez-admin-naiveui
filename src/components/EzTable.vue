<script setup lang="ts">
import { ref, type CSSProperties } from 'vue'
import { NDataTable, type DataTableProps } from 'naive-ui'
import EzTableToolbar from './table/EzTableToolbar.vue'
import type { ToolbarConfig } from '@/types/table'

/**
 * EzTable 极简表格组件
 * 继承 NaiveUI DataTable 所有类型，仅添加美化工具栏
 *
 * @example
 * ```ts
 * interface User { id: number; name: string }
 * const columns: DataTableColumns<User> = [...]
 * const data = ref<User[]>([])
 * ```
 */

/**
 * EzTable 组件 Props
 * 继承 NaiveUI DataTable 所有 props，添加自定义的 toolbar 配置
 *
 * 注意：NaiveUI 的 DataTableProps 不是泛型类型，内部使用 any
 * 泛型类型安全主要由 DataTableColumns 提供
 */
type EzTableProps = Omit<DataTableProps, 'class' | 'style'> & {
  /** 工具栏配置 */
  toolbar?: ToolbarConfig
  /** 容器类名 */
  class?: string
  /** 容器样式 */
  style?: CSSProperties
}

const props = defineProps<EzTableProps>()

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

/**
 * 提取 NDataTable 需要的 props
 * 排除我们自定义的 toolbar、class、style
 */
const dataTableProps: DataTableProps = (() => {
  // 使用下划线前缀表示有意未使用
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { toolbar: _toolbar, class: _class, style: _style, ...rest } = props
  return rest
})()
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
      <n-data-table v-bind="dataTableProps">
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData || {}" />
        </template>
      </n-data-table>
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
