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
import { ref, computed, onMounted } from 'vue'
import { createUserTableColumns, createPagination, calculateTableScrollWidth } from './userTableConfig'
import type { UserListVO, UserQuery } from '@/types'
import { userApi } from '@/api/user'
import { message } from '@/hooks/useMessagehook'

// 响应式数据
const loading = ref(false)
const userList = ref<UserListVO[]>([])
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

// 处理编辑用户
const handleEdit = (row: UserListVO) => {
  message.info(`编辑用户: ${row.username}`)
  // TODO: 实现编辑逻辑
}

// 处理删除用户
const handleDelete = (row: UserListVO) => {
  message.warning(`删除用户: ${row.username}`)
  // TODO: 实现删除逻辑
}

// 加载用户列表
const loadUserList = async () => {
  try {
    loading.value = true
    // 同步分页参数到查询参数
    queryParams.value.pageNum = pagination.page
    queryParams.value.pageSize = pagination.pageSize

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

// 分页配置
const pagination = createPagination(loadUserList)

// 表格列配置
const columns = createUserTableColumns(handleEdit, handleDelete)

// 动态计算表格总宽度
const tableScrollWidth = computed(() => calculateTableScrollWidth(columns))

// 选中用户行的处理函数
const checkedRowKeys = ref<Array<string | number>>([])

function handleCheck(keys: Array<string | number>) {
  checkedRowKeys.value = keys
  console.log(checkedRowKeys.value)
}

// 组件挂载时加载数据
onMounted(() => {
  loadUserList()
})
</script>

<style lang="scss" scoped></style>
