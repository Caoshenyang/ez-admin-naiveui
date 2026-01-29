# 5.3 EzTable 表格组件

## 本节目标

- ✅ 封装表格组件
- ✅ 实现分页功能
- ✅ 支持自定义列渲染

---

## 1. 类型定义

**src/types/table.ts**:

```typescript
export interface TableColumn {
  /** 列键 */
  key: string
  /** 列标题 */
  title: string
  /** 宽度 */
  width?: number
  /** 对齐 */
  align?: 'left' | 'center' | 'right'
  /** 自定义渲染 */
  render?: (row: any) => any
  /** 是否固定 */
  fixed?: 'left' | 'right'
}

export interface TableProps {
  /** 列配置 */
  columns: TableColumn[]
  /** 数据 */
  data: any[]
  /** 是否显示分页 */
  pagination?: boolean | PaginationConfig
  /** 是否加载中 */
  loading?: boolean
}

export interface PaginationConfig {
  /** 当前页 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 总数 */
  total: number
  /** 页码改变回调 */
  onPageChange: (page: number) => void
  /** 每页条数改变回调 */
  onPageSizeChange: (pageSize: number) => void
}
```

---

## 2. EzTable 组件

**src/components/EzTable.vue**:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { NDataTable, NPagination } from 'naive-ui'
import type { TableProps, TableColumn } from '@/types/table'

const props = withDefaults(defineProps<TableProps>(), {
  pagination: true,
  loading: false,
})

const emit = defineEmits<{
  'update:page': [page: number]
  'update:pageSize': [pageSize: number]
}>()

/**
 * 转换列配置
 */
const columns = computed(() => {
  return props.columns.map((col) => ({
    key: col.key,
    title: col.title,
    width: col.width,
    align: col.align || 'left',
    fixed: col.fixed,
    render: col.render
      ? (row: any) => col.render!(row)
      : undefined,
  }))
})

/**
 * 处理页码改变
 */
const handlePageChange = (page: number) => {
  if (typeof props.pagination === 'object') {
    props.pagination.onPageChange(page)
  }
  emit('update:page', page)
}

/**
 * 处理每页条数改变
 */
const handlePageSizeChange = (pageSize: number) => {
  if (typeof props.pagination === 'object') {
    props.pagination.onPageSizeChange(pageSize)
  }
  emit('update:pageSize', pageSize)
}
</script>

<template>
  <div class="ez-table">
    <n-data-table
      :columns="columns"
      :data="data"
      :loading="loading"
      :bordered="false"
    />

    <div v-if="pagination" class="mt-4 flex justify-end">
      <n-pagination
        v-if="typeof pagination === 'object'"
        :page="pagination.page"
        :page-size="pagination.pageSize"
        :item-count="pagination.total"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
.ez-table {
  @apply bg-white rounded-lg;
}
</style>
```

---

## 3. 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import EzTable from '@/components/EzTable.vue'
import type { TableColumn } from '@/types/table'

const data = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
])

const columns: TableColumn[] = [
  {
    key: 'id',
    title: 'ID',
    width: 80,
  },
  {
    key: 'name',
    title: '姓名',
  },
  {
    key: 'email',
    title: '邮箱',
  },
  {
    key: 'actions',
    title: '操作',
    width: 150,
    render: (row) => {
      return h('div', [
        h(NButton, { size: 'small' }, { default: () => '编辑' }),
        h(NButton, { size: 'small', type: 'error' }, { default: () => '删除' }),
      ])
    },
  },
]

const pagination = {
  page: 1,
  pageSize: 10,
  total: 100,
  onPageChange: (page: number) => {
    pagination.page = page
    fetchData()
  },
}
</script>

<template>
  <EzTable :columns="columns" :data="data" :pagination="pagination" />
</template>
```

---

## 4. 本节小结

✅ 完成的工作：
- 封装了 EzTable 组件
- 实现了分页功能
- 支持自定义列渲染

**下一步**: [5.4 EzModal 弹窗组件](./04-EzModal弹窗组件.md)
