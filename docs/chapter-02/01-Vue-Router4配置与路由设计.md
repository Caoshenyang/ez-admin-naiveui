# 2.1 Vue Router 4 配置与路由设计

## 本节目标

- ✅ 安装和配置 Vue Router 4
- ✅ 设计后台管理系统的路由结构
- ✅ 实现路由懒加载
- ✅ 配置路由元信息

---

## 1. 安装 Vue Router

### 1.1 安装依赖

```bash
pnpm add vue-router@4
```

### 1.2 创建目录结构

```
src/router/
├── index.ts          # 路由配置入口
├── routes.ts         # 路由定义
└── types.ts          # 路由类型定义
```

---

## 2. 路由配置

### 2.1 创建类型定义

**src/router/types.ts**:

```typescript
import type { RouteRecordRaw } from 'vue-router'

/**
 * 路由元信息
 */
export interface RouteMeta {
  /** 路由标题 */
  title?: string
  /** 图标 */
  icon?: string
  /** 是否隐藏 */
  hidden?: boolean
  /** 是否缓存 */
  keepAlive?: boolean
  /** 权限标识 */
  roles?: string[]
  /** 排序 */
  order?: number
  /** 是否固定在 Tab 上 */
  affix?: boolean
}

/**
 * 扩展路由记录
 */
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  meta?: RouteMeta
  children?: AppRouteRecordRaw[]
}
```

### 2.2 创建路由配置

**src/router/routes.ts**:

```typescript
import type { AppRouteRecordRaw } from './types'
import { Layout } from '@/layouts' // 稍后创建

/**
 * 基础路由（不需要权限）
 */
export const basicRoutes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginPage.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      hidden: true,
    },
  },
]

/**
 * 异步路由（需要权限）
 */
export const asyncRoutes: AppRouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      title: '首页',
      icon: 'dashboard',
    },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardPage.vue'),
        meta: {
          title: '工作台',
          icon: 'dashboard',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/system',
    name: 'System',
    component: Layout,
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'setting',
      roles: ['admin'],
    },
    children: [
      {
        path: '/system/user',
        name: 'UserManagement',
        component: () => import('@/views/system/UserManagement.vue'),
        meta: {
          title: '用户管理',
          icon: 'user',
          keepAlive: true,
        },
      },
      {
        path: '/system/role',
        name: 'RoleManagement',
        component: () => import('@/views/system/RoleManagement.vue'),
        meta: {
          title: '角色管理',
          icon: 'team',
          keepAlive: true,
        },
      },
    ],
  },
]

/**
 * 404 路由（必须放在最后）
 */
export const notFoundRoute: AppRouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  redirect: '/404',
}
```

### 2.3 创建 Router 实例

**src/router/index.ts**:

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import type { App } from 'vue'
import { basicRoutes, asyncRoutes, notFoundRoute } from './routes'

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...basicRoutes, ...asyncRoutes, notFoundRoute],
  scrollBehavior: () => ({ top: 0 }),
})

/**
 * 重置路由
 */
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...basicRoutes],
  })
  ;(router as any).matcher = (newRouter as any).matcher
}

/**
 * 配置路由
 */
export function setupRouter(app: App) {
  app.use(router)
}

export default router
```

---

## 3. 路由守卫

### 3.1 创建权限守卫

**src/router/guard.ts**:

```typescript
import router from './index'
import { useAuthStore } from '@/stores/auth'

/**
 * 路由守卫
 */
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || ''} - Ez-Admin`

  const authStore = useAuthStore()
  const hasToken = authStore.token

  if (hasToken) {
    // 已登录
    if (to.path === '/login') {
      // 如果去登录页，重定向到首页
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    // 未登录
    if (to.path === '/login') {
      next()
    } else {
      // 重定向到登录页
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach((to) => {
  // 可以在这里做一些统计或日志
})
```

### 3.2 在 main.ts 中初始化

**src/main.ts**:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'

const app = createApp(App)

// 配置路由
setupRouter(app)

app.mount('#app')
```

---

## 4. 路由使用示例

### 4.1 编程式导航

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 导航到不同位置
const goDashboard = () => {
  router.push('/dashboard')
}

// 带参数导航
const goUserDetail = (id: number) => {
  router.push({
    name: 'UserDetail',
    params: { id },
  })
}

// 替换当前位置
const replacePage = () => {
  router.replace('/login')
}

// 前进/后退
const goBack = () => {
  router.back()
}

const goForward = () => {
  router.forward()
}
</script>
```

### 4.2 声明式导航

```vue
<template>
  <!-- 基础路由 -->
  <router-link to="/dashboard">工作台</router-link>

  <!-- 命名路由 -->
  <router-link :to="{ name: 'UserDetail', params: { id: 1 } }">
    用户详情
  </router-link>

  <!-- 带查询参数 -->
  <router-link :to="{ path: '/user', query: { page: 1 } }">
    用户列表
  </router-link>
</template>
```

### 4.3 获取路由信息

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

// 当前路径
console.log(route.path)

// 路由参数
console.log(route.params)

// 查询参数
console.log(route.query)

// 路由元信息
console.log(route.meta.title)
</script>
```

---

## 5. 路由懒加载

### 5.1 懒加载语法

```typescript
// ✅ 推荐：使用动态导入
const DashboardPage = () => import('@/views/dashboard/DashboardPage.vue')

// ✅ 推荐：命名 chunk（更好的调试体验）
const UserManagement = () =>
  import(/* webpackChunkName: "system" */ '@/views/system/UserManagement.vue')

// ❌ 不推荐：直接导入（不懒加载）
import DashboardPage from '@/views/dashboard/DashboardPage.vue'
```

### 5.2 分组打包

```typescript
// 相同功能的模块打包在一起
const UserRoutes = [
  {
    path: '/user',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/index.vue'),
  },
  {
    path: '/role',
    component: () => import(/* webpackChunkName: "user" */ '@/views/role/index.vue'),
  },
]
```

---

## 6. 路由过渡动画

### 6.1 添加过渡效果

**App.vue**:

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'fade'" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

---

## 7. 常见问题

### Q1: 路由跳转后页面不刷新？

**A**: 在 `<router-view>` 上添加 `:key`:
```vue
<router-view :key="$route.path" />
```

### Q2: 路由参数丢失？

**A**: 检查是否正确获取参数：
```typescript
// 动态路由参数
route.params.id

// 查询参数
route.query.page
```

### Q3: 路由守卫不生效？

**A**: 确保在 `main.ts` 中导入了守卫文件：
```typescript
import './router/guard' // 确保守卫被执行
```

---

## 8. 本节小结

✅ 完成的工作：
- 安装并配置了 Vue Router 4
- 设计了后台管理系统的路由结构
- 实现了路由懒加载
- 配置了路由守卫

🎯 路由清单：
- ✅ 基础路由配置
- ✅ 异步路由配置
- ✅ 路由守卫
- ✅ 路由懒加载
- ✅ 类型定义

**下一步**: [2.2 Pinia 状态管理搭建](./02-Pinia状态管理搭建.md)
