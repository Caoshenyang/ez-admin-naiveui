import { h, type Component } from 'vue'
import { NIcon } from 'naive-ui'

/**
 * 渲染图标组件，用于Naive UI菜单等组件的图标渲染
 * @param icon - 要渲染的图标组件
 * @returns 返回渲染函数
 */
export function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
