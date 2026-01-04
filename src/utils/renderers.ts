import { h, type Component, type VNode } from 'vue'
import { NIcon, NTag, NButton } from 'naive-ui'
import type { TagProps, ButtonProps } from 'naive-ui'

/**
 * 渲染图标组件，用于Naive UI菜单等组件的图标渲染
 * @param icon - 要渲染的图标组件
 * @returns 返回渲染函数
 */
export function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

/**
 * 渲染标签组件
 * @param text - 标签文本
 * @param props - 标签属性
 * @returns 返回渲染函数
 */
export function renderTag(text: string, props?: TagProps) {
  return () => h(NTag, props, { default: () => text })
}

/**
 * 渲染按钮组件
 * @param text - 按钮文本
 * @param props - 按钮属性
 * @returns 返回渲染函数
 */
export function renderButton(text: string, props?: ButtonProps) {
  return () => h(NButton, props, { default: () => text })
}

/**
 * 根据值渲染状态标签
 * @param options - 状态选项配置
 * @param key - 从数据行中提取值的键名，默认为 'status'
 * @returns 返回表格列的渲染函数
 */
export function renderStatusTag<T = Record<string, unknown>>(
  options: Array<{
    label: string
    value: string | number
    type?: TagProps['type']
  }>,
  key: string = 'status',
) {
  return (row: T) => {
    const value = (row as Record<string, unknown>)[key] as string | number
    const option = options.find(opt => opt.value === value)
    return renderTag(option?.label || '未知', {
      type: option?.type || 'default'
    })()
  }
}

/**
 * 创建按钮VNode（用于表格操作列）
 * @param props - 按钮属性
 * @param icon - 图标组件（可选）
 * @returns 返回按钮VNode
 */
export function createButton(props: ButtonProps, icon?: Component) {
  const children = icon ? { default: () => h(NIcon, { size: 20 }, { default: () => h(icon) }) } : undefined
  return h(NButton, props, children)
}

/**
 * 创建操作按钮组的容器
 * @param buttons - 按钮VNode数组
 * @returns 返回容器VNode
 */
export function createButtonGroup(buttons: VNode[]) {
  return h('div', { style: { display: 'flex', gap: '8px' } }, buttons)
}
