// 用户登录DTO
export interface LoginDTO {
  username: string
  password: string
}


// 菜单树形结构VO
export interface MenuTreeVO {
  // 菜单ID
  menuId: string
  // 父菜单ID，0表示根菜单
  parentId: number
  // 菜单名称
  menuName: string
  // 路由路径
  routePath: string
  // 组件路径
  componentPath?: string
  // 菜单图标
  menuIcon?: string
  // 菜单类型：1目录 ，2菜单 ，3按钮
  menuType: number
  // 权限标识
  menuPerm?: string
  // 排序
  menuSort?: number
  // 是否隐藏：0显示，1隐藏
  hidden?: number
  // 重定向地址
  redirect?: string
  // 状态：0禁用，1启用
  status?: number
  // 创建时间
  createTime?: string
  // 更新时间
  updateTime?: string
  // 子菜单
  children?: MenuTreeVO[]
}

// 用户信息VO
export interface UserInfoVO {
  userId: string
  username: string
  nickname: string
  avatar: string
  // 用户权限列表
  permissions: string[]
  // 用户角色列表
  menus: MenuTreeVO[]
}
