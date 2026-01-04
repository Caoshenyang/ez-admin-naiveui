// 用户相关类型定义
import type { PageQuery } from './api'
import type { MenuTreeVO } from './menu'

// 用户登录DTO
export interface LoginDTO {
  username: string
  password: string
}

// 用户信息VO
export interface UserInfoVO {
  userId: string
  username: string
  nickname: string
  avatar: string
  // 用户权限列表
  permissions: string[]
  // 用户菜单列表
  menus: MenuTreeVO[]
}

// 用户搜索条件
export interface UserSearchCriteria {
  username?: string
  nickname?: string
  deptId?: string
  status?: number
  gender?: number
  email?: string
  keywords?: string
}

// 用户分页查询参数
export type UserQuery = PageQuery<UserSearchCriteria>

// 用户列表VO（匹配API返回的数据结构）
export interface UserListVO {
  userId: string
  deptId: string
  deptName: string
  username: string
  nickname: string
  avatar: string
  email: string
  phoneNumber: string
  gender: number
  status: number
  createTime: string
}

// 用户创建DTO
export interface UserCreateDTO {
  username: string
  password: string
  nickname: string
  email?: string
  phoneNumber?: string
  gender?: number
  deptId?: string
  status?: number
}

// 用户更新DTO
export interface UserUpdateDTO extends UserCreateDTO {
  userId: string
}

// 用户详情VO
export interface UserDetailVO {
  userId: string
  username: string
  nickname: string
  email?: string
  phoneNumber?: string
  gender?: number
  deptId?: string
  deptName?: string
  avatar?: string
  status: number
  createTime: string
  updateTime?: string
}
