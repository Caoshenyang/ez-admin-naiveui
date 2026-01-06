import http from '../utils/request'
import type { DeptQuery, DeptListVO, DeptDetailVO, PageResult, DeptCreateDTO, DeptUpdateDTO } from '@/types'

export const deptApi = {
  // 分页查询部门列表
  page: (params: DeptQuery) => http.post<PageResult<DeptListVO>>('/system/dept/page', params),

  // 获取所有部门树形结构
  tree: () => http.get<DeptListVO[]>('/system/dept/tree'),

  // 新增部门
  create: (data: DeptCreateDTO) => http.post<void>('/system/dept', data),

  // 更新部门
  update: (data: DeptUpdateDTO) => http.put<void>('/system/dept', data),

  // 删除部门
  remove: (id: string | number) => http.delete<void>(`/system/dept/${id}`),

  // 批量删除
  batchRemove: (ids: (string | number)[]) => http.delete<void>('/system/dept/batch', { data: ids }),

  // 获取详情
  detail: (id: string | number) => http.get<DeptDetailVO>(`/system/dept/${id}`),
}
