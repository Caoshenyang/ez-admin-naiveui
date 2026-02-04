/**
 * Iconify 图标系统类型定义
 */

/**
 * Iconify 图标名称格式
 * 例如: "ionicons5:home", "mdi:account", "ant-design:user"
 */
export type IconifyIconName = `${string}:${string}`

/**
 * EzIcon 组件 Props
 */
export interface EzIconProps {
  /** 图标名称（Iconify 格式：collection:name，如 ionicons5:home-outline） */
  icon: string
  /** 图标大小 */
  size?: number | string
  /** 图标颜色 */
  color?: string
  /** 是否翻转 */
  flip?: 'horizontal' | 'vertical' | 'both'
  /** 是否旋转 */
  rotate?: number
  /** 是否旋转动画（使用 Tailwind CSS animate-spin） */
  spin?: boolean
}

/**
 * EzIconPicker 组件 Props
 */
export interface EzIconPickerProps {
  /** 当前选中的图标名称 */
  modelValue?: string
  /** 弹窗宽度 */
  width?: string | number
  /** 弹窗高度 */
  height?: string | number
  /** 图标大小 */
  iconSize?: number
  /** 每页显示的图标数量 */
  pageSize?: number
  /** 是否允许清空 */
  clearable?: boolean
  /** 是否显示分类 */
  showCategory?: boolean
  /** 是否启用搜索 */
  searchable?: boolean
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
}

/**
 * EzIconPicker 组件 Emits
 */
export interface EzIconPickerEmits {
  /** 更新选中图标 */
  'update:modelValue': [value: string | undefined]
  /** 选中图标变化 */
  'change': [value: string]
}
