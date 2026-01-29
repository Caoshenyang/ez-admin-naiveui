# 请求模块使用指南

## 概述

项目已集成完整的 Axios 请求封装模块，提供统一的请求拦截、响应拦截、错误处理和消息提示功能。

## 核心特性

- ✅ Bearer Token 认证（自动从 userStore 获取 token）
- ✅ 统一的响应拦截和错误处理
- ✅ 支持多种 HTTP 方法（GET, POST, PUT, DELETE, PATCH）
- ✅ 文件上传/下载支持
- ✅ 可配置的消息提示（成功/错误）
- ✅ 401 自动跳转登录
- ✅ GET 请求自动添加时间戳防止缓存
- ✅ 开发环境详细日志输出
- ✅ 完整的 TypeScript 类型支持
- ✅ 使用离散式 API（无需 Provider）

## 目录结构

```
src/
├── api/                    # API 接口模块
│   ├── index.ts           # 统一导出
│   └── user.ts            # 用户相关 API 示例
├── hooks/
│   └── useNaiveApi.ts     # NaiveUI 离散式 API 封装
├── types/
│   └── api.ts             # API 通用类型定义
└── utils/
    └── request.ts         # Axios 请求封装
```

## 初始化配置

### 配置环境变量

在 `.env.development` 和 `.env.production` 中配置 API 基础路径：

```bash
# .env.development
VITE_API_BASE_URL=/api

# .env.production
VITE_API_BASE_URL=https://api.example.com
```

**注意**：本项目使用 NaiveUI 的 `createDiscreteApi` 创建离散式 API，无需在 App.vue 中初始化，可以在任何地方直接使用。

## 使用方法

### 基本用法

```typescript
import { request } from '@/utils/request'

// GET 请求
const data = await request.get<UserInfo>('/user/info')

// POST 请求
const result = await request.post<LoginResponse>('/auth/login', {
  username: 'admin',
  password: '123456'
})

// PUT 请求
await request.put(`/user/update/${id}`, {
  nickname: 'New Name'
})

// DELETE 请求
await request.delete(`/user/delete/${id}`)

// PATCH 请求
await request.patch(`/user/patch/${id}`, {
  status: 'active'
})
```

### 高级配置

```typescript
import { request } from '@/utils/request'

// 不显示错误消息
await request.delete('/user/delete/1', {
  showError: false
})

// 显示成功消息
await request.post('/user/create', userData, {
  showSuccess: true,
  successMsg: '用户创建成功'
})

// 自定义 headers
await request.get('/user/info', {
  headers: {
    'X-Custom-Header': 'value'
  }
})

// 设置超时时间
await request.post('/upload', data, {
  timeout: 60000
})
```

### 文件上传

```typescript
import { request } from '@/utils/request'

const formData = new FormData()
formData.append('file', file)
formData.append('name', 'example.jpg')

const result = await request.upload<{ url: string }>('/upload', formData, {
  showSuccess: true,
  successMsg: '文件上传成功'
})

console.log(result.url)
```

### 文件下载

```typescript
import { request } from '@/utils/request'

// 自动触发下载
await request.download('/export/excel', '用户列表.xlsx')

// 获取 Blob 对象自行处理
const blob = await request.download('/export/pdf')
```

## API 模块化

推荐将 API 接口按模块组织：

```typescript
// src/api/user.ts
import { request } from '@/utils/request'
import type { UserInfo, LoginParams } from '@/stores/types/user'

export function apiLogin(params: LoginParams) {
  return request.post<LoginResponse>('/auth/login', params, {
    showSuccess: true,
    successMsg: '登录成功'
  })
}

export function apiGetUserInfo() {
  return request.get<UserInfo>('/user/info')
}

export function apiUpdateUser(id: string, data: Partial<UserInfo>) {
  return request.put<UserInfo>(`/user/update/${id}`, data, {
    showSuccess: true,
    successMsg: '更新成功'
  })
}
```

在组件中使用：

```vue
<script setup lang="ts">
import { apiLogin, apiGetUserInfo } from '@/api'

const handleLogin = async () => {
  try {
    const res = await apiLogin({
      username: 'admin',
      password: '123456'
    })
    console.log(res.token)
  } catch (error) {
    // 错误已被统一处理，这里可以添加额外逻辑
    console.error('登录失败:', error)
  }
}
</script>
```

## 类型定义

### ApiResponse（通用响应结构）

```typescript
interface ApiResponse<T = any> {
  code: number        // 状态码（200 或 0 表示成功）
  message: string     // 响应消息
  data: T            // 响应数据
  timestamp?: number // 时间戳
}
```

### RequestConfig（请求配置）

```typescript
interface RequestConfig extends AxiosRequestConfig {
  showError?: boolean     // 是否显示错误消息（默认 true）
  showSuccess?: boolean   // 是否显示成功消息（默认 false）
  successMsg?: string     // 成功消息内容
  retry?: boolean         // 是否重试（暂未实现）
  retryCount?: number     // 重试次数（暂未实现）
}
```

### PageParams 和 PageData（分页）

```typescript
interface PageParams {
  page: number
  pageSize: number
}

interface PageData<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
```

## 错误处理

### HTTP 状态码错误

- 400: 请求参数错误
- 401: 登录已过期（自动清除用户信息并跳转登录页）
- 403: 没有权限访问
- 404: 请求的资源不存在
- 500: 服务器内部错误
- 502: 网关错误
- 503: 服务不可用
- 504: 网关超时

### 网络错误

- 请求超时
- 网络连接失败
- 请求被取消

所有错误都会通过 NaiveUI 的 message 组件显示，可通过 `showError: false` 关闭。

## 开发调试

在开发环境下，所有请求和响应都会在控制台输出详细信息：

```
🚀 Request: { url: '/user/info', method: 'GET', params: {...} }
✅ Response: { url: '/user/info', status: 200, data: {...} }
❌ Response Error: { url: '/user/info', status: 401, message: '...' }
```

## 注意事项

1. **Bearer Token 认证**：Token 会自动从 userStore 中获取并添加到请求头
2. **响应数据格式**：后端接口需返回标准的 ApiResponse 格式（code/message/data）
3. **401 自动处理**：遇到 401 错误会自动清除用户信息并跳转登录页
4. **类型安全**：始终为 API 调用指定泛型类型以获得类型提示
5. **离散式 API**：使用 `createDiscreteApi` 创建，无需 Provider，可在任何地方直接调用

## 离散式 API 使用

项目使用 NaiveUI 的 `createDiscreteApi` 创建离散式 API，无需在 Provider 内部使用。

### 导入方式

```typescript
// 方式 1：单独导入
import { message, dialog, notification } from '@/hooks/useNaiveApi'

// 方式 2：批量导入
import naiveApi from '@/hooks/useNaiveApi'

// 使用
naiveApi.message.success('操作成功')
naiveApi.dialog.info({ title: '提示', content: '内容' })
```

### 消息 API

```typescript
import { message } from '@/hooks/useNaiveApi'

// 成功消息
message.success('操作成功')

// 错误消息
message.error('操作失败')

// 警告消息
message.warning('警告信息')

// 信息消息
message.info('提示信息')

// 加载消息
const loading = message.loading('加载中...')
// 可以手动关闭
loading.destroy()
```

### 对话框 API

```typescript
import { dialog } from '@/hooks/useNaiveApi'

// 信息对话框
dialog.info({
  title: '提示',
  content: '这是一条信息',
  positiveText: '确定',
  onPositiveClick: () => {
    console.log('点击了确定')
  }
})

// 确认对话框
dialog.warning({
  title: '确认',
  content: '确定要删除吗？',
  positiveText: '确定',
  negativeText: '取消',
  onPositiveClick: () => {
    console.log('确认删除')
  }
})

// 错误对话框
dialog.error({
  title: '错误',
  content: '操作失败'
})

// 成功对话框
dialog.success({
  title: '成功',
  content: '操作成功'
})
```

### 通知 API

```typescript
import { notification } from '@/hooks/useNaiveApi'

notification.success({
  title: '成功',
  content: '操作成功',
  duration: 3000
})

notification.error({
  title: '错误',
  content: '操作失败',
  duration: 5000
})
```

### 日志工具

```typescript
import { logger } from '@/hooks/useNaiveApi'

// 普通日志（开发环境可见）
logger.log('普通日志', { data: 'value' })

// 信息日志
logger.info('信息日志')

// 警告日志
logger.warn('警告日志')

// 错误日志
logger.error('错误日志', error)

// 调试日志
logger.debug('调试日志')
```

### 开发环境日志

在开发环境下，所有消息提示都会自动在控制台输出对应级别的日志：

```
[MESSAGE SUCCESS] 操作成功
[MESSAGE ERROR] 操作失败
[MESSAGE WARNING] 警告信息
[LOGGER] 普通日志 {...}
```

## 下一步

- [ ] 实现 Token 刷新机制
- [ ] 添加请求重试逻辑
- [ ] 实现请求取消功能
- [ ] 添加请求缓存机制
- [ ] 实现请求节流防抖
