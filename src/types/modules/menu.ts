// 菜单相关类型定义
import type { PageQuery } from './api'

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

// 菜单项（用于路由生成）
export interface MenuItem {
  id: number
  parentId: number
  name: string
  path: string
  component?: string
  icon?: string
  type: number // 1目录，2菜单，3按钮
  permission?: string
  sort?: number
  hidden?: number
  redirect?: string
  status?: number
  children?: MenuItem[]
}

// 菜单搜索条件
export interface MenuSearchCriteria {
  menuName?: string
  status?: number
  menuType?: number
  parentId?: number
}

// 菜单分页查询参数
export type MenuQuery = PageQuery<MenuSearchCriteria>

// 菜单保存/更新DTO
export interface SaveMenuDTO {
  id?: number
  parentId: number
  menuName: string
  path: string
  component?: string
  icon?: string
  menuType: number
  permission?: string
  sort?: number
  hidden?: number
  redirect?: string
  status?: number
}
