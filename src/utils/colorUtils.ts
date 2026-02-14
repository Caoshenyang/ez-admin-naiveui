/**
 * 颜色变量读取工具
 *
 * 命名规范（中缀式）：
 * - 亮色模式：--{name}-{scale}，如 --primary-500
 * - 暗色模式：--{name}-dark-{scale}，如 --primary-dark-500
 *
 * 使用方式：
 * - getColor('--primary-500') → 读取 --primary-500
 * - getDarkColor('primary-500') → 读取 --primary-dark-500
 */

/**
 * 读取 CSS 变量的实际值
 * @param variable 完整的 CSS 变量名，包含 -- 前缀
 * @param element 目标元素，默认为 document.documentElement
 * @returns CSS 变量的实际值（如 #5B6BF0）
 *
 * @example
 * getColor('--primary-500') // '#5B6BF0'
 * getColor('--radius-md') // '6px'
 */
export function getColor(variable: string, element: HTMLElement = document.documentElement): string {
  const value = getComputedStyle(element).getPropertyValue(variable).trim()
  return value
}

/**
 * 读取暗色模式 CSS 变量的实际值（中缀式命名）
 * @param variable CSS 变量名（可含或不含 -- 前缀），如 'primary-500' 或 '--primary-500'
 * @param element 目标元素，默认为 document.documentElement
 * @returns CSS 变量的实际值（如 #A78BFA）
 *
 * @example
 * // 无 -- 前缀
 * getDarkColor('primary-500') // '#A78BFA'（读取 --primary-dark-500）
 * // 有 -- 前缀
 * getDarkColor('--primary-500') // '#A78BFA'（读取 --primary-dark-500）
 */
export function getDarkColor(variable: string, element: HTMLElement = document.documentElement): string {
  // 移除 -- 前缀
  const cleanVar = variable.replace(/^--/, '')

  // 分离 base 和 scale
  // 'primary-500' → ['primary', '500']
  // 'text-tertiary' → ['text', 'tertiary']
  const parts = cleanVar.split('-')
  const base = parts[0] // 'primary' 或 'text'
  const scale = parts.slice(1).join('-') // '500' 或 'tertiary'

  // 构建中缀式暗色变量名：--{base}-dark-{scale}
  const darkVariable = `--${base}-dark-${scale}`

  const value = getComputedStyle(element).getPropertyValue(darkVariable).trim()
  return value
}
