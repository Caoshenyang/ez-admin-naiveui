// 部门相关类型定义
import type { PageQuery } from './api'

// 部门实体
export interface DepartmentItem {
  id: number
  departmentName: string
  departmentKey: string
  parentId?: number
  leader?: string
  phone?: string
  email?: string
  sort?: number
  status?: number
  children?: DepartmentItem[]
  createdTime?: string
}

// 部门搜索条件
export interface DepartmentSearchCriteria {
  departmentName?: string
  status?: number
  parentId?: number
}

// 部门分页查询参数
export type DepartmentQuery = PageQuery<DepartmentSearchCriteria>

// 部门保存/更新DTO
export interface SaveDepartmentDTO {
  id?: number
  departmentName: string
  departmentKey: string
  parentId?: number
  leader?: string
  phone?: string
  email?: string
  sort?: number
  status?: number
}
