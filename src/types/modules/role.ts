// 角色相关类型定义
import type { PageQuery } from './api'

// 角色实体
export interface RoleItem {
  id: number
  roleName: string
  roleKey: string
  description?: string
  status?: number
  createdTime?: string
}

// 角色搜索条件
export interface RoleSearchCriteria {
  roleName?: string
  roleKey?: string
}

// 角色分页查询参数
export type RoleQuery = PageQuery<RoleSearchCriteria>

// 角色保存/更新DTO
export interface SaveRoleDTO {
  id?: number
  roleName: string
  roleKey: string
  description?: string
  status?: number
}
