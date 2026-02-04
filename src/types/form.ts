/**
 * EzForm 表单组件类型定义
 * 基于 NaiveUI 的配置式表单封装
 */

import type { FormItemRule } from 'naive-ui'

/**
 * 支持的表单项类型
 */
export type FormItemType =
  | 'input'
  | 'input-password'
  | 'input-number'
  | 'select'
  | 'multi-select'
  | 'date-picker'
  | 'date-range-picker'
  | 'datetime-picker'
  | 'time-picker'
  | 'switch'
  | 'radio'
  | 'radio-group'
  | 'checkbox'
  | 'checkbox-group'
  | 'textarea'
  | 'upload'
  | 'slider'
  | 'rate'
  | 'icon-picker'
  | 'custom'

/**
 * 选项类型（用于 select、radio、checkbox 等）
 */
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
  [key: string]: unknown
}

/**
 * 表单项验证规则
 * 扩展 NaiveUI 的 FormItemRule
 */
export type EzFormItemRule = FormItemRule

/**
 * 表单项配置
 */
export interface FormItem {
  /** 字段名，对应表单数据的 key */
  field: string
  /** 标签文本 */
  label: string
  /** 表单项类型 */
  type: FormItemType
  /** 占位符 */
  placeholder?: string
  /** 默认值 */
  defaultValue?: unknown
  /** 选项配置（用于 select、radio、checkbox 等） */
  options?: SelectOption[] | (() => Promise<SelectOption[]>)
  /** 传递给 NaiveUI 组件的额外属性 */
  props?: Record<string, unknown>
  /** 验证规则 */
  rules?: EzFormItemRule[]
  /** 栅格占用的列数（24列系统） */
  span?: number
  /** 栅格偏移列数 */
  offset?: number
  /** 条件显示函数，返回 true 时显示该表单项 */
  show?: (values: Record<string, unknown>) => boolean
  /** 条件禁用函数，返回 true 时禁用该表单项 */
  disabled?: (values: Record<string, unknown>) => boolean
  /** 自定义类名 */
  className?: string
  /** 表单项布局配置 */
  itemProps?: {
    /** 标签宽度 */
    labelWidth?: number | string
    /** 标签对齐方式 */
    labelAlign?: 'left' | 'center' | 'right'
    /** 标签放置位置 */
    labelPlacement?: 'left' | 'top'
    /** 是否显示标签 */
    showLabel?: boolean
    /** 是否显示反馈图标 */
    showFeedback?: boolean
    /** 是否必填标记 */
    required?: boolean
  }
  /** 提示文本 */
  tip?: string
}

/**
 * 表单配置
 */
export interface FormOptions {
  /** 表单项配置数组 */
  items: FormItem[]
  /** 表单布局方式 */
  layout?: 'horizontal' | 'vertical' | 'inline'
  /** 标签宽度 */
  labelWidth?: number | string
  /** 标签对齐方式 */
  labelAlign?: 'left' | 'center' | 'right'
  /** 标签放置位置 */
  labelPlacement?: 'left' | 'top'
  /** 表单项尺寸 */
  size?: 'small' | 'medium' | 'large'
  /** 是否显示标签 */
  showLabel?: boolean
  /** 是否 Require 标记位置 */
  requireMarkPlacement?: 'left' | 'right' | 'right-hanging'
  /** 是否显示反馈图标 */
  showFeedback?: boolean
  /** 响应式列数 */
  columns?: 1 | 2 | 3 | 4 | 6
  /** 列间距 */
  gutter?: number
}

/**
 * 表单值类型
 */
export type FormValues = Record<string, unknown>

/**
 * 表单回调类型
 */
export type FormCallback = (values: FormValues) => void

/**
 * EzForm 组件 Props
 */
export interface EzFormProps {
  /** 表单配置 */
  options: FormOptions
  /** 表单数据（v-model） */
  modelValue?: FormValues
  /** 是否禁用整个表单 */
  disabled?: boolean
  /** 是否只读模式 */
  readonly?: boolean
  /** 加载状态 */
  loading?: boolean
  /** 提交按钮文本 */
  submitText?: string
  /** 重置按钮文本 */
  resetText?: string
  /** 是否显示操作按钮 */
  showActions?: boolean
  /** 按钮对齐方式 */
  actionAlign?: 'left' | 'center' | 'right'
}

/**
 * EzForm 组件 Emits
 */
export interface EzFormEmits {
  'update:modelValue': [values: FormValues]
  'submit': [values: FormValues]
  'reset': [values: FormValues]
  'validate': [values: FormValues]
}

/**
 * EzForm 实例暴露的方法
 */
export interface EzFormInstance {
  /** 验证表单 */
  validate: () => Promise<boolean>
  /** 恢复表单验证状态 */
  restoreValidation: () => void
  /** 重置表单 */
  reset: () => void
  /** 获取表单数据 */
  getValues: () => FormValues
  /** 设置表单数据 */
  setValues: (values: FormValues) => void
  /** 设置字段值 */
  setFieldValue: (field: string, value: unknown) => void
  /** 获取字段值 */
  getFieldValue: (field: string) => unknown
}

/**
 * 文件上传选项
 */
export interface UploadOptions {
  /** 上传地址 */
  action: string
  /** 请求头 */
  headers?: Record<string, string>
  /** 附带数据 */
  data?: Record<string, string | Blob>
  /** 文件字段名 */
  name?: string
  /** 文件大小限制（字节） */
  maxSize?: number
  /** 允许的文件类型 */
  accept?: string
  /** 最大上传数量 */
  maxCount?: number
}
