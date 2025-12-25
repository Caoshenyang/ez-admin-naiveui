<template>
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
    max-height="calc(100vh - 250px)"
    @update:checked-row-keys="handleCheck"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useTableConfig } from '@/hooks/useTableConfig'
import { userTableConfig } from './userTableConfig'
import type { UserListVO, UserQuery } from '@/types'
import { userApi } from '@/api/user'
import { message } from '@/hooks/useMessagehook'

// 查询参数
const queryParams = ref<UserQuery>({
  pageNum: 1,
  pageSize: 10,
  search: {
    username: '',
    nickname: '',
    deptId: undefined,
    status: undefined,
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
  handlers,
} = tableConfig

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
    message.error('加载用户列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 设置业务逻辑函数 - 直接赋值
handlers.loadData = loadUserList

handlers.handleEdit = (row: UserListVO) => {
  message.info(`编辑用户: ${row.username}`)
  // TODO: 实现编辑逻辑
}

handlers.handleDelete = (row: UserListVO) => {
  message.warning(`删除用户: ${row.username}`)
  // TODO: 实现删除逻辑
}

// 组件挂载时加载数据
onMounted(() => {
  loadUserList()
})
</script>

<style lang="scss" scoped>

</style>
