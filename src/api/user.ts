import http from '../utils/request'
import type { PageResult, UserListVO, UserQuery, UserCreateDTO, UserUpdateDTO, UserDetailVO } from '../types'

export const userApi = {
  // 分页查询用户列表
  page: (params: UserQuery) => http.post<PageResult<UserListVO>>('/system/user/page', params),

  // 新增用户
  create: (data: UserCreateDTO) => http.post<void>('/system/user/create', data),

  // 更新用户
  update: (data: UserUpdateDTO) => http.post<void>('/system/user/update', data),

  // 删除单个用户
  remove: (id: string) => http.delete<void>(`/system/user/delete/${id}`),

  // 批量删除
  batchRemove: (ids: string[]) => http.delete<void>('/system/user/batch-delete', ids),

  // 获取详情
  detail: (id: string) => http.get<UserDetailVO>(`/system/user/getUserById/${id}`),

  // 更新用户状态
  updateStatus: (id: string, status: number) =>
    http.put<void>(`/system/user/${id}/status`, { status }),
}
