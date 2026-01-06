# CRUD 组件使用指南

项目提供了完整的 CRUD 组件系统，支持通过配置快速搭建管理页面，大大提升开发效率。

## useCrud Hook

`useCrud` 是核心的组合式函数，封装了完整的 CRUD 逻辑。

### 基本用法

```typescript
import { useCrud } from '@/hooks/useCrud'

// 使用 CRUD Hook
const crud = useCrud(userCrudConfig)

// 解构响应式数据和方法
const {
  loading,
  dataList,
  pagination,
  formVisible,
  formData,
  handleSearch,
  handleAdd,
  handleSubmit
} = crud
```

### Hook 返回值

#### 状态数据

| 属性 | 类型 | 说明 |
|------|------|------|
| `loading` | `boolean` | 表格加载状态 |
| `dataList` | `T[]` | 数据列表 |
| `pagination` | `object` | 分页配置 |
| `columns` | `DataTableColumns` | 表格列配置 |
| `tableScrollWidth` | `number` | 表格滚动宽度 |
| `checkedRowKeys` | `array` | 选中的行键 |
| `formVisible` | `boolean` | 表单显示状态 |
| `formLoading` | `boolean` | 表单提交状态 |
| `formMode` | `'create' \| 'update'` | 表单模式 |
| `formData` | `object` | 表单数据 |
| `detailVisible` | `boolean` | 详情显示状态 |
| `detailLoading` | `boolean` | 详情加载状态 |
| `detailData` | `object` | 详情数据 |

#### 方法

| 方法 | 参数 | 说明 |
|------|------|------|
| `setLoadData` | `(fn: Function)` | 设置数据加载函数 |
| `loadData` | `(params?: object)` | 加载数据 |
| `handleSearch` | `()` | 执行搜索 |
| `handleReset` | `()` | 重置搜索 |
| `handleAdd` | `()` | 打开新增表单 |
| `handleEdit` | `(row: object)` | 打开编辑表单 |
| `handleView` | `(row: object)` | 查看详情 |
| `handleSubmit` | `(data: object)` | 提交表单 |
| `handleDelete` | `(row: object)` | 删除单条记录 |
| `handleBatchDelete` | `(ids: string[], callback: Function)` | 批量删除 |

## CRUD 配置

### 基础配置

```typescript
export interface CrudConfig {
  // 查询参数初始值
  queryParams?: PageQuery
  // 分页查询API
  pageApi: (params: PageQuery) => Promise<PageResult>
  // 获取详情API
  detailApi: (id: string | number) => Promise<object>
  // 新增API
  createApi: (data: object) => Promise<void>
  // 更新API
  updateApi: (data: object) => Promise<void>
  // 删除API
  removeApi: (id: string | number) => Promise<void>
  // 批量删除API（可选）
  batchRemoveApi?: (ids: (string | number)[]) => Promise<void>
  // 表格配置
  tableConfig: TableConfigOptions
  // 分页配置
  paginationConfig?: PaginationConfigOptions
  // 详情配置
  detailConfig?: DetailModalConfig
  // 主键字段
  idKey?: string
  // 显示名称字段
  nameKey?: string
  // 新增表单默认值
  createDefaultValues?: Record<string, any>
}
```

### 示例配置

```typescript
export const userCrudConfig: UserCrudConfig = {
  // API配置
  pageApi: userApi.page,
  detailApi: userApi.detail,
  createApi: userApi.create,
  updateApi: userApi.update,
  removeApi: userApi.remove,
  batchRemoveApi: userApi.batchRemove,

  // 表格配置
  tableConfig: userTableConfig,
  // 详情配置
  detailConfig: userDetailConfig,

  // 主键字段
  idKey: 'userId',
  // 显示名称字段
  nameKey: 'username',

  // 新增表单默认值
  createDefaultValues: {
    status: 1, // 默认启用
    gender: 1, // 默认男
  },
}
```

## EzTable 组件

通用表格组件，基于 Naive UI 的 `n-data-table` 封装。

### 基本用法

```vue
<template>
  <EzTable :config="tableConfig" :checked-keys="checkedRowKeys" @check-change="handleCheck" />
</template>

<script setup>
import EzTable from '@/components/common/EzTable.vue'

const tableConfig = computed<EzTableConfig>(() => ({
  columns: columns.value,
  data: userList.value,
  loading: loading.value,
  pagination: pagination,
  rowKey: (row) => row.userId,
  scrollX: tableScrollWidth.value,
  maxHeight: 'calc(100vh - 320px)',
  striped: true,
  remote: true,
}))
</script>
```

### 配置选项

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `DataTableColumns` | - | 表格列配置 |
| `data` | `Array` | - | 表格数据 |
| `loading` | `boolean` | `false` | 加载状态 |
| `pagination` | `object` | - | 分页配置 |
| `rowKey` | `Function` | - | 行键函数 |
| `scrollX` | `number` | - | 横向滚动宽度 |
| `maxHeight` | `string` | - | 最大高度 |
| `striped` | `boolean` | `false` | 斑马纹 |
| `remote` | `boolean` | `false` | 远程分页 |

## EzForm 组件

通用表单组件，基于 Naive UI 的 `n-form` 封装。

### 基本用法

```vue
<template>
  <EzForm
    v-model="formVisible"
    :config="formConfig"
    :loading="formLoading"
    :form-data="formData"
    @update:form-data="handleFormDataUpdate"
    @submit="handleFormSubmit"
    @cancel="handleCancel"
  />
</template>

<script setup>
import EzForm from '@/components/common/EzForm.vue'
</script>
```

### 表单配置

```typescript
export interface FormConfig<T = any> {
  title: string                    // 表单标题
  gridCols?: number               // 栅格列数，默认24
  fields: FormField<T>[]          // 表单字段配置
  rules?: FormRules               // 验证规则
  labelWidth?: number             // 标签宽度
  labelAlign?: 'left' | 'right'   // 标签对齐方式
}
```

### 字段配置

```typescript
export interface FormField<T = any> {
  key: keyof T                    // 字段键
  label: string                   // 字段标签
  type: FormFieldType            // 字段类型
  required?: boolean             // 是否必填
  disabled?: boolean             // 是否禁用
  placeholder?: string           // 占位符
  span?: number                  // 栅格跨度
  options?: SelectOption[]       // 选项（用于选择类字段）
  inputType?: string             // 输入类型（用于input）
  rows?: number                  // 行数（用于textarea）
  // ... 其他配置
}
```

### 支持的字段类型

- `input`: 文本输入框
- `password`: 密码输入框
- `textarea`: 文本域
- `number`: 数字输入框
- `select`: 下拉选择
- `radio`: 单选框
- `checkbox`: 复选框
- `date`: 日期选择
- `datetime`: 日期时间选择
- `switch`: 开关

## EzSearch 组件

搜索组件，用于关键词搜索。

### 基本用法

```vue
<template>
  <EzSearch
    v-model="queryParams.search.keywords"
    placeholder="请输入关键词进行搜索"
    @search="handleSearch"
    @reset="handleResetSearch"
  />
</template>

<script setup>
import EzSearch from '@/components/common/EzSearch.vue'
</script>
```

## EzButtonGroup 组件

操作按钮组组件。

### 基本用法

```vue
<template>
  <EzButtonGroup :buttons="userActionButtons" @action="handleAction" />
</template>

<script setup>
import EzButtonGroup from '@/components/common/EzButtonGroup.vue'
import { userActionButtons } from './config'
</script>
```

### 按钮配置

```typescript
export interface ActionButton {
  key: string           // 按钮唯一标识
  text: string          // 按钮文本
  type?: ButtonType     // 按钮类型
  icon?: Component      // 按钮图标
  permission?: string   // 权限标识
  disabled?: boolean    // 是否禁用
}
```

## 完整示例

```vue
<template>
  <!-- 搜索表单 -->
  <EzSearch
    v-model="queryParams.search.keywords"
    placeholder="请输入关键词进行搜索"
    @search="handleSearch"
    @reset="handleResetSearch"
  />

  <!-- 操作按钮组 -->
  <EzButtonGroup :buttons="actionButtons" @action="handleAction" />

  <!-- 数据表格 -->
  <EzTable :config="tableConfig" :checked-keys="checkedRowKeys" @check-change="handleCheck" />

  <!-- 表单 -->
  <EzForm
    v-model="formVisible"
    :config="formConfig"
    :loading="formLoading"
    :form-data="formData"
    @update:form-data="handleFormDataUpdate"
    @submit="handleFormSubmit"
    @cancel="handleCancel"
  />

  <!-- 详情 -->
  <EzDetailModal
    v-model:show="detailVisible"
    :data="detailData"
    :config="detailConfig"
    :loading="detailLoading"
  />
</template>

<script setup>
import { useCrud } from '@/hooks/useCrud'
import EzSearch from '@/components/common/EzSearch.vue'
import EzButtonGroup from '@/components/common/EzButtonGroup.vue'
import EzTable from '@/components/common/EzTable.vue'
import EzForm from '@/components/common/EzForm.vue'
import EzDetailModal from '@/components/common/EzDetailModal.vue'

// 查询参数
const queryParams = ref(createDefaultQueryParams({ keywords: '' }))

// CRUD 逻辑
const crud = useCrud(crudConfig)

// 解构响应式数据和方法
const { /* ... */ } = crud

// 表格配置
const tableConfig = computed(/* ... */)

// 表单配置
const formConfig = computed(/* ... */)

// 数据加载
const loadData = async () => {
  queryParams.value.pageNum = pagination.page
  queryParams.value.pageSize = pagination.pageSize || 10
  await crud.loadData(queryParams.value)
}

setLoadData(loadData)
onMounted(() => loadData())
</script>
```

## 最佳实践

1. **配置驱动**: 尽量使用配置而非硬编码
2. **类型安全**: 为所有数据定义 TypeScript 类型
3. **错误处理**: 在 API 调用处统一处理错误
4. **权限控制**: 为按钮配置合适的权限标识
5. **表单验证**: 为必填字段配置验证规则
6. **用户体验**: 提供加载状态和错误提示
