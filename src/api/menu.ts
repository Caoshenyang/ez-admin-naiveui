import request from '@/utils/request'
import type { MenuItem } from '@/router/routes'

/**
 * 获取用户菜单数据
 */
export const getUserMenus = () => {
  return request<MenuItem[]>({
    url: '/system/menu/user',
    method: 'get'
  })
}

/**
 * 获取所有菜单数据（管理员用）
 */
export const getAllMenus = () => {
  return request<MenuItem[]>({
    url: '/system/menu',
    method: 'get'
  })
}