# 代码风格与架构规范

## 基本代码风格

### 格式化规则

- **无分号**: 语句末尾不使用分号
- **单引号**: 字符串使用单引号
- **行宽**: 120 字符
- **缩进**: 2 空格

```typescript
// ✅ 正确
const message = 'Hello, World!'
const count = 10

// ❌ 错误
const message = "Hello, World!";  // 使用了双引号和分号
```

## TypeScript 类型规范

### 类型定义原则

✅ **优先使用类型推断**（简单场景）
✅ **显式类型注解**（公共 API、复杂类型）
❌ **禁止使用 `any`**
❌ **禁止使用 `as` 类型断言**（除非必要）

```typescript
// ✅ 正确 - 推断类型
const count = ref(0)

// ✅ 正确 - 显式类型
interface User {
  id: number
  name: string
}
const user = ref<User>({ id: 1, name: 'John' })

// ❌ 错误 - 使用 any
const data: any = fetchData()

// ❌ 错误 - 使用 as
const user = data as User
```

### 类型定义位置

```
src/types/
├── api.ts          # API 相关类型
├── user.ts         # 用户相关类型
├── form.ts         # 表单相关类型
└── index.ts        # 统一导出
```

## 文件组织规范

### 目录结构

```
src/
├── api/              # API 模块
├── assets/           # 静态资源
├── components/       # 通用组件
├── config/           # 配置文件
├── enums/            # 枚举定义
├── hooks/            # 组合式函数
├── layouts/          # 布局组件
├── router/           # 路由配置
├── stores/           # Pinia 状态管理
│   └── modules/     # Store 模块
├── types/            # TypeScript 类型
├── utils/            # 工具函数
├── views/            # 页面组件
└── main.ts           # 应用入口
```

### 导入顺序

```typescript
// 1. Vue 相关
import { ref, computed } from 'vue'

// 2. 第三方库
import { debounce } from 'lodash-es'

// 3. 类型导入
import type { User } from '@/types'

// 4. 项目内部模块
import { useUserStore } from '@/stores/modules/user'
import EzTable from '@/components/EzTable.vue'
```

### 命名规范

```typescript
// 文件名: PascalCase
UserManagement.vue
useRequest.ts

// 组件名: PascalCase
export default defineComponent({
  name: 'UserManagement'
})

// 函数名: camelCase
function getUserInfo() {}

// 常量: UPPER_SNAKE_CASE 或 camelCase
const MAX_RETRY_COUNT = 3
const apiBaseUrl = 'https://api.example.com'

// 接口/类型: PascalCase
interface UserInfo {}
type UserStatus = 'active' | 'inactive'
```

## 组件设计原则

### 单一职责

每个组件只做一件事，保持简单

### 组件大小控制

- 业务组件: < 300 行
- 复杂组件: < 500 行
- 超过 500 行考虑拆分

### 组件通信模式选择

| 场景 | 推荐方式 |
|------|---------|
| 父子通信 | Props + Events |
| 双向绑定 | v-model |
| 跨层级通信 | Provide/Inject |
| 兄弟组件通信 | Pinia Store |
| 全局状态 | Pinia Store |

## 性能优化规范

### 计算属性缓存

```typescript
// ✅ 使用计算属性（有缓存）
const filteredList = computed(() => {
  return list.value.filter(item => item.active)
})

// ❌ 避免使用方法（无缓存）
function getFilteredList() {
  return list.value.filter(item => item.active)
}
```

### 列表渲染优化

```vue
<!-- ✅ 使用 key -->
<div v-for="item in list" :key="item.id">
  {{ item.name }}
</div>
```

### 懒加载组件

```typescript
// ✅ 路由懒加载
const UserList = () => import('@/views/users/UserList.vue')

// ✅ 组件懒加载
const HeavyComponent = defineAsyncComponent(() =>
  import('@/components/HeavyComponent.vue')
)
```

## 错误处理规范

### API 错误处理

```typescript
try {
  const result = await api.getData()
} catch (error) {
  if (error instanceof Error) {
    message.error(error.message)
  } else {
    message.error('未知错误')
  }
}
```

### 全局错误处理

已在 `src/utils/request.ts` 中配置响应拦截器处理。

## Git 提交规范

### 提交信息格式

```
<type>(<scope>): <subject>
```

### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `refactor`: 重构
- `docs`: 文档更新
- `style`: 代码格式调整
- `test`: 测试相关
- `chore`: 构建/工具链相关

### 示例

```bash
feat(components): add EzTable component
fix(api): handle 401 error properly
refactor(user): migrate to Composition API
```
