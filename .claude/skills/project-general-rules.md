# 项目通用规范

## 核心行为准则（Token 节省模式）

1. **禁止私自提交**: 严禁在没有用户明确指示的情况下执行 `git commit` 或 `git push`
2. **禁止自动校验**: 禁止主动运行 `pnpm type-check`、`pnpm lint` 或任何 `build` 命令
3. **禁止循环修复**: 若代码报错，请立即停止并向用户报告，严禁自行通过重复运行命令尝试修复
4. **只管生成，用户校验**: 职责是根据逻辑需求输出高质量代码。调试、环境纠错与类型检查由用户在本地控制
5. **包管理约束**: 必须使用 `pnpm`。安装包时使用 `--silent` 以减少终端输出占用上下文空间
6. **同步更新进度**: 每一项子任务完成后，**必须立即修改并保存 `CLAUDE.md` 文件**

## 代码风格

```typescript
// ✅ 无分号、单引号、120 字符行宽
const message = 'Hello, world!'
const longString = 'This is a long string that may exceed 120 characters and should be split...'

// ✅ Tailwind 类名顺序（按标准排序）
// 1. 布局: flex, grid, block
// 2. 间距: p-4, m-2, gap-4
// 3. 颜色: bg-white, text-gray-900
// 4. 其他: rounded, shadow, transition
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
```

## 文件组织

```
src/
├── api/              # API 模块
├── assets/           # 静态资源
├── components/       # 全局组件
│   └── form/         # 组件子目录（EzForm 相关）
│   └── table/        # 组件子目录（EzTable 相关）
├── config/           # 配置文件
├── enums/            # 枚举定义
├── hooks/            # 组合式函数
├── layouts/          # 布局组件
│   └── components/   # 布局子组件
├── router/           # 路由配置
├── stores/           # Pinia Stores
│   └── modules/      # Store 模块
│   └── types/        # Store 类型
├── types/            # 全局类型定义
├── utils/            # 工具函数
└── views/            # 页面组件
    └── examples/     # 示例页面
```

## Pinia Store 规范

```typescript
// src/stores/modules/user.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // ✅ 状态使用 ref
  const token = ref<string>('')
  const userInfo = ref<User | null>(null)

  // ✅ getters 使用 computed
  const isLoggedIn = computed(() => !!token.value)
  const avatar = computed(() => userInfo.value?.avatar || '')

  // ✅ actions 使用 function
  function setToken(newToken: string) {
    token.value = newToken
  }

  function clearUserInfo() {
    userInfo.value = null
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    avatar,
    setToken,
    clearUserInfo
  }
})
```

## 路由规范

```typescript
// src/router/index.ts
const routes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/UserManagement.vue'),
    meta: {
      title: '用户管理',
      requiresAuth: true
    }
  }
]
```

## API 调用规范

```typescript
// src/api/user.ts
import { request } from '@/utils/request'
import type { User, UserListParams } from '@/types/user'

export function getUserList(params: UserListParams) {
  return request<User[]>({
    url: '/users',
    method: 'get',
    params
  })
}

export function createUser(data: Partial<User>) {
  return request<User>({
    url: '/users',
    method: 'post',
    data
  })
}

// 使用
import { getUserList } from '@/api/user'

const { data, loading } = await getUserList({ page: 1, size: 10 })
```

## 错误处理规范

```typescript
// ✅ 使用 useNaiveApi 处理错误
const { message } = useNaiveApi()

try {
  await createUser(formData)
  message.success('创建成功')
} catch (error) {
  // 错误已在 request.ts 中统一处理
  console.error('Create user failed:', error)
}
```

## 类型定义规范

```typescript
// src/types/user.ts
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  createdAt: string
}

export interface UserListParams {
  page: number
  size: number
  keyword?: string
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}
```

---

**任何代码生成都必须遵守以上规范！**
