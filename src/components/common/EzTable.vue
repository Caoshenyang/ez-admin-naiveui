<!--
  EzTable 表格组件
-->
<template>
  <!-- 表格容器 -->
  <n-data-table
    ref="tableRef"
    v-model:checked-row-keys="internalCheckedKeys"
    :columns="columns"
    :data="data"
    :loading="loading"
    :pagination="pagination"
    :row-key="rowKey"
    :scroll-x="scrollX"
    :max-height="maxHeight"
    :striped="striped"
    :remote="remote"
    :single-line="singleLine"
    :size="size"
    :bordered="bordered"
    :bottom-bordered="bottomBordered"
    :single-column="singleColumn"
    @update:checked-row-keys="handleCheckedChange"
    @update:sorter="handleSorterChange"
    @update:filters="handleFiltersChange"
  >
    <!-- 自定义插槽支持 -->
    <slot />
  </n-data-table>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PaginationProps, DataTableColumns } from 'naive-ui'

/**
 * 表格配置接口
 */
export interface TableConfig {
  /** 列配置 */
  columns: DataTableColumns
  /** 数据源 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: readonly any[]
  /** 是否显示加载状态 */
  loading?: boolean
  /** 分页配置 */
  pagination?: PaginationProps
  /** 行主键字段 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowKey?: string | ((row: any) => string | number)
  /** 横向滚动宽度 */
  scrollX?: string | number
  /** 最大高度 */
  maxHeight?: string | number
  /** 是否显示斑马纹 */
  striped?: boolean
  /** 是否远程分页 */
  remote?: boolean
  /** 是否单行显示 */
  singleLine?: boolean
  /** 表格尺寸 */
  size?: 'small' | 'medium' | 'large'
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示底部边框 */
  bottomBordered?: boolean
  /** 是否单列模式 */
  singleColumn?: boolean
}

/**
 * 表格事件接口
 */
export interface TableEmits {
  /** 行选择改变事件 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'check-change', keys: (string | number)[], rows: any[]): void
  /** 排序改变事件 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'sort-change', sorter: any): void
  /** 筛选改变事件 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'filter-change', filters: any): void
}

/**
 * 组件属性接口
 */
export interface TableProps {
  /** 表格配置 */
  config: TableConfig
  /** 选中的行keys */
  checkedKeys?: (string | number)[]
}

/**
 * 组件属性定义
 */
const props = withDefaults(defineProps<TableProps>(), {
  checkedKeys: () => [],
})

/**
 * 组件事件定义
 */
const emit = defineEmits<TableEmits>()

/**
 * 表格引用
 */
const tableRef = ref()

/**
 * 内部选中的行keys（双向绑定）
 */
const internalCheckedKeys = ref<(string | number)[]>(props.checkedKeys)

/**
 * 监听外部checkedKeys变化，同步到内部状态
 */
watch(
  () => props.checkedKeys,
  (newKeys) => {
    internalCheckedKeys.value = newKeys
  }
)

/**
 * 计算属性：表格列配置
 */
const columns = computed(() => props.config.columns)

/**
 * 计算属性：表格数据
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data = computed(() => (props.config.data || []) as any)

/**
 * 计算属性：加载状态
 */
const loading = computed(() => props.config.loading || false)

/**
 * 计算属性：分页配置
 */
const pagination = computed(() => props.config.pagination)

/**
 * 计算属性：行主键
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rowKey = computed(() => props.config.rowKey as any)

/**
 * 计算属性：横向滚动
 */
const scrollX = computed(() => props.config.scrollX)

/**
 * 计算属性：最大高度
 */
const maxHeight = computed(() => props.config.maxHeight)

/**
 * 计算属性：斑马纹
 */
const striped = computed(() => props.config.striped ?? true)

/**
 * 计算属性：远程分页
 */
const remote = computed(() => props.config.remote ?? true)

/**
 * 计算属性：单行显示
 */
const singleLine = computed(() => props.config.singleLine ?? true)

/**
 * 计算属性：表格尺寸
 */
const size = computed(() => props.config.size ?? 'small')

/**
 * 计算属性：边框
 */
const bordered = computed(() => props.config.bordered ?? false)

/**
 * 计算属性：底部边框
 */
const bottomBordered = computed(() => props.config.bottomBordered ?? true)

/**
 * 计算属性：单列模式
 */
const singleColumn = computed(() => props.config.singleColumn ?? false)

/**
 * 处理行选择改变事件
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleCheckedChange = (keys: (string | number)[], rows: any[]) => {
  internalCheckedKeys.value = keys
  emit('check-change', keys, rows)
}

/**
 * 处理排序改变事件
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleSorterChange = (sorter: any) => {
  emit('sort-change', sorter)
}

/**
 * 处理筛选改变事件
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleFiltersChange = (filters: any) => {
  emit('filter-change', filters)
}
</script>

<style lang="scss" scoped></style>
