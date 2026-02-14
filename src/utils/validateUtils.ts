/**
 * 邮箱验证
 * @param value - 待验证的邮箱地址
 * @returns 是否是有效的邮箱格式
 */
export const isEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/**
 * 手机号验证（中国大陆）
 * @param value - 待验证的手机号
 * @returns 是否是有效的手机号格式
 */
export const isPhone = (value: string): boolean => {
  return /^1[3-9]\d{9}$/.test(value)
}

/**
 * 身份证验证
 * @param value - 待验证的身份证号
 * @returns 是否是有效的身份证格式
 */
export const isIdCard = (value: string): boolean => {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
}

/**
 * URL 验证
 * @param value - 待验证的 URL
 * @returns 是否是有效的 URL 格式
 */
export const isUrl = (value: string): boolean => {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

/**
 * IP 地址验证（IPv4）
 * @param value - 待验证的 IP 地址
 * @returns 是否是有效的 IPv4 格式
 */
export const isIPv4 = (value: string): boolean => {
  return /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(value)
}

/**
 * 数字验证
 * @param value - 待验证的值
 * @returns 是否是数字
 */
export const isNumber = (value: unknown): boolean => {
  return typeof value === 'number' && !isNaN(value)
}

/**
 * 整数验证
 * @param value - 待验证的值
 * @returns 是否是整数
 */
export const isInteger = (value: unknown): boolean => {
  return Number.isInteger(value)
}

/**
 * 正整数验证
 * @param value - 待验证的值
 * @returns 是否是正整数
 */
export const isPositiveInteger = (value: unknown): boolean => {
  return Number.isInteger(value) && (value as number) > 0
}

/**
 * 字母验证
 * @param value - 待验证的字符串
 * @returns 是否只包含字母
 */
export const isAlpha = (value: string): boolean => {
  return /^[a-zA-Z]+$/.test(value)
}

/**
 * 字母数字验证
 * @param value - 待验证的字符串
 * @returns 是否只包含字母和数字
 */
export const isAlphanumeric = (value: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(value)
}

/**
 * 邮编验证（中国大陆）
 * @param value - 待验证的邮编
 * @returns 是否是有效的邮编格式
 */
export const isPostalCode = (value: string): boolean => {
  return /^[1-9]\d{5}$/.test(value)
}

/**
 * 强密码验证（至少包含大小写字母、数字，8-20位）
 * @param value - 待验证的密码
 * @returns 是否是强密码
 */
export const isStrongPassword = (value: string): boolean => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/.test(value)
}

/**
 * 数组验证
 * @param value - 待验证的值
 * @returns 是否是数组
 */
export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value)
}

/**
 * 对象验证
 * @param value - 待验证的值
 * @returns 是否是对象（非 null、非数组）
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 空值验证（null、undefined、空字符串、空数组、空对象）
 * @param value - 待验证的值
 * @returns 是否是空值
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * 十六进制颜色验证
 * @param value - 待验证的颜色值
 * @returns 是否是有效的十六进制颜色
 */
export const isHexColor = (value: string): boolean => {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)
}

/**
 * RGB 颜色验证
 * @param value - 待验证的颜色值
 * @returns 是否是有效的 RGB 颜色
 */
export const isRgbColor = (value: string): boolean => {
  return /^rgb\(\s*(\d{1,3}%?\s*,\s*){2}\d{1,3}%?\s*\)$/.test(value)
}

/**
 * 日期验证
 * @param value - 待验证的日期
 * @returns 是否是有效的日期
 */
export const isValidDate = (value: unknown): boolean => {
  if (value instanceof Date) return !isNaN(value.getTime())
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    return !isNaN(date.getTime())
  }
  return false
}

/**
 * QQ 号验证
 * @param value - 待验证的 QQ 号
 * @returns 是否是有效的 QQ 号
 */
export const isQQ = (value: string): boolean => {
  return /^[1-9]\d{4,10}$/.test(value)
}

/**
 * 微信号验证
 * @param value - 待验证的微信号
 * @returns 是否是有效的微信号
 */
export const isWechat = (value: string): boolean => {
  return /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/.test(value)
}

/**
 * 车牌号验证（中国大陆）
 * @param value - 待验证的车牌号
 * @returns 是否是有效的车牌号
 */
export const isLicensePlate = (value: string): boolean => {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]$/.test(
    value
  )
}
