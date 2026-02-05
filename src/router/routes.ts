import type { RouteRecordRaw } from 'vue-router'

/**
 * 基础路由（不需要权限，如登录页、404等）
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginPage.vue'),
    meta: {
      title: '登录',
      hidden: true
    }
  },
  // 主布局路由（始终存在，作为动态路由的父容器）
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      // 首页（根路径）
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/HomePage.vue'),
        meta: {
          title: '首页',
          affix: true
        }
      }
    ]
  },
  // 临时通配路由（用于动态路由加载期间捕获所有路径，避免 "No match found" 警告）
  {
    path: '/:pathMatch(.*)*',
    name: 'TempWildcard',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: {
      hidden: true
    }
  }
]

/**
 * 404 通配路由（必须在动态路由之后注册）
 */
export const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/error/NotFoundPage.vue'),
  meta: {
    title: '页面未找到',
    hidden: true
  }
}

/**
 * 异步路由（需要权限控制的路由）
 */
export const asyncRoutes: RouteRecordRaw[] = []
