import { h, type Component } from 'vue'
import { NIcon } from 'naive-ui'

/**
 * 图标渲染工具（用于 NaiveUI 下拉菜单等场景）
 * @param icon 图标组件
 * @returns 渲染函数
 * @example
 * ```ts
 * import { PersonCircleOutline } from '@vicons/ionicons5'
 * const options = [
 *   { label: '个人中心', key: 'profile', icon: renderIcon(PersonCircleOutline) }
 * ]
 * ```
 */
export function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
