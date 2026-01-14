import http from '@/utils/request'
import type { MenuTreeVO, SaveMenuDTO, MenuQuery, Menu } from '@/types'

export const menuApi = {
  // 获取菜单树形结构
  tree: (params?: MenuQuery) => http.post<MenuTreeVO[]>('/system/menu/tree', params || {}),

  // 新增菜单
  create: (data: SaveMenuDTO) => http.post<void>('/system/menu/create', data),

  // 更新菜单
  update: (data: SaveMenuDTO) => http.post<void>('/system/menu/update', data),

  // 删除菜单
  remove: (id: string | number) => http.delete<void>(`/system/menu/${id}`),

  // 获取详情
  detail: (id: string | number) => http.get<Menu>(`/system/menu/${id}`),

  // 获取父节点树形结构（用于表单上级菜单选择）
  parentTree: (excludeId?: string | number) => http.post<MenuTreeVO[]>('/system/menu/parent-tree', excludeId ? { excludeId } : {}),
}
