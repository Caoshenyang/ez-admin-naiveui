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
/**
 * 后端返回的菜单数据结构
 */
export interface MenuVO {
  /** 菜单ID */
  id: string | number
  /** 父菜单ID */
  parentId?: string | number
  /** 菜单名称 */
  title: string
  /** 路由路径 */
  path: string
  /** 组件路径（相对于 views 目录） */
  component: string
  /** 图标 */
  icon?: string
  /** 是否隐藏 */
  hidden?: boolean
  /** 是否缓存 */
  keepAlive?: boolean
  /** 权限标识 */
  permissions?: string[]
  /** 子菜单 */
  children?: MenuVO[]
}
```

**类型设计说明**：

1. **Vue Router 的 RouteMeta 是开放式的**：
   ```typescript
   // Vue Router 的定义
   interface RouteMeta extends Record<PropertyKey, unknown> {}
   ```
   这意味着 `RouteMeta` 可以接受任何属性，无需自定义接口

2. **直接使用 RouteMeta**：
   - 不需要定义自定义的 `RouteMeta` 接口
   - 直接在 `meta` 对象中添加需要的属性即可
   - TypeScript 仍然会提供类型检查和智能提示

3. **完全类型安全**：
   - 无需任何 `any` 或 `as xxx` 断言
   - TypeScript 会检查 meta 对象的字段类型
   - Vue Router 的设计本身就是开放式的

### 2.2 创建路由配置

**src/router/routes.ts**:

```typescript
import type { RouteRecordRaw } from 'vue-router'

/**
 * 基础路由（不需要权限，如登录页、404等）
 * 注意：404 通配路由也在此处，确保始终存在兜底路由
 */
export const constantRoutes: RouteRecordRaw[] = [
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
    component: () => import('@/views/error/NotFoundPage.vue'),
    meta: {
      title: '页面不存在',
      hidden: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]
```

**设计说明**：

- **基础路由**：不需要权限的路由（登录页、404 页面等）
- **404 通配路由**：包含在 `constantRoutes` 中，确保始终存在
  - 避免用户登出后访问任意路径出现空白页面
  - 404 通配路由不涉及权限，可以始终存在
  - 捕获所有未匹配的路径并重定向到 `/404`

### 2.3 定义后端菜单数据类型

**src/router/types.ts**（在文件末尾添加）:

```typescript
/**
 * 后端返回的菜单数据结构
 */
export interface MenuVO {
  /** 菜单ID */
  id: string | number
  /** 父菜单ID */
  parentId?: string | number
  /** 菜单名称 */
  title: string
  /** 路由路径 */
  path: string
  /** 组件路径（相对于 views 目录） */
  component: string
  /** 图标 */
  icon?: string
  /** 排序 */
  order?: number
  /** 是否隐藏 */
  hidden?: boolean
  /** 是否缓存 */
  keepAlive?: boolean
  /** 是否固定在 Tab 上 */
  affix?: boolean
  /** 权限标识 */
  permissions?: string[]
  /** 子菜单 */
  children?: MenuVO[]
}

/**
 * 后端返回的菜单树响应
 */
export interface MenuTreeResponse {
  /** 菜单树数据 */
  menus: MenuVO[]
  /** 用户权限列表 */
  permissions: string[]
}
```

### 2.4 动态路由生成器

**src/router/helper.ts**:

```typescript
import type { RouteRecordRaw } from 'vue-router'
import type { MenuVO } from './types'

/**
 * 组件映射表
 * 将后端返回的组件路径映射到实际组件
 */
const modules = import.meta.glob('../views/**/*.vue')

/**
 * 根据组件路径动态加载组件
 * @param componentPath 组件路径，如 'system/user/index'
 * @returns 组件
 */
export function loadComponent(componentPath: string) {
  const key = `../views/${componentPath}.vue`

  if (modules[key]) {
    return modules[key]
  }

  console.warn(`组件不存在: ${key}`)
  return () => import('../views/error/404.vue')
}

/**
 * 将后端菜单数据转换为路由配置
 * @param menu 后端菜单数据
 * @returns 路由配置
 */
export function menuToRoute(menu: MenuVO): RouteRecordRaw {
  const route: RouteRecordRaw = {
    path: menu.path,
    name: menu.id.toString(),
    component: loadComponent(menu.component),
    meta: {
      title: menu.title,
      icon: menu.icon,
      hidden: menu.hidden,
      keepAlive: menu.keepAlive,
      affix: menu.affix,
      permissions: menu.permissions,
      order: menu.order,
    },
    children: menu.children && menu.children.length > 0
      ? menu.children.map(menuToRoute)
      : undefined,
  }

  return route
}
```

**类型安全说明**：

1. **Vue Router 的 RouteMeta 是开放式的**：可以接受任何属性
2. **直接在 meta 中添加字段**：无需定义自定义接口
3. **完全类型安全**：TypeScript 会检查 meta 对象的每个字段类型
4. **无需断言**：整个过程不需要任何 `as` 断言

### 2.5 创建 Router 实例

**src/router/index.ts**:

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes } from './routes'

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0 }),
})

/**
 * 动态添加路由
 * 注意：404 通配路由已在 constantRoutes 中，无需再次添加
 * @param routes 动态路由配置
 */
export function addRoutes(routes: RouteRecordRaw[]) {
  routes.forEach(route => {
    router.addRoute(route)
  })
}

/**
 * 重置路由
 * 使用 Vue Router 4 的 removeRoute API 移除所有动态路由
 * 404 通配路由保留在 constantRoutes 中，始终存在兜底路由
 */
export function resetRouter() {
  // 获取所有当前路由
  const allRoutes = router.getRoutes()

  // 获取所有需要保留的基础路由名称
  const constantRouteNames = new Set(constantRoutes.map(r => r.name))

  // 删除所有不在 constantRoutes 中的路由（只删除动态路由）
  allRoutes.forEach((route) => {
    const { name } = route
    if (name && !constantRouteNames.has(name)) {
      router.removeRoute(name)
    }
  })
}

/**
 * 配置路由
 */
export function setupRouter(app: App) {
  app.use(router)
}

export default router
```

**类型安全说明**：

1. **Vue Router 的 RouteMeta 是开放式的**：
   ```typescript
   interface RouteMeta extends Record<PropertyKey, unknown> {}
   ```
   可以接受任何属性，无需自定义接口

2. **直接在 meta 中添加字段**：
   ```typescript
   const route: RouteRecordRaw = {
     path: '/user',
     meta: {
       title: '用户管理',      // ✅ 直接添加
       permissions: ['user:view']  // ✅ 类型检查
     }
   }
   ```

3. **完全类型安全**：
   - TypeScript 会检查 meta 对象的每个字段类型
   - 无需任何 `any` 或 `as xxx` 断言
   - 符合项目的严格类型安全规范

详细解释参见：[TypeScript 类型系统说明](./TypeScript类型系统说明.md)

---

## 3. 路由守卫

### 3.1 创建权限守卫

**src/router/guard.ts**:

```typescript
import router from './index'
import { useAuthStore } from '@/stores/auth'
import { generateRoutes, addRoutes } from './helper'

/**
 * 路由守卫
 */
router.beforeEach(async (to, from, next) => {
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
      // 检查是否已加载动态路由
      if (!authStore.routesLoaded) {
        try {
          // 从后端获取菜单数据
          const { menus } = await authStore.fetchUserMenus()

          // 生成路由配置
          const routes = generateRoutes(menus)

          // 动态添加路由
          addRoutes(routes)

          // 标记路由已加载
          authStore.routesLoaded = true

          // 重新进入当前路由
          next({ ...to, replace: true })
        } catch (error) {
          console.error('加载路由失败:', error)
          // 登出并跳转到登录页
          await authStore.logout()
          next(`/login?redirect=${to.path}`)
        }
      } else {
        next()
      }
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

### 3.2 Auth Store 示例

**src/stores/auth.ts**:

```typescript
import { defineStore } from 'pinia'
import type { MenuVO } from '@/router/types'
import { getMenuTree } from '@/api/auth'

interface AuthState {
  token: string
  permissions: string[]
  routesLoaded: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || '',
    permissions: [],
    routesLoaded: false,
  }),

  actions: {
    /** 获取用户菜单 */
    async fetchUserMenus() {
      const { data } = await getMenuTree()
      this.permissions = data.permissions
      return data
    },

    /** 登出 */
    async logout() {
      this.token = ''
      this.permissions = []
      this.routesLoaded = false
      localStorage.removeItem('token')
    },
  },
})
```

### 3.3 API 请求示例

**src/api/auth.ts**:

```typescript
import request from '@/utils/request'
import type { MenuTreeResponse } from '@/router/types'

/**
 * 获取用户菜单树
 */
export function getMenuTree() {
  return request<MenuTreeResponse>({
    url: '/system/user/menus',
    method: 'get',
  })
}
```

### 3.4 后端接口数据示例

**请求示例**:
```http
GET /api/system/user/menus
Authorization: Bearer {token}
```

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "menus": [
      {
        "id": "1",
        "parentId": null,
        "title": "系统管理",
        "path": "/system",
        "component": "layouts/index",
        "icon": "setting",
        "order": 1,
        "children": [
          {
            "id": "1-1",
            "parentId": "1",
            "title": "用户管理",
            "path": "/system/user",
            "component": "system/user/index",
            "icon": "user",
            "permissions": ["system:user:view"],
            "order": 1
          },
          {
            "id": "1-2",
            "parentId": "1",
            "title": "角色管理",
            "path": "/system/role",
            "component": "system/role/index",
            "icon": "team",
            "permissions": ["system:role:view"],
            "order": 2
          }
        ]
      }
    ],
    "permissions": [
      "system:user:view",
      "system:user:create",
      "system:user:update",
      "system:user:delete",
      "system:role:view",
      "dashboard:view"
    ]
  }
}
```

### 3.5 在 main.ts 中初始化

**src/main.ts**:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import './router/guard' // 确保卫卫被执行

const app = createApp(App)

// 配置路由
setupRouter(app)

app.mount('#app')
```

---

## 4. 方案优势说明

### 4.1 为什么选择后端返回菜单树？

#### ✅ 优势

1. **灵活的权限控制**
   - 管理员可通过后台动态配置菜单
   - 不同角色/租户可拥有完全不同的菜单结构
   - 无需重新部署前端即可调整权限

2. **安全性更高**
   - 后端完全掌握用户可访问的页面
   - 减少前端路由泄露风险
   - 权限变更即时生效

3. **符合实际业务场景**
   - 大多数后台管理系统需要动态菜单
   - 多租户场景下菜单差异巨大
   - 运营人员可自行配置菜单

4. **权限与菜单统一**
   - 一次接口调用解决菜单和权限两个问题
   - 减少前端维护成本

#### ⚠️ 注意事项

1. **前端路由控制 ≠ 最终权限验证**
   - 前端只控制用户体验（避免无权限页面）
   - **后端 API 必须再次验证权限**（真正的安全边界）

2. **组件路径约定**
   - 后端返回的组件路径需与前端目录结构对应
   - 组件不存在时需有降级方案（如 404 页面）

3. **类型安全（项目核心规范）**
   - **严禁使用 `any` 类型**
   - **严禁使用 `as xxx` 类型断言**绕开类型约束
   - Vue Router 的 `RouteMeta` 是开放式的，可直接在 `meta` 中添加任何字段
   - TypeScript 会检查 `meta` 对象的字段类型
   - 无需自定义 `RouteMeta` 接口
   - 所有类型设计都遵循 TypeScript 最佳实践

4. **路由重置最佳实践**
   - 使用 Vue Router 4 的 `removeRoute` API 移除动态路由
   - **避免使用 `Object.assign(router, newRouter)`**（Vue Router 3 时代的遗留做法）
   - **404 通配路由包含在 `constantRoutes` 中，始终存在**
     - 避免用户登出后访问任意路径出现空白页面
     - 404 通配路由不涉及权限，可以始终存在
   - 对比两种方案：

     | 方面 | Object.assign 做法 | removeRoute 做法（推荐） |
     |------|-------------------|----------------------|
     | **安全性** | ❌ 可能导致状态错乱 | ✅ 安全，符合官方 API |
     | **可维护性** | ❌ 逻辑模糊，难以追踪 | ✅ 显式操作，意图明确 |
     | **性能** | ⚠️ 可能存在内存风险 | ✅ 性能平稳 |
     | **官方支持** | ❌ 非官方推荐 | ✅ Vue Router 4 官方 API |

   - 正确实现方式：
     ```typescript
     export function resetRouter() {
       const allRoutes = router.getRoutes()
       const constantRouteNames = new Set(constantRoutes.map(r => r.name))

       // 删除所有不在 constantRoutes 中的路由（只删除动态路由）
       allRoutes.forEach((route) => {
         const { name } = route
         if (name && !constantRouteNames.has(name)) {
           router.removeRoute(name)
         }
       })
     }
     ```

---

## 5. 路由使用示例

### 5.1 编程式导航

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

### 5.2 声明式导航

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

### 5.3 获取路由信息

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

## 6. 路由懒加载

### 6.1 懒加载语法

```typescript
// ✅ 推荐：使用动态导入
const DashboardPage = () => import('@/views/dashboard/DashboardPage.vue')

// ✅ 推荐：命名 chunk（更好的调试体验）
const UserManagement = () =>
  import(/* webpackChunkName: "system" */ '@/views/system/UserManagement.vue')

// ❌ 不推荐：直接导入（不懒加载）
import DashboardPage from '@/views/dashboard/DashboardPage.vue'
```

### 6.2 分组打包

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

## 7. 路由过渡动画

### 7.1 添加过渡效果

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

## 8. 常见问题

### Q1: 路由跳转后页面不刷新？

**A**: 在 `<router-view>` 上添加 `:key`:
```vue
<router-view :key="$route.path" />
```

### Q2: 动态路由不生效？

**A**: 确保：
1. 后端返回的组件路径与前端目录结构一致
2. 在路由守卫中重新进入当前路由：`next({ ...to, replace: true })`
3. 404 通配路由在动态路由之后添加

### Q3: 刷新页面后路由丢失？

**A**: 动态路由需要重新加载：
- 在路由守卫中检查 `routesLoaded` 状态
- 未加载时重新获取菜单数据并生成路由

### Q4: 组件路径映射失败？

**A**: 检查 `loadComponent` 函数中的路径映射：
- 后端返回：`'system/user/index'`
- 转换后：`../views/system/user/index.vue`
- 使用 `import.meta.glob` 确保组件被 Vite 发现

### Q5: 如何处理 TypeScript 类型不兼容？

**A**: 本项目遵循严格的类型安全规范，利用 **Vue Router RouteMeta 的开放性**：

- ❌ **禁止使用** `any` 类型
- ❌ **禁止使用** `as xxx` 类型断言
- ❌ **不推荐** 模块增强（Module Augmentation），会污染全局类型
- ❌ **不推荐** 自定义 `RouteMeta` 接口，没有必要
- ✅ **正确做法**：
  1. Vue Router 的 `RouteMeta` 本身就是开放式的：`interface RouteMeta extends Record<PropertyKey, unknown> {}`
  2. 直接在 `meta` 对象中添加需要的字段即可
  3. TypeScript 会检查字段类型
  4. 无需任何额外定义

**示例**：
```typescript
// types.ts - 不需要定义 RouteMeta
import type { Router } from 'vue-router'

export interface RouterInternal extends Router {
  matcher: Router['matcher']
}

// helper.ts - 直接使用
export function menuToRoute(menu: MenuVO): RouteRecordRaw {
  const route: RouteRecordRaw = {
    path: menu.path,
    meta: {
      title: menu.title,      // ✅ 直接添加字段
      permissions: menu.permissions  // ✅ 类型检查通过
    }
  }

  return route
}
```

详细说明：[TypeScript 类型系统说明](./TypeScript类型系统说明.md)

---

## 9. 本节小结

✅ 完成的工作：
- 安装并配置了 Vue Router 4
- **采用后端返回菜单树方案**，实现动态路由
- 定义了完整的类型系统（RouteMeta、MenuVO 等）
- 实现了路由生成器和动态加载逻辑
- 配置了路由守卫和权限控制
- 实现了路由懒加载

🎯 路由清单：
- ✅ 基础路由配置（登录页、404 等）
- ✅ 后端菜单数据类型定义
- ✅ 动态路由生成器
- ✅ 路由守卫与权限控制
- ✅ 组件动态加载机制
- ✅ 路由懒加载
- ✅ 完整 TypeScript 类型支持

📋 核心文件：
```
src/router/
├── index.ts          # Router 实例和路由管理
├── types.ts          # 类型定义（RouteMeta、MenuVO 等）
├── routes.ts         # 常量路由定义
├── helper.ts         # 路由生成器和工具函数
└── guard.ts          # 路由守卫
```

🎯 设计原则：
1. **后端控制权限**：菜单结构由后端返回，前端动态注册
2. **严格类型安全（利用 Vue Router 设计）**：
   - Vue Router 的 `RouteMeta` 是开放式的，可直接添加任何字段
   - 无需自定义 `RouteMeta` 接口
   - TypeScript 会检查 `meta` 对象的字段类型
   - 无需任何类型断言（`as xxx`）
   - 完全避免 `any`
3. **用户体验**：前端路由控制避免无权限页面
4. **安全边界**：后端 API 必须再次验证权限

**下一步**: [2.2 Pinia 状态管理搭建](./02-Pinia状态管理搭建.md)
