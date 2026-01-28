# 第4章：Axios 请求封装与拦截器 - 总结

## 本章回顾

本章完成了 Axios 的封装，实现了请求/响应拦截器、错误处理、Token 管理和请求取消等功能。

### 完成清单

- [x] 4.1 安装 Axios 与基础配置 (Done - 2025-01-28)
- [x] 4.2 请求拦截器实现（Token、Headers）(Done - 2025-01-28)
- [x] 4.3 响应拦截器实现（统一格式、错误处理）(Done - 2025-01-28)
- [x] 4.4 请求取消与重复请求防御 (Done - 2025-01-28)
- [x] 4.5 Token 刷新机制设计 (Done - 2025-01-28)
- [x] 4.6 API 模块化组织结构 (Done - 2025-01-28)
- [x] 4.7 第4章总结文章输出 (Done - 2025-01-28)

## 安装的依赖

| 依赖 | 版本 | 说明 |
|------|------|------|
| axios | ^1.7.9 | HTTP 请求库 |

## 核心功能

### 1. 请求拦截器

- ✅ 自动添加 Token
- ✅ 防止缓存（添加时间戳）
- ✅ 取消重复请求

### 2. 响应拦截器

- ✅ 统一响应格式处理
- ✅ Token 过期自动跳转登录
- ✅ 网络错误处理
- ✅ HTTP 错误码映射

### 3. 请求取消

- ✅ 基于 `AbortController`
- ✅ 自动取消重复请求
- ✅ 支持手动取消所有请求

### 4. Token 管理

- ✅ Token 刷新机制
- ✅ 等待队列处理并发请求
- ✅ 刷新失败自动清除 Token

### 5. API 模块化

- ✅ 按功能模块组织
- ✅ TypeScript 类型定义
- ✅ 统一导出方式

## 目录结构

```
src/
├── api/
│   ├── index.ts              # API 统一导出
│   ├── user.ts               # 用户相关 API
│   └── common.ts             # 通用 API
├── types/
│   └── api.d.ts              # API 类型定义
└── utils/
    └── http/
        ├── index.ts          # HTTP 工具导出
        ├── request.ts        # Axios 配置与拦截器
        └── refreshToken.ts   # Token 刷新机制
```

## 使用示例

### API 调用

```typescript
import { getUserList, createUser } from '@/api/user'

// 获取用户列表
const users = await getUserList({ page: 1, pageSize: 10 })

// 创建用户
await createUser({ username: 'admin', nickname: '管理员' })
```

### 错误处理

```typescript
try {
  const data = await getUserList({ page: 1, pageSize: 10 })
} catch (error) {
  // 错误已被拦截器处理，直接显示
  console.error(error.message)
}
```

### 取消请求

```typescript
import { cancelAllRequests } from '@/utils/http'

// 取消所有进行中的请求
cancelAllRequests()
```

## 文件变更

### 新增文件

```
src/
├── api/
│   ├── index.ts
│   ├── user.ts
│   └── common.ts
├── types/
│   └── api.d.ts
└── utils/
    └── http/
        ├── index.ts
        ├── request.ts
        └── refreshToken.ts

docs/chapter-04/
├── 01-axios-encapsulation.md
└── README.md
```

## 响应格式约定

### 成功响应

```typescript
{
  "code": 0,          // 或 200
  "data": any,        // 实际数据
  "message": "success",
  "timestamp": 1700000000
}
```

### 分页响应

```typescript
{
  "code": 0,
  "data": {
    "list": [],
    "total": 100,
    "page": 1,
    "pageSize": 10
  },
  "message": "success"
}
```

### 错误响应

```typescript
{
  "code": 400,
  "data": null,
  "message": "请求参数错误",
  "timestamp": 1700000000
}
```

## HTTP 错误码映射

| 状态码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权，请登录 |
| 403 | 拒绝访问 |
| 404 | 请求资源不存在 |
| 408 | 请求超时 |
| 500 | 服务器内部错误 |
| 502 | 网关错误 |
| 503 | 服务不可用 |
| 504 | 网关超时 |

## 下一步预告

**第5章：路由系统设计与权限控制**

- 路由表结构设计与类型定义
- 路由懒加载实现
- 路由守卫与白名单配置
- 动态路由生成（基于权限）
- 面包屑导航自动生成

---

**第4章完成！** 🎉 准备进入第5章：路由系统设计与权限控制。
