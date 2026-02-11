/**
 * CSS 变量读取工具
 *
 * 从 Tailwind CSS 定义的 CSS 变量中提取实际颜色值
 * 确保 NaiveUI themeOverrides 使用实际颜色而非 CSS 变量引用
 * 解决 seemly/rgba 无法解析 var() 的问题
 */

/**
 * 读取 CSS 变量的值
 * @param variable CSS 变量名，如 '--color-primary-500'
 * @param element 目标元素，默认为 document.documentElement
 * @returns CSS 变量的实际值
 *
 * @example
 * getColor('--color-primary-500') // '#5B6BF0'
 */
export function getColor(variable: string, element: HTMLElement = document.documentElement): string {
  const value = getComputedStyle(element).getPropertyValue(variable).trim()
  return value
}
