<script setup lang="ts">
import { ref, h } from 'vue'
import { NButton, NTag, NBadge, NSpace, useMessage, type DataTableColumns } from 'naive-ui'
import EzTable from '@/components/EzTable.vue'

const message = useMessage()

// 用户数据接口
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  status: 'active' | 'inactive'
  age: number
  department: string
  createdAt: string
}

// 模拟数据生成器
const generateUsers = (count: number): User[] => {
  const roles: Array<'admin' | 'user' | 'guest'> = ['admin', 'user', 'guest', 'user', 'user']
  const statuses: Array<'active' | 'inactive'> = ['active', 'active', 'active', 'inactive']
  const departments = ['技术部', '产品部', '设计部', '市场部', '运营部']

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length]!,
    status: statuses[i % statuses.length]!,
    age: 20 + (i % 40),
    department: departments[i % departments.length]!,
    createdAt: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`
  }))
}

// 数据源
const data = ref<User[]>(generateUsers(25))
const loading = ref(false)

// 选中的行 keys
const selectedRowKeys = ref<Array<string | number>>([])

// 分页配置
const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 25,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 50, 100],
  showQuickJumper: true
})

// 工具栏配置
const toolbar = {
  title: '用户列表',
  showRefresh: true,
  showFullscreen: true,
  onRefresh: handleRefresh
}

// 表格列配置（直接使用 NaiveUI 的 DataTableColumns 格式）
const columns: DataTableColumns<User> = [
  { type: 'selection' },
  {
    title: 'ID',
    key: 'id',
    width: 80,
    align: 'center',
    sorter: (a, b) => a.id - b.id
  },
  {
    title: '姓名',
    key: 'name',
    width: 120,
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (row) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h(
          'div',
          {
            class:
              'w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium'
          },
          row.name.charAt(0)
        ),
        h('span', { class: 'font-medium' }, row.name)
      ])
    }
  },
  {
    title: '邮箱',
    key: 'email',
    width: 200,
    sorter: (a, b) => a.email.localeCompare(b.email)
  },
  {
    title: '年龄',
    key: 'age',
    width: 80,
    align: 'center',
    sorter: (a, b) => a.age - b.age,
    render: (row) => {
      const ageColor = row.age < 30 ? 'text-green-600' : row.age < 50 ? 'text-blue-600' : 'text-orange-600'
      return h('span', { class: ageColor }, row.age)
    }
  },
  {
    title: '部门',
    key: 'department',
    width: 120,
    align: 'center',
    filterOptions: [
      { label: '技术部', value: '技术部' },
      { label: '产品部', value: '产品部' },
      { label: '设计部', value: '设计部' },
      { label: '市场部', value: '市场部' },
      { label: '运营部', value: '运营部' }
    ],
    filter: (value, row) => !!value && row.department === value,
    render: (row) => h(NTag, { type: 'info', size: 'small' }, { default: () => row.department })
  },
  {
    title: '角色',
    key: 'role',
    width: 100,
    align: 'center',
    filterOptions: [
      { label: '管理员', value: 'admin' },
      { label: '普通用户', value: 'user' },
      { label: '访客', value: 'guest' }
    ],
    filter: (value, row) => !!value && row.role === value,
    render: (row) => {
      const roleMap = {
        admin: { type: 'error' as const, label: '管理员' },
        user: { type: 'info' as const, label: '用户' },
        guest: { type: 'default' as const, label: '访客' }
      }
      const role = roleMap[row.role]
      return h(NTag, { type: role.type, size: 'small' }, { default: () => role.label })
    }
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    align: 'center',
    filterOptions: [
      { label: '活跃', value: 'active' },
      { label: '停用', value: 'inactive' }
    ],
    filter: (value, row) => !!value && row.status === value,
    render: (row) => {
      return h(
        NBadge,
        {
          type: row.status === 'active' ? 'success' : 'warning',
          processing: row.status === 'active'
        },
        {
          default: () => (row.status === 'active' ? '活跃' : '停用')
        }
      )
    }
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 120,
    sorter: (a, b) => a.createdAt.localeCompare(b.createdAt)
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    align: 'center',
    fixed: 'right',
    render: (row) => {
      return h(NSpace, { size: 'small' }, () => [
        h(NButton, { size: 'small', onClick: () => handleEdit(row) }, { default: () => '编辑' }),
        h(NButton, { size: 'small', type: 'warning', onClick: () => handleView(row) }, { default: () => '查看' }),
        h(NButton, { size: 'small', type: 'error', onClick: () => handleDelete(row) }, { default: () => '删除' })
      ])
    }
  }
]

// ==================== 函数定义 ====================

/** 处理编辑 */
const handleEdit = (row: User) => {
  message.info(`编辑用户：${row.name}`)
}

/** 处理查看 */
const handleView = (row: User) => {
  message.success(`查看用户：${row.name}`)
}

/** 处理删除 */
const handleDelete = (row: User) => {
  message.warning(`删除用户：${row.name}`)
}

/** 处理刷新 */
function handleRefresh() {
  loading.value = true
  message.loading('刷新数据中...')
  setTimeout(() => {
    data.value = generateUsers(25)
    loading.value = false
    message.success('数据已刷新')
  }, 500)
}

/** 处理批量删除 */
const handleBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的数据')
    return
  }
  message.warning(`将删除 ${selectedRowKeys.value.length} 条数据`)
}

/** 处理导出 */
const handleExport = () => {
  message.success(`导出 ${data.value.length} 条数据`)
}

/** 处理分页变化 */
const handlePageChange = (page: number) => {
  pagination.value.page = page
  message.info(`跳转到第 ${page} 页`)
}

/** 处理分页大小变化 */
const handlePageSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize
  message.info(`每页显示 ${pageSize} 条`)
}

/** 处理选择变化 */
const handleCheck = (keys: Array<string | number>) => {
  selectedRowKeys.value = keys
}
</script>

<template>
  <div class="table-example-page min-h-screen bg-gray-50 p-6">
    <!-- 页面头部 -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">EzTable 表格组件示例</h1>
      <p class="text-gray-600">极简设计：直接透传 NaiveUI DataTable，仅添加美化工具栏</p>
    </div>

    <!-- 统计信息 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div class="text-sm text-gray-500 mb-1">总数据量</div>
        <div class="text-2xl font-bold text-gray-800">{{ data.length }}</div>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div class="text-sm text-gray-500 mb-1">已选择</div>
        <div class="text-2xl font-bold text-blue-600">{{ selectedRowKeys.length }}</div>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div class="text-sm text-gray-500 mb-1">活跃用户</div>
        <div class="text-2xl font-bold text-green-600">
          {{ data.filter((u) => u.status === 'active').length }}
        </div>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div class="text-sm text-gray-500 mb-1">管理员</div>
        <div class="text-2xl font-bold text-purple-600">
          {{ data.filter((u) => u.role === 'admin').length }}
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="mb-4 flex flex-wrap gap-3">
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        :disabled="selectedRowKeys.length === 0"
        @click="handleBatchDelete"
      >
        批量删除 ({{ selectedRowKeys.length }})
      </button>
      <button
        class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        @click="handleExport"
      >
        导出数据
      </button>
      <button
        class="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        @click="handleRefresh"
      >
        刷新数据
      </button>
    </div>

    <!-- 功能说明卡片 -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 class="text-lg font-semibold text-blue-800 mb-3">🎯 核心特性</h3>
        <ul class="space-y-1.5 text-sm text-blue-700">
          <li>✅ <strong>极简透传</strong>：完全继承 NaiveUI DataTable 功能</li>
          <li>✅ <strong>美化工具栏</strong>：支持标题、刷新、全屏</li>
          <li>✅ <strong>类型安全</strong>：完整的 TypeScript 类型支持</li>
          <li>✅ <strong>零学习成本</strong>：完全兼容 NaiveUI API</li>
        </ul>
      </div>
      <div class="bg-green-50 rounded-lg p-4 border border-green-200">
        <h3 class="text-lg font-semibold text-green-800 mb-3">💡 设计理念</h3>
        <ul class="space-y-1.5 text-sm text-green-700">
          <li>✅ <strong>最小封装</strong>：只添加工具栏，不造轮子</li>
          <li>✅ <strong>灵活扩展</strong>：所有 NaiveUI 功能都可用</li>
          <li>✅ <strong>易于维护</strong>：代码量极小，维护成本低</li>
          <li>✅ <strong>自动同步</strong>：NaiveUI 更新时自动获得新功能</li>
        </ul>
      </div>
    </div>

    <!-- 表格示例 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <EzTable
        :columns="columns"
        :data="data"
        :loading="loading"
        :row-key="(row: { id: any }) => row.id"
        :pagination="pagination"
        :checked-row-keys="selectedRowKeys"
        :toolbar="toolbar"
        striped
        bordered
        @update:checked-row-keys="handleCheck"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>

    <!-- 使用提示 -->
    <div class="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
      <h3 class="text-lg font-semibold text-yellow-800 mb-2">📝 使用提示</h3>
      <ul class="space-y-1.5 text-sm text-yellow-700">
        <li>• <strong>零学习成本</strong>：EzTable 完全兼容 NaiveUI DataTable 的所有 props 和事件</li>
        <li>• <strong>列配置</strong>：直接使用 NaiveUI 的 `DataTableColumns` 格式</li>
        <li>• <strong>排序筛选</strong>：使用 NaiveUI 原生的 `sorter` 和 `filter` 属性</li>
        <li>• <strong>分页</strong>：直接传递 NaiveUI 的 `PaginationProps` 配置</li>
        <li>• <strong>工具栏</strong>：通过 `toolbar` prop 配置，支持标题、刷新、全屏</li>
      </ul>
    </div>

    <!-- 代码示例 -->
    <div class="mt-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4">💻 代码示例</h2>
      <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <pre class="text-sm text-gray-100"><code>&lt;script setup lang="ts"&gt;
import { h } from 'vue'
import { NTag, type DataTableColumns } from 'naive-ui'
import EzTable from '@/components/EzTable.vue'

interface User {
  id: number
  name: string
  role: string
}

const data = ref&lt;User[]&gt;([])
const selectedRowKeys = ref&lt;number[]&gt;([])

const columns: DataTableColumns&lt;User&gt; = [
  { type: 'selection' },
  {
    title: 'ID',
    key: 'id',
    sorter: (a, b) =&gt; a.id - b.id,
  },
  {
    title: '姓名',
    key: 'name',
    render: (row) =&gt; h('div', row.name),
  },
  {
    title: '角色',
    key: 'role',
    render: (row) =&gt; h(NTag, { type: 'info' }, { default: () =&gt; row.role }),
  },
]

const pagination = {
  page: 1,
  pageSize: 10,
  itemCount: 100,
}

const toolbar = {
  title: '用户列表',
  showRefresh: true,
  showFullscreen: true,
  onRefresh: () =&gt; console.log('刷新'),
}
&lt;/script&gt;

&lt;template&gt;
  &lt;EzTable
    :columns="columns"
    :data="data"
    :row-key="(row) =&gt; row.id"
    :pagination="pagination"
    :checked-row-keys="selectedRowKeys"
    :toolbar="toolbar"
    striped
    bordered
    @update:checked-row-keys="selectedRowKeys = $event"
    @update:page="pagination.page = $event"
  /&gt;
&lt;/template&gt;</code></pre>
      </div>
    </div>
  </div>
</template>
