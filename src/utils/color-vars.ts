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

/**
 * 批量读取 CSS 变量
 * @param variables CSS 变量名数组
 * @param element 目标元素
 * @returns 变量名到值的映射
 *
 * @example
 * getColors(['--color-primary-500', '--color-success-500'])
 * // { '--color-primary-500': '#5B6BF0', '--color-success-500': '#10B981' }
 */
export function getColors(variables: string[], element: HTMLElement = document.documentElement): Record<string, string> {
	const result: Record<string, string> = {}
	for (const variable of variables) {
		result[variable] = getColor(variable, element)
	}
	return result
}

/**
 * 创建颜色映射对象（用于 NaiveUI themeOverrides）
 * 自动从 CSS 变量读取颜色值
 *
 * @example
 * const primaryColors = createColorMap({
 *   primaryColor: '--color-primary-500',
 *   primaryColorHover: '--color-primary-600',
 *   primaryColorPressed: '--color-primary-700',
 * })
 * // { primaryColor: '#5B6BF0', primaryColorHover: '#4A57D9', ... }
 */
export function createColorMap(
	mapping: Record<string, string>,
	element: HTMLElement = document.documentElement
): Record<string, string> {
	const result: Record<string, string> = {}
	for (const [key, variable] of Object.entries(mapping)) {
		result[key] = getColor(variable, element)
	}
	return result
}

/**
 * 主色调颜色映射（亮色模式）
 * 从 Tailwind CSS @theme 读取
 */
export function getPrimaryColors(element: HTMLElement = document.documentElement) {
	return createColorMap(
		{
			primaryColor: '--color-primary-500',
			primaryColorHover: '--color-primary-600',
			primaryColorPressed: '--color-primary-700',
			primaryColorSuppl: '--color-primary-500'
		},
		element
	)
}

/**
 * 语义色颜色映射（亮色模式）
 */
export function getSemanticColors(element: HTMLElement = document.documentElement) {
	return createColorMap(
		{
			successColor: '--color-success-500',
			successColorHover: '--color-success-400',
			successColorPressed: '--color-success-600',
			successColorSuppl: '--color-success-500',
			warningColor: '--color-warning-500',
			warningColorHover: '--color-warning-400',
			warningColorPressed: '--color-warning-600',
			warningColorSuppl: '--color-warning-500',
			errorColor: '--color-error-500',
			errorColorHover: '--color-error-400',
			errorColorPressed: '--color-error-600',
			errorColorSuppl: '--color-error-500',
			infoColor: '--color-info-500',
			infoColorHover: '--color-info-400',
			infoColorPressed: '--color-info-600',
			infoColorSuppl: '--color-info-500'
		},
		element
	)
}

/**
 * 中性色颜色映射（slate 色系）
 */
export function getSlateColors(element: HTMLElement = document.documentElement) {
	return createColorMap(
		{
			textColorBase: '--color-slate-500',
			textColor1: '--color-slate-900',
			textColor2: '--color-slate-600',
			textColor3: '--color-slate-400',
			borderColor: '--color-slate-200',
			dividerColor: '--color-slate-100',
			bodyColor: '--color-slate-50'
		},
		element
	)
}

/**
 * 透明度颜色映射
 * 用于需要 rgba 值的场景
 */
export function getAlphaColors(element: HTMLElement = document.documentElement) {
	return createColorMap(
		{
			boxShadowFocus: '--color-primary-500/08',
			buttonBoxShadow: '--color-primary-500/08',
			buttonBoxShadowActive: '--color-primary-500/15',
			buttonBoxShadowHover: '--color-primary-500/10'
		},
		element
	)
}
