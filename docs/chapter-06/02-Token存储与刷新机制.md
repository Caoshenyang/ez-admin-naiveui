# 6.2 Token 存储与刷新机制

## 本节目标

- ✅ 实现 Token 存储
- ✅ 实现 Token 刷新
- ✅ 处理 Token 过期

---

## 1. Token 存储

### 1.1 Storage 封装

**src/utils/auth.ts**:

```typescript
import { storage } from './storage'

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const authStorage = {
  // 获取 Access Token
  getToken(): string | null {
    return storage.get<string>(TOKEN_KEY)
  },

  // 设置 Access Token
  setToken(token: string): void {
    storage.set(TOKEN_KEY, token)
  },

  // 移除 Access Token
  removeToken(): void {
    storage.remove(TOKEN_KEY)
  },

  // 获取 Refresh Token
  getRefreshToken(): string | null {
    return storage.get<string>(REFRESH_TOKEN_KEY)
  },

  // 设置 Refresh Token
  setRefreshToken(token: string): void {
    storage.set(REFRESH_TOKEN_KEY, token)
  },

  // 移除 Refresh Token
  removeRefreshToken(): void {
    storage.remove(REFRESH_TOKEN_KEY)
  },

  // 清除所有 Token
  clear(): void {
    this.removeToken()
    this.removeRefreshToken()
  },
}
```

---

## 2. Token 刷新

### 2.1 UserStore 扩展

**src/stores/user.ts**:

```typescript
import { authStorage } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: authStorage.getToken() || '',
    refreshToken: authStorage.getRefreshToken() || '',
    userInfo: null as User | null,
  }),

  actions: {
    /**
     * 设置 Token
     */
    setToken(token: string) {
      this.token = token
      authStorage.setToken(token)
    },

    /**
     * 设置 Refresh Token
     */
    setRefreshToken(token: string) {
      this.refreshToken = token
      authStorage.setRefreshToken(token)
    },

    /**
     * 刷新 Token
     */
    async refreshToken() {
      try {
        const res = await authApi.refreshToken(this.refreshToken)
        this.setToken(res.token)
        return res.token
      } catch (error) {
        this.logout()
        throw error
      }
    },

    /**
     * 登出
     */
    logout() {
      this.token = ''
      this.refreshToken = ''
      this.userInfo = null
      authStorage.clear()
    },
  },
})
```

---

## 3. 请求拦截器处理

**src/utils/request.ts**:

```typescript
let isRefreshing = false
let requests: Array<(token: string) => void> = []

service.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error

    // 401 错误
    if (response?.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true

        try {
          const userStore = useUserStore()
          const newToken = await userStore.refreshToken()

          // 执行队列中的请求
          requests.forEach((cb) => cb(newToken))
          requests = []

          // 重试当前请求
          return service(config)
        } catch (err) {
          // 刷新失败，跳转登录
          userStore.logout()
          router.push('/login')
          return Promise.reject(err)
        } finally {
          isRefreshing = false
        }
      } else {
        // 正在刷新，将请求加入队列
        return new Promise((resolve) => {
          requests.push((token: string) => {
            config.headers.Authorization = `Bearer ${token}`
            resolve(service(config))
          })
        })
      }
    }

    return Promise.reject(error)
  }
)
```

---

## 4. 本节小结

✅ 完成的工作：
- 实现了 Token 存储
- 实现了 Token 刷新
- 处理了 Token 过期

**下一步**: [6.3 路由守卫实现](./03-路由守卫实现.md)
