# 布局系统使用指南

## 概述

本项目采用了一套完整的后台管理系统布局方案，包含侧边栏、顶部导航栏、标签页、内容区域等核心模块。布局系统基于 **NaiveUI** 和 **Tailwind CSS** 构建，支持响应式设计和多种自定义配置。

## 目录结构

```
src/
├── layouts/
│   ├── AppLayout.vue             # 主布局容器
│   └── components/
│       ├── AppLogo.vue           # Logo 组件
│       ├── AppMenu.vue           # 菜单组件
│       ├── AppTopBar.vue         # 顶部导航栏组件
│       └── AppWorkTab.vue        # 标签页组件
├── types/
│   └── layout.ts                 # 布局类型定义
├── stores/
│   └── modules/
│       └── layout.ts             # 布局状态管理
├── enums/
│   └── menu.ts                   # 菜单宽度枚举
└── config/
    └── menu.ts                   # 菜单配置
```

## 核心功能

### 1. Logo 组件 (AppLogo)

显示系统 Logo 和名称，点击可返回首页。支持折叠状态下的简化显示。

### 2. 菜单组件 (AppMenu)

**功能特性：**
- 支持多级菜单
- 支持折叠/展开
- 响应式设计（移动端自动折叠）
- 菜单状态持久化
- 图标支持（基于 @vicons/ionicons5）

**配置方式：**

在 `src/config/menu.ts` 中配置菜单项：

```typescript
import { HomeOutlined, SettingsOutline } from '@vicons/ionicons5'

export const menuConfig: MenuItem[] = [
  {
    key: 'home',
    label: '首页',
    icon: HomeOutlined,
    path: '/',
  },
  {
    key: 'system',
    label: '系统管理',
    icon: SettingsOutline,
    children: [
      {
        key: 'system-user',
        label: '用户管理',
        path: '/system/user',
      },
    ],
  },
]
```

### 3. 顶部导航栏 (AppTopBar)

**功能特性：**
- 侧边栏折叠按钮
- 面包屑导航
- 用户信息下拉菜单
- 主题切换按钮（待完善）
- 全屏切换按钮（待完善）

### 4. 标签页组件 (AppWorkTab)

**功能特性：**
- 访问页面自动添加标签页
- 支持固定标签页（不可关闭）
- 支持切换标签页
- 支持右键菜单：
  - 刷新当前页
  - 关闭标签页
  - 关闭其他标签页
  - 关闭左侧标签页
  - 关闭右侧标签页
  - 关闭全部标签页
- 标签页状态持久化

### 5. 布局配置

通过 Layout Store 管理布局状态：

```typescript
import { useLayoutStore } from '@/stores/modules/layout'

const layoutStore = useLayoutStore()

// 切换侧边栏折叠
layoutStore.toggleSidebar()

// 设置侧边栏折叠状态
layoutStore.setSidebarCollapsed(true)

// 更新布局配置
layoutStore.updateLayoutConfig({
  showTabs: true,
  showBreadcrumb: true,
  layoutMode: 'sidebar',
})
```

### 4. 标签页系统

**功能特性：**
- 访问页面自动添加标签页
- 支持固定标签页（不可关闭）
- 支持右键菜单（关闭其他、关闭左侧、关闭右侧等）
- 标签页状态持久化

**使用方式：**

```typescript
// 添加标签页
layoutStore.addTab({
  path: '/dashboard',
  title: '仪表盘',
  name: 'Dashboard',
  affix: true, // 固定标签页
})

// 关闭标签页
layoutStore.removeTab('/dashboard')

// 关闭其他标签页
layoutStore.closeOtherTabs('/dashboard')

// 关闭所有标签页
layoutStore.closeAllTabs()
```

### 6. 菜单宽度配置

使用枚举管理菜单宽度：

```typescript
import { MenuWidthEnum } from '@/enums/menu'

// 菜单折叠时的宽度
MenuWidthEnum.CLOSE // 64

// 菜单展开时的宽度
MenuWidthEnum.OPEN // 240
```

## 路由配置

### 基础路由（constantRoutes）

不需要权限的路由，如登录页、404 页面：

```typescript
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
]
```

### 异步路由（asyncRoutes）

需要权限控制的路由，使用布局组件包裹：

```typescript
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/HomePage.vue'),
        meta: {
          title: '首页',
          affix: true, // 固定标签页
        },
      },
    ],
  },
]
```

## 路由元信息（meta）

```typescript
interface RouteMeta {
  /** 页面标题 */
  title?: string
  /** 是否在菜单中隐藏 */
  hidden?: boolean
  /** 是否缓存页面 */
  keepAlive?: boolean
  /** 权限标识 */
  roles?: string[]
  /** 图标 */
  icon?: string
  /** 排序 */
  order?: number
  /** 是否固定标签页（不可关闭） */
  affix?: boolean
  /** 是否不显示面包屑 */
  noBreadcrumb?: boolean
}
```

## 响应式设计

布局系统支持移动端和桌面端自适应：

- **移动端（< 768px）**：侧边栏自动折叠
- **桌面端（≥ 768px）**：侧边栏默认展开

```typescript
// 监听窗口大小变化
const handleResize = () => {
  const width = window.innerWidth
  if (width < 768) {
    layoutStore.setDevice('mobile')
    layoutStore.setSidebarCollapsed(true)
  } else {
    layoutStore.setDevice('desktop')
  }
}
```

## 自定义主题

### 修改侧边栏宽度

```typescript
layoutStore.updateLayoutConfig({
  sidebarWidth: 280,
  sidebarCollapsedWidth: 64,
})
```

### 修改布局模式

```typescript
layoutStore.updateLayoutConfig({
  layoutMode: 'sidebar', // 'sidebar' | 'top-menu' | 'mix-menu'
})
```

### 修改主题模式

```typescript
layoutStore.updateLayoutConfig({
  themeMode: 'dark', // 'light' | 'dark' | 'auto'
})
```

## 常见问题

### 1. 如何添加新页面？

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/routes.ts` 的 `asyncRoutes` 中添加路由配置
3. 在 `src/config/menu.ts` 中添加菜单项（可选）

### 2. 如何隐藏菜单项？

在路由 meta 中设置 `hidden: true`：

```typescript
{
  path: '/detail/:id',
  name: 'Detail',
  component: () => import('@/views/DetailPage.vue'),
  meta: {
    title: '详情页',
    hidden: true, // 不在菜单中显示
  },
}
```

### 3. 如何固定标签页？

在路由 meta 中设置 `affix: true`：

```typescript
{
  path: '/home',
  name: 'Home',
  component: () => import('@/views/HomePage.vue'),
  meta: {
    title: '首页',
    affix: true, // 固定标签页，不可关闭
  },
}
```

### 4. 如何实现页面缓存？

在路由 meta 中设置 `keepAlive: true`，并在布局组件中使用 `<KeepAlive>`：

```typescript
{
  path: '/list',
  name: 'List',
  component: () => import('@/views/ListPage.vue'),
  meta: {
    title: '列表页',
    keepAlive: true, // 缓存页面
  },
}
```

## 后续优化方向

- [x] 实现标签页组件（AppWorkTab）
- [x] 实现面包屑自动生成
- [ ] 实现暗色模式切换
- [ ] 实现全屏切换功能
- [ ] 实现页面切换动画配置
- [ ] 实现权限控制（路由守卫）
- [ ] 实现动态路由生成
- [ ] 实现多语言支持

## 相关文档

- [NaiveUI Layout 文档](https://www.naiveui.com/zh-CN/os-theme/components/layout)
- [NaiveUI Menu 文档](https://www.naiveui.com/zh-CN/os-theme/components/menu)
- [Vue Router 文档](https://router.vuejs.org/zh/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
