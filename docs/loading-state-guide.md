# Loading 状态管理使用指南

## 概述

项目实现了基于 Pinia Store 的 Loading 状态管理系统，支持：
- 全局 Loading 状态
- 按模块/功能的独立 Loading
- 异步操作自动包装
- 组合式 API 使用方式

## 目录结构

```
src/
├── stores/
│   ├── modules/
│   │   └── loading.ts          # Loading Store
│   └── types/
│       └── loading.ts          # Loading 类型定义
├── hooks/
│   └── useLoading.ts           # Loading 组合式函数
└── components/
    └── EzLoadingBar.vue        # 全局加载进度条
```

## 核心 API

### 1. useLoading Hook

推荐的组合式函数，提供便捷的 Loading 状态管理。

#### 基础用法

```typescript
import { useLoading } from '@/hooks/useLoading'

// 在组件中使用
const { isLoading, startLoading, stopLoading } = useLoading()

// 开始 loading
startLoading()

// 结束 loading
stopLoading()
```

#### 模块化用法（推荐）

```typescript
// 指定模块前缀，避免冲突
const { startLoading, stopLoading } = useLoading('user')

// 实际 key 为 'user:fetch'
startLoading('fetch')
stopLoading('fetch')
```

#### 异步包装（推荐）

```typescript
const { wrapLoading } = useLoading('api')

// 自动管理 loading 状态
const data = await wrapLoading(
  'getUser',
  getUserInfo(),
  { global: true, text: '加载用户信息...' }
)
```

### 2. useLoadingStore

直接使用 Store，适合复杂场景。

```typescript
import { useLoadingStore } from '@/stores/modules/loading'

const loadingStore = useLoadingStore()

// 检查 loading 状态
loadingStore.isLoading
loadingStore.loadingCount

// 手动控制
loadingStore.start({ key: 'submit', global: true })
loadingStore.stop('submit')
loadingStore.clear()
```

## 使用场景

### 场景 1: 表格数据加载

```vue
<script setup lang="ts">
import { useLoading } from '@/hooks/useLoading'
import { userApi } from '@/api'

const { isLoading, wrapLoading } = useLoading('user-table')

const tableData = ref([])

async function fetchTableData() {
  tableData.value = await wrapLoading('fetch', userApi.getList({
    page: 1,
    pageSize: 10
  }))
}
</script>

<template>
  <n-spin :show="isLoading">
    <n-data-table :data="tableData" />
  </n-spin>
</template>
```

### 场景 2: 表单提交

```vue
<script setup lang="ts">
import { useLoading } from '@/hooks/useLoading'
import { userApi } from '@/api'

const { isLoading: isSubmitting, wrapLoading } = useLoading('user-form')

async function handleSubmit() {
  try {
    await wrapLoading('submit', userApi.create(formData), {
      global: true,
      text: '提交中...'
    })
    // 成功处理
  } catch (error) {
    // 错误处理
  }
}
</script>

<template>
  <n-button :loading="isSubmitting" @click="handleSubmit">
    提交
  </n-button>
</template>
```

### 场景 3: 多个并行请求

```vue
<script setup lang="ts">
import { useLoading } from '@/hooks/useLoading'
import { userApi, authApi } from '@/api'

const { isLoading, isPrefixLoading, startLoading, stopLoading } = useLoading('dashboard')

// 检查当前模块下是否有任何 loading 在进行
watchEffect(() => {
  console.log('Dashboard loading:', isPrefixLoading.value)
})

async function loadDashboardData() {
  startLoading('init')
  try {
    const [users, auth] = await Promise.all([
      userApi.getList({ page: 1, pageSize: 10 }),
      authApi.login({ username: 'admin', password: '123456' })
    ])
    // 处理数据
  } finally {
    stopLoading('init')
  }
}
</script>

<template>
  <n-spin :show="isPrefixLoading">
    <div>Dashboard Content</div>
  </n-spin>
</template>
```

### 场景 4: 全局 Loading

```vue
<script setup lang="ts">
import { useLoading } from '@/hooks/useLoading'

const { isGlobalLoading, loadingText } = useLoading()

async function performHeavyTask() {
  const { wrapLoading } = useLoading('heavy-task')

  await wrapLoading(
    'process',
    heavyTaskProcessor(),
    { global: true, text: '正在处理数据...' }
  )
}
</script>

<template>
  <n-spin :show="isGlobalLoading" :description="loadingText">
    <router-view />
  </n-spin>
</template>
```

## 与请求模块集成

在 `src/utils/request.ts` 中集成 Loading 状态：

```typescript
import { useLoadingStore } from '@/stores/modules/loading'

// 在请求拦截器中
service.interceptors.request.use((config) => {
  // 自动管理 loading
  if (config.showLoading !== false) {
    const loadingStore = useLoadingStore()
    loadingStore.start({
      key: config.loadingKey || 'request',
      global: config.globalLoading
    })
  }
  return config
})

// 在响应拦截器中
service.interceptors.response.use(
  (response) => {
    const loadingStore = useLoadingStore()
    const key = response.config.loadingKey || 'request'
    loadingStore.stop(key)
    return response
  },
  (error) => {
    const loadingStore = useLoadingStore()
    const key = error.config?.loadingKey || 'request'
    loadingStore.stop(key)
    return Promise.reject(error)
  }
)
```

## 最佳实践

### 1. 命名规范

```typescript
// ✅ 推荐：使用模块前缀
const loading = useLoading('user')
const loading = useLoading('product-list')
const loading = useLoading('order-submit')

// ❌ 避免：没有前缀
const loading = useLoading()
```

### 2. 选择合适的 Loading 类型

```typescript
// 全局 Loading（全屏遮罩）
wrapLoading('task', apiCall(), { global: true })

// 局部 Loading（按钮、卡片等）
startLoading('button')
```

### 3. 清理 Loading 状态

```typescript
// 在组件卸载时清理
onBeforeUnmount(() => {
  clearLoading()
})
```

### 4. 避免 Loading 冲突

```typescript
// 为不同的操作使用不同的 key
startLoading('fetch')
startLoading('submit')
startLoading('delete')

// 而不是
startLoading() // 多次调用会冲突
```

## API 参考

### useLoading Hook

#### 返回值

| 属性/方法 | 类型 | 说明 |
|---------|------|------|
| `isLoading` | `Ref<boolean>` | 是否有任何 loading 在进行 |
| `isGlobalLoading` | `Ref<boolean>` | 是否是全局 loading |
| `isPrefixLoading` | `Ref<boolean>` | 当前前缀下是否有 loading |
| `loadingCount` | `Ref<number>` | 当前 loading 数量 |
| `loadingText` | `Ref<string>` | 加载提示文本 |
| `startLoading` | `(key?, options?) => void` | 开始 loading |
| `stopLoading` | `(key?) => void` | 结束 loading |
| `clearLoading` | `() => void` | 清空当前前缀的 loading |
| `checkLoading` | `(key) => boolean` | 检查指定 key 是否 loading |
| `wrapLoading` | `(key, promise, options?) => Promise` | 异步包装 |

### LoadingOptions

```typescript
interface LoadingOptions {
  key: string          // Loading 标识
  global?: boolean     // 是否全局 loading
  text?: string        // 提示文本
}
```

## 总结

- ✅ 优先使用 `useLoading` Hook
- ✅ 使用模块前缀避免冲突
- ✅ 优先使用 `wrapLoading` 自动管理异步操作
- ✅ 合理选择全局/局部 Loading
- ✅ 及时清理 Loading 状态
