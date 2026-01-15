import { h } from 'vue'
import { NIcon } from 'naive-ui'
import EzIconRender from '@/components/EzIconRender.vue'

/**
 * 渲染图标函数（用于 NaiveUI 组件的 icon 插槽）
 * @param icon - 图标标识符（字符串）或图标配置对象
 * @param size - 图标大小，默认 18
 * @returns 渲染函数
 */
export function renderIcon(icon: string, size = 18) {
  return () => h(NIcon, { size: size + 'px' }, { default: () => h(EzIconRender, { icon, size }) })
}

/**
 * 渲染菜单图标函数（支持响应式折叠状态）
 * @param icon - 图标标识符
 * @param isCollapse - 是否折叠
 * @param expandSize - 展开时的图标大小，默认 20
 * @param collapseSize - 折叠时的图标大小，默认 24
 * @returns 渲染函数
 */
export function renderMenuIcon(
  icon: string,
  isCollapse: boolean,
  expandSize = 20,
  collapseSize = 24
) {
  return () =>
    h(NIcon, { size: (isCollapse ? collapseSize : expandSize) + 'px' }, {
      default: () => h(EzIconRender, { icon, size: isCollapse ? collapseSize : expandSize }),
    })
}
