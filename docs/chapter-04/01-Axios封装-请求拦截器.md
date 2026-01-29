# 4.1 Axios 封装：请求拦截器

## 本节目标

- ✅ 安装和配置 Axios
- ✅ 实现请求拦截器
- ✅ 添加 Token 认证
- ✅ 请求日志和超时处理

---

## 1. 安装 Axios

```bash
pnpm add axios
```

---

## 2. 基础配置

### 2.1 创建请求实例

**src/utils/request.ts**:

```typescript
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { env } from './env'

/**
 * 创建 Axios 实例
 */
const service: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

export default service
```

---

## 3. 请求拦截器

### 3.1 添加 Token

**src/utils/request.ts**:

```typescript
import { useUserStore } from '@/stores/user'

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  (config) => {
    // 添加 Token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }

    // 添加时间戳（防止缓存）
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    // 开发环境打印请求信息
    if (env.isDebug) {
      console.log('🚀 Request:', {
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data,
      })
    }

    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)
```

### 3.2 请求配置选项

**扩展 Axios 配置**:

```typescript
declare module 'axios' {
  interface AxiosRequestConfig {
    /** 是否显示加载动画 */
    showLoading?: boolean
    /** 是否显示错误提示 */
    showError?: boolean
    /** 是否直接返回完整响应 */
    returnFullResponse?: boolean
  }
}
```

使用：
```typescript
request.get('/api/users', {
  showLoading: true,
  showError: true,
})
```

---

## 4. 请求方法封装

### 4.1 通用请求方法

**src/utils/request.ts**:

```typescript
/**
 * 通用请求方法
 */
async function request<T = any>(
  config: AxiosRequestConfig
): Promise<T> {
  const { showLoading = true, returnFullResponse = false } = config

  try {
    const response = await service.request<T>(config)

    if (returnFullResponse) {
      return response as unknown as T
    }

    return response.data
  } catch (error) {
    throw error
  }
}

export default {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'GET', url }),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'POST', url, data }),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PUT', url, data }),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'DELETE', url }),
}
```

---

## 5. 使用示例

### 5.1 基础使用

```typescript
import request from '@/utils/request'

// GET 请求
const users = await request.get('/api/users')

// POST 请求
const newUser = await request.post('/api/users', {
  name: 'John',
  email: 'john@example.com',
})

// PUT 请求
const updatedUser = await request.put('/api/users/1', {
  name: 'Jane',
})

// DELETE 请求
await request.delete('/api/users/1')
```

### 5.2 带配置的请求

```typescript
// 不显示 loading
const data = await request.get('/api/data', {
  showLoading: false,
})

// 自定义超时
const data = await request.post('/api/upload', formData, {
  timeout: 30000,
})

// 添加额外 headers
const data = await request.get('/api/special', {
  headers: {
    'X-Custom-Header': 'value',
  },
})
```

---

## 6. 类型定义

### 6.1 API 响应类型

**src/types/api.ts**:

```typescript
/**
 * 标准 API 响应
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/**
 * 分页响应
 */
export interface PageResponse<T = any> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
```

### 6.2 使用类型

```typescript
import type { ApiResponse } from '@/types/api'

interface User {
  id: number
  name: string
}

const response = await request.get<ApiResponse<User>>('/api/user/1')
// response.data 类型为 ApiResponse<User>
```

---

## 7. 请求重试

### 7.1 重试配置

**src/utils/request.ts**:

```typescript
import axiosRetry from 'axios-retry'

// 配置重试
axiosRetry(service, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // 只在网络错误或 5xx 错误时重试
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status ?? 0 >= 500
  },
})
```

---

## 8. 本节小结

✅ 完成的工作：
- 配置了 Axios 实例
- 实现了请求拦截器
- 添加了 Token 认证
- 封装了请求方法

**下一步**: [4.2 Axios 封装：响应拦截器](./02-Axios封装-响应拦截器.md)
