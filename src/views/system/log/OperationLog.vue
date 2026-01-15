<script setup lang="ts">
import { h, ref, onMounted } from 'vue'
import { NCard, NSpace, NButton, NInput, NSelect, NTag, NDataTable, NDatePicker } from 'naive-ui'

// 搜索参数
const searchParams = ref({
  module: '',
  operation: '',
  username: '',
  startTime: null,
  endTime: null,
  status: null
})

// 表格数据
const loading = ref(false)
const dataSource = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟数据
function mockLoadData() {
  loading.value = true
  setTimeout(() => {
    dataSource.value = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      module: '用户管理',
      operation: '新增用户',
      method: 'POST',
      requestUrl: '/system/user',
      ip: '192.168.1.100',
      location: '广东省深圳市',
      browser: 'Chrome 120',
      os: 'Windows 11',
      status: i % 3 === 0 ? 0 : 1,
      errorMsg: i % 3 === 0 ? '参数错误' : '',
      costTime: Math.floor(Math.random() * 1000) + 50,
      createTime: new Date().toISOString()
    }))
    total.value = 100
    loading.value = false
  }, 500)
}

/**
 * 搜索
 */
function handleSearch() {
  currentPage.value = 1
  mockLoadData()
}

/**
 * 重置
 */
function handleReset() {
  searchParams.value = {
    module: '',
    operation: '',
    username: '',
    startTime: null,
    endTime: null,
    status: '' as string | ''
  }
  currentPage.value = 1
  mockLoadData()
}

/**
 * 查看详情
 */
function handleDetail(row: any) {
  console.log('查看详情:', row)
}

/**
 * 分页改变
 */
function handlePageChange(page: number) {
  currentPage.value = page
  mockLoadData()
}

/**
 * 每页条数改变
 */
function handlePageSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  mockLoadData()
}

// 状态选项
const statusOptions = [
  { label: '全部', value: '' },
  { label: '成功', value: '1' },
  { label: '失败', value: '0' }
]

// 表格列
const columns = [
  { title: '模块', key: 'module', width: 120 },
  { title: '操作类型', key: 'operation', width: 120 },
  { title: '请求方式', key: 'method', width: 100 },
  {
    title: '操作状态',
    key: 'status',
    width: 100,
    render(row: any) {
      return h(
        NTag,
        { type: row.status === 1 ? 'success' : 'error', size: 'small' },
        { default: () => (row.status === 1 ? '成功' : '失败') }
      )
    }
  },
  { title: 'IP地址', key: 'ip', width: 140 },
  { title: '操作地点', key: 'location', width: 150 },
  { title: '浏览器', key: 'browser', width: 120 },
  { title: '耗时(ms)', key: 'costTime', width: 100 },
  { title: '操作时间', key: 'createTime', width: 180 },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    fixed: 'right' as const,
    render(row: any) {
      return h(
        NButton,
        {
          size: 'small',
          type: 'info',
          onClick: () => handleDetail(row)
        },
        { default: () => '详情' }
      )
    }
  }
]

onMounted(() => {
  mockLoadData()
})
</script>

<template>
  <div class="log-management">
    <n-card title="操作日志" :bordered="false">
      <!-- 搜索表单 -->
      <n-space :size="12" style="margin-bottom: 16px" wrap>
        <n-input
          v-model:value="searchParams.module"
          placeholder="请输入模块名称"
          clearable
          style="width: 200px"
        />
        <n-input
          v-model:value="searchParams.operation"
          placeholder="请输入操作类型"
          clearable
          style="width: 200px"
        />
        <n-input
          v-model:value="searchParams.username"
          placeholder="请输入操作人"
          clearable
          style="width: 200px"
        />
        <n-select
          v-model:value="searchParams.status"
          :options="statusOptions"
          placeholder="请选择状态"
          style="width: 150px"
        />
        <n-button type="primary" @click="handleSearch">搜索</n-button>
        <n-button @click="handleReset">重置</n-button>
      </n-space>

      <!-- 表格 -->
      <n-data-table
        :columns="columns"
        :data="dataSource"
        :loading="loading"
        :row-key="row => row.id"
        :scroll-x="1400"
        :max-height="600"
        :single-line="false"
      />

      <!-- 分页 -->
      <div class="pagination">
        <n-pagination
          v-model:page="currentPage"
          :page-count="Math.ceil(total / pageSize)"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 50, 100]"
          show-size-picker
          :item-count="total"
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
        />
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.log-management {
  padding: 16px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
