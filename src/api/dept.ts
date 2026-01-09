import http from '../utils/request'
import type { DeptQuery, DeptListVO, DeptDetailVO, DeptCreateDTO, DeptUpdateDTO } from '@/types'

export const deptApi = {
  // 获取所有部门树形结构（根据接口文档是POST方法）
  tree: (params?: DeptQuery) => http.post<DeptListVO[]>('/system/dept/tree', params || {}),

  // 新增部门
  create: (data: DeptCreateDTO) => http.post<void>('/system/dept/create', data),

  // 更新部门
  update: (data: DeptUpdateDTO) => http.post<void>('/system/dept/update', data),

  // 删除部门
  remove: (id: string | number) => http.delete<void>(`/system/dept/${id}`),

  // 获取详情
  detail: (id: string | number) => http.get<DeptDetailVO>(`/system/dept/${id}`),

  // 获取父节点树形结构（用于表单上级部门选择）
  parentTree: (excludeId?: number) => http.post<DeptListVO[]>('/system/dept/parent-tree', { excludeId }),
}
