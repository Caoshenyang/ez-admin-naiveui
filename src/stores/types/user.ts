/**
 * 用户 Store 类型定义
 */

/** CurrentUserVO，当前登录用户信息 */
export interface CurrentUserVO {
  userId?: string // 用户ID（雪花ID）
  username?: string // 用户名
  nickname?: string // 用户昵称
  avatar?: string // 用户头像
  email?: string // 邮箱
  gender?: number // 性别（0=保密 1=男 2=女）
  phoneNumber?: string // 手机号
  roleLabels?: string[] // 角色标识列表（如：[SUPER_ADMIN, ADMIN]）
  permissions?: string[] // 权限标识列表（用于前端按钮级权限控制）
  menus?: MenuTreeVO[] // 菜单树（用于前端动态路由和菜单渲染）
}

/** MenuTreeVO，菜单树形响应对象 */
export interface MenuTreeVO {
  menuId?: string // 菜单ID（雪花ID）
  menuLabel?: string // 菜单标识
  menuName?: string // 菜单名称
  menuPerm?: string // 权限标识
  menuIcon?: string // 菜单图标
  menuType?: number // 菜单类型【1 目录 2 菜单 3 按钮】
  menuSort?: number // 菜单排序
  parentId?: string // 父级菜单ID（雪花ID）
  routePath?: string // 路由地址
  routeName?: string // 路由名称
  componentPath?: string // 组件路径
  status?: number // 菜单状态【0 停用 1 正常】
  visible?: boolean // 是否可见
  createBy?: string // 创建者ID（雪花ID）
  createTime?: Date // 创建时间
  updateBy?: string // 更新者ID（雪花ID）
  updateTime?: Date // 更新时间
  description?: string // 描述信息
  children?: MenuTreeVO[] // 子节点列表
  nodeId?: string // 节点ID（雪花ID）
  root?: boolean // 是否根节点
  depth?: number // 深度
  sort?: number // 排序
}

/** 登录请求参数 */
export interface LoginReq {
  username: string
  password: string
}

/** 登录响应 */
export interface LoginVO {
  token: string
}
