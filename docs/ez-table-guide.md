# EzTable 表格组件使用指南

## 组件概述

`EzTable` 是基于 NaiveUI DataTable 的极简封装，直接透传所有原生功能，仅添加美化工具栏。

### 设计理念

- ✅ **零学习成本**：完全兼容 NaiveUI DataTable API
- ✅ **最小封装**：只添加工具栏和样式容器
- ✅ **灵活扩展**：所有 NaiveUI 功能都可用
- ✅ **易于维护**：代码量极小，只有 83 行

### 核心特性

- ✅ **完全透传**：使用 `$attrs` 透传所有 NaiveUI DataTable 的 props
- ✅ **工具栏**：支持标题、刷新按钮、全屏按钮
- ✅ **全屏功能**：内置全屏切换功能
- ✅ **插槽透传**：自动透传所有 NaiveUI DataTable 的插槽

---

## 技术实现

### 类型方案：使用 `$attrs` 透传

EzTable 不继承 NaiveUI 的 `DataTableProps` 类型，而是只定义自己的 3 个 props，其他所有 props 通过 `$attrs` 透传。

#### 实际代码（`src/components/EzTable.vue`）

```vue
<script setup lang="ts">
import { ref, type CSSProperties } from 'vue'
import { NDataTable } from 'naive-ui'
import EzTableToolbar from './table/EzTableToolbar.vue'
import type { ToolbarConfig } from '@/types/table'

/**
 * EzTable 组件 Props
 * 只定义我们自定义的配置，其他 props 通过 $attrs 透传给 NDataTable
 */
interface EzTableProps {
  /** 工具栏配置 */
  toolbar?: ToolbarConfig
  /** 容器类名 */
  class?: string
  /** 容器样式 */
  style?: CSSProperties
}

defineProps<EzTableProps>()

const tableRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

/** 处理刷新 */
const handleRefresh = () => {
  // 通过 emit 触发父组件的刷新
}

/** 处理全屏切换 */
const handleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (tableRef.value) {
    tableRef.value.classList.toggle('ez-table-fullscreen', isFullscreen.value)
    document.body.style.overflow = isFullscreen.value ? 'hidden' : ''
  }
}
</script>

<template>
  <div
    ref="tableRef"
    :class="['ez-table', 'flex', 'flex-col', 'bg-white', 'rounded-lg', 'overflow-hidden', $props.class]"
    :style="$props.style"
  >
    <!-- 工具栏 -->
    <EzTableToolbar
      v-if="$props.toolbar && Object.keys($props.toolbar).length > 0"
      :toolbar="$props.toolbar"
      :is-fullscreen="isFullscreen"
      @refresh="handleRefresh"
      @fullscreen="handleFullscreen"
    >
      <template v-if="$slots['toolbar-left']" #left>
        <slot name="toolbar-left" />
      </template>
      <template v-if="$slots['toolbar-right']" #right>
        <slot name="toolbar-right" />
      </template>
    </EzTableToolbar>

    <!-- 表格主体 - 使用 v-bind="$attrs" 透传所有 DataTable props -->
    <div class="ez-table-body flex-1 overflow-auto">
      <n-data-table v-bind="$attrs">
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData || {}" />
        </template>
      </n-data-table>
    </div>
  </div>
</template>

<style scoped>
.ez-table-fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 9999 !important;
}
</style>
```

### 工具栏组件（`src/components/table/EzTableToolbar.vue`）

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NTooltip, NIcon } from 'naive-ui'
import { RefreshOutline, ContractOutline, ExpandOutline } from '@vicons/ionicons5'
import type { ToolbarConfig } from '@/types/table'

interface Props {
  toolbar: ToolbarConfig
  isFullscreen: boolean
}

interface Emits {
  refresh: []
  fullscreen: []
}

const props = withDefaults(defineProps<Props>(), {
  toolbar: () => ({}),
  isFullscreen: false,
})

const emit = defineEmits<Emits>()

// 是否显示工具栏
const showToolbar = computed(() => {
  return (
    props.toolbar.showRefresh ||
    props.toolbar.showFullscreen ||
    props.toolbar.left ||
    props.toolbar.right ||
    Boolean(props.toolbar.title)
  )
})

const handleRefresh = () => {
  emit('refresh')
}

const handleFullscreen = () => {
  emit('fullscreen')
}
</script>

<template>
  <div v-if="showToolbar" class="ez-table-toolbar flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
    <!-- 左侧：标题和自定义内容 -->
    <div class="toolbar-left flex items-center gap-3">
      <slot name="left">
        <h3 v-if="toolbar.title" class="text-base font-semibold text-gray-700">
          {{ toolbar.title }}
        </h3>
        <component v-if="toolbar.left" :is="toolbar.left()" />
      </slot>
    </div>

    <!-- 右侧：操作按钮 -->
    <div class="toolbar-right flex items-center">
      <div class="flex items-center gap-2">
        <!-- 右侧自定义内容（按钮组之前） -->
        <slot name="right">
          <component v-if="toolbar.right" :is="toolbar.right()" />
        </slot>

        <!-- 刷新按钮 -->
        <NTooltip v-if="toolbar.showRefresh" placement="bottom">
          <template #trigger>
            <NButton quaternary circle size="small" @click="handleRefresh">
              <template #icon>
                <NIcon :component="RefreshOutline" />
              </template>
            </NButton>
          </template>
          刷新
        </NTooltip>

        <!-- 全屏按钮 -->
        <NTooltip v-if="toolbar.showFullscreen" placement="bottom">
          <template #trigger>
            <NButton quaternary circle size="small" @click="handleFullscreen">
              <template #icon>
                <NIcon :component="isFullscreen ? ContractOutline : ExpandOutline" />
              </template>
            </NButton>
          </template>
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </NTooltip>
      </div>
    </div>
  </div>
</template>
```

### 类型定义（`src/types/table.ts`）

```typescript
/**
 * 表格工具栏配置
 */
export interface ToolbarConfig {
  /** 工具栏标题 */
  title?: string
  /** 是否显示刷新按钮 */
  showRefresh?: boolean
  /** 是否显示全屏按钮 */
  showFullscreen?: boolean
  /** 刷新回调 */
  onRefresh?: () => void
  /** 左侧自定义内容 */
  left?: () => VNode | VNode[]
  /** 右侧自定义内容（按钮组之前） */
  right?: () => VNode | VNode[]
}
```

---

## API 文档

### EzTable Props

EzTable 只定义了 3 个自定义 props，其他所有 NaiveUI DataTable 的 props 通过 `$attrs` 透传。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `toolbar` | `ToolbarConfig` | - | 工具栏配置 |
| `class` | `string` | - | 容器类名 |
| `style` | `CSSProperties` | - | 容器样式 |

### ToolbarConfig

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 工具栏标题 |
| `showRefresh` | `boolean` | - | 是否显示刷新按钮 |
| `showFullscreen` | `boolean` | - | 是否显示全屏按钮 |
| `onRefresh` | `() => void` | - | 刷新回调 |
| `left` | `() => VNode \| VNode[]` | - | 左侧自定义内容 |
| `right` | `() => VNode \| VNode[]` | - | 右侧自定义内容 |

### EzTable Slots

| 插槽名 | 说明 |
|--------|------|
| `toolbar-left` | 工具栏左侧内容（传递给 EzTableToolbar 的 `left` 插槽） |
| `toolbar-right` | 工具栏右侧内容（传递给 EzTableToolbar 的 `right` 插槽） |
| 其他插槽 | 自动透传给 NDataTable（如 `empty` 等） |

### 透传的 NaiveUI Props

所有 NaiveUI DataTable 的 props 都可以直接使用，包括：

- `columns` - 列配置（必填）
- `data` - 数据源
- `loading` - 是否加载中
- `pagination` - 分页配置
- `row-key` - 行唯一标识
- `bordered` - 是否显示边框
- `striped` - 是否斑马纹
- 以及其他所有 NaiveUI DataTable props

完整列表请参考：[NaiveUI DataTable 文档](https://www.naiveui.com/zh-CN/os-theme/components/data-table)

### 透传的 NaiveUI Events

所有 NaiveUI DataTable 的事件都自动透传，包括：

- `update:checked-row-keys` - 选择变化事件
- `update:page` - 分页变化事件
- `update:page-size` - 分页大小变化事件
- 以及其他所有 NaiveUI DataTable events

---

## 快速开始

### 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { type DataTableColumns } from 'naive-ui'
import EzTable from '@/components/EzTable.vue'

interface User {
  id: number
  name: string
  email: string
}

const data = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
])

const columns: DataTableColumns<User> = [
  { type: 'selection' },
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  { title: '邮箱', key: 'email' },
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

### 带工具栏

```vue
<script setup lang="ts">
const toolbar = {
  title: '用户列表',
  showRefresh: true,
  showFullscreen: true,
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
    <template #toolbar-left>
      <NButton type="primary">新增用户</NButton>
    </template>

    <template #toolbar-right>
      <span class="text-gray-500">共 {{ data.length }} 条</span>
    </template>
  </EzTable>
</template>
```

### 带分页和选择

```vue
<script setup lang="ts">
const selectedRowKeys = ref<number[]>([])

const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 100,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
})

const handleCheck = (keys: number[]) => {
  selectedRowKeys.value = keys
}
</script>

<template>
  <EzTable
    :columns="columns"
    :data="data"
    :row-key="(row) => row.id"
    :checked-row-keys="selectedRowKeys"
    :pagination="pagination"
    @update:checked-row-keys="handleCheck"
  />
</template>
```

---

## 完整示例

**文件位置**：`src/views/examples/components/TableExample.vue`

该示例包含：
- ✅ 选择功能（多选）
- ✅ 排序功能（多列排序）
- ✅ 筛选功能（多列筛选）
- ✅ 自定义渲染（头像、标签、徽章）
- ✅ 固定列（操作列）
- ✅ 工具栏（标题、刷新、全屏）
- ✅ 分页配置
- ✅ 批量操作

访问路径：`/examples/table`

---

## 容器样式

EzTable 的默认容器样式（Tailwind CSS）：

```html
<div class="ez-table flex flex-col bg-white rounded-lg overflow-hidden">
  <!-- 工具栏 -->
  <!-- 表格主体 -->
</div>
```

可以通过 `class` prop 自定义：

```vue
<EzTable
  :columns="columns"
  :data="data"
  class="shadow-lg border border-gray-200"
/>
```

---

## 全屏功能

点击工具栏的全屏按钮后，表格会进入全屏模式：

- 添加 `ez-table-fullscreen` class
- 固定定位覆盖整个视口
- `z-index: 9999`
- 禁止 body 滚动

全屏样式：

```css
.ez-table-fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 9999 !important;
}
```

---

## 注意事项

### 1. 刷新功能

工具栏的刷新按钮点击后会触发 `toolbar.onRefresh` 回调（如果定义了），需要手动实现刷新逻辑。

### 2. 插槽透传

EzTable 会自动透传所有 NaiveUI DataTable 的插槽，包括：
- `empty` - 空状态
- 以及其他所有 NDataTable 插槽

工具栏自定义插槽：
- `toolbar-left` - 工具栏左侧内容
- `toolbar-right` - 工具栏右侧内容

### 3. Props 透传

所有未在 EzTable props 中定义的属性都会自动透传给 NDataTable，因此可以直接使用所有 NaiveUI DataTable 的功能。

---

## 相关文件

- **主组件**：`src/components/EzTable.vue` (83 行)
- **工具栏组件**：`src/components/table/EzTableToolbar.vue` (97 行)
- **类型定义**：`src/types/table.ts` (18 行)
- **完整示例**：`src/views/examples/components/TableExample.vue` (426 行)
