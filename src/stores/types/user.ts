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

/**
 * 登录请求参数
 */
export interface LoginReq {
  username: string
  password: string
}

export interface LoginVO {
  token: string
}
