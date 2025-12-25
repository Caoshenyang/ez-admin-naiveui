<template>
  <!-- 搜索表单 -->
  <n-card class="mb-4">
    <n-form
      :show-feedback="false"
      :model="queryParams.search"
      label-placement="left"
      label-width="80"
    >
      <!-- 主要搜索条件（前4个） -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <n-form-item label="用户名" path="username">
          <n-input
            v-model:value="queryParams.search.username"
            placeholder="请输入用户名"
            clearable
            @keydown.enter="handleSearch"
          />
        </n-form-item>
        <n-form-item label="昵称" path="nickname">
          <n-input
            v-model:value="queryParams.search.nickname"
            placeholder="请输入昵称"
            clearable
            @keydown.enter="handleSearch"
          />
        </n-form-item>
        <n-form-item label="部门" path="deptId">
          <n-select
            v-model:value="queryParams.search.deptId"
            placeholder="请选择部门"
            clearable
            :options="deptOptions"
          />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-select
            v-model:value="queryParams.search.status"
            placeholder="请选择状态"
            clearable
            :options="statusOptions"
          />
        </n-form-item>
      </div>

      <!-- 额外的搜索条件 - 当有更多条件时使用 -->
      <transition
        name="search-expand"
        enter-active-class="transition-all duration-300 ease-in-out"
        leave-active-class="transition-all duration-200 ease-in-out"
        enter-from-class="opacity-0 max-h-0 overflow-hidden"
        enter-to-class="opacity-100 max-h-96 overflow-hidden"
        leave-from-class="opacity-100 max-h-96 overflow-hidden"
        leave-to-class="opacity-0 max-h-0 overflow-hidden"
      >
        <div
          v-show="searchExpanded && totalSearchFields > 4"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
        >
          <n-form-item label="性别" path="gender">
            <n-select
              v-model:value="queryParams.search.gender"
              placeholder="请选择性别"
              clearable
              :options="genderOptions"
            />
          </n-form-item>
          <n-form-item label="邮箱" path="email">
            <n-input
              v-model:value="queryParams.search.email"
              placeholder="请输入邮箱"
              clearable
              @keydown.enter="handleSearch"
            />
          </n-form-item>
          <!-- 预留位置给未来可能的更多搜索条件 -->
          <div></div>
          <div></div>
        </div>
      </transition>

      <div class="flex justify-end items-center gap-3">
        <n-button @click="handleReset">重置</n-button>
        <n-button type="primary" @click="handleSearch">搜索</n-button>
        <n-button
          v-if="showExpandButton"
          text
          @click="toggleSearchExpanded"
          class="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <n-icon :component="searchExpanded ? ChevronUp : ChevronDown" size="16" />
          <span>{{ searchExpanded ? '收起' : '展开' }}</span>
        </n-button>
      </div>
    </n-form>
  </n-card>

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
    max-height="calc(100vh - 350px)"
    @update:checked-row-keys="handleCheck"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { ChevronDown, ChevronUp } from '@vicons/ionicons5'
import { useTableConfig } from '@/hooks/useTableConfig'
import { userTableConfig } from './userTableConfig'
import type { UserListVO, UserQuery } from '@/types'
import { userApi } from '@/api/user'
import { message } from '@/hooks/useMessagehook'
import type { SelectOption } from 'naive-ui'

// 搜索条件总数
const totalSearchFields = 6

// 搜索表单展开状态 - 当条件总数 <= 4时默认展开，不显示按钮
const searchExpanded = ref(totalSearchFields <= 4)
const showExpandButton = computed(() => totalSearchFields > 4)

// 查询参数
const queryParams = ref<UserQuery>({
  pageNum: 1,
  pageSize: 10,
  search: {
    username: '',
    nickname: '',
    deptId: undefined,
    gender: undefined,
    status: undefined,
    email: '',
  },
})

// 部门选项（暂时使用模拟数据，后续可从API获取）
const deptOptions = computed<SelectOption[]>(() => [
  { label: '技术部', value: 1 },
  { label: '产品部', value: 2 },
  { label: '设计部', value: 3 },
  { label: '运营部', value: 4 },
])

// 性别选项
const genderOptions = computed<SelectOption[]>(() => [
  { label: '男', value: 0 },
  { label: '女', value: 1 },
])

// 状态选项
const statusOptions = computed<SelectOption[]>(() => [
  { label: '正常', value: 0 },
  { label: '禁用', value: 1 },
])

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

// 切换搜索表单展开状态
const toggleSearchExpanded = () => {
  searchExpanded.value = !searchExpanded.value
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
  queryParams.value.search = {
    username: '',
    nickname: '',
    deptId: undefined,
    gender: undefined,
    status: undefined,
    email: '',
  }
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
