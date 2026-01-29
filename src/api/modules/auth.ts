/**
 * 认证相关 API
 */
import { request } from '@/utils/request'
import type { LoginParams, LoginResponse } from '@/stores/types/user'

export const authApi = {
  /**
   * 用户登录
   */
  login: (params: LoginParams) =>
    request.post<LoginResponse>('/auth/login', params, {
      showSuccess: true,
      successMsg: '登录成功'
    }),

  /**
   * 用户登出
   */
  logout: () =>
    request.post('/auth/logout', undefined, {
      showSuccess: true,
      successMsg: '退出成功'
    })
}
