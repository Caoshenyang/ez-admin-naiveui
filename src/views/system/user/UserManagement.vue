<template>
  <!-- 搜索表单 -->
  <SimpleSearch
    v-model="queryParams.search.keywords"
    placeholder="请输入用户名、昵称或邮箱进行搜索"
    @search="handleSearch"
    @reset="handleReset"
  />

  <!-- 操作按钮组 -->
  <div class="flex justify-end mb-4">
    <n-space size="small">
      <n-button type="primary" size="small" @click="handleAdd">
        <template #icon>
          <n-icon size="18">
            <plus-outlined />
          </n-icon>
        </template>
        新增
      </n-button>
      <n-button type="warning" size="small" @click="handleBatchDelete">
        <template #icon>
          <n-icon size="18">
            <trash-outline />
          </n-icon>
        </template>
        批量删除
      </n-button>
      <n-button type="info" size="small" @click="handleExport">
        <template #icon>
          <n-icon size="18">
            <download-outlined />
          </n-icon>
        </template>
        导出
      </n-button>
      <n-button size="small" @click="handleRefresh">
        <template #icon>
          <n-icon size="18">
            <sync-outline />
          </n-icon>
        </template>
        刷新
      </n-button>
    </n-space>
  </div>

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
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useTableConfig } from '@/hooks/useTableConfig'
import { userTableConfig } from './userTableConfig'
import SimpleSearch from '@/components/common/SimpleSearch.vue'
import type { UserListVO, UserQuery } from '@/types'
import { userApi } from '@/api/user'
import { message } from '@/hooks/useMessagehook'
import { SyncOutline, TrashOutline } from '@vicons/ionicons5'
import { DownloadOutlined, PlusOutlined } from '@vicons/antd'

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

// 按钮处理函数
const handleAdd = () => {
  message.info('新增用户')
  // TODO: 实现新增逻辑
}

const handleBatchDelete = () => {
  if (checkedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的用户')
    return
  }
  message.warning(`批量删除 ${checkedRowKeys.value.length} 个用户`)
  // TODO: 实现批量删除逻辑
}

const handleExport = () => {
  message.info('导出用户数据')
  // TODO: 实现导出逻辑
}

const handleRefresh = () => {
  message.success('刷新数据')
  loadUserList()
}

// 搜索处理函数
const handleSearch = () => {
  // 重置页码到第一页
  pagination.page = 1
  queryParams.value.pageNum = 1
  // 重新加载数据
  loadUserList()
}

// 重置搜索条件
const handleReset = () => {
  queryParams.value.search.keywords = ''
  // 重置页码到第一页
  pagination.page = 1
  queryParams.value.pageNum = 1
  // 重新加载数据
  loadUserList()
}

// 组件挂载时加载数据
onMounted(() => {
  loadUserList()
})
</script>

<style lang="scss" scoped></style>
