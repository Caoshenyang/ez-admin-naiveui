/**
 * EzModal 弹窗组件类型定义
 * 基于 NaiveUI Modal 的极简封装
 */

/**
 * 弹窗尺寸
 */
export type ModalSize = 'small' | 'medium' | 'large' | 'huge'

/**
 * 弹窗 props 配置
 */
export interface ModalConfig {
  /** 弹窗标题 */
  title?: string
  /** 弹窗内容（支持 VNode 和字符串） */
  content?: (() => VNode | VNode[]) | string
  /** 是否显示弹窗 */
  show?: boolean
  /** 弹窗宽度（CSS 宽度值） */
  width?: string | number
  /** 弹窗尺寸预设 */
  size?: ModalSize
  /** 是否显示遮罩 */
  maskClosable?: boolean
  /** 是否显示关闭图标 */
  closable?: boolean
  /** 确认按钮文本 */
  positiveText?: string
  /** 取消按钮文本 */
  negativeText?: string
  /** 是否显示loading状态 */
  loading?: boolean
  /** 确认回调 */
  onPositiveClick?: () => boolean | Promise<boolean>
  /** 取消回调 */
  onNegativeClick?: () => boolean | Promise<boolean>
  /** 关闭回调 */
  onClose?: () => boolean | Promise<boolean>
  /** 是否显示底部操作按钮 */
  showAction?: boolean
  /** 是否禁用确认按钮 */
  positiveDisabled?: boolean
  /** 是否禁用取消按钮 */
  negativeDisabled?: boolean
}

/**
 * EzModal 组件 Props
 */
export interface EzModalProps {
  /** 弹窗配置 */
  config?: ModalConfig
  /** 弹窗标题 */
  title?: string
  /** 是否显示弹窗（v-model） */
  show?: boolean
  /** 弹窗宽度 */
  width?: string | number
  /** 弹窗尺寸预设 */
  size?: ModalSize
  /** 是否显示遮罩 */
  maskClosable?: boolean
  /** 是否显示关闭图标 */
  closable?: boolean
  /** 确认按钮文本 */
  positiveText?: string
  /** 取消按钮文本 */
  negativeText?: string
  /** 是否显示底部操作按钮 */
  showAction?: boolean
  /** 确认按钮类型 */
  positiveType?: 'default' | 'tertiary' | 'success' | 'warning' | 'error'
  /** 取消按钮类型 */
  negativeType?: 'default' | 'tertiary' | 'success' | 'warning' | 'error'
  /** 弹窗容器类名 */
  class?: string
  /** 弹窗容器样式 */
  style?: Record<string, string>
}

/**
 * EzModal 组件 Emits
 */
export interface EzModalEmits {
  'update:show': [value: boolean]
  'positiveClick': []
  'negativeClick': []
  'close': []
}
