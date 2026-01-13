<!--
  EzTable 表格组件
  基于CommonTable重命名，二次封装n-data-table
-->
<template>
  <!-- 头部工具栏 -->
  <div v-if="showToolbar" class="flex items-center justify-between mb-4">
    <!-- 左侧：简易查询 -->
    <div class="flex gap-3 items-center">
      <EzSearch
        v-if="showSearch"
        :model-value="searchValue"
        :placeholder="searchPlaceholder"
        :width="searchWidth"
        @update:model-value="handleSearchInput"
        @search="handleSearch"
      />
    </div>

    <!-- 右侧：列表操作栏 -->
    <div class="flex gap-2 items-center">
      <!-- 高级筛选按钮 -->
      <n-button v-if="showAdvancedFilter" @click="handleAdvancedFilter">
        <template #icon>
          <n-icon size="18">
            <filter />
          </n-icon>
        </template>
      </n-button>

      <!-- 表头字段显示隐藏按钮 -->
      <n-dropdown v-if="showColumnSelector" :options="columnOptions" @select="handleColumnToggle">
        <n-button>
          <template #icon>
            <n-icon size="18">
              <eye />
            </n-icon>
          </template>
        </n-button>
      </n-dropdown>

      <!-- 刷新按钮 -->
      <n-button v-if="showRefresh" @click="handleRefresh">
        <template #icon>
          <n-icon size="18">
            <refresh />
          </n-icon>
        </template>
      </n-button>
    </div>
  </div>

  <!-- 表格容器 -->
  <n-data-table
    ref="tableRef"
    v-model:checked-row-keys="internalCheckedKeys"
    v-model:expanded-row-keys="internalExpandedKeys"
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
    :tree-structure="treeStructure"
    :children-key="childrenKey"
    :default-expand-all="defaultExpandAll"
    @update:checked-row-keys="handleCheckedChange"
    @update:expanded-row-keys="handleExpandedChange"
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
import { Refresh, Eye } from '@vicons/ionicons5'
import type { RowData, InternalRowData } from 'naive-ui/es/data-table/src/interface'
import type { DropdownOption } from 'naive-ui'
import type { EzTableConfig } from '@/hooks/types/table'
import EzSearch from '@/components/common/EzSearch.vue'

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
 * 表格事件接口
 */
export interface EzTableEmits<T extends RowData> {
  /** 行选择改变事件 */
  (e: 'check-change', keys: (string | number)[], rows: T[]): void
  /** 行展开改变事件 */
  (e: 'expand-change', keys: (string | number)[]): void
  /** 排序改变事件 */
  (e: 'sort-change', sorter: Record<string, unknown>): void
  /** 筛选改变事件 */
  (e: 'filter-change', filters: Record<string, unknown>): void
  /** 搜索事件 */
  (e: 'search', value: string): void
  /** 搜索输入事件 */
  (e: 'search-input', value: string): void
  /** 刷新事件 */
  (e: 'refresh'): void
  /** 高级筛选事件 */
  (e: 'advanced-filter'): void
  /** 字段显示切换事件 */
  (e: 'column-toggle', key: string, visible: boolean): void
}

/**
 * 组件属性接口
 */
export interface EzTableProps<T extends RowData> {
  /** 表格配置 */
  config: EzTableConfig<T>
  /** 选中的行keys */
  checkedKeys?: (string | number)[]
  /** 展开的行keys */
  expandedKeys?: (string | number)[]

  /** 是否显示工具栏 */
  showToolbar?: boolean
  /** 是否显示搜索 */
  showSearch?: boolean
  /** 搜索占位符 */
  searchPlaceholder?: string
  /** 搜索框宽度 */
  searchWidth?: string
  /** 搜索值 */
  searchValue?: string

  /** 是否显示刷新按钮 */
  showRefresh?: boolean
  /** 是否显示表头字段选择器 */
  showColumnSelector?: boolean
  /** 是否显示高级筛选按钮 */
  showAdvancedFilter?: boolean
}

/**
 * 组件属性定义
 */
const props = withDefaults(defineProps<EzTableProps<T>>(), {
  checkedKeys: () => [],
  expandedKeys: () => [],
  showToolbar: true,
  showSearch: true,
  searchPlaceholder: '请输入搜索关键词',
  searchWidth: '220px',
  searchValue: '',
  showRefresh: true,
  showColumnSelector: true,
  showAdvancedFilter: true,
})

/**
 * 组件事件定义
 */
const emit = defineEmits<EzTableEmits<T>>()

/**
 * 图标组件引用
 */
const refresh = Refresh
const eye = Eye

/**
 * 表格引用
 */
const tableRef = ref()

/**
 * 内部选中的行keys（双向绑定）
 */
const internalCheckedKeys = ref<(string | number)[]>(props.checkedKeys)

/**
 * 内部展开的行keys（双向绑定）
 */
const internalExpandedKeys = ref<(string | number)[]>(props.expandedKeys)

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
 * 监听外部expandedKeys变化，同步到内部状态
 */
watch(
  () => props.expandedKeys,
  (newKeys) => {
    internalExpandedKeys.value = newKeys
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
function calculateTableScrollWidth(columns: EzTableConfig<T>['columns']): number {
  return columns.reduce((total, col) => {
    if (col.type === 'selection') {
      return total + 50
    }
    return total + Number(col.width || 0)
  }, 0)
}

/**
 * 计算属性：横向滚动
 * - 默认：自动按列宽计算总宽度（与 useCrud 的计算逻辑保持一致）
 * - 可通过 config.scrollX 覆盖
 */
const scrollX = computed(() => props.config.scrollX ?? calculateTableScrollWidth(columns.value))

/**
 * 计算属性：最大高度
 */
const maxHeight = computed(() => props.config.maxHeight ?? 'calc(100vh - 320px)')

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
const bordered = computed(() => props.config.bordered ?? true)

/**
 * 计算属性：底部边框
 */
const bottomBordered = computed(() => props.config.bottomBordered ?? true)

/**
 * 计算属性：单列模式
 */
const singleColumn = computed(() => props.config.singleColumn ?? false)

/**
 * 计算属性：树形结构
 */
const treeStructure = computed(() => props.config.treeStructure ?? false)

/**
 * 计算属性：子节点字段名
 */
const childrenKey = computed(() => props.config.childrenKey ?? 'children')

/**
 * 计算属性：是否默认展开所有行
 */
const defaultExpandAll = computed(() => props.config.defaultExpandAll ?? false)

/**
 * 计算属性：是否显示工具栏
 */
const showToolbar = computed(() => props.showToolbar)

/**
 * 计算属性：是否显示搜索
 */
const showSearch = computed(() => props.showSearch)

/**
 * 计算属性：搜索占位符
 */
const searchPlaceholder = computed(() => props.searchPlaceholder)

/**
 * 计算属性：搜索框宽度
 */
const searchWidth = computed(() => props.searchWidth)

/**
 * 计算属性：搜索值
 */
const searchValue = computed(() => props.searchValue)

/**
 * 计算属性：是否显示刷新按钮
 */
const showRefresh = computed(() => props.showRefresh)

/**
 * 计算属性：是否显示字段选择器
 */
const showColumnSelector = computed(() => props.showColumnSelector)

/**
 * 计算属性：是否显示高级筛选
 */
const showAdvancedFilter = computed(() => props.showAdvancedFilter)

/**
 * 计算属性：字段选项（用于字段选择器）
 */
const columnOptions = computed((): DropdownOption[] => {
  return columns.value
    .filter((col) => col.type !== 'selection' && 'key' in col)
    .map((col) => ({
      key: String((col as unknown as Record<string, unknown>).key || ''),
      label: String((col as unknown as Record<string, unknown>).title || ''),
    }))
    .filter((option) => option.key && option.key !== 'actions')
})

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

/**
 * 处理行展开改变事件
 */
const handleExpandedChange = (keys: (string | number)[]) => {
  internalExpandedKeys.value = keys
  emit('expand-change', keys)
}

/**
 * 处理搜索输入事件
 */
const handleSearchInput = (value: string) => {
  emit('search-input', value)
}

/**
 * 处理搜索事件
 */
const handleSearch = () => {
  emit('search', searchValue.value)
}

/**
 * 处理刷新事件
 */
const handleRefresh = () => {
  emit('refresh')
}

/**
 * 处理高级筛选事件
 */
const handleAdvancedFilter = () => {
  emit('advanced-filter')
}

/**
 * 处理字段显示切换事件
 */
const handleColumnToggle = (key: string) => {
  // 这里可以实现字段显示隐藏的逻辑
  // 暂时先发出事件，让父组件处理
  emit('column-toggle', key, true)
}
</script>

<style lang="scss" scoped></style>
