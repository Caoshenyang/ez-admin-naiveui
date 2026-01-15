/**
 * 验证邮箱
 */
export function validateEmail(email: string): boolean {
  const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  return reg.test(email)
}

/**
 * 验证手机号（中国大陆）
 */
export function validatePhone(phone: string): boolean {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证用户名（字母开头，允许字母数字下划线，4-16位）
 */
export function validateUsername(username: string): boolean {
  const reg = /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/
  return reg.test(username)
}

/**
 * 验证密码（至少包含字母和数字，8-20位）
 */
export function validatePassword(password: string): boolean {
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/
  return reg.test(password)
}

/**
 * 验证身份证号
 */
export function validateIdCard(idCard: string): boolean {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(idCard)
}

/**
 * 验证URL
 */
export function validateUrl(url: string): boolean {
  const reg = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
  return reg.test(url)
}

/**
 * 验证IP地址
 */
export function validateIp(ip: string): boolean {
  const reg =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  return reg.test(ip)
}

/**
 * 验证数字（整数或小数）
 */
export function validateNumber(value: string): boolean {
  const reg = /^-?\d+(\.\d+)?$/
  return reg.test(value)
}

/**
 * 验证正整数
 */
export function validatePositiveInteger(value: string): boolean {
  const reg = /^[1-9]\d*$/
  return reg.test(value)
}

/**
 * 验证是否为空
 */
export function validateEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string' && value.trim() === '') return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === 'object' && Object.keys(value).length === 0) return true
  return false
}
