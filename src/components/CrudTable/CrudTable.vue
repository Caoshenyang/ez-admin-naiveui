<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import {
  NDataTable,
  NPagination,
  NSpace,
  NButton,
  NButtonGroup,
  NPopconfirm,
  NConfigProvider
} from 'naive-ui'
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import type { PageParams } from '@/types/api'

interface Props {
  // 列配置
  columns: DataTableColumns
  // 数据加载函数
  request: (params: PageParams) => Promise<{ list: any[]; total: number }>
  // 是否显示序号列
  showIndex?: boolean
  // 是否显示复选框
  showCheckbox?: boolean
  // 是否分页
  showPagination?: boolean
  // 每页条数选项
  pageSizes?: number[]
  // 初始每页条数
  pageSize?: number
  // 是否自动加载
  autoLoad?: boolean
  // 操作列配置
  actions?: {
    label: string
    type?: 'default' | 'info' | 'success' | 'warning' | 'error'
    icon?: any
    show?: (row: any) => boolean
    onClick: (row: any) => void
  }[]
}

const props = withDefaults(defineProps<Props>(), {
  showIndex: true,
  showCheckbox: false,
  showPagination: true,
  pageSizes: () => [10, 20, 30, 50, 100],
  pageSize: 10,
  autoLoad: true
})

const emit = defineEmits<{
  (e: 'register', instance: any): void
  (e: 'selectionChange', keys: DataTableRowKey[], rows: any[]): void
}>()

// 状态
const loading = ref(false)
const dataSource = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const currentPageSize = ref(props.pageSize)
const selectedRowKeys = ref<DataTableRowKey[]>([])
const selectedRows = ref<any[]>([])

// 表格列
const tableColumns = computed(() => {
  const cols: any[] = [...props.columns]

  // 添加序号列
  if (props.showIndex) {
    cols.unshift({
      type: 'index',
      width: 60,
      title: '序号'
    })
  }

  // 添加操作列
  if (props.actions && props.actions.length > 0) {
    cols.push({
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right' as const,
      render(row: any) {
        return h(
          NButtonGroup,
          {},
          {
            default: () =>
              props.actions!.map(action => {
                if (action.show && !action.show(row)) return null
                return h(
                  NButton,
                  {
                    size: 'small',
                    type: action.type || 'default',
                    onClick: () => action.onClick(row)
                  },
                  {
                    default: () => action.label,
                    icon: () => (action.icon ? h(action.icon) : null)
                  }
                )
              })
          }
        )
      }
    })
  }

  return cols
})

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const res = await props.request({
      page: currentPage.value,
      pageSize: currentPageSize.value
    })
    dataSource.value = res.list || []
    total.value = res.total || 0
  } catch (error) {
    console.error('Load data error:', error)
    dataSource.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 刷新
function refresh() {
  loadData()
}

// 重置
function reset() {
  currentPage.value = 1
  loadData()
}

// 分页改变
function handlePageChange(page: number) {
  currentPage.value = page
  loadData()
}

// 每页条数改变
function handlePageSizeChange(pageSize: number) {
  currentPageSize.value = pageSize
  currentPage.value = 1
  loadData()
}

// 选中行改变
function handleSelectionChange(keys: DataTableRowKey[], rows: any[]) {
  selectedRowKeys.value = keys
  selectedRows.value = rows
  emit('selectionChange', keys, rows)
}

// 清空选中
function clearSelection() {
  selectedRowKeys.value = []
  selectedRows.value = []
}

// 暴露实例方法
const instance = {
  refresh,
  reset,
  clearSelection,
  loadData
}

// 监听分页变化
watch(() => props.pageSize, val => {
  if (val) {
    currentPageSize.value = val
  }
})

// 组件挂载
onMounted(() => {
  emit('register', instance)
  if (props.autoLoad) {
    loadData()
  }
})
</script>

<template>
  <div class="crud-table">
    <n-data-table
      :columns="tableColumns"
      :data="dataSource"
      :loading="loading"
      :row-key="(row: any) => row.id"
      :scroll-x="1200"
      :max-height="600"
      :single-line="false"
      :checked-row-keys="showCheckbox ? selectedRowKeys : undefined"
      @update:checked-row-keys="handleSelectionChange"
    />

    <div v-if="showPagination" class="pagination">
      <n-pagination
        v-model:page="currentPage"
        :page-count="Math.ceil(total / currentPageSize)"
        :page-size="currentPageSize"
        :page-sizes="pageSizes"
        show-size-picker
        :item-count="total"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
.crud-table {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
