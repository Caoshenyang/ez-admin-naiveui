// 部门相关类型定义
import type { PageQuery } from './api'
import type { CrudConfig } from '@/hooks/useCrud'

// 部门列表VO（匹配接口文档字段）
export interface DeptListVO {
  deptId: number
  deptName: string
  parentId?: number
  deptSort?: number
  status?: number
  children?: DeptListVO[]
  createTime?: string
  updateTime?: string
}

// 部门详情VO（匹配接口文档字段）
export interface DeptDetailVO {
  deptId: number
  deptName: string
  parentId?: number
  deptSort?: number
  status?: number
  description?: string
  createTime?: string
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

// 部门创建DTO（匹配接口文档）
export interface DeptCreateDTO {
  deptName: string
  parentId?: number
  deptSort?: number
  status?: number
  description?: string
}

// 部门更新DTO（匹配接口文档）
export interface DeptUpdateDTO extends DeptCreateDTO {
  deptId: number
}

// 部门CRUD配置类型
export type DeptCrudConfig = CrudConfig<DeptListVO, DeptQuery, DeptCreateDTO, DeptUpdateDTO, DeptDetailVO>
