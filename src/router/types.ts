
/**
 * 后端返回的菜单数据结构
 */
export interface MenuVO {
  /** 菜单ID */
  menuId: string | number
  /** 父菜单ID */
  parentId?: string | number
  /** 菜单名称 */
  title: string
  /** 路由路径 */
  path: string
  /** 组件路径（相对于 views 目录） */
  component: string
  /** 图标 */
  icon?: string
  /** 排序 */
  order?: number
  /** 是否隐藏 */
  hidden?: boolean
  /** 是否缓存 */
  keepAlive?: boolean
  /** 是否固定在 Tab 上 */
  affix?: boolean
  /** 权限标识 */
  permissions?: string[]
  /** 子菜单 */
  children?: MenuVO[]
}

/**
 * 后端返回的菜单树响应
 */
export interface MenuTreeResponse {
  /** 菜单树数据 */
  menus: MenuVO[]

}
