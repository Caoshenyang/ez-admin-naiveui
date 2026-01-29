# 4.3 API 模块化管理

## 本节目标

- ✅ 按功能模块组织 API
- ✅ 统一 API 定义方式
- ✅ 实现 API 类型安全

---

## 1. API 目录结构

```
src/api/
├── index.ts          # API 入口
├── user.ts           # 用户相关 API
├── auth.ts           # 认证相关 API
└── system.ts         # 系统相关 API
```

---

## 2. 用户 API

**src/api/user.ts**:

```typescript
import request from '@/utils/request'
import type { User, UserForm, PageParams, PageResponse } from '@/types'

export const userApi = {
  /**
   * 获取用户列表
   */
  getList: (params: PageParams) =>
    request.get<PageResponse<User>>('/users', { params }),

  /**
   * 获取用户详情
   */
  getDetail: (id: number) =>
    request.get<User>(`/users/${id}`),

  /**
   * 创建用户
   */
  create: (data: UserForm) =>
    request.post<User>('/users', data),

  /**
   * 更新用户
   */
  update: (id: number, data: UserForm) =>
    request.put<User>(`/users/${id}`, data),

  /**
   * 删除用户
   */
  delete: (id: number) =>
    request.delete(`/users/${id}`),

  /**
   * 批量删除
   */
  batchDelete: (ids: number[]) =>
    request.delete('/users/batch', { data: { ids } }),
}
```

---

## 3. 认证 API

**src/api/auth.ts**:

```typescript
import request from '@/utils/request'
import type { LoginParams, LoginResult } from '@/types/auth'

export const authApi = {
  /**
   * 登录
   */
  login: (data: LoginParams) =>
    request.post<LoginResult>('/auth/login', data),

  /**
   * 登出
   */
  logout: () =>
    request.post('/auth/logout'),

  /**
   * 刷新 Token
   */
  refreshToken: (refreshToken: string) =>
    request.post<{ token: string }>('/auth/refresh', { refreshToken }),

  /**
   * 获取用户信息
   */
  getUserInfo: () =>
    request.get<User>('/auth/user'),
}
```

---

## 4. 统一导出

**src/api/index.ts**:

```typescript
export * as userApi from './user'
export * as authApi from './auth'
export * as systemApi from './system'
```

使用：
```typescript
import { userApi, authApi } from '@/api'

// 使用 API
const users = await userApi.getList({ page: 1, pageSize: 10 })
```

---

## 5. 本节小结

✅ 完成的工作：
- 建立了模块化的 API 结构
- 实现了类型安全的 API 调用

**下一步**: [4.4 错误处理机制](./04-错误处理机制.md)
