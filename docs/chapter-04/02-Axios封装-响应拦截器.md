# 4.2 Axios 封装：响应拦截器

## 本节目标

- ✅ 实现响应拦截器
- ✅ 统一处理响应数据
- ✅ 处理错误状态码
- ✅ Token 刷新机制

---

## 1. 响应拦截器

### 1.1 成功响应处理

**src/utils/response.ts**:

```typescript
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/api'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

/**
 * 检查响应状态
 */
const checkStatus = (response: AxiosResponse) => {
  const { status } = response

  if (status >= 200 && status < 300) {
    return response
  }

  throw new Error(`请求失败: ${status}`)
}

/**
 * 处理响应数据
 */
const handleResponseData = <T = any>(response: AxiosResponse<ApiResponse<T>>): T => {
  const { data } = response

  // 根据业务约定处理
  if (data.code === 0 || data.code === 200) {
    return data.data
  }

  // 业务错误
  throw new Error(data.message || '请求失败')
}
```

### 1.2 响应拦截器实现

**src/utils/response.ts**:

```typescript
/**
 * 响应拦截器
 */
export function setupResponseInterceptor(axiosInstance: any) {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 检查 HTTP 状态
      checkStatus(response)

      // 开发环境打印响应
      if (env.isDebug) {
        console.log('✅ Response:', {
          url: response.config.url,
          status: response.status,
          data: response.data,
        })
      }

      // 处理业务数据
      return handleResponseData(response)
    },
    (error: any) => {
      // 错误处理
      handleResponseError(error)
      return Promise.reject(error)
    }
  )
}
```

---

## 2. 错误处理

### 2.1 HTTP 错误处理

**src/utils/response.ts**:

```typescript
/**
 * 处理响应错误
 */
const handleResponseError = (error: any) => {
  const { response } = error

  if (!response) {
    // 网络错误
    console.error('网络错误，请检查网络连接')
    return
  }

  const { status, data } = response

  switch (status) {
    case 400:
      console.error('请求参数错误:', data.message)
      break
    case 401:
      handleUnauthorized()
      break
    case 403:
      console.error('没有权限访问')
      break
    case 404:
      console.error('请求的资源不存在')
      break
    case 500:
      console.error('服务器错误:', data.message)
      break
    default:
      console.error(`请求失败: ${status}`)
  }
}
```

### 2.2 401 处理

```typescript
/**
 * 处理未授权
 */
const handleUnauthorized = () => {
  const userStore = useUserStore()
  const router = useRouter()

  // 清除用户信息
  userStore.logout()

  // 跳转到登录页
  router.push({
    path: '/login',
    query: { redirect: router.currentRoute.value.fullPath },
  })
}
```

---

## 3. Token 刷新

### 3.1 刷新机制

**src/utils/response.ts**:

```typescript
let isRefreshing = false
let requests: Array<(token: string) => void> = []

/**
 * 刷新 Token
 */
const refreshToken = async (): Promise<string> => {
  const userStore = useUserStore()

  try {
    const newToken = await userStore.refreshToken()
    return newToken
  } catch (error) {
    // 刷新失败，清除登录状态
    userStore.logout()
    throw error
  }
}

/**
 * 处理 401 并刷新 Token
 */
const handleTokenExpired = async (error: any) => {
  const config = error.config

  // 正在刷新，将请求加入队列
  if (isRefreshing) {
    return new Promise((resolve) => {
      requests.push((token: string) => {
        config.headers.Authorization = `Bearer ${token}`
        resolve(service(config))
      })
    })
  }

  isRefreshing = true

  try {
    // 刷新 Token
    const newToken = await refreshToken()

    // 执行队列中的请求
    requests.forEach((cb) => cb(newToken))
    requests = []

    // 重试当前请求
    config.headers.Authorization = `Bearer ${newToken}`
    return service(config)
  } catch (err) {
    // 刷新失败
    requests.forEach((cb) => cb(''))
    requests = []
    throw err
  } finally {
    isRefreshing = false
  }
}
```

---

## 4. 完整封装

### 4.1 整合请求和响应

**src/utils/request.ts**:

```typescript
import axios from 'axios'
import { env } from './env'
import { setupRequestInterceptor } from './request'
import { setupResponseInterceptor } from './response'

/**
 * 创建 Axios 实例
 */
const service = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
})

// 设置请求拦截器
setupRequestInterceptor(service)

// 设置响应拦截器
setupResponseInterceptor(service)

export default service
```

### 4.2 使用示例

```typescript
import request from '@/utils/request'

// 自动处理 Token、错误、刷新等
const users = await request.get('/api/users')

// 错误会自动处理，也可以手动捕获
try {
  const user = await request.post('/api/login', {
    username: 'admin',
    password: '123456',
  })
} catch (error) {
  // 错误已在拦截器中处理
  console.error('登录失败')
}
```

---

## 5. 请求取消

### 5.1 AbortController

**src/utils/request.ts**:

```typescript
/**
 * 可取消的请求
 */
export class CancelableRequest {
  private controller: AbortController | null = null

  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    // 取消上一个请求
    this.cancel()

    // 创建新的 AbortController
    this.controller = new AbortController()
    config.signal = this.controller.signal

    try {
      return await request.request<T>(config)
    } catch (error: any) {
      if (error.name === 'CanceledError') {
        console.log('请求已取消')
        return Promise.reject(error)
      }
      throw error
    }
  }

  cancel() {
    this.controller?.abort()
    this.controller = null
  }
}
```

使用：
```typescript
const searchReq = new CancelableRequest()

// 发送请求
searchReq.request({ url: '/api/search' })

// 取消请求
searchReq.cancel()
```

---

## 6. 本节小结

✅ 完成的工作：
- 实现了响应拦截器
- 统一处理了错误
- 实现了 Token 刷新
- 支持请求取消

**下一步**: [4.3 API 模块化管理](./03-API模块化管理.md)
