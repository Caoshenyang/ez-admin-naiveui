# Pinia Store 模式对比文档

本文档详细对比了 Pinia 的两种 Store 模式，并说明了本项目的选择理由。

---

## 一、Options Store（选项式 API）

### 代码示例

```typescript
// stores/modules/user.ts
import { defineStore } from 'pinia'

interface UserInfo {
  id: number
  name: string
  email: string
}

interface LoginParams {
  username: string
  password: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null as UserInfo | null,
    permissions: [] as string[]
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    hasPermission: (state) => (permission: string) =>
      state.permissions.includes(permission)
  },

  actions: {
    async login(credentials: LoginParams) {
      const res = await apiLogin(credentials)
      this.token = res.token
      this.userInfo = res.userInfo
    },

    logout() {
      this.token = ''
      this.userInfo = null
    }
  },

  persist: true
})
```

### 优点

- ✅ **结构清晰**：state、getters、actions 分离，一目了然
- ✅ **适合传统 Vue 2 迁移**：与 Vuex API 类似，学习曲线平缓
- ✅ **自动类型推断**：state 属性可以直接通过 `this` 访问，类型自动推断
- ✅ **代码组织直观**：对于大型 Store，容易快速定位功能位置
- ✅ **this 上下文明确**：在 actions 中使用 `this` 访问和修改状态，语义清晰

### 缺点

- ❌ **灵活性较低**：无法使用组合式 API 的强大功能（如 computed、watch 等）
- ❌ **代码复用困难**：无法将逻辑提取为可复用的组合式函数
- ❌ **不支持响应式式逻辑**：无法在 store 内部使用 watch、watchEffect 等响应式 API
- ❌ **组织复杂逻辑受限**：对于复杂的状态逻辑，可能导致 actions 臃肿

---

## 二、Setup Store（组合式 API）

### 代码示例

```typescript
// stores/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

interface UserInfo {
  id: number
  name: string
  email: string
}

interface LoginParams {
  username: string
  password: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref('')
  const userInfo = ref<UserInfo | null>(null)
  const permissions = ref<string[]>([])

  // Getters
  const isLoggedIn = computed(() => !!token.value)

  const hasPermission = (permission: string) =>
    permissions.value.includes(permission)

  // Actions
  async function login(credentials: LoginParams) {
    const res = await apiLogin(credentials)
    token.value = res.token
    userInfo.value = res.userInfo
  }

  function logout() {
    token.value = ''
    userInfo.value = null
  }

  // 可以使用 watch 等响应式 API
  watch(token, (newToken) => {
    if (newToken) {
      setupAxiosInterceptor(newToken)
    }
  })

  return {
    token,
    userInfo,
    permissions,
    isLoggedIn,
    hasPermission,
    login,
    logout
  }
}, { persist: true })
```

### 优点

- ✅ **灵活性极高**：可以使用所有组合式 API（computed、watch、watchEffect 等）
- ✅ **逻辑复用方便**：可以将复杂逻辑提取为独立的 composable 函数
- ✅ **更好的 TypeScript 支持**：可以使用泛型、类型守卫等高级 TS 特性
- ✅ **代码组织更灵活**：可以将相关逻辑分组，而不必强制按 state/getters/actions 分离
- ✅ **响应式监听**：可以在 store 内部监听状态变化并执行副作用
- ✅ **更符合 Vue 3 发展方向**：Vue 3 官方推荐组合式 API

### 缺点

- ❌ **需要手动返回**：必须显式返回所有需要暴露的状态和方法
- ❌ **this 上下文丢失**：无法使用 `this`，需要通过 `.value` 访问 ref 值
- ❌ **结构不如 Options 清晰**：对于小型 Store，可能显得过于复杂
- ❌ **学习曲线稍陡**：需要理解组合式 API 和 ref/reactive 的工作机制

---

## 三、选择建议

### 推荐使用 Setup Store 的场景

- 项目已全面采用 `<script setup>` 语法
- 需要在 store 内部使用 watch 监听状态变化
- 需要将逻辑提取为可复用的 composables
- 需要更灵活的类型定义和泛型支持

### 推荐使用 Options Store 的场景

- 团队更熟悉 Vue 2 / Vuex 的 API 风格
- Store 逻辑相对简单，主要是 CRUD 操作
- 不需要复杂的响应式逻辑和监听
- 希望代码结构更加固定和规范

---

## 四、本项目的选择

### 技术选型：**Setup Store 模式**

基于项目的技术栈特点，本项目中**采用 Setup Store 模式**，主要原因如下：

1. ✅ 项目已全面采用 `<script setup>` 语法，保持代码风格一致
2. ✅ 后台管理系统通常需要监听状态变化（如 token 过期检测、权限变化响应等）
3. ✅ Setup Store 可以更方便地提取可复用的业务逻辑
4. ✅ 更好的 TypeScript 类型推导和泛型支持
5. ✅ 这是 Vue 3 的主流发展方向，生态更完善

### 目录结构

```
src/stores/
├── index.ts                    # Pinia 实例创建和配置
├── modules/                    # 业务模块 stores
│   ├── user.ts                 # 用户模块
│   ├── app.ts                  # 应用配置模块
│   ├── permission.ts           # 权限模块
│   ├── tagView.ts              # 标签页视图模块
│   └── settings.ts             # 设置模块
└── types/                      # Store 相关类型定义
    ├── user.ts
    └── app.ts
```

### 代码示例

```typescript
// stores/modules/app.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const sidebarOpened = ref(true)
  const device = ref<'desktop' | 'mobile'>('desktop')

  // Actions
  function toggleSidebar() {
    sidebarOpened.value = !sidebarOpened.value
  }

  function setDevice(deviceValue: 'desktop' | 'mobile') {
    device.value = deviceValue
  }

  return {
    sidebarOpened,
    device,
    toggleSidebar,
    setDevice
  }
}, {
  persist: true
})
```

---

## 五、最佳实践

### 1. 状态命名规范

```typescript
// ✅ 使用 ref 定义基本类型和对象
const token = ref('')
const userInfo = ref<UserInfo | null>(null)
const permissions = ref<string[]>([])

// ❌ 避免使用 reactive（除非你明确知道为什么需要）
const state = reactive({
  token: '',
  userInfo: null
})
```

### 2. Getter 命名规范

```typescript
// ✅ 使用 is/has/can 等前缀表示布尔值
const isLoggedIn = computed(() => !!token.value)
const hasPermission = (permission: string) => permissions.value.includes(permission)

// ❌ 避免使用 get 前缀
const getLoggedIn = computed(() => !!token.value)
```

### 3. Action 命名规范

```typescript
// ✅ 使用动词开头
function login() {}
function logout() {}
function fetchUserInfo() {}
function updateUserInfo() {}

// ❌ 避免使用名词开头
function userLogin() {}
function userLogout() {}
```

### 4. 类型定义

```typescript
// stores/types/user.ts
export interface UserInfo {
  id: number
  name: string
  email: string
  avatar?: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userInfo: UserInfo
}

// stores/modules/user.ts
import type { UserInfo, LoginParams } from '../types/user'
```

### 5. 持久化配置

```typescript
// stores/modules/user.ts
export const useUserStore = defineStore('user', () => {
  // ... 代码
}, {
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['token', 'userInfo'] // 只持久化部分字段
  }
})
```

---

## 六、常见问题

### Q1: Setup Store 中如何调用其他 store？

```typescript
import { useAppStore } from './app'

export const useUserStore = defineStore('user', () => {
  const appStore = useAppStore()

  function login() {
    // 可以访问其他 store
    appStore.setDevice('desktop')
  }

  return { login }
})
```

### Q2: 如何在 setup 外部使用 store？

```typescript
// ✅ 在组件外使用（如路由守卫）
import { useUserStore } from '@/stores/modules/user'

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})
```

### Q3: 如何监听 store 的变化？

```typescript
import { watch } from 'vue'
import { useUserStore } from '@/stores/modules/user'

export function setupUserWatch() {
  const userStore = useUserStore()

  watch(
    () => userStore.token,
    (newToken) => {
      console.log('Token changed:', newToken)
    }
  )
}
```

---

## 七、参考资源

- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Vue 3 官方文档 - 组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [VueUse - 组合式函数集合](https://vueuse.org/)
