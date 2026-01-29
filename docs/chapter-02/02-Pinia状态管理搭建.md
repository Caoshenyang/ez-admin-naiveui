# 2.2 Pinia 状态管理搭建

## 本节目标

- ✅ 安装和配置 Pinia
- ✅ 创建 Pinia Store
- ✅ 使用组合式 API 风格的 Store
- ✅ 实现状态持久化

---

## 1. 安装 Pinia

```bash
pnpm add pinia
# 持久化插件
pnpm add pinia-plugin-persistedstate
```

---

## 2. Pinia 配置

### 2.1 创建 Pinia 实例

**src/stores/index.ts**:

```typescript
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

/**
 * 创建 Pinia 实例
 */
const pinia = createPinia()

/**
 * 配置持久化
 */
pinia.use(
  createPersistedState({
    // 存储到 sessionStorage
    storage: sessionStorage,
    // 默认所有 store 都持久化
    auto: true,
  })
)

/**
 * 配置 Pinia
 */
export function setupStore(app: App) {
  app.use(pinia)
}

export default pinia
```

### 2.2 在 main.ts 中初始化

**src/main.ts**:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from './stores'
import { setupRouter } from './router'

const app = createApp(App)

// 配置状态管理
setupStore(app)

// 配置路由
setupRouter(app)

app.mount('#app')
```

---

## 3. 创建 Store

### 3.1 用户 Store

**src/stores/user.ts**:

```typescript
import { defineStore } from 'pinia'
import type { UserInfo } from '@/types/user'

interface UserState {
  userInfo: UserInfo | null
  token: string
}

export const useUserStore = defineStore('user', {
  // 状态
  state: (): UserState => ({
    userInfo: null,
    token: '',
  }),

  // 计算属性
  getters: {
    /** 是否已登录 */
    isLogin: (state) => !!state.token,
    /** 用户名 */
    userName: (state) => state.userInfo?.name ?? '',
    /** 用户角色 */
    userRoles: (state) => state.userInfo?.roles ?? [],
  },

  // 方法
  actions: {
    /**
     * 设置用户信息
     */
    setUserInfo(info: UserInfo) {
      this.userInfo = info
    },

    /**
     * 设置 Token
     */
    setToken(token: string) {
      this.token = token
    },

    /**
     * 登录
     */
    async login(username: string, password: string) {
      const res = await authApi.login({ username, password })
      this.setToken(res.token)
      this.setUserInfo(res.user)
      return res
    },

    /**
     * 登出
     */
    async logout() {
      await authApi.logout()
      this.token = ''
      this.userInfo = null
    },

    /**
     * 获取用户信息
     */
    async getUserInfo() {
      const res = await authApi.getUserInfo()
      this.setUserInfo(res)
      return res
    },
  },

  // 持久化配置
  persist: {
    key: 'user-store',
    storage: sessionStorage,
    paths: ['token'], // 只持久化 token
  },
})
```

### 3.2 应用 Store

**src/stores/app.ts**:

```typescript
import { defineStore } from 'pinia'

interface AppState {
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  device: 'desktop' | 'mobile'
  size: 'large' | 'default' | 'small'
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebar: {
      opened: true,
      withoutAnimation: false,
    },
    device: 'desktop',
    size: 'default',
  }),

  actions: {
    /**
     * 切换侧边栏
     */
    toggleSidebar(withoutAnimation = false) {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = withoutAnimation
    },

    /**
     * 关闭侧边栏
     */
    closeSidebar(withoutAnimation = false) {
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
    },

    /**
     * 设置设备类型
     */
    setDevice(device: 'desktop' | 'mobile') {
      this.device = device
    },

    /**
     * 设置组件尺寸
     */
    setSize(size: 'large' | 'default' | 'small') {
      this.size = size
    },
  },

  persist: true,
})
```

---

## 4. 使用 Store

### 4.1 在组件中使用

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 使用 storeToRefs 保持响应式
const { userInfo, userName, isLogin } = storeToRefs(userStore)

// 直接使用方法
const handleLogin = async () => {
  await userStore.login('admin', '123456')
}

const handleLogout = async () => {
  await userStore.logout()
}
</script>

<template>
  <div v-if="isLogin">
    <p>欢迎, {{ userName }}</p>
    <button @click="handleLogout">退出</button>
  </div>
  <div v-else>
    <button @click="handleLogin">登录</button>
  </div>
</template>
```

### 4.2 在组合式函数中使用

**src/composables/useAuth.ts**:

```typescript
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

export function useAuth() {
  const userStore = useUserStore()

  const isLogin = computed(() => userStore.isLogin)
  const userName = computed(() => userStore.userName)
  const userRoles = computed(() => userStore.userRoles)

  return {
    isLogin,
    userName,
    userRoles,
    login: userStore.login,
    logout: userStore.logout,
  }
}
```

---

## 5. Store 最佳实践

### 5.1 命名规范

```typescript
// ✅ 推荐：use 前缀
export const useUserStore = defineStore('user', {})
export const useAppStore = defineStore('app', {})

// ❌ 避免：没有 use 前缀
export const userStore = defineStore('user', {})
```

### 5.2 状态拆分

```typescript
// ✅ 推荐：按功能拆分
export const useUserStore = defineStore('user', {})
export const useAppStore = defineStore('app', {})
export const usePermissionStore = defineStore('permission', {})

// ❌ 避免：所有状态放在一起
export const useStore = defineStore('all', {
  state: () => ({
    user: {},
    app: {},
    permission: {},
  }),
})
```

### 5.3 类型定义

```typescript
// ✅ 推荐：定义接口类型
interface UserState {
  userInfo: UserInfo | null
  token: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: null,
    token: '',
  }),
})

// ❌ 避免：隐式 any 类型
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null, // ❌ any 类型
  }),
})
```

---

## 6. 常见问题

### Q1: storeToRefs 是必须的吗？

**A**: 不是必须的，但推荐使用。直接解构会丢失响应式：
```typescript
// ❌ 丢失响应式
const { token } = userStore

// ✅ 保持响应式
const { token } = storeToRefs(userStore)
```

### Q2: 如何在 Store 外部使用？

**A**: 直接调用 store 函数即可：
```typescript
import { useUserStore } from '@/stores/user'

export function someUtil() {
  const userStore = useUserStore()
  console.log(userStore.token)
}
```

### Q3: 持久化数据如何清理？

**A**:
```typescript
// 清理单个 store
userStore.$reset()

// 清理所有持久化数据
sessionStorage.clear()
```

---

## 7. 本节小结

✅ 完成的工作：
- 配置了 Pinia 状态管理
- 创建了用户和应用 Store
- 实现了状态持久化
- 掌握了 Store 的使用方法

**下一步**: [2.3 NaiveUI 安装与基础配置](./03-NaiveUI安装与基础配置.md)
