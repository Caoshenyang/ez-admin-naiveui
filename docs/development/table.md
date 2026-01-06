# 表格配置指南

EzTable 组件基于 Naive UI 的 `n-data-table` 封装，支持丰富的表格配置和功能。

## 表格配置结构

```typescript
export interface TableConfigOptions<T = any> {
  columns: TableColumnConfig<T>[]     // 表格列配置
  actionButtons?: ActionButtonsConfig // 操作按钮配置
  actionWidth?: number               // 操作列宽度，默认180
  showIndex?: boolean               // 是否显示序号列，默认false
  indexWidth?: number               // 序号列宽度，默认60
}
```

## 列配置

### 基础列配置

```typescript
export interface TableColumnConfig<T = any> {
  title: string                    // 列标题
  key: keyof T | string           // 列键
  width?: number                  // 列宽度
  minWidth?: number              // 最小宽度
  maxWidth?: number              // 最大宽度
  align?: 'left' | 'center' | 'right' // 对齐方式
  ellipsis?: boolean | object     // 文本省略
  sortable?: boolean | object     // 排序配置
  filterable?: boolean | object   // 筛选配置
  resizable?: boolean            // 是否可调整宽度
  fixed?: 'left' | 'right'        // 固定列
  render?: (row: T, index: number) => VNode // 自定义渲染
}
```

### 基础列

```typescript
const columns: TableColumnConfig<UserListVO>[] = [
  {
    title: '用户名',
    key: 'username',
    width: 100,
    align: 'left',
  },
  {
    title: '昵称',
    key: 'nickname',
    width: 100,
  },
  {
    title: '邮箱',
    key: 'email',
    width: 180,
    ellipsis: true,  // 长文本省略
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 200,
    align: 'center',
  },
]
```

### 排序列

```typescript
{
  title: '年龄',
  key: 'age',
  width: 80,
  sortable: true,  // 启用排序
},
{
  title: '注册时间',
  key: 'registerTime',
  width: 150,
  sortable: {
    sorter: (a, b) => new Date(a.registerTime).getTime() - new Date(b.registerTime).getTime(),
  },
}
```

### 筛选列

```typescript
{
  title: '状态',
  key: 'status',
  width: 80,
  filterable: true,
  filters: [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 },
  ],
  filterMultiple: false,  // 是否多选
}
```

### 自定义渲染列

```typescript
import { renderTag, renderStatusTag } from '@/utils/renderers'

// 状态标签
{
  title: '状态',
  key: 'status',
  width: 80,
  render: renderStatusTag([
    { label: '启用', value: 1, type: 'success' },
    { label: '禁用', value: 0, type: 'error' },
  ]),
}

// 自定义标签
{
  title: '类型',
  key: 'type',
  width: 100,
  render: (row) => {
    const typeMap = {
      1: { text: '管理员', type: 'primary' },
      2: { text: '普通用户', type: 'info' },
    }
    const config = typeMap[row.type as keyof typeof typeMap]
    return config ? renderTag(config.text, { type: config.type }) : '-'
  },
}

// 日期格式化
{
  title: '创建时间',
  key: 'createTime',
  width: 200,
  render: (row) => {
    return row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'
  },
}
```

## 操作按钮配置

### 操作按钮配置

```typescript
export interface ActionButtonsConfig {
  view?: boolean      // 查看按钮
  edit?: boolean      // 编辑按钮
  delete?: boolean    // 删除按钮
  custom?: ActionButton[] // 自定义按钮
}
```

### 基础操作按钮

```typescript
const tableConfig: TableConfigOptions<UserListVO> = {
  columns: userColumns,
  actionButtons: {
    view: true,    // 显示查看按钮
    edit: true,    // 显示编辑按钮
    delete: true,  // 显示删除按钮
  },
  actionWidth: 180,  // 操作列宽度
}
```

### 自定义操作按钮

```typescript
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@vicons/antd'

const tableConfig: TableConfigOptions<UserListVO> = {
  columns: userColumns,
  actionButtons: {
    custom: [
      {
        key: 'reset-password',
        text: '重置密码',
        type: 'warning',
        icon: EditOutlined,
        permission: 'sys:user:reset-password',
        onClick: (row) => handleResetPassword(row),
      },
      {
        key: 'disable',
        text: '禁用',
        type: 'error',
        icon: DeleteOutlined,
        permission: 'sys:user:disable',
        visible: (row) => row.status === 1, // 仅启用状态显示
        onClick: (row) => handleDisableUser(row),
      },
    ],
  },
}
```

## 表格渲染工具

### 状态标签渲染

```typescript
import { renderStatusTag } from '@/utils/renderers'

// 使用预定义的状态标签
{
  title: '状态',
  key: 'status',
  width: 80,
  render: renderStatusTag(statusOptions),
}
```

### 普通标签渲染

```typescript
import { renderTag } from '@/utils/renderers'

// 自定义标签
{
  title: '级别',
  key: 'level',
  width: 80,
  render: (row) => {
    const levelColors = {
      1: 'success',
      2: 'warning',
      3: 'error',
    } as const

    return renderTag(`Lv.${row.level}`, {
      type: levelColors[row.level as keyof typeof levelColors] || 'default'
    })
  },
}
```

### 按钮渲染

```typescript
import { createButton } from '@/utils/renderers'

// 操作按钮组
{
  title: '操作',
  key: 'actions',
  width: 200,
  render: (row) => createButtonGroup([
    {
      text: '编辑',
      type: 'primary',
      size: 'tiny',
      onClick: () => handleEdit(row),
    },
    {
      text: '删除',
      type: 'error',
      size: 'tiny',
      onClick: () => handleDelete(row),
    },
  ]),
}
```

## 高级配置

### 序号列

```typescript
const tableConfig: TableConfigOptions<UserListVO> = {
  showIndex: true,      // 显示序号列
  indexWidth: 60,       // 序号列宽度
  columns: userColumns,
}
```

### 固定列

```typescript
const columns: TableColumnConfig<UserListVO>[] = [
  {
    title: '用户名',
    key: 'username',
    width: 100,
    fixed: 'left',  // 左侧固定
  },
  {
    title: '操作',
    key: 'actions',
    width: 180,
    fixed: 'right', // 右侧固定
  },
]
```

### 合并单元格

```typescript
{
  title: '姓名',
  key: 'name',
  width: 100,
  span: (row, index, columnIndex) => {
    // 合并逻辑
    if (index % 3 === 0) {
      return 3 // 合并3行
    }
    return 1
  },
}
```

### 自定义排序

```typescript
{
  title: '综合评分',
  key: 'score',
  width: 100,
  sortable: {
    sorter: (a, b) => {
      // 自定义排序逻辑
      const aScore = calculateScore(a)
      const bScore = calculateScore(b)
      return aScore - bScore
    },
  },
}
```

### 自定义筛选

```typescript
{
  title: '注册时间',
  key: 'registerTime',
  width: 150,
  filterable: {
    filter: (value, row) => {
      // 自定义筛选逻辑
      const registerDate = dayjs(row.registerTime).format('YYYY-MM')
      return registerDate === value
    },
    filterOptions: [
      { label: '本月', value: dayjs().format('YYYY-MM') },
      { label: '上月', value: dayjs().subtract(1, 'month').format('YYYY-MM') },
    ],
  },
}
```

## 表格事件处理

### 行选择

```vue
<template>
  <EzTable
    :config="tableConfig"
    :checked-keys="checkedRowKeys"
    @check-change="handleCheck"
  />
</template>

<script setup>
const checkedRowKeys = ref<(string | number)[]>([])

const handleCheck = (keys: (string | number)[]) => {
  checkedRowKeys.value = keys
}
</script>
```

### 行点击

```vue
<template>
  <EzTable
    :config="tableConfig"
    @row-click="handleRowClick"
  />
</template>

<script setup>
const handleRowClick = (row: UserListVO, rowIndex: number) => {
  console.log('点击行:', row, rowIndex)
  // 处理行点击逻辑
}
</script>
```

### 排序变化

```vue
<template>
  <EzTable
    :config="tableConfig"
    @sort-change="handleSortChange"
  />
</template>

<script setup>
const handleSortChange = (sortState: SortState) => {
  console.log('排序变化:', sortState)
  // 处理排序逻辑
  queryParams.value.sortField = sortState.columnKey
  queryParams.value.sortOrder = sortState.order
  loadData()
}
</script>
```

### 筛选变化

```vue
<template>
  <EzTable
    :config="tableConfig"
    @filter-change="handleFilterChange"
  />
</template>

<script setup>
const handleFilterChange = (filters: Record<string, any>) => {
  console.log('筛选变化:', filters)
  // 处理筛选逻辑
  Object.assign(queryParams.value.filters, filters)
  loadData()
}
</script>
```

## 性能优化

### 虚拟滚动

对于大数据量的表格，可以启用虚拟滚动：

```vue
<template>
  <EzTable
    :config="tableConfig"
    virtual-scroll
    :max-height="400"
  />
</template>
```

### 分页加载

```typescript
const tableConfig = computed<EzTableConfig>(() => ({
  // ... 其他配置
  remote: true,  // 启用远程分页
  pagination: {
    pageSize: 20,
    showSizePicker: true,
    pageSizes: [10, 20, 50, 100],
    showQuickJumper: true,
    prefix: () => h('div', { class: 'pagination-prefix' }, '共'),
    suffix: () => h('div', { class: 'pagination-suffix' }, '条记录'),
  },
}))
```

### 懒加载

```typescript
{
  title: '详情',
  key: 'detail',
  width: 200,
  render: (row) => {
    // 懒加载详情内容
    return h('div', {
      onClick: () => loadDetail(row.id),
    }, '点击加载详情')
  },
}
```

## 样式定制

### 自定义样式

```vue
<template>
  <EzTable
    :config="tableConfig"
    class="custom-table"
  />
</template>

<style scoped>
.custom-table {
  --n-table-header-color: #333;
  --n-table-header-font-weight: 600;
}

.custom-table :deep(.n-data-table-td) {
  padding: 12px 16px;
}
</style>
```

### 条件样式

```typescript
{
  title: '状态',
  key: 'status',
  width: 80,
  render: (row) => {
    const className = row.status === 1 ? 'status-active' : 'status-inactive'
    return h('span', { class: className }, row.status === 1 ? '启用' : '禁用')
  },
}
```

```css
.status-active {
  color: #52c41a;
  font-weight: 500;
}

.status-inactive {
  color: #ff4d4f;
  font-weight: 500;
}
```

## 使用示例

```vue
<template>
  <div class="user-table-container">
    <!-- 搜索区域 -->
    <EzSearch
      v-model="queryParams.search.keywords"
      placeholder="请输入用户名、昵称或邮箱进行搜索"
      @search="handleSearch"
      @reset="handleResetSearch"
    />

    <!-- 操作按钮 -->
    <EzButtonGroup :buttons="userActionButtons" @action="handleAction" />

    <!-- 数据表格 -->
    <EzTable
      :config="tableConfig"
      :checked-keys="checkedRowKeys"
      @check-change="handleCheck"
    />

    <!-- 表单弹窗 -->
    <EzForm
      v-model="formVisible"
      :config="formConfig"
      :loading="formLoading"
      :form-data="formData"
      @update:form-data="handleFormDataUpdate"
      @submit="handleFormSubmit"
      @cancel="handleCancel"
    />

    <!-- 详情弹窗 -->
    <EzDetailModal
      v-model:show="detailVisible"
      :data="detailData"
      :config="userDetailConfig"
      :loading="detailLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCrud } from '@/hooks/useCrud'
import EzSearch from '@/components/common/EzSearch.vue'
import EzButtonGroup from '@/components/common/EzButtonGroup.vue'
import EzTable from '@/components/common/EzTable.vue'
import EzForm from '@/components/common/EzForm.vue'
import EzDetailModal from '@/components/common/EzDetailModal.vue'
import { userActionButtons, userCrudConfig } from './config'
import type { EzTableConfig } from '@/hooks/types/table'

// 查询参数
const queryParams = ref(
  createDefaultQueryParams({
    keywords: '',
  })
)

// 使用 CRUD Hook
const crud = useCrud(userCrudConfig)

// 解构响应式数据和方法
const {
  loading,
  dataList,
  pagination,
  columns,
  tableScrollWidth,
  checkedRowKeys,
  formVisible,
  formLoading,
  formMode,
  formData,
  detailVisible,
  detailLoading,
  detailData,
  handleCancel,
  handleFormDataUpdate,
  handleSearch,
  handleReset,
  setLoadData,
} = crud

// 表格配置
const tableConfig = computed<EzTableConfig>(() => ({
  columns: columns.value,
  data: dataList.value,
  loading: loading.value,
  pagination: pagination.value,
  rowKey: (row) => row.userId,
  scrollX: tableScrollWidth.value,
  maxHeight: 'calc(100vh - 320px)',
  striped: true,
  remote: true,
}))

// 表单配置
const formConfig = computed(() => ({
  ...userCrudConfig.formConfig,
  title: formMode.value === 'create' ? '新增用户' : '编辑用户',
}))

// 数据加载
const loadUserList = async () => {
  queryParams.value.pageNum = pagination.value.page
  queryParams.value.pageSize = pagination.value.pageSize || 10
  await crud.loadData(queryParams.value)
}

// 设置数据加载函数
setLoadData(loadUserList)

// 搜索重置
const handleResetSearch = () => {
  queryParams.value.search.keywords = ''
  handleReset()
}

// 表单提交
const handleFormSubmit = async (data: any) => {
  await crud.handleSubmit(data)
  await loadUserList() // 刷新列表
}

// 表格行选择
const handleCheck = (keys: (string | number)[]) => {
  checkedRowKeys.value = keys
}

// 批量删除
const handleBatchDeleteClick = async () => {
  const ids = checkedRowKeys.value.map((id) => String(id))
  await crud.handleBatchDelete(ids, async () => {
    checkedRowKeys.value = []
    await loadUserList()
  })
}

// 刷新
const handleRefresh = () => {
  loadUserList()
}

// 按钮操作处理器
const handleAction = handleButtonActions({
  add: crud.handleAdd,
  'batch-delete': handleBatchDeleteClick,
  refresh: handleRefresh,
})

// 组件挂载时加载数据
onMounted(() => {
  loadUserList()
})
</script>

<style scoped>
.user-table-container {
  padding: 20px;
  background: white;
  border-radius: 8px;
}
</style>
```

## 注意事项

1. **性能**: 大数据量表格建议使用虚拟滚动和分页
2. **响应式**: 表格列宽应考虑不同屏幕尺寸
3. **可访问性**: 为表格提供适当的标题和描述
4. **类型安全**: 为表格数据定义明确的 TypeScript 类型
5. **用户体验**: 合理使用加载状态和错误处理
