<template>
  <!-- 搜索表单 -->
  <EzSearch
    v-model="queryParams.search.keywords"
    placeholder="请输入用户名、昵称或邮箱进行搜索"
    @search="handleSearch"
    @reset="handleResetSearch"
  />

  <!-- 操作按钮组 -->
  <EzButtonGroup :buttons="userActionButtons" @action="handleAction" />

  <!-- 用户列表表格 -->
  <EzTable :config="tableConfig" :checked-keys="checkedRowKeys" @check-change="handleCheck" />

  <!-- 用户表单 -->
  <EzForm
    v-model="formVisible"
    :config="formConfig"
    :loading="formLoading"
    :form-data="formData"
    @update:form-data="handleFormDataUpdate"
    @submit="handleFormSubmit"
    @cancel="handleCancel"
  />

  <!-- 用户详情模态框 -->
  <EzDetailModal
    v-model:show="detailVisible"
    :data="detailData"
    :config="userCrudConfig.detailConfig"
    :loading="detailLoading"
  />
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useCrud, createDefaultQueryParams } from '@/hooks/useCrud'
import { handleButtonActions } from '@/utils/actionHandler'
import EzTable from '@/components/common/EzTable.vue'
import EzDetailModal from '@/components/common/EzDetailModal.vue'
import { userFormConfig, userActionButtons, userCrudConfig } from './'
import type { UserListVO, UserQuery, UserCreateDTO, UserUpdateDTO } from '@/types'
import type { EzTableConfig } from '@/hooks/types/table'

// === 查询参数管理 ===
const queryParams = ref<UserQuery>(
  createDefaultQueryParams<UserQuery>({
    keywords: '',
  }),
)

// === 使用CRUD Hook（约定：自动处理所有CRUD逻辑，包含表格） ===
const crud = useCrud(userCrudConfig)

// === 解构响应式数据和方法（按功能分组） ===

// 表格相关状态
const { loading, dataList: userList, columns, checkedRowKeys } = crud

// 表单相关状态
const { formVisible, formLoading, formMode, formData, handleCancel, handleFormDataUpdate } = crud

// 详情相关状态
const { detailVisible, detailLoading, detailData } = crud

// 查询相关方法
const { handleSearch, handleReset, setLoadData } = crud

// CRUD操作方法
const { handleAdd, handleSubmit, handleBatchDelete } = crud

// 表格配置
const tableConfig = computed<EzTableConfig<UserListVO>>(() => ({
  columns: columns.value,
  data: userList.value,
  loading: loading.value,
  rowKey: (row: UserListVO) => row.userId,
  // scrollX 默认：自动按列宽计算总宽度
  // maxHeight 默认：'calc(100vh - 320px)'
  // bordered/striped/remote 均使用默认值，不需要显式设置
}))

// === 计算属性 ===
const formConfig = computed(() => ({
  ...userFormConfig,
  title: formMode.value === 'create' ? '新增用户' : '编辑用户',
  fields: userFormConfig.fields.map((field) => {
    if (formMode.value === 'create') {
      return field
    } else {
      switch (field.key) {
        case 'username':
          return { ...field, disabled: true }
        default:
          return field
      }
    }
  }),
}))

// === 数据加载（集成表格分页和查询参数） ===
const loadUserList = async () => {
  // 同步分页参数到查询参数
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

// === 表格行选择处理 ===
const handleCheck = (keys: (string | number)[]) => {
  checkedRowKeys.value = keys
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

// === 按钮action处理器 ===
const handleAction = handleButtonActions({
  add: handleAdd, // 新增按钮 -> 打开新增表单
  'batch-delete': handleBatchDeleteClick, // 批量删除按钮 -> 执行批量删除
  refresh: handleRefresh, // 刷新按钮 -> 刷新数据列表
})

// === 组件挂载时加载数据 ===
onMounted(() => {
  loadUserList()
})
</script>
