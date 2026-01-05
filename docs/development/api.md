# API 调用指南

项目封装了完整的 HTTP 请求工具，支持请求/响应拦截器、错误处理、请求取消等功能。

## 请求工具

### 基础配置

```typescript
// src/utils/request.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from '@/hooks/useMessage'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加认证 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response

    // 处理业务错误
    if (data.code !== 200) {
      message.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }

    return data
  },
  (error) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response
      switch (status) {
        case 401:
          message.error('未授权，请重新登录')
          // 跳转到登录页
          break
        case 403:
          message.error('拒绝访问')
          break
        case 404:
          message.error('请求地址不存在')
          break
        case 500:
          message.error('服务器内部错误')
          break
        default:
          message.error(data?.message || '网络错误')
      }
    } else if (error.request) {
      message.error('网络连接失败')
    } else {
      message.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

export default request
```

### 请求方法

```typescript
// GET 请求
export const get = <T = any>(url: string, params?: object, config?: AxiosRequestConfig) => {
  return request.get<T>(url, { ...config, params })
}

// POST 请求
export const post = <T = any>(url: string, data?: object, config?: AxiosRequestConfig) => {
  return request.post<T>(url, data, config)
}

// PUT 请求
export const put = <T = any>(url: string, data?: object, config?: AxiosRequestConfig) => {
  return request.put<T>(url, data, config)
}

// DELETE 请求
export const remove = <T = any>(url: string, params?: object, config?: AxiosRequestConfig) => {
  return request.delete<T>(url, { ...config, params })
}

// PATCH 请求
export const patch = <T = any>(url: string, data?: object, config?: AxiosRequestConfig) => {
  return request.patch<T>(url, data, config)
}
```

## API 模块

### API 文件结构

每个业务模块都有对应的 API 文件：

```
src/api/
├── user.ts       # 用户相关接口
├── role.ts       # 角色相关接口
├── menu.ts       # 菜单相关接口
├── department.ts # 部门相关接口
├── dict.ts       # 字典相关接口
├── file.ts       # 文件相关接口
└── log.ts        # 日志相关接口
```

### 用户 API 示例

```typescript
// src/api/user.ts
import { get, post, put, remove } from '@/utils/request'
import type { PageResult, UserListVO, UserQuery, UserCreateDTO, UserUpdateDTO } from '@/types'

/**
 * 用户 API
 */
export const userApi = {
  /**
   * 分页查询用户
   */
  page: (params: UserQuery): Promise<PageResult<UserListVO>> => {
    return get('/user/page', params)
  },

  /**
   * 获取用户详情
   */
  detail: (id: string | number): Promise<UserListVO> => {
    return get(`/user/${id}`)
  },

  /**
   * 新增用户
   */
  create: (data: UserCreateDTO): Promise<void> => {
    return post('/user', data)
  },

  /**
   * 更新用户
   */
  update: (data: UserUpdateDTO): Promise<void> => {
    return put('/user', data)
  },

  /**
   * 删除用户
   */
  remove: (id: string | number): Promise<void> => {
    return remove(`/user/${id}`)
  },

  /**
   * 批量删除用户
   */
  batchRemove: (ids: (string | number)[]): Promise<void> => {
    return remove('/user/batch', { ids: ids.join(',') })
  },

  /**
   * 重置密码
   */
  resetPassword: (id: string | number, password: string): Promise<void> => {
    return put(`/user/${id}/password`, { password })
  },

  /**
   * 启用/禁用用户
   */
  toggleStatus: (id: string | number, status: number): Promise<void> => {
    return put(`/user/${id}/status`, { status })
  },
}
```

## 类型定义

### 请求相关类型

```typescript
// src/types/modules/api.ts

/**
 * 分页查询参数
 */
export interface PageQuery {
  pageNum: number     // 页码
  pageSize: number    // 页大小
  search?: {          // 搜索条件
    keywords?: string
    [key: string]: any
  }
  sort?: {           // 排序条件
    field?: string
    order?: 'asc' | 'desc'
  }
  filters?: {        // 筛选条件
    [key: string]: any
  }
}

/**
 * 分页结果
 */
export interface PageResult<T = any> {
  records: T[]       // 数据列表
  total: number      // 总记录数
  pageNum: number    // 当前页码
  pageSize: number   // 页大小
  pages: number      // 总页数
}

/**
 * API 响应格式
 */
export interface ApiResponse<T = any> {
  code: number       // 响应码
  message: string    // 响应消息
  data: T           // 响应数据
  success: boolean   // 是否成功
  timestamp: string  // 时间戳
}
```

### 业务类型定义

```typescript
// src/types/modules/user.ts

/**
 * 用户列表展示对象
 */
export interface UserListVO {
  userId: number
  username: string
  nickname: string
  email: string
  phoneNumber?: string
  gender?: number
  status: number
  createTime: string
  updateTime?: string
}

/**
 * 用户查询参数
 */
export interface UserQuery extends PageQuery {
  search: {
    keywords?: string
    status?: number
    createTimeStart?: string
    createTimeEnd?: string
  }
}

/**
 * 用户创建数据传输对象
 */
export interface UserCreateDTO {
  username: string
  password: string
  nickname: string
  email?: string
  phoneNumber?: string
  gender?: number
  status: number
  deptId?: number
}

/**
 * 用户更新数据传输对象
 */
export interface UserUpdateDTO extends UserCreateDTO {
  userId: number
}
```

## API 调用示例

### 在组件中使用 API

```vue
<template>
  <div>
    <n-button @click="loadUsers">加载用户</n-button>
    <n-data-table :columns="columns" :data="userList" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { userApi } from '@/api/user'
import type { UserListVO } from '@/types'

const loading = ref(false)
const userList = ref<UserListVO[]>([])

const loadUsers = async () => {
  try {
    loading.value = true
    const result = await userApi.page({
      pageNum: 1,
      pageSize: 10,
      search: {
        keywords: 'admin'
      }
    })
    userList.value = result.records
  } catch (error) {
    console.error('加载用户失败:', error)
  } finally {
    loading.value = false
  }
}
</script>
```

### 在 CRUD Hook 中使用 API

```typescript
// src/views/system/user/index.ts
export const userCrudConfig: UserCrudConfig = {
  // API 配置
  pageApi: userApi.page,
  detailApi: userApi.detail,
  createApi: userApi.create,
  updateApi: userApi.update,
  removeApi: userApi.remove,
  batchRemoveApi: userApi.batchRemove,

  // 其他配置...
}
```

## 错误处理

### 统一错误处理

```typescript
// 使用 try-catch 处理错误
const handleSubmit = async (data: UserCreateDTO) => {
  try {
    await userApi.create(data)
    message.success('创建成功')
    // 刷新列表等操作
  } catch (error) {
    console.error('创建失败:', error)
    // 错误已由响应拦截器处理，无需额外处理
  }
}
```

### 自定义错误处理

```typescript
// 需要特殊处理的错误
const handleSpecialOperation = async () => {
  try {
    await userApi.resetPassword(userId, newPassword)
    message.success('密码重置成功')
  } catch (error: any) {
    if (error.response?.status === 403) {
      message.error('没有重置密码的权限')
    } else {
      message.error('密码重置失败')
    }
  }
}
```

## 请求取消

### 手动取消请求

```typescript
import axios, { CancelToken } from 'axios'

const cancelTokenSource = axios.CancelToken.source()

const loadData = async () => {
  try {
    const response = await request.get('/user/page', {
      cancelToken: cancelTokenSource.token,
      params: { pageNum: 1, pageSize: 10 }
    })
    console.log(response)
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('请求已取消')
    } else {
      console.error('请求失败:', error)
    }
  }
}

// 取消请求
const cancelRequest = () => {
  cancelTokenSource.cancel('操作已取消')
}
```

### 在组件卸载时取消请求

```vue
<script setup lang="ts">
import { onUnmounted } from 'vue'
import axios from 'axios'

const cancelTokenSource = axios.CancelToken.source()

const loadData = async () => {
  try {
    await request.get('/user/page', {
      cancelToken: cancelTokenSource.token
    })
  } catch (error) {
    if (axios.isCancel(error)) {
      return // 组件卸载时取消的请求，不需要处理
    }
    // 处理其他错误
  }
}

onUnmounted(() => {
  cancelTokenSource.cancel('组件卸载')
})
</script>
```

## 文件上传

### 单文件上传

```typescript
// src/api/file.ts
export const fileApi = {
  upload: (file: File, onProgress?: (progress: number) => void): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)

    return request.post('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percent)
        }
      },
    })
  },

  // 批量上传
  batchUpload: (files: File[]): Promise<{ urls: string[] }> => {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })

    return request.post('/file/batch-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
```

### 文件上传组件使用

```vue
<template>
  <n-upload
    v-model:file-list="fileList"
    :custom-request="customUpload"
    :show-file-list="false"
    accept="image/*"
    @before-upload="beforeUpload"
  >
    <n-button>上传头像</n-button>
  </n-upload>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { fileApi } from '@/api/file'
import { message } from '@/hooks/useMessage'

const fileList = ref([])

const beforeUpload = (options: { file: File }) => {
  const { file } = options
  // 文件大小检查
  if (file.size > 2 * 1024 * 1024) {
    message.error('文件大小不能超过 2MB')
    return false
  }
  return true
}

const customUpload = async (options: any) => {
  const { file, onProgress, onSuccess, onError } = options

  try {
    const result = await fileApi.upload(file, (progress) => {
      onProgress({ percent: progress })
    })
    onSuccess(result)
    message.success('上传成功')
  } catch (error) {
    onError(error)
    message.error('上传失败')
  }
}
</script>
```

## 环境配置

### 环境变量

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api

# .env.production
VITE_API_BASE_URL=https://api.example.com
```

### 请求配置

```typescript
// 根据环境设置不同的配置
const config = {
  development: {
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
  },
  production: {
    baseURL: 'https://api.example.com',
    timeout: 5000,
  },
}

const env = import.meta.env.MODE as keyof typeof config
const currentConfig = config[env]

const request = axios.create(currentConfig)
```

## 测试和 Mock

### API 测试

```typescript
// src/api/__tests__/user.test.ts
import { userApi } from '../user'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

const server = setupServer(
  rest.get('/user/page', (req, res, ctx) => {
    return res(ctx.json({
      code: 200,
      message: 'success',
      data: {
        records: [
          { userId: 1, username: 'admin', nickname: '管理员' }
        ],
        total: 1,
        pageNum: 1,
        pageSize: 10
      }
    }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('userApi', () => {
  test('page should return user list', async () => {
    const result = await userApi.page({ pageNum: 1, pageSize: 10 })
    expect(result.records).toHaveLength(1)
    expect(result.records[0].username).toBe('admin')
  })
})
```

## 注意事项

1. **类型安全**: 为所有 API 调用定义明确的 TypeScript 类型
2. **错误处理**: 在请求拦截器中统一处理常见错误
3. **性能优化**: 合理使用请求缓存和取消功能
4. **安全**: 敏感信息通过 HTTPS 传输，使用适当的认证机制
5. **兼容性**: 处理不同浏览器的兼容性问题
6. **监控**: 记录请求性能和错误信息
