# 技术栈规范

## Tailwind CSS 4.x 规范

🚫 **严禁使用 `@apply` 指令**（官方已不再推荐）

```scss
/* ❌ 错误 - 禁止使用 @apply */
.button {
  @apply bg-blue-500 text-white px-4 py-2;
}

/* ✅ 正确 - 直接使用 utility classes */
<button class="bg-blue-500 text-white px-4 py-2">Button</button>
```

### 推荐做法

✅ 直接使用 utility classes
✅ 复杂样式使用 `@utility` 指令或 CSS 变量
✅ 主题自定义使用 `@theme` 指令

详细使用指南：`docs/tailwind-v4-guide.md`

## NaiveUI 规范

**组件库**: NaiveUI 负责复杂交互（表格、表单、弹窗）

### NaiveUI API 使用规范

**必须使用 `src/hooks/useNaiveApi.ts` 中导出的 API**

```typescript
// ✅ 正确
import { message, dialog, notification, modal, loadingBar } from '@/hooks/useNaiveApi'

message.success('操作成功')

// ❌ 错误 - 严禁直接使用全局变量
window.$message?.error('错误')
```

## Pinia Store 规范

**状态管理**: Pinia 使用 **Setup Store 模式**，目录结构采用 `modules/` 组织方式

### Setup Store 模式

```typescript
// src/stores/modules/user.ts
export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>('')

  // Getters
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  function setToken(newToken: string) {
    token.value = newToken
  }

  return { token, isLoggedIn, setToken }
})
```

### Store 使用规范

```typescript
// ✅ 正确 - 解构需要保持响应性
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const { token } = storeToRefs(userStore)

// ❌ 错误 - 直接解构会丢失响应性
const { token } = useUserStore()
```

## Vue Router 4 规范

**路由**: Vue Router 4 使用集中化路由配置

### 路由配置结构

```typescript
// 常量路由（无需权限）
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  }
]

// 异步路由（需要权限）
export const asyncRoutes: RouteRecordRaw[] = [...]
```

### 路由导航

```typescript
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

router.push('/admin/users')
router.push({ name: 'UserDetail', params: { id: 1 } })
```

## API 请求规范

### 请求封装使用

使用 `src/utils/request.ts` 中封装的请求方法：

```typescript
import request from '@/utils/request'

// GET 请求
const getUsers = () => request.get<User[]>('/api/users')

// POST 请求
const createUser = (data: CreateUserDto) => request.post<User>('/api/users', data)
```

### API 模块化

按功能模块组织 API：

```
src/api/
├── user.ts          # 用户相关 API
├── auth.ts          # 认证相关 API
└── index.ts         # 统一导出
```

## 工具函数规范

### 日期工具
```typescript
import { formatDate } from '@/utils/date'
const dateStr = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
```

### 验证工具
```typescript
import { isEmail, isPhone } from '@/utils/validate'
if (isEmail(value)) { /* ... */ }
```

### 存储工具
```typescript
import { storage } from '@/utils/storage'
storage.set('token', 'xxx')
const token = storage.get('token')
```

## 代码风格规范

- **无分号**: 语句末尾不使用分号
- **单引号**: 字符串使用单引号
- **行宽**: 120 字符
- **缩进**: 2 空格
