<template>
  <!-- 搜索表单 -->
  <SimpleSearch
    v-model="queryParams.search.keywords"
    placeholder="请输入用户名、昵称或邮箱进行搜索"
    @search="handleSearch"
    @reset="handleResetSearch"
  />

  <!-- 操作按钮组 -->
  <ActionButtonGroup :buttons="actionButtons" />

  <!-- 用户列表表格 -->
  <n-data-table
    striped
    remote
    :columns="columns"
    :data="userList"
    :loading="loading"
    :pagination="pagination"
    :checked-row-keys="checkedRowKeys"
    :row-key="(row) => row.userId"
    :scroll-x="tableScrollWidth"
    max-height="calc(100vh - 320px)"
    @update:checked-row-keys="handleCheck"
  />

  <!-- 用户表单 -->
  <SimpleForm
    v-model="formVisible"
    :config="formConfig"
    :loading="formLoading"
    :form-data="formData"
    @update:form-data="handleFormDataUpdate"
    @submit="handleFormSubmit"
    @cancel="handleCancel"
  />
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useCrud } from '@/hooks/useCrud'
import { createUserFormConfig, userActionButtons, userCrudConfig } from './config'
import type { UserListVO, UserDetailVO, UserQuery, UserCreateDTO, UserUpdateDTO } from '@/types'

// === 查询参数管理 ===
const queryParams = ref<UserQuery>(userCrudConfig.queryParams)

// === 使用CRUD Hook（约定：自动处理所有CRUD逻辑，包含表格） ===
const crud = useCrud<
  UserListVO,
  UserQuery,
  UserCreateDTO,
  UserUpdateDTO,
  UserDetailVO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
>(userCrudConfig as any)

// === 解构需要的响应式数据和方法 ===
const {
  loading,
  dataList: userList,
  pagination,
  columns,
  tableScrollWidth,
  checkedRowKeys,
  formVisible,
  formLoading,
  formMode,
  formData,
  handleAdd,
  handleSubmit,
  handleBatchDelete,
  handleCancel,
  handleFormDataUpdate,
  handleCheck,
  handleSearch,
  handleReset,
  setLoadData,
} = crud

// === 计算属性 ===
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formConfig = computed(() => createUserFormConfig(formMode.value) as any)

// === 数据加载（集成表格分页和查询参数） ===
const loadUserList = async () => {
  // 同步分页参数到查询参数
  queryParams.value.pageNum = pagination.page
  queryParams.value.pageSize = pagination.pageSize || 10
  await crud.loadData(queryParams.value)
}

// === 设置加载数据函数（约定：通过配置驱动） ===
setLoadData(loadUserList)

const handleResetSearch = () => {
  queryParams.value.search.keywords = ''
  handleReset()
}

// === 表单提交（成功后刷新列表） ===
const handleFormSubmit = async (data: Partial<UserCreateDTO | UserUpdateDTO>) => {
  await handleSubmit(data)
  await loadUserList() // 刷新列表
}

// === 批量删除（集成表格选中状态） ===
const handleBatchDeleteClick = async () => {
  const ids = checkedRowKeys.value.map((id) => String(id))
  await handleBatchDelete(ids, async () => {
    checkedRowKeys.value = []
    await loadUserList()
  })
}

// === 刷新功能 ===
const handleRefresh = () => {
  loadUserList()
}

// === 按钮配置（约定：通过配置自动生成） ===
const actionButtons = userActionButtons.map((btn) => {
  const keyToHandlerMap: Record<string, () => void | Promise<void>> = {
    add: handleAdd,
    'batch-delete': handleBatchDeleteClick,
    refresh: handleRefresh,
  }
  return {
    ...btn,
    onClick: keyToHandlerMap[btn.key] || (() => {}),
  }
})

// === 组件挂载时加载数据 ===
onMounted(() => {
  loadUserList()
})
</script>

<style lang="scss" scoped></style>
