<template>
  <!-- 搜索表单 -->
  <EzSearch
    v-model="queryParams.search.keywords"
    placeholder="请输入部门名称进行搜索"
    @search="handleSearch"
    @reset="handleResetSearch"
  />

  <!-- 操作按钮组 -->
  <EzButtonGroup :buttons="deptActionButtons" @action="handleAction" />

  <!-- 部门列表表格 -->
  <EzTable :config="tableConfig" :checked-keys="checkedRowKeys" @check-change="handleCheck" />

  <!-- 部门表单 -->
  <EzForm
    v-model="formVisible"
    :config="formConfig"
    :loading="formLoading"
    :form-data="formData"
    @update:form-data="handleFormDataUpdate"
    @submit="handleFormSubmit"
    @cancel="handleCancel"
  />

  <!-- 部门详情模态框 -->
  <EzDetailModal
    v-model:show="detailVisible"
    :data="detailData"
    :config="deptCrudConfig.detailConfig"
    :loading="detailLoading"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCrud, createDefaultQueryParams } from '@/hooks/useCrud'
import { handleButtonActions } from '@/utils/actionHandler'
import EzTable from '@/components/common/EzTable.vue'
import EzDetailModal from '@/components/common/EzDetailModal.vue'
import { deptFormConfig, deptActionButtons, deptCrudConfig } from './'
import type { DeptListVO, DeptQuery, DeptCreateDTO, DeptUpdateDTO } from '@/types'
import type { EzTableConfig } from '@/hooks/types/table'

// === 查询参数管理 ===
const queryParams = ref<DeptQuery>(
  createDefaultQueryParams<DeptQuery>({
    keywords: '',
  }),
)

// === 使用CRUD Hook（约定：自动处理所有CRUD逻辑，包含表格） ===
const crud = useCrud(deptCrudConfig)

// === 解构响应式数据和方法（按功能分组） ===

// 表格相关状态
const { loading, dataList: deptList, pagination, columns, tableScrollWidth, checkedRowKeys } = crud

// 表单相关状态
const { formVisible, formLoading, formMode, formData, handleCancel, handleFormDataUpdate } = crud

// 详情相关状态
const { detailVisible, detailLoading, detailData } = crud

// 查询相关方法
const { handleSearch, handleReset, setLoadData } = crud

// CRUD操作方法
const { handleAdd, handleSubmit, handleBatchDelete } = crud

// 表格配置
const tableConfig = computed<EzTableConfig<DeptListVO>>(() => ({
  columns: columns.value,
  data: deptList.value,
  loading: loading.value,
  pagination: pagination,
  rowKey: (row: DeptListVO) => row.id,
  scrollX: tableScrollWidth.value,
  maxHeight: 'calc(100vh - 320px)',
  bordered: true,
  striped: true,
  remote: true,
}))

// === 计算属性 ===
const formConfig = computed(() => ({
  ...deptFormConfig,
  title: formMode.value === 'create' ? '新增部门' : '编辑部门',
  fields: deptFormConfig.fields.map((field) => {
    if (formMode.value === 'create') {
      return field
    } else {
      switch (field.key) {
        default:
          return field
      }
    }
  }),
}))

// === 数据加载（集成表格分页和查询参数） ===
const loadDeptList = async () => {
  // 同步分页参数到查询参数
  queryParams.value.pageNum = pagination.page
  queryParams.value.pageSize = pagination.pageSize || 10
  await crud.loadData(queryParams.value)
}

// === 设置加载数据函数（约定：通过配置驱动） ===
setLoadData(loadDeptList)


const handleResetSearch = () => {
  queryParams.value.search.keywords = ''
  handleReset()
}

// === 表单提交（成功后刷新列表） ===
const handleFormSubmit = async (data: Partial<DeptCreateDTO | DeptUpdateDTO>) => {
  await handleSubmit(data)
  await loadDeptList() // 刷新列表
}

// === 表格行选择处理 ===
const handleCheck = (keys: (string | number)[]) => {
  checkedRowKeys.value = keys
}

// === 批量删除（集成表格选中状态） ===
const handleBatchDeleteClick = async () => {
  const ids = checkedRowKeys.value.map((id) => String(id))
  await handleBatchDelete(ids, async () => {
    checkedRowKeys.value = []
    await loadDeptList()
  })
}

// === 按钮action处理器 ===
const handleAction = handleButtonActions({
  add: handleAdd, // 新增按钮 -> 打开新增表单
  'batch-delete': handleBatchDeleteClick, // 批量删除按钮 -> 执行批量删除
  refresh: () => loadDeptList(), // 刷新按钮 -> 刷新数据列表
})

// === 组件挂载时加载数据 ===
onMounted(() => {
  loadDeptList()
})
</script>

