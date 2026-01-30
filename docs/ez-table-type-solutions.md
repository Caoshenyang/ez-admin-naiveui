# EzTable 类型安全方案对比

## 方案 1：类型继承 + 显式传递 ✅ 当前实现

```vue
<script setup lang="ts" generic="T = any">
import { ref, type CSSProperties } from 'vue'
import { NDataTable, type DataTableProps } from 'naive-ui'

type EzTableProps<T> = Omit<DataTableProps<T>, 'class' | 'style'> & {
  toolbar?: ToolbarConfig
  class?: string
  style?: CSSProperties
}

const props = defineProps<EzTableProps<T>>()

// 提取 NDataTable 需要的 props
const dataTableProps: DataTableProps<T> = (() => {
  const { toolbar, class: _, style: __, ...rest } = props
  return rest
})()
</script>

<template>
  <n-data-table v-bind="dataTableProps" />
</template>
```

**优点**：
- ✅ 完整的类型提示和检查
- ✅ 泛型支持
- ✅ IDE 自动补全

**缺点**：
- ⚠️ 需要手动提取 props
- ⚠️ 代码稍多

---

## 方案 2：透传 + 使用 `InstanceType` 获取组件类型

```vue
<script setup lang="ts" generic="T = any">
import { ref, type CSSProperties } from 'vue'
import { NDataTable } from 'naive-ui'

const props = defineProps<{
  toolbar?: ToolbarConfig
  class?: string
  style?: CSSProperties
  // 其他 NaiveUI props 不会提示
}>()
</script>

<template>
  <n-data-table v-bind="$attrs" />
</template>
```

**优点**：
- ✅ 代码最简洁
- ✅ 运行时完美

**缺点**：
- ❌ 无类型提示
- ❌ 无类型检查

---

## 方案 3：使用 `withDefaults` 定义默认值（折中方案）

```vue
<script setup lang="ts" generic="T = any">
import { ref, type CSSProperties } from 'vue'
import { type DataTableProps, type DataTableColumns } from 'naive-ui'

interface EzTableProps<T = any> {
  /** 列配置 */
  columns: DataTableColumns<T>
  /** 数据源 */
  data: readonly T[]
  /** 分页配置 */
  pagination?: any
  /** 工具栏配置 */
  toolbar?: ToolbarConfig
  /** 行样式 */
  rowClassName?: string | ((row: T, index: number) => string)
  /** 行 key */
  rowKey: (row: T) => string | number
  /** 容器类名 */
  class?: string
  /** 容器样式 */
  style?: CSSProperties
  /** NaiveUI 其他常用 props */
  striped?: boolean
  bordered?: boolean
  singleLine?: boolean
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  scrollX?: string | number
  maxHeight?: number | string
}

const props = withDefaults(defineProps<EzTableProps<T>>(), {
  striped: true,
  bordered: true,
  size: 'medium'
})
</script>

<template>
  <div>
    <EzTableToolbar v-if="toolbar" :toolbar="toolbar" />
    <n-data-table
      :columns="columns"
      :data="data"
      :pagination="pagination"
      :row-class-name="rowClassName"
      :row-key="rowKey"
      :striped="striped"
      :bordered="bordered"
      :single-line="singleLine"
      :size="size"
      :loading="loading"
      :scroll-x="scrollX"
      :max-height="maxHeight"
      v-bind="$attrs"
    />
  </div>
</template>
```

**优点**：
- ✅ 常用属性有类型提示
- ✅ 可以设置默认值
- ✅ 仍然支持透传其他属性

**缺点**：
- ⚠️ 需要手动定义常用属性
- ⚠️ 不常用的属性需要查文档

---

## 方案 4：使用 TS 工具类型自动继承（高级）

```vue
<script setup lang="ts" generic="T = any">
import { ref, type CSSProperties } from 'vue'
import { NDataTable, type DataTableProps } from 'naive-ui'

// 自动继承所有 props，但保留自定义
type InheritedProps<T> = Omit<DataTableProps<T>, 'toolbar' | 'class' | 'style'>
type CustomProps = {
  toolbar?: ToolbarConfig
  class?: string
  style?: CSSProperties
}

type EzTableProps<T> = InheritedProps<T> & CustomProps

const props = defineProps<EzTableProps<T>>()

// 使用 toRaw 避免响应式开销
import { toRaw } from 'vue'
const dataTableProps = () => {
  const raw = toRaw(props)
  const { toolbar, class: cls, style, ...rest } = raw
  return rest
}
</script>

<template>
  <n-data-table v-bind="dataTableProps()" />
</template>
```

**优点**：
- ✅ 完整类型继承
- ✅ 泛型支持
- ✅ 类型安全

**缺点**：
- ⚠️ 每次渲染创建新对象（性能开销）

---

## 推荐选择

### 🎯 对于 EzTable 组件：推荐 **方案 1**（当前实现）

理由：
1. **类型安全最重要**：表格组件是核心业务组件，类型检查能避免很多 bug
2. **性能最优**：编译时确定类型，运行时零开销
3. **开发体验好**：完整的 IDE 自动补全
4. **可维护性强**：代码清晰，易于理解

### 何时使用其他方案？

- **方案 2（透传）**：快速原型开发，或者封装的组件非常简单
- **方案 3（显式常用）**：组件只用到原组件的少数功能，不需要全部继承
- **方案 4（工具类型）**：需要频繁更新的组件，自动化程度高

## 结论

对于 EzTable 这种**核心业务组件**，**方案 1（类型继承）**是最佳选择。
