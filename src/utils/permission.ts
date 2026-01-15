/**
 * 检查是否有权限
 */
export function hasPermission(value: string[] | string, userPermissions?: string[]): boolean {
  if (!value || value.length === 0) return true
  if (!userPermissions || userPermissions.length === 0) return false

  const permissions = Array.isArray(value) ? value : [value]
  return userPermissions.some(permission => permissions.includes(permission))
}

/**
 * 检查是否有角色
 */
export function hasRole(value: string[] | string, userRoles?: string[]): boolean {
  if (!value || value.length === 0) return true
  if (!userRoles || userRoles.length === 0) return false

  const roles = Array.isArray(value) ? value : [value]
  return userRoles.some(role => roles.includes(role))
}

/**
 * 检查是否为管理员
 */
export function isAdmin(userRoles?: string[]): boolean {
  if (!userRoles || userRoles.length === 0) return false
  return userRoles.includes('admin') || userRoles.includes('super_admin')
}
