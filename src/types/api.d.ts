/**
 * API 响应基础结构
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp?: string
}

/**
 * 分页请求参数
 */
export interface PageParams {
  page: number
  pageSize: number
}

/**
 * 分页响应数据
 */
export interface PageResponse<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// ========== 登录相关 ==========

/**
 * 登录请求参数
 */
export interface LoginParams {
  username: string
  password: string
  captcha?: string
}

/**
 * 登录响应数据
 * 注意：后端使用 Cookie 认证，token 通过 Set-Cookie 返回
 */
export interface LoginResult {
  // data 字段为 null，token 通过 Cookie 返回
}

/**
 * 用户信息
 */
export interface UserInfo {
  userId: string | number
  username: string
  nickname: string
  avatar?: string
  permissions: string[]
  menus?: BackendMenuItem[]
}

// ========== 用户相关 ==========

/**
 * 用户新建 DTO
 */
export interface UserCreateDTO {
  deptId?: number
  username: string
  password: string
  nickname?: string
  email?: string
  phoneNumber?: string
  gender?: number // 0 保密 1 男 2 女
  avatar?: string
}

/**
 * 用户更新 DTO
 */
export interface UserUpdateDTO {
  userId: number
  deptId?: number
  nickname?: string
  email?: string
  phoneNumber?: string
  gender?: number
  avatar?: string
}

/**
 * 用户列表 VO
 */
export interface UserListVO {
  userId: number
  deptId?: number
  deptName?: string
  username: string
  nickname?: string
  avatar?: string
  email?: string
  phoneNumber?: string
  gender?: number
  status?: number // 0 禁用 1 正常
  createTime?: string
}

/**
 * 用户详情 VO
 */
export interface UserDetailVO {
  userId: number
  deptId?: number
  deptName?: string
  username: string
  nickname?: string
  avatar?: string
  email?: string
  phoneNumber?: string
  gender?: number
  status?: number
  createTime?: string
  roleIds?: number[]
}

// ========== 角色相关 ==========

/**
 * 角色创建 DTO
 */
export interface RoleCreateDTO {
  roleName: string
  roleLabel: string
  roleSort?: number
  dataScope?: number // 1 仅本人 2 本部门 3 本部门及以下 4 自定义 5 全部
  status?: number // 0 停用 1 正常
  description?: string
  menuIds?: number[]
  deptIds?: number[]
}

/**
 * 角色更新 DTO
 */
export interface RoleUpdateDTO {
  roleId: number
  roleName: string
  roleLabel: string
  roleSort?: number
  dataScope?: number
  status?: number
  description?: string
  menuIds?: number[]
  deptIds?: number[]
}

/**
 * 角色详情 VO
 */
export interface RoleDetailVO {
  roleId: number
  roleName: string
  roleLabel: string
  roleSort?: number
  dataScope?: number
  status?: number
  description?: string
  menuIds?: number[]
  deptIds?: number[]
  createTime?: string
}

/**
 * 角色信息
 */
export interface Role {
  roleId: number
  roleName: string
  roleLabel: string
  roleSort?: number
  dataScope?: number
  status?: number
  description?: string
  createTime?: string
  updateTime?: string
}

// ========== 菜单相关 ==========

/**
 * 菜单创建 DTO
 */
export interface MenuCreateDTO {
  menuName: string
  menuIcon?: string
  menuLabel?: string
  parentId?: number
  menuSort?: number
  menuType: number // 1 目录 2 菜单 3 按钮
  menuPerm?: string
  routePath?: string
  routeName?: string
  componentPath?: string
  status?: number // 0 停用 1 正常
  description?: string
}

/**
 * 菜单更新 DTO
 */
export interface MenuUpdateDTO {
  menuId: number
  menuName: string
  menuIcon?: string
  menuLabel?: string
  parentId?: number
  menuSort?: number
  menuType: number
  menuPerm?: string
  routePath?: string
  routeName?: string
  componentPath?: string
  status?: number
  description?: string
}

/**
 * 菜单查询条件
 */
export interface MenuQuery {
  menuName?: string
  menuType?: number
  status?: number
}

/**
 * 菜单父节点树 DTO
 */
export interface MenuParentTreeDTO {
  menuId?: number
}

/**
 * 菜单树 VO
 */
export interface MenuTreeVO {
  menuId: number
  menuName: string
  menuIcon?: string
  menuPerm?: string
  menuType: number
  parentId?: number
  routePath?: string
  componentPath?: string
  redirect?: string
  hidden?: boolean
  menuSort?: number
  status?: number
  createTime?: string
  updateTime?: string
  children?: MenuTreeVO[]
}

/**
 * 菜单信息
 */
export interface Menu {
  menuId: number
  menuName: string
  menuIcon?: string
  menuLabel?: string
  parentId?: number
  menuSort?: number
  menuType: number
  menuPerm?: string
  routePath?: string
  routeName?: string
  componentPath?: string
  status?: number
  description?: string
  createTime?: string
  updateTime?: string
}

/**
 * 前端菜单项
 */
export interface MenuItem {
  id: string | number
  parentId?: string | number
  name: string
  path: string
  component?: string
  redirect?: string
  meta: MenuMeta
  children?: MenuItem[]
  sort?: number
}

/**
 * 菜单元数据
 */
export interface MenuMeta {
  title: string
  icon?: string
  hidden?: boolean
  roles?: string[]
  permissions?: string[]
  keepAlive?: boolean
  affix?: boolean
  noCache?: boolean
}

// ========== 部门相关 ==========

/**
 * 部门创建 DTO
 */
export interface DeptCreateDTO {
  deptName: string
  deptSort?: number
  parentId?: number
  status?: number // 0 停用 1 正常
  description?: string
}

/**
 * 部门更新 DTO
 */
export interface DeptUpdateDTO {
  deptId: number
  deptName: string
  deptSort?: number
  parentId?: number
  status?: number
  description?: string
}

/**
 * 部门查询条件
 */
export interface DeptQuery {
  deptName?: string
  status?: number
}

/**
 * 部门父节点树 DTO
 */
export interface DeptParentTreeDTO {
  deptId?: number
}

/**
 * 部门树 VO
 */
export interface DeptTreeVO {
  deptId: number
  deptName: string
  parentId?: number
  deptSort?: number
  status?: number
  description?: string
  createTime?: string
  updateTime?: string
  children?: DeptTreeVO[]
}

/**
 * 部门信息
 */
export interface Dept {
  deptId: number
  deptName: string
  parentId?: number
  deptSort?: number
  status?: number
  description?: string
  createTime?: string
  updateTime?: string
}

// ========== 字典相关 ==========

/**
 * 字典类型创建 DTO
 */
export interface DictTypeCreateDTO {
  name: string
  code: string
  description?: string
  sort?: number
  status?: number
}

/**
 * 字典类型更新 DTO
 */
export interface DictTypeUpdateDTO {
  dictId: number
  name: string
  code: string
  description?: string
  sort?: number
  status?: number
}

/**
 * 字典类型查询条件
 */
export interface DictTypeQuery {
  name?: string
  code?: string
  status?: number
}

/**
 * 字典数据创建 DTO
 */
export interface DictDataCreateDTO {
  dictType: string
  label: string
  value: string
  sort?: number
  status?: number
  color?: string
}

/**
 * 字典数据更新 DTO
 */
export interface DictDataUpdateDTO {
  dictDataId: number
  dictType: string
  label: string
  value: string
  sort?: number
  status?: number
  color?: string
}

/**
 * 字典数据查询条件
 */
export interface DictDataQuery {
  dictType?: string
  label?: string
  status?: number
}

/**
 * 字典类型
 */
export interface DictType {
  dictId: number
  name: string
  code: string
  description?: string
  sort?: number
  status?: number
  createTime?: string
  updateTime?: string
}

/**
 * 字典数据
 */
export interface DictData {
  dictDataId: number
  dictType: string
  label: string
  value: string
  sort?: number
  status?: number
  color?: string
  createTime?: string
  updateTime?: string
}

// ========== 后端菜单项 ==========

/**
 * 后端菜单项（从用户信息接口返回）
 */
export interface BackendMenuItem {
  menuId: string | number
  menuName: string
  menuIcon?: string
  menuPerm?: string
  menuType: number // 1: 目录 2: 菜单 3: 按钮
  parentId?: string | number
  routePath?: string
  componentPath?: string
  redirect?: string
  hidden?: boolean
  menuSort?: number
  status?: number
  createTime?: string
  updateTime?: string
  children?: BackendMenuItem[]
}

// ========== 操作日志 ==========

/**
 * 操作日志
 */
export interface OperLog {
  id: string | number
  module: string
  operation: string
  method: string
  params?: string
  ip: string
  location?: string
  browser?: string
  os?: string
  status: number
  errorMsg?: string
  createTime: string
}

