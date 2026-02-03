/**
 * 认证相关 API
 */
import { request } from '@/utils/request'
import type { LoginReq, LoginVO, CurrentUserVO } from '@/stores/types/user'

export const authApi = {
  /**
   * 用户登录
   */
  login: (params: LoginReq) =>
    request.post<LoginVO>('/auth/login', params, {
      showSuccess: true,
      successMsg: '登录成功'
    }),

  /**
   * 用户登出
   */
  logout: () =>
    request.post('/auth/logout', {
      showSuccess: true,
      successMsg: '退出成功'
    }),

  /**
   * 获取用户信息
   */
  getUserInfo: () => request.get<CurrentUserVO>('/auth/user-info')
}
