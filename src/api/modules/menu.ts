import { request } from '../request'
import type {
  MenuTreeVO,
  Menu,
  MenuCreateDTO,
  MenuUpdateDTO,
  MenuQuery,
  MenuParentTreeDTO
} from '@/types/api'

/**
 * 菜单树查询
 */
export function getMenuTree(query?: MenuQuery) {
  return request.post<MenuTreeVO[]>('/system/menu/tree', query || {})
}

/**
 * 获取父节点树形结构（用于表单上级菜单选择）
 */
export function getMenuParentTree(dto?: MenuParentTreeDTO) {
  return request.post<MenuTreeVO[]>('/system/menu/parent-tree', dto || {})
}

/**
 * 菜单详情
 */
export function getMenuDetail(menuId: number) {
  return request.get<Menu>(`/system/menu/${menuId}`)
}

/**
 * 新增菜单
 */
export function createMenu(data: MenuCreateDTO) {
  return request.post('/system/menu/create', data)
}

/**
 * 更新菜单
 */
export function updateMenu(data: MenuUpdateDTO) {
  return request.post('/system/menu/update', data)
}

/**
 * 删除菜单
 */
export function deleteMenu(menuId: number) {
  return request.delete(`/system/menu/${menuId}`)
}

/**
 * 全部菜单列表
 */
export function getMenuListAll() {
  return request.get<Menu[]>('/system/menu/list')
}
