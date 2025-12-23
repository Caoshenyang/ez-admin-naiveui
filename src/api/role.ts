import http from '../utils/request'

// 这里同样以常见 REST 风格为默认约定

export interface RoleQuery {
  page?: number
  size?: number
  roleName?: string
  roleKey?: string
}

export interface RoleItem {
  id: number
  roleName: string
  roleKey: string
  description?: string
  status?: number
  createdTime?: string
}

export interface PageResult<T> {
  records: T[]
  total: number
}

export interface SaveRoleDTO {
  id?: number
  roleName: string
  roleKey: string
  description?: string
  status?: number
}

export const roleApi = {
  // 分页查询角色列表
  page: (params: RoleQuery) =>
    http.get<PageResult<RoleItem>>('/system/role/page', { params }),

  // 新增角色
  create: (data: SaveRoleDTO) =>
    http.post<void>('/system/role', data),

  // 更新角色
  update: (data: SaveRoleDTO) =>
    http.put<void>('/system/role', data),

  // 删除角色
  remove: (id: number) =>
    http.delete<void>(`/system/role/${id}`),

  // 批量删除
  batchRemove: (ids: number[]) =>
    http.delete<void>('/system/role/batch', { data: ids }),

  // 详情
  detail: (id: number) =>
    http.get<RoleItem>(`/system/role/${id}`),
}

