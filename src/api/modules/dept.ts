import { request } from '../request'
import type {
  DeptTreeVO,
  Dept,
  DeptCreateDTO,
  DeptUpdateDTO,
  DeptQuery,
  DeptParentTreeDTO
} from '@/types/api'

/**
 * 部门树查询
 */
export function getDeptTree(query?: DeptQuery) {
  return request.post<DeptTreeVO[]>('/system/dept/tree', query || {})
}

/**
 * 获取父节点树形结构（用于表单上级部门选择）
 */
export function getDeptParentTree(dto?: DeptParentTreeDTO) {
  return request.post<DeptTreeVO[]>('/system/dept/parent-tree', dto || {})
}

/**
 * 部门详情
 */
export function getDeptDetail(deptId: number) {
  return request.get<Dept>(`/system/dept/${deptId}`)
}

/**
 * 新增部门
 */
export function createDept(data: DeptCreateDTO) {
  return request.post('/system/dept/create', data)
}

/**
 * 更新部门
 */
export function updateDept(data: DeptUpdateDTO) {
  return request.post('/system/dept/update', data)
}

/**
 * 删除部门
 */
export function deleteDept(deptId: number) {
  return request.delete(`/system/dept/${deptId}`)
}
