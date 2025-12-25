<template>
  <!-- 部门列表表格 -->
  <n-data-table
    striped
    remote
    :columns="columns"
    :data="deptList"
    :loading="loading"
    :pagination="pagination"
    :checked-row-keys="checkedRowKeys"
    :row-key="(row) => row.deptId"
    :scroll-x="tableScrollWidth"
    max-height="calc(100vh - 250px)"
    @update:checked-row-keys="handleCheck"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useTableConfig } from '@/hooks/useTableConfig'
import { deptTableConfig } from './deptTableConfig'
import type { DeptListVO, DeptQuery } from '@/types'
import { deptApi } from '@/api/dept'
import { message } from '@/hooks/useMessagehook'

// 查询参数
const queryParams = ref<DeptQuery>({
  pageNum: 1,
  pageSize: 10,
  search: {
    deptName: '',
    status: undefined,
  },
})

// 加载部门列表函数
const loadDeptList = async () => {
  try {
    loading.value = true
    // 同步分页参数到查询参数
    queryParams.value.pageNum = pagination.page
    queryParams.value.pageSize = pagination.pageSize || 10

    const res = await deptApi.page(queryParams.value)
    deptList.value = res.records
    // 设置总记录数到分页配置（确保类型为number）
    pagination.itemCount = Number(res.total)
  } catch (error) {
    message.error('加载部门列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 使用通用表格配置
const tableConfig = useTableConfig<DeptListVO>(deptTableConfig)

// 解构获取需要的响应式数据
const {
  loading,
  dataList: deptList,
  pagination,
  columns,
  tableScrollWidth,
  checkedRowKeys,
  handleCheck,
  handlers,
} = tableConfig

// 设置业务逻辑函数 - 直接赋值
handlers.loadData = loadDeptList

handlers.handleEdit = (row: DeptListVO) => {
  message.info(`编辑部门: ${row.deptName}`)
  // TODO: 实现编辑逻辑
}

handlers.handleDelete = (row: DeptListVO) => {
  message.warning(`删除部门: ${row.deptName}`)
  // TODO: 实现删除逻辑
}

// 组件挂载时加载数据
onMounted(() => {
  loadDeptList()
})
</script>

<style lang="scss" scoped></style>
