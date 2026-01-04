<!--
  EzTable 表格组件
  基于CommonTable重命名，二次封装n-data-table
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
<!--
  Vue 3 Composition API 泛型组件语法
  定义一个泛型参数 T，它必须继承自 RowData (Naive UI 的数据行类型)
  这使得组件可以接受不同类型的表格数据，同时保持类型安全
-->
<script setup lang="ts" generic="T extends RowData">
import { ref, computed, watch } from 'vue'
import type { DataTableColumns, PaginationProps } from 'naive-ui'
import type { RowData, InternalRowData } from 'naive-ui/es/data-table/src/interface'

/**
 * 🎯 EzTable 泛型组件设计说明：
 *
 * 1. 使用 Vue 3 的 generic="T extends RowData" 语法定义泛型参数
 * 2. T 必须继承自 RowData，确保与 Naive UI 的类型兼容
 * 3. 通过 generic="T" 属性将泛型传递给 n-data-table
 * 4. 这样可以获得完整的类型安全和 IDE 支持
 *
 * 使用示例：
 * <EzTable<UserListVO> :config="tableConfig" />
 */

/**
 * EzTable 组件配置接口
 */
export interface EzTableConfig<T extends RowData> {
  /** 表格列配置 */
  columns: DataTableColumns<T>
  /** 表格数据源 */
  data: T[]
  /** 是否显示加载状态 */
  loading?: boolean
  /** 分页配置 */
  pagination?: PaginationProps
  /** 行主键字段 */
  rowKey?: (row: T) => string | number
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
export interface EzTableEmits<T extends RowData> {
  /** 行选择改变事件 */
  (e: 'check-change', keys: (string | number)[], rows: T[]): void
  /** 排序改变事件 */
  (e: 'sort-change', sorter: Record<string, unknown>): void
  /** 筛选改变事件 */
  (e: 'filter-change', filters: Record<string, unknown>): void
}

/**
 * 组件属性接口
 */
export interface EzTableProps<T extends RowData> {
  /** 表格配置 */
  config: EzTableConfig<T>
  /** 选中的行keys */
  checkedKeys?: (string | number)[]
}

/**
 * 组件属性定义
 */
const props = withDefaults(defineProps<EzTableProps<T>>(), {
  checkedKeys: () => [],
})

/**
 * 组件事件定义
 */
const emit = defineEmits<EzTableEmits<T>>()

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
  },
)

/**
 * 计算属性：表格列配置
 */
const columns = computed(() => props.config.columns)

/**
 * 计算属性：表格数据
 */
const data = computed(() => props.config.data)

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
const rowKey = computed(() => props.config.rowKey)

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
const handleCheckedChange = (keys: (string | number)[], rows: InternalRowData[]) => {
  internalCheckedKeys.value = keys
  emit('check-change', keys, rows as T[])
}

/**
 * 处理排序改变事件
 */
const handleSorterChange = (sorter: Record<string, unknown>) => {
  emit('sort-change', sorter)
}

/**
 * 处理筛选改变事件
 */
const handleFiltersChange = (filters: Record<string, unknown>) => {
  emit('filter-change', filters)
}
</script>

<style lang="scss" scoped></style>
