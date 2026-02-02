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

/**
 * 异步路由（需要权限控制的路由）
 */
export const asyncRoutes: RouteRecordRaw[] = [
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
          affix: true,
        },
      },
      // 示例合集页面
      {
        path: '/examples',
        name: 'ExamplesIndex',
        component: () => import('@/views/examples/ExamplesIndex.vue'),
        meta: {
          title: '组件示例合集',
        },
      },
      // 表单示例页面（独立访问）
      {
        path: '/form',
        name: 'FormExample',
        component: () => import('@/views/examples/components/FormExample.vue'),
        meta: {
          title: '表单示例',
          hidden: true, // 隐藏，通过合集页面访问
        },
      },
      // Loading 示例页面（独立访问）
      {
        path: '/loading',
        name: 'LoadingExample',
        component: () => import('@/views/examples/components/LoadingExample.vue'),
        meta: {
          title: 'Loading 示例',
          hidden: true, // 隐藏，通过合集页面访问
        },
      },
      // LoadingBar 示例页面（独立访问）
      {
        path: '/loadingbar',
        name: 'EzLoadingBarExample',
        component: () => import('@/views/examples/components/EzLoadingBarExample.vue'),
        meta: {
          title: 'EzLoadingBar 示例',
          hidden: true, // 隐藏，通过合集页面访问
        },
      },
      // Modal 示例页面（独立访问）
      {
        path: '/modal',
        name: 'ModalExample',
        component: () => import('@/views/examples/components/ModalExample.vue'),
        meta: {
          title: 'EzModal 示例',
          hidden: true, // 隐藏，通过合集页面访问
        },
      },
      // 表格示例页面
      {
        path: '/table',
        name: 'TableExample',
        component: () => import('@/views/examples/components/TableExample.vue'),
        meta: {
          title: '表格示例',
          hidden: true,
        },
      },
    ],
  },
]
