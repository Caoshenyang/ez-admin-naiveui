import type { MenuItem } from '@/types/layout'
import {
  Home,
  Desktop,
  Settings,
  Document,
  Apps,
} from '@vicons/ionicons5'

/**
 * 菜单配置
 * 根据实际需求配置菜单项
 */
export const menuConfig: MenuItem[] = [
  {
    key: 'home',
    label: '首页',
    icon: Home,
    path: '',
  },
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: Desktop,
    path: '/dashboard',
    children: [
      {
        key: 'dashboard-analytics',
        label: '数据分析',
        path: '/dashboard/analytics',
      },
      {
        key: 'dashboard-overview',
        label: '总览',
        path: '/dashboard/overview',
      },
    ],
  },
  {
    key: 'examples',
    label: '组件示例',
    icon: Apps,
    path: '/examples',
    children: [
      {
        key: 'examples-form',
        label: '表单组件',
        path: '/form',
      },
      {
        key: 'examples-table',
        label: '表格组件',
        path: '/table',
      },
      {
        key: 'examples-modal',
        label: '弹窗组件',
        path: '/modal',
      },
      {
        key: 'examples-loading',
        label: 'Loading 组件',
        path: '/loading',
      },
    ],
  },
  {
    key: 'system',
    label: '系统管理',
    icon: Settings,
    path: '/system',
    children: [
      {
        key: 'system-user',
        label: '用户管理',
        path: '/system/user',
      },
      {
        key: 'system-role',
        label: '角色管理',
        path: '/system/role',
      },
      {
        key: 'system-menu',
        label: '菜单管理',
        path: '/system/menu',
      },
    ],
  },
  {
    key: 'document',
    label: '文档中心',
    icon: Document,
    path: '/document',
  },
]

/**
 * 根据路由配置生成菜单
 * @param routes 路由配置
 * @returns 菜单配置
 */
export function generateMenuFromRoutes(routes: any[]): MenuItem[] {
  const menus: MenuItem[] = []

  routes.forEach(route => {
    // 跳过隐藏的路由
    if (route.meta?.hidden) {
      return
    }

    const menuItem: MenuItem = {
      key: route.name as string,
      label: route.meta?.title || route.name,
      path: route.path,
      icon: route.meta?.icon,
    }

    // 处理子路由
    if (route.children && route.children.length > 0) {
      menuItem.children = generateMenuFromRoutes(route.children)
    }

    menus.push(menuItem)
  })

  return menus
}
