/**
 * 用户相关 API
 */
import { request } from '@/utils/request'
import type { UserInfo } from '@/stores/types/user'
import type { PageData, PageParams } from '@/types/api'

export const userApi = {
  /**
   * 获取当前用户信息
   */
  getInfo: () => request.get<UserInfo>('/user/info'),

  /**
   * 获取用户列表（分页）
   */
  getList: (params: PageParams) => request.get<PageData<UserInfo>>('/user/list', { params }),

  /**
   * 创建用户
   */
  create: (data: Partial<UserInfo>) =>
    request.post<UserInfo>('/user/create', data, {
      showSuccess: true,
      successMsg: '创建成功'
    }),

  /**
   * 更新用户
   */
  update: (id: string, data: Partial<UserInfo>) =>
    request.put<UserInfo>(`/user/update/${id}`, data, {
      showSuccess: true,
      successMsg: '更新成功'
    }),

  /**
   * 删除用户
   */
  delete: (id: string) =>
    request.delete(`/user/delete/${id}`, undefined, {
      showSuccess: true,
      successMsg: '删除成功'
    }),

  /**
   * 批量删除用户
   */
  batchDelete: (ids: string[]) =>
    request.delete<string[]>('/user/batch-delete', ids, {
      showSuccess: true,
      successMsg: `成功删除 ${ids.length} 个用户`
    }),

  /**
   * 修改密码
   */
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    request.post('/user/change-password', data, {
      showSuccess: true,
      successMsg: '密码修改成功，请重新登录'
    }),

  /**
   * 上传头像
   */
  uploadAvatar: (formData: FormData) =>
    request.upload<{ url: string }>('/user/upload-avatar', formData, {
      showSuccess: true,
      successMsg: '头像上传成功'
    })
}
