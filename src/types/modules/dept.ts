// 部门相关类型定义
import type { PageQuery } from './api'
import type { CrudConfig } from '@/hooks/useCrud'

// 部门列表VO
export interface DeptListVO {
  id: number
  deptName: string
  parentId?: number
  sort?: number
  status?: number
  children?: DeptListVO[]
  createdTime?: string
}

// 部门详情VO
export interface DeptDetailVO {
  id: number
  deptName: string
  parentId?: number
  sort?: number
  status?: number
  createdTime?: string
  updateTime?: string
}

// 部门搜索条件
export interface DeptSearchCriteria {
  deptName?: string
  status?: number
  parentId?: number
  keywords?: string
}

// 部门分页查询参数
export type DeptQuery = PageQuery<DeptSearchCriteria>

// 部门创建DTO
export interface DeptCreateDTO {
  deptName: string
  parentId?: number
  sort?: number
  status?: number
}

// 部门更新DTO
export interface DeptUpdateDTO extends DeptCreateDTO {
  id: number
}

// 部门CRUD配置类型
export type DeptCrudConfig = CrudConfig<DeptListVO, DeptQuery, DeptCreateDTO, DeptUpdateDTO, DeptDetailVO>
