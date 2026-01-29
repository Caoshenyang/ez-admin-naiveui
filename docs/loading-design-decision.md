# Loading 状态管理 - 设计决策文档

## 设计目标

构建一个**灵活、可控、类型安全**的 Loading 状态管理系统，避免过度自动化导致的用户体验问题。

## 架构决策

### ❌ 拒绝的方案：集成到 Axios 拦截器

#### 方案描述
```typescript
// ❌ 不推荐：在请求拦截器中自动管理 loading
service.interceptors.request.use((config) => {
  loadingStore.start({ key: 'request' })
  return config
})

service.interceptors.response.use((response) => {
  loadingStore.stop('request')
  return response
})
```

#### 拒绝原因

| 问题 | 说明 | 影响 |
|------|------|------|
| **过度自动化** | 所有请求自动显示 loading | 静默请求、轮询请求也会触发 loading |
| **灵活性差** | 无法区分业务场景 | 无法区分全局/局部 loading |
| **并发冲突** | 多个请求导致 loading 闪烁 | 用户体验差 |
| **性能开销** | 每次请求都触发状态更新 | 不必要的渲染 |
| **语义模糊** | "request" key 无法准确描述业务 | 代码可读性差 |

#### 具体问题场景

```typescript
// 场景 1: 静默刷新 token
await refreshToken() // ❌ 会触发全局 loading

// 场景 2: 轮询获取数据
setInterval(() => {
  fetchNotifications() // ❌ 频繁触发 loading 闪烁
}, 5000)

// 场景 3: 并发请求
Promise.all([
  fetchUserInfo(),    // ❌ loading 闪烁
  fetchUserStats(),   // ❌ loading 闪烁
  fetchUserSettings() // ❌ loading 闪烁
])

// 场景 4: 后台数据同步
await syncDataToServer() // ❌ 不需要用户感知的操作也显示 loading
```

### ✅ 选择的方案：组合式 API 按需管理

#### 方案描述
```typescript
// ✅ 推荐：使用 useLoading Hook 按需管理
const { wrapLoading } = useLoading('user')

// 明确指定哪些操作需要 loading
const data = await wrapLoading('fetch', userApi.getList(...))
```

#### 选择原因

| 优势 | 说明 | 实际效果 |
|------|------|---------|
| **按需控制** | 只在需要时显示 loading | 静默请求不受影响 |
| **业务语义** | key 描述具体业务场景 | `user:fetch`, `order:submit` |
| **灵活组合** | 支持全局/局部 loading | 根据场景选择 |
| **并发友好** | 多个操作共享 loading 状态 | `loadingCount` 准确反映 |
| **类型安全** | 完整的 TypeScript 支持 | 编译时错误检查 |
| **开发体验** | 简洁的 API，易于使用 | 一行代码搞定 |

#### 核心设计理念

**"显式优于隐式"（Explicit is better than Implicit）**

```typescript
// ❌ 隐式：无法控制
await apiCall() // 自动显示 loading

// ✅ 显式：明确意图
await wrapLoading('getUser', apiCall()) // 明确知道会显示 loading
```

## 架构设计

### 三层架构

```
┌─────────────────────────────────────────┐
│   组件层 (Component Layer)              │
│   ┌─────────────────────────────────┐   │
│   │ 使用 useLoading Hook            │   │
│   │ <n-spin :show="isLoading">     │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│   Hook 层 (Composable Layer)            │
│   ┌─────────────────────────────────┐   │
│   │ useLoading(prefix)              │   │
│   │ - 提供便捷的 API                │   │
│   │ - 模块化前缀管理                │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│   Store 层 (State Layer)                │
│   ┌─────────────────────────────────┐   │
│   │ useLoadingStore                 │   │
│   │ - 管理 loading 状态集合         │   │
│   │ - 提供底层操作方法              │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 关键设计决策

#### 1. 使用 Set 而不是 Array

```typescript
// ✅ 使用 Set
const loadingSet = ref<Set<string>>(new Set())

// 为什么？
// - 自动去重，避免重复添加
// - O(1) 查找性能
// - 语义更清晰（集合而非列表）
```

#### 2. 模块前缀机制

```typescript
// ✅ 使用前缀避免冲突
const userLoading = useLoading('user')
const orderLoading = useLoading('order')

userLoading.startLoading('fetch')  // 'user:fetch'
orderLoading.startLoading('fetch') // 'order:fetch'
// 两个 loading 互不干扰
```

#### 3. 异步包装函数

```typescript
// ✅ 自动管理 loading 的开启和关闭
async function wrap<T>(key: string, promise: Promise<T>): Promise<T> {
  try {
    start(key)
    return await promise
  } finally {
    stop(key) // 保证一定会执行
  }
}
```

#### 4. 分离全局和局部 Loading

```typescript
// 全局 loading：全屏遮罩
globalLoading: ref<boolean>
loadingText: ref<string>

// 局部 loading：按钮、卡片等
loadingSet: ref<Set<string>>
```

## 使用指南

### 基本原则

1. **按需使用**：只在需要用户感知的操作中显示 loading
2. **语义化命名**：key 要能准确描述业务场景
3. **模块化组织**：使用前缀避免冲突
4. **及时清理**：组件卸载时清理 loading 状态

### 决策树

```
需要显示 loading？
│
├─ 否 → 直接调用 API（静默请求）
│         await api.call()
│
└─ 是 → 需要什么类型的 loading？
           │
           ├─ 全局 loading（全屏遮罩）
           │   → wrapLoading(key, promise, { global: true })
           │
           ├─ 局部 loading（按钮、表单）
           │   → wrapLoading(key, promise)
           │
           └─ 自定义控制
               → startLoading() / stopLoading()
```

## 性能考虑

### 避免不必要的渲染

```typescript
// ✅ 使用 isPrefixLoading 而不是遍历 loadingSet
const isPrefixLoading = computed(() =>
  Array.from(loadingSet.value).some(key => key.startsWith(`${prefix}:`))
)
```

### 减少响应式开销

```typescript
// ✅ loadingSet 使用 ref，避免深层响应式
const loadingSet = ref<Set<string>>(new Set())

// 而不是
const loadingState = reactive({
  loadings: {} // ❌ 会导致深层响应式
})
```

## 扩展性

### 支持自定义场景

```typescript
// 扩展 1: 进度条 loading
const progress = ref(0)
function startWithProgress(key: string) {
  start(key)
  const timer = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      clearInterval(timer)
    }
  }, 100)
}

// 扩展 2: 超时控制
async function wrapWithTimeout<T>(
  key: string,
  promise: Promise<T>,
  timeout: number
): Promise<T> {
  return Promise.race([
    wrapLoading(key, promise),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ])
}
```

## 总结

| 设计原则 | 实现方式 | 效果 |
|---------|---------|------|
| **显式优于隐式** | 按需调用，不自动集成 | 避免过度自动化 |
| **灵活性优先** | 支持多种使用方式 | 适应不同场景 |
| **类型安全** | 完整的 TypeScript 支持 | 编译时错误检查 |
| **性能优化** | Set 数据结构、computed 优化 | 高效的状态管理 |
| **开发体验** | 简洁的 API、语义化命名 | 易于使用和维护 |

这个设计的核心是**将控制权交给开发者**，而不是通过黑魔法自动化一切。这样虽然需要多写一行代码，但换来的是**精确控制、灵活性和可维护性**。
