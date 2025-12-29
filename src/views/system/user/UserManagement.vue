<template>
  <!-- 搜索表单 -->
  <SimpleSearch
    v-model="queryParams.search.keywords"
    placeholder="请输入用户名、昵称或邮箱进行搜索"
    @search="handleSearch"
    @reset="handleReset"
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
    @cancel="handleFormCancel"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useTableConfig } from '@/hooks/useTableConfig'
import { userTableConfig, createUserActionButtons, createUserFormConfig } from './config'
import SimpleSearch from '@/components/common/SimpleSearch.vue'
import ActionButtonGroup from '@/components/common/ActionButtonGroup.vue'
import SimpleForm from '@/components/common/SimpleForm.vue'
import type { UserListVO, UserQuery, UserCreateDTO, UserUpdateDTO, UserDetailVO } from '@/types'
import { userApi } from '@/api/user'
import { message, dialog } from '@/hooks/useMessage'

// 查询参数
const queryParams = ref<UserQuery>({
  pageNum: 1,
  pageSize: 10,
  search: {
    keywords: '',
  },
})

// 使用通用表格配置
const tableConfig = useTableConfig<UserListVO>(userTableConfig)

// 解构获取需要的响应式数据
const {
  loading,
  dataList: userList,
  pagination,
  columns,
  tableScrollWidth,
  checkedRowKeys,
  handleCheck,
  handleSearch,
  handleReset,
  handlers,
} = tableConfig

// 表单状态管理
const formVisible = ref(false)
const formLoading = ref(false)
const formMode = ref<'create' | 'update'>('create')

// 类型安全的表单数据
const formData = reactive<UserCreateDTO | UserUpdateDTO>({} as UserCreateDTO | UserUpdateDTO)

// 计算表单配置
const formConfig = computed(() => createUserFormConfig(formMode.value))

// 加载用户列表函数
const loadUserList = async () => {
  try {
    loading.value = true
    // 同步分页参数到查询参数
    queryParams.value.pageNum = pagination.page
    queryParams.value.pageSize = pagination.pageSize || 10

    const res = await userApi.page(queryParams.value)
    userList.value = res.records
    // 设置总记录数到分页配置（确保类型为number）
    pagination.itemCount = Number(res.total)
  } catch (error) {
    console.error('加载用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 设置业务逻辑函数 - 直接赋值
handlers.loadData = loadUserList

// 设置重置搜索条件的逻辑
handlers.resetSearch = () => {
  queryParams.value.search.keywords = ''
}

handlers.handleEdit = async (row: UserListVO) => {
  try {
    // 获取用户详情数据
    const userDetail: UserDetailVO = await userApi.detail(row.userId)
    // 设置为编辑模式，填充表单数据并打开弹窗
    formMode.value = 'update'
    Object.assign(formData, {
      userId: userDetail.userId,
      username: userDetail.username,
      password: '', // 编辑时密码字段为空
      nickname: userDetail.nickname,
      email: userDetail.email,
      phoneNumber: userDetail.phoneNumber,
      gender: userDetail.gender,
      status: userDetail.status,
      deptId: userDetail.deptId,
    } as UserUpdateDTO)
    formVisible.value = true
  } catch (error) {
    console.error('获取用户详情失败:', error)
    message.error('获取用户详情失败')
  }
}

handlers.handleDelete = async (row: UserListVO) => {
  try {
    await dialog.warning({
      title: '删除确认',
      content: `确定要删除用户 "${row.username}" 吗？此操作不可撤销。`,
      positiveText: '确定删除',
      negativeText: '取消',
      onPositiveClick: async () => {
        await userApi.remove(row.userId)
        message.success(`删除用户 ${row.username} 成功`)
        loadUserList()
      },
    })
  } catch (error) {
    console.error('删除用户失败:', error)
  }
}


// 按钮处理函数
const handleAdd = async () => {
  try {
    // 设置为新增模式，重置表单数据并打开弹窗
    formMode.value = 'create'
    Object.assign(formData, {
      username: '',
      password: '',
      nickname: '',
      status: 1, // 默认启用
      gender: 1, // 默认男
    } as UserCreateDTO)
    formVisible.value = true
  } catch (error) {
    console.error('打开新增用户表单失败:', error)
  }
}

// 类型安全的表单数据更新处理
const handleFormDataUpdate = (data: Partial<UserCreateDTO | UserUpdateDTO>) => {
  Object.assign(formData, data)
}

// 类型安全的表单提交处理
const handleFormSubmit = async (data: Partial<UserCreateDTO | UserUpdateDTO>) => {
  try {
    formLoading.value = true

    if (formMode.value === 'create') {
      // 新增用户
      await userApi.create(data as UserCreateDTO)
      message.success('新增用户成功')
    } else {
      // 编辑用户
      let submitData = data as UserUpdateDTO
      // 如果密码为空，删除密码字段（表示不修改密码）
      if (!submitData.password || (typeof submitData.password === 'string' && submitData.password.trim() === '')) {
        const { password: _, ...restData } = submitData
        submitData = restData as UserUpdateDTO
      }
      await userApi.update(submitData as unknown as UserUpdateDTO)
      message.success('编辑用户成功')
    }

    formVisible.value = false
    loadUserList() // 刷新列表
  } catch (error) {
    console.error(`${formMode.value === 'create' ? '新增' : '编辑'}用户失败:`, error)
    message.error(`${formMode.value === 'create' ? '新增' : '编辑'}用户失败`)
  } finally {
    formLoading.value = false
  }
}

// 表单取消处理
const handleFormCancel = () => {
  formVisible.value = false
}

const handleBatchDelete = async () => {
  if (checkedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的用户')
    return
  }

  try {
    await dialog.warning({
      title: '批量删除确认',
      content: `确定要删除选中的 ${checkedRowKeys.value.length} 个用户吗？此操作不可撤销。`,
      positiveText: '确定删除',
      negativeText: '取消',
      onPositiveClick: async () => {
        await userApi.batchRemove(checkedRowKeys.value.map(id => String(id)))
        message.success(`成功删除 ${checkedRowKeys.value.length} 个用户`)
        checkedRowKeys.value = []
        loadUserList()
      },
    })
  } catch (error) {
    console.error('批量删除用户失败:', error)
  }
}

const handleExport = async () => {
  try {
    // TODO: 实现用户数据导出，通常需要调用导出接口下载文件
    message.success('导出用户数据功能待实现')
  } catch (error) {
    console.error('导出用户数据失败:', error)
  }
}

const handleRefresh = () => {
  message.success('刷新数据')
  loadUserList()
}


// 按钮配置 - 根据约定自动生成所有配置！
const actionButtons = createUserActionButtons({
  handleAdd,
  handleBatchDelete,
  handleExport,
  handleRefresh,
})

// 组件挂载时加载数据
onMounted(() => {
  loadUserList()
})
</script>

<style lang="scss" scoped></style>
