<template>
  <!-- 主要内容容器 -->
  <n-card title="部门管理">
    <template #header-extra>
      <!-- 操作按钮组 -->
      <EzButtonGroup :buttons="actionButtons" @action="handleAction" />
    </template>

    <!-- 部门列表表格 -->
    <EzTable
      :config="tableConfig"
      :checked-keys="checkedRowKeys"
      :expanded-keys="expandedKeys"
      :search-value="searchKeywords"
      search-placeholder="部门名称"
      @check-change="handleCheck"
      @expand-change="handleExpandChange"
      @search="handleSearch"
      @search-input="handleSearchInput"
      @refresh="handleRefresh"
      @advanced-filter="handleAdvancedFilter"
    />
  </n-card>

  <!-- 部门表单 -->
  <EzForm
    v-model="formVisible"
    :config="formConfig"
    :loading="formLoading"
    :form-data="formData"
    :options-map="fieldOptionsMap"
    @update:form-data="handleFormDataUpdate"
    @submit="handleFormSubmit"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCrud } from '@/hooks/useCrud'
import EzTable from '@/components/common/EzTable.vue'
import { deptConfig } from './'
import type { DeptListVO, DeptCreateDTO, DeptUpdateDTO, DeptQuery } from '@/types'
import type { EzTableConfig } from '@/hooks/types/table'

// ==================== CRUD Hook ====================
// 使用扁平化配置的 CRUD Hook（严格泛型）
const crud = useCrud<DeptListVO, DeptQuery, DeptCreateDTO, DeptUpdateDTO, DeptListVO>(deptConfig)

// 解构响应式数据和方法
const {
  loading,
  dataList: deptList,
  columns,
  checkedRowKeys,
  queryParams,
  fieldOptionsMap,
  expandedKeys,
  actionButtons,
} = crud

// 表单相关状态
const { formVisible, formLoading, formMode, formData, handleCancel, handleFormDataUpdate, handleSubmit } = crud

// 查询相关方法
const { resetPaginationAndLoad, loadDataList, handlePageAction } = crud

// ==================== 类型守卫和辅助函数 ====================

/**
 * 检查 queryParams 是否有 keywords 属性
 */
function hasKeywords(query: unknown): query is { keywords: string } {
  return typeof query === 'object' && query !== null && 'keywords' in query
}

/**
 * 获取搜索关键词
 */
function getSearchKeywords(query: unknown): string | undefined {
  if (hasKeywords(query)) {
    return query.keywords
  }
  return undefined
}

// ==================== 计算属性 ====================

// 搜索关键词（类型安全）
const searchKeywords = computed(() => getSearchKeywords(queryParams.value))

// 表格配置（树形结构模式）
const tableConfig = computed<EzTableConfig<DeptListVO>>(() => {
  const tableColumns = columns.value
  const tableData = deptList.value
  const tableLoading = loading.value

  return {
    columns: tableColumns,
    data: tableData,
    loading: tableLoading,
    rowKey: (row: DeptListVO) => row.deptId,
    remote: false,
    treeStructure: true,
    defaultExpandAll: false,
  }
})

// 表单配置（使用字段级联加载的数据）
const formConfig = computed(() => {
  if (!deptConfig.form) {
    return { title: '表单', fields: [] }
  }

  return {
    ...deptConfig.form,
    title: formMode.value === 'create' ? '新增部门' : '编辑部门',
  }
})

// ==================== 事件处理方法 ====================

// 搜索处理
const handleSearch = (value?: string) => {
  if (hasKeywords(queryParams.value)) {
    queryParams.value.keywords = value ?? ''
  }
  resetPaginationAndLoad()
}

// 搜索输入处理
const handleSearchInput = (value: string) => {
  if (hasKeywords(queryParams.value)) {
    queryParams.value.keywords = value
  }
}

// 刷新处理
const handleRefresh = () => {
  loadDataList()
}

// 高级筛选处理
const handleAdvancedFilter = () => {
  // TODO: 实现高级筛选功能
  console.log('高级筛选')
}

// 表单提交（成功后刷新列表）
const handleFormSubmit = async (data: Partial<DeptCreateDTO | DeptUpdateDTO>) => {
  await handleSubmit(data)
  await loadDataList()
}

// 表格行选择处理
const handleCheck = (keys: Array<string | number>) => {
  checkedRowKeys.value = keys
}

// 表格行展开处理
const handleExpandChange = (keys: Array<string | number>) => {
  expandedKeys.value = keys
}

// 统一的按钮处理函数（配置驱动）
const handleAction = (key: string) => {
  handlePageAction(key)
}

// ==================== 生命周期 ====================

// 组件挂载时加载数据
onMounted(async () => {
  await loadDataList()
})
</script>
