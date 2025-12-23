// 用户登录DTO
export interface LoginDTO {
  username: string
  password: string
}

// 用户权限信息
export interface UserPermission {
  // 权限标识
  permissionKey: string
  // 权限名称
  permissionName: string
  // 权限类型
  permissionType: string
  // 路由路径
  path?: string
}

// 用户角色信息
export interface UserRole {
  // 角色标识
  roleKey: string
  // 角色名称
  roleName: string
  // 角色描述
  description?: string
}

// 用户信息VO
export interface UserInfoVO {
  id: number
  username: string
  nickname: string
  avatar: string
  // 用户权限列表
  permissions?: UserPermission[]
  // 用户角色列表
  roles?: UserRole[]
}
