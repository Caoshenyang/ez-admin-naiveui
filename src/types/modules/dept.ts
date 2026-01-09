// 部门相关类型定义
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
  keywords?: string
}

// 部门查询参数（树形模式，无分页）
export type DeptQuery = DeptSearchCriteria

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
