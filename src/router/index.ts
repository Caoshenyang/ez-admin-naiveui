import { createRouter, createWebHashHistory } from 'vue-router'

// 路由名称常量
export const ROUTE_NAMES = {
  LOGIN: 'Login',
  HOME: 'Home',
  ERROR: 'Error',
  NOT_FOUND: 'NotFound',
} as const

// 路由路径常量
export const ROUTE_PATHS = {
  LOGIN: '/login',
  HOME: '/home',
  ERROR: '/error',
  NOT_FOUND: '/:pathMatch(.*)*',
} as const

// 静态路由配置
const staticRoutes = [
  // 登录页 - 静态路由，不需要权限控制
  {
    path: ROUTE_PATHS.LOGIN,
    name: ROUTE_NAMES.LOGIN,
    component: () => import('@/views/login/LoginPage.vue'),
    meta: {
      title: '登录',
      showInMenu: false,
    },
  },
  // 首页 - 每个用户默认拥有
  {
    path: '/',
    redirect: ROUTE_PATHS.HOME,
    component: () => import('@/components/layout/AppLayout.vue'),
    children: [
      {
        path: ROUTE_PATHS.HOME.slice(1), // 去掉前导斜杠
        name: ROUTE_NAMES.HOME,
        component: () => import('@/views/dashboard/HomePage.vue'),
        meta: {
          title: '首页',
          showInMenu: true,
        },
      },
    ],
  },
  // 错误页 - 静态路由，处理系统错误
  {
    path: ROUTE_PATHS.ERROR,
    name: ROUTE_NAMES.ERROR,
    component: () => import('@/views/error/ErrorPage.vue'),
    meta: {
      title: '系统错误',
      showInMenu: false,
    },
  },
  // 404页面 - 静态路由
  {
    path: ROUTE_PATHS.NOT_FOUND,
    name: ROUTE_NAMES.NOT_FOUND,
    component: () => import('@/views/error/NotFoundPage.vue'),
    meta: {
      title: '页面未找到',
      showInMenu: false,
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    ...staticRoutes,
    // 动态路由会在用户登录后从后端获取并添加
  ],
})

// 导出静态路由名称数组，供 routeManager 使用
export const STATIC_ROUTE_NAMES = Object.values(ROUTE_NAMES)

export default router
