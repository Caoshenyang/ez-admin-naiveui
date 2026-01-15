import { request } from '../request'
import type { LoginParams, LoginResult, UserInfo } from '@/types/api'

/**
 * 用户登录
 */
export function login(data: LoginParams) {
  return request.post<LoginResult>('/auth/login', data)
}

/**
 * 用户登出
 */
export function logout() {
  return request.post('/auth/logout')
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request.get<UserInfo>('/auth/user-info')
}

/**
 * 刷新令牌
 */
export function refreshToken(refreshToken: string) {
  return request.post<LoginResult>('/auth/refresh-token', { refreshToken })
}

/**
 * 获取用户菜单
 */
export function getUserMenus() {
  return request.get<any[]>('/auth/menus')
}
