import type { AppRouteRecordRaw } from '@/types/router'

/**
 * 静态路由（不需要权限）
 */
export const constantRoutes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: {
      title: '登录',
      hidden: true
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404',
      hidden: true
    }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/user',
    meta: {
      hidden: true
    }
  }
]

/**
 * 动态路由（从后端接口获取）
 * 注意：这些路由仅作为开发参考，实际路由由后端接口提供
 */
export const asyncRoutes: AppRouteRecordRaw[] = []
