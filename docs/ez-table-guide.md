# EzTable 表格组件使用指南

## 组件概述

`EzTable` 是基于 NaiveUI DataTable 的极简封装，**直接透传所有原生功能**，仅添加美化工具栏。

### 设计理念

- ✅ **零学习成本**：完全兼容 NaiveUI DataTable API
- ✅ **最小封装**：只添加工具栏美化
- ✅ **灵活扩展**：所有 NaiveUI 功能都可用
- ✅ **易于维护**：代码量极小，维护成本低
- ✅ **自动同步**：NaiveUI 更新时自动获得新功能

### 核心特性

- ✅ **完全透传**：NaiveUI DataTable 的所有 props 和事件
- ✅ **美化工具栏**：支持标题、刷新、全屏
- ✅ **类型安全**：完整的 TypeScript 类型支持
- ✅ **零破坏性**：可以随时切换回 NaiveUI DataTable

---

## 快速开始

### 基础用法

```vue
<script setup lang="ts">
import { ref, h } from 'vue'
import { NButton, NTag, type DataTableColumns } from 'naive-ui'
import EzTable from '@/components/EzTable.vue'

interface User {
  id: number
  name: string
  email: string
  role: string
}

const data = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: '用户' },
])

// 使用 NaiveUI 原生的 DataTableColumns 格式
const columns: DataTableColumns<User> = [
  { type: 'selection' },
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  {
    title: '角色',
    key: 'role',
    render: (row) => h(NTag, { type: 'info' }, { default: () => row.role }),
  },
  {
    title: '操作',
    key: 'actions',
    render: (row) => h(NButton, { size: 'small' }, { default: () => '编辑' }),
  },
]
</script>

<template>
  <EzTable
    :columns="columns"
    :data="data"
    :row-key="(row) => row.id"
    striped
    bordered
  />
</template>
```

---

## 工具栏配置

### 基础工具栏

```vue
<script setup lang="ts">
const toolbar = {
  title: '用户列表',        // 工具栏标题
  showRefresh: true,        // 显示刷新按钮
  showFullscreen: true,     // 显示全屏按钮
  onRefresh: () => {
    console.log('刷新数据')
  },
}
</script>

<template>
  <EzTable
    :columns="columns"
    :data="data"
    :toolbar="toolbar"
  />
</template>
```

### 自定义工具栏内容

```vue
<template>
  <EzTable
    :columns="columns"
    :data="data"
    :toolbar="toolbar"
  >
    <!-- 左侧自定义内容 -->
    <template #toolbar-left>
      <NButton type="primary">新增用户</NButton>
      <NButton>批量操作</NButton>
    </template>

    <!-- 右侧自定义内容（按钮组之前） -->
    <template #toolbar-right>
      <span class="text-gray-500">共 {{ data.length }} 条数据</span>
    </template>
  </EzTable>
</template>
```

---

## 分页配置

### 简单分页

```vue
<script setup lang="ts">
const pagination = {
  page: 1,
  pageSize: 10,
  itemCount: 100,
}
</script>

<template>
  <EzTable
    :columns="columns"
    :data="data"
    :pagination="pagination"
    @update:page="pagination.page = $event"
  />
</template>
```

### 完整分页配置

```vue
<script setup lang="ts">
const pagination = {
  page: 1,
  pageSize: 10,
  itemCount: 100,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 50, 100],
  showQuickJumper: true,
  prefix: (info: { itemCount?: number }) => `共 ${info.itemCount || 0} 条`,
}
</script>

<template>
  <EzTable
    :columns="columns"
    :data="data"
    :pagination="pagination"
  />
</template>
```

---

## 常用功能示例

### 选择功能

```vue
<script setup lang="ts">
const selectedRowKeys = ref<number[]>([])

const handleCheck = (keys: number[]) => {
  console.log('选中的行：', keys)
  selectedRowKeys.value = keys
}
</script>

<template>
  <EzTable
    :columns="columns"
    :data="data"
    :row-key="(row) => row.id"
    :checked-row-keys="selectedRowKeys"
    @update:checked-row-keys="handleCheck"
  />
</template>
```

### 排序和筛选

```vue
<script setup lang="ts">
const columns: DataTableColumns<User> = [
  {
    title: 'ID',
    key: 'id',
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: '姓名',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: '角色',
    key: 'role',
    filterOptions: [
      { label: '管理员', value: 'admin' },
      { label: '用户', value: 'user' },
    ],
    filter: (value, row) => row.role === value,
  },
]
</script>

<template>
  <EzTable
    :columns="columns"
    :data="data"
  />
</template>
```

### 固定列

```vue
<script setup lang="ts">
const columns: DataTableColumns<User> = [
  { title: 'ID', key: 'id', fixed: 'left', width: 80 },
  { title: '姓名', key: 'name' },
  { title: '邮箱', key: 'email' },
  { title: '操作', key: 'actions', fixed: 'right', width: 200 },
]
</script>

<template>
  <EzTable
    :columns="columns"
    :data="data"
    :scroll-x="1200"
  />
</template>
```

### 展开行

```vue
<script setup lang="ts">
const expandedRowKeys = ref<number[]>([])

const columns: DataTableColumns<User> = [
  { type: 'expand' },
  { title: 'ID', key: 'id' },
  { title: '姓名', key: 'name' },
]
</script>

<template>
  <EzTable
    :columns="columns"
    :data="data"
    :expanded-row-keys="expandedRowKeys"
    @update:expanded-row-keys="expandedRowKeys = $event"
  />
</template>
```

### 树形数据

```vue
<script setup lang="ts">
interface TreeNode {
  id: number
  name: string
  children?: TreeNode[]
}

const columns: DataTableColumns<TreeNode> = [
  { title: '名称', key: 'name', width: 200 },
]

const data = ref<TreeNode[]>([
  {
    id: 1,
    name: '部门 A',
    children: [
      { id: 11, name: '团队 A1' },
      { id: 12, name: '团队 A2' },
    ],
  },
])
</script>

<template>
  <EzTable
    :columns="columns"
    :data="data"
    :row-key="(row) => row.id"
    default-expand-all
  />
</template>
```

### 自定义行样式

```vue
<script setup lang="ts">
const rowClassName = (row: User) => {
  if (row.role === 'admin') return 'admin-row'
  return ''
}

const rowProps = (row: User) => {
  return {
    style: { cursor: 'pointer' },
    onClick: () => console.log('点击行：', row),
  }
}
</script>

<template>
  <EzTable
    :columns="columns"
    :data="data"
    :row-class-name="rowClassName"
    :row-props="rowProps"
  />
</template>
```

---

## API 文档

### EzTable Props

EzTable 完全透传 NaiveUI DataTable 的所有 props，以下是常用属性：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `DataTableColumns` | **必填** | 列配置（NaiveUI 原生格式） |
| `data` | `T[]` | `[]` | 数据源 |
| `loading` | `boolean` | `false` | 是否加载中 |
| `bordered` | `boolean` | `false` | 是否显示边框 |
| `striped` | `boolean` | `false` | 是否斑马纹 |
| `singleLine` | `boolean` | `true` | 单行模式 |
| `tableLayout` | `'auto' \| 'fixed'` | `'auto'` | 表格布局 |
| `flexHeight` | `boolean` | `false` | 弹性高度 |
| `maxHeight` | `string \| number` | - | 最大高度 |
| `rowKey` | `string \| (row) => string \| number` | - | 行唯一标识 |
| `rowProps` | `(row, index) => object` | - | 自定义行属性 |
| `rowClassName` | `string \| (row, index) => string` | - | 行类名 |
| `rowDisabled` | `(row) => boolean` | - | 行是否禁用选择 |
| `checkedRowKeys` | `Array<string \| number>` | - | 已选择的行 keys |
| `defaultCheckedRowKeys` | `Array<string \| number>` | - | 默认选中的行 keys |
| `defaultCheckedAll` | `boolean` | `false` | 是否默认全选 |
| `cascade` | `boolean` | `false` | 列联选择（树形数据） |
| `expandedRowKeys` | `Array<string \| number>` | - | 展开行的 keys |
| `defaultExpandedRowKeys` | `Array<string \| number>` | - | 默认展开的行 keys |
| `defaultExpandAll` | `boolean` | `false` | 是否默认展开所有 |
| `scrollX` | `number \| string` | - | 横向滚动 |
| `virtualScroll` | `boolean` | `false` | 虚拟滚动 |
| `childrenKey` | `string` | `'children'` | 子节点键名 |
| `summary` | `() => VNode` | - | 汇总行渲染 |
| `summaryPlacement` | `'top' \| 'bottom'` | `'bottom'` | 汇总位置 |
| `pagination` | `boolean \| PaginationProps` | `false` | 分页配置 |
| `toolbar` | `ToolbarConfig` | - | 工具栏配置 |
| `class` | `string` | - | 容器类名 |
| `style` | `CSSProperties` | - | 容器样式 |

### ToolbarConfig

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 工具栏标题 |
| `showRefresh` | `boolean` | `false` | 是否显示刷新按钮 |
| `showFullscreen` | `boolean` | `false` | 是否显示全屏按钮 |
| `onRefresh` | `() => void` | - | 刷新回调 |
| `left` | `() => VNode` | - | 左侧自定义内容 |
| `right` | `() => VNode` | - | 右侧自定义内容 |

### EzTable Emits

EzTable 完全透传 NaiveUI DataTable 的所有事件：

| 事件 | 参数 | 说明 |
|------|------|------|
| `update:checkedRowKeys` | `keys` | 选择变化事件 |
| `update:expandedRowKeys` | `keys` | 展开变化事件 |
| `update:sorter` | `sorter` | 排序变化事件 |
| `update:filters` | `filters` | 筛选变化事件 |
| `row-click` | `(row, index)` | 行点击事件 |
| `scroll` | `e` | 滚动事件 |
| `update:page` | `page` | 分页变化事件 |
| `update:pageSize` | `pageSize` | 分页大小变化事件 |

### EzTable Slots

| 插槽名 | 说明 |
|--------|------|
| `empty` | 自定义空状态 |
| `toolbar-left` | 工具栏左侧内容 |
| `toolbar-right` | 工具栏右侧内容 |

---

## 最佳实践

### 1. 远程数据加载

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const data = ref([])
const loading = ref(false)
const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.getUsers({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    })
    data.value = res.data.list
    pagination.value.itemCount = res.data.total
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  pagination.value.page = page
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <EzTable
    :columns="columns"
    :data="data"
    :loading="loading"
    :pagination="pagination"
    @update:page="handlePageChange"
  />
</template>
```

### 2. 固定高度表格

```vue
<template>
  <!-- 固定高度 600px -->
  <EzTable
    :columns="columns"
    :data="data"
    :max-height="600"
    flex-height
  />
</template>
```

### 3. 虚拟滚动（大数据量）

```vue
<template>
  <EzTable
    :columns="columns"
    :data="data"
    :max-height="600"
    :virtual-scroll="true"
    flex-height
  />
</template>
```

---

## 常见问题

### Q1: EzTable 和 NaiveUI DataTable 有什么区别？

A: EzTable 是 NaiveUI DataTable 的极简封装，**完全透传所有功能**，仅添加美化工具栏。你可以像使用 NaiveUI DataTable 一样使用 EzTable，零学习成本。

### Q2: 如何使用 NaiveUI 的所有表格功能？

A: 直接使用 NaiveUI 的 `DataTableColumns` 格式定义列配置，所有 NaiveUI 的功能都完全支持。

### Q3: 如何自定义工具栏？

A: 使用 `toolbar-left` 和 `toolbar-right` 插槽，或者通过 `toolbar.left` 和 `toolbar.right` 配置。

### Q4: 为什么没有列设置功能？

A: 遵循"最小封装"原则，NaiveUI 已经提供了列宽调整功能，不需要额外的列设置。

---

## 完整示例

```vue
<script setup lang="ts">
import { ref, h } from 'vue'
import { NButton, NTag, type DataTableColumns } from 'naive-ui'
import EzTable from '@/components/EzTable.vue'

interface User {
  id: number
  name: string
  email: string
  role: string
}

const data = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: '用户' },
])

const selectedRowKeys = ref<number[]>([])

const columns: DataTableColumns<User> = [
  { type: 'selection' },
  { title: 'ID', key: 'id', width: 80, sorter: (a, b) => a.id - b.id },
  { title: '姓名', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
  { title: '邮箱', key: 'email' },
  {
    title: '角色',
    key: 'role',
    render: (row) => h(NTag, { type: 'info' }, { default: () => row.role }),
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    width: 150,
    render: (row) => h(NButton, { size: 'small' }, { default: () => '编辑' }),
  },
]

const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 2,
})

const toolbar = {
  title: '用户列表',
  showRefresh: true,
  showFullscreen: true,
  onRefresh: () => console.log('刷新'),
}
</script>

<template>
  <EzTable
    :columns="columns"
    :data="data"
    :row-key="(row) => row.id"
    :checked-row-keys="selectedRowKeys"
    :toolbar="toolbar"
    :pagination="pagination"
    striped
    bordered
    @update:checked-row-keys="selectedRowKeys = $event"
    @update:page="pagination.page = $event"
  />
</template>
```

---

## 总结

EzTable 遵循"最小封装"原则，**不造轮子**，NaiveUI 已经很强大，直接用！

**核心优势**：
- ✅ 零学习成本
- ✅ 完全兼容 NaiveUI API
- ✅ 代码量极小
- ✅ 易于维护

**推荐使用场景**：
- ✅ 需要"工具栏 + 表格"的标准后台管理界面
- ✅ 所有使用 NaiveUI DataTable 的场景

**查看完整示例**：`src/views/examples/components/TableExample.vue`
