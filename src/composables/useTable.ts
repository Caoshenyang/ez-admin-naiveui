import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import type { PageParams, PageResponse } from '@/types/api'

/**
 * 表格 Hook
 */
export function useTable<T = any>(loadDataFn: (params: PageParams) => Promise<PageResponse<T>>) {
  // 表格数据
  const loading = ref(false)
  const dataSource = ref<T[]>([])
  const total = ref(0)

  // 分页参数
  const currentPage = ref(1)
  const pageSize = ref(10)
  const pageSizes = [10, 20, 30, 50, 100]

  // 搜索参数
  const searchParams = ref<Record<string, any>>({})

  // 选中的行
  const selectedRowKeys = ref<(string | number)[]>([])
  const selectedRows = ref<T[]>([])

  // 计算分页参数
  const pageParams = computed<PageParams>(() => ({
    page: currentPage.value,
    pageSize: pageSize.value
  }))

  /**
   * 加载数据
   */
  async function load() {
    loading.value = true
    try {
      const res = await loadDataFn({
        ...pageParams.value,
        ...searchParams.value
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

  /**
   * 搜索
   */
  function handleSearch(params: Record<string, any>) {
    searchParams.value = params
    currentPage.value = 1
    load()
  }

  /**
   * 重置
   */
  function handleReset() {
    searchParams.value = {}
    currentPage.value = 1
    load()
  }

  /**
   * 刷新
   */
  function handleRefresh() {
    load()
  }

  /**
   * 分页改变
   */
  function handlePageChange(page: number) {
    currentPage.value = page
    load()
  }

  /**
   * 每页条数改变
   */
  function handlePageSizeChange(size: number) {
    pageSize.value = size
    currentPage.value = 1
    load()
  }

  /**
   * 选中行改变
   */
  function handleSelectionChange(keys: (string | number)[], rows: T[]) {
    selectedRowKeys.value = keys
    selectedRows.value = rows
  }

  /**
   * 清空选中
   */
  function clearSelection() {
    selectedRowKeys.value = []
    selectedRows.value = []
  }

  return {
    // 状态
    loading,
    dataSource,
    total,
    currentPage,
    pageSize,
    pageSizes,
    selectedRowKeys,
    selectedRows,
    // 方法
    load,
    handleSearch,
    handleReset,
    handleRefresh,
    handlePageChange,
    handlePageSizeChange,
    handleSelectionChange,
    clearSelection
  }
}
