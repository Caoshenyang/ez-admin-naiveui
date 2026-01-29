/**
 * 用户 Store 类型定义
 */

export interface UserInfo {
  id: number
  username: string
  nickname: string
  email?: string
  avatar?: string
  roles?: string[]
  permissions?: string[]
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken?: string
  userInfo: UserInfo
}
