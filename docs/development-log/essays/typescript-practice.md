# TypeScript 类型编程的实践

## 在 Vue 3 项目中的类型安全探索

TypeScript 不仅仅是类型检查，更是代码质量和开发体验的保障。

### 🎯 类型安全的重要性

在前端开发中，类型安全意味着：

- **编译时错误捕获**：在运行前发现潜在问题
- **更好的 IDE 支持**：智能提示和重构
- **自文档化代码**：类型即文档
- **重构的信心**：大规模重构的安全保障

### 💡 实用类型技巧

#### 1. 泛型组件的类型定义

```typescript
// 通用表格组件的类型定义
interface TableColumn<T> {
  key: keyof T
  title: string
  width?: number
  render?: (record: T) => VNode
}

interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
}

// 使用示例
const userColumns: TableColumn<User>[] = [
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
  {
    key: 'status',
    title: '状态',
    render: (record) => h('span', record.status ? '激活' : '未激活')
  }
]
```

#### 2. API 响应的类型安全

```typescript
// API 响应的统一格式
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 具体的响应类型
type UserResponse = ApiResponse<User>
type UserListResponse = ApiResponse<User[]>

// API 函数的类型定义
interface UserApi {
  getUser(id: number): Promise<UserResponse>
  getUserList(params: UserListParams): Promise<UserListResponse>
  createUser(user: CreateUserRequest): Promise<UserResponse>
}
```

#### 3. 组合式函数的类型推断

```typescript
// 自动推断返回类型
function useTableData<T>(api: () => Promise<T[]>) {
  const data = ref<T[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      data.value = await api()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
    } finally {
      loading.value = false
    }
  }

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    fetchData
  }
}

// 使用时自动推断类型
const { data, loading, error } = useTableData<User>(api.getUsers)
```

### 🚀 高级类型编程

#### 条件类型和映射类型

```typescript
// 从接口生成可选的更新类型
type OptionalUpdate<T> = {
  [K in keyof T]?: T[K] | null
}

// 从表单数据生成验证规则
type ValidationRules<T> = {
  [K in keyof T]?: (value: T[K]) => string | null
}

// API 参数的序列化
type Serialized<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends object
      ? Serialized<T[K]>
      : T[K]
}
```

### 🎨 最佳实践

1. **从小开始**：从核心业务类型开始，逐步扩展
2. **保持简单**：避免过度复杂的类型编程
3. **利用工具**：使用 `keyof`、`typeof` 等工具类型
4. **类型测试**：为复杂的类型逻辑编写测试
5. **渐进式迁移**：逐步为现有代码添加类型

TypeScript 是一把双刃剑，用得好能显著提升代码质量，用不好则会适得其反。关键在于找到平衡点，让类型为业务服务，而不是成为负担。

[← 返回随笔集](../essays/index.md)