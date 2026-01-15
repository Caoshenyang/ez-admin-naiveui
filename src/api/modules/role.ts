import { request } from '../request'
import type {
  PageParams,
  Role,
  RoleDetailVO,
  RoleCreateDTO,
  RoleUpdateDTO
} from '@/types/api'

/**
 * 角色分页查询
 */
export function getRolePage(params: PageParams & {
  keywords?: string
  status?: number
}) {
  return request.post({
    url: '/system/role/page',
    data: {
      pageNum: params.page,
      pageSize: params.pageSize,
      search: {
        keywords: params.keywords,
        status: params.status
      }
    }
  })
}

/**
 * 角色详情
 */
export function getRoleDetail(roleId: number) {
  return request.get<RoleDetailVO>(`/system/role/${roleId}`)
}

/**
 * 新增角色
 */
export function createRole(data: RoleCreateDTO) {
  return request.post('/system/role/create', data)
}

/**
 * 更新角色
 */
export function updateRole(data: RoleUpdateDTO) {
  return request.post('/system/role/update', data)
}

/**
 * 删除角色
 */
export function deleteRole(roleId: number) {
  return request.delete(`/system/role/${roleId}`)
}

/**
 * 全部角色列表
 */
export function getRoleListAll() {
  return request.get<Role[]>('/system/role/list')
}
