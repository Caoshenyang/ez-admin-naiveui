import http from '../utils/request'

// 部门查询参数
export interface DepartmentQuery {
  page?: number
  size?: number
  departmentName?: string
  status?: string | number
  parentId?: number
}

// 部门项
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

// 分页结果
export interface PageResult<T> {
  records: T[]
  total: number
}

// 保存部门DTO
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

export const departmentApi = {
  // 分页查询部门列表
  page: (params: DepartmentQuery) =>
    http.get<PageResult<DepartmentItem>>('/system/department/page', { params }),

  // 获取所有部门树形结构
  tree: () =>
    http.get<DepartmentItem[]>('/system/department/tree'),

  // 新增部门
  create: (data: SaveDepartmentDTO) =>
    http.post<void>('/system/department', data),

  // 更新部门
  update: (data: SaveDepartmentDTO) =>
    http.put<void>('/system/department', data),

  // 删除部门
  remove: (id: number) =>
    http.delete<void>(`/system/department/${id}`),

  // 批量删除
  batchRemove: (ids: number[]) =>
    http.delete<void>('/system/department/batch', { data: ids }),

  // 获取详情
  detail: (id: number) =>
    http.get<DepartmentItem>(`/system/department/${id}`),
}