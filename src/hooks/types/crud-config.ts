/**
 * 扁平化 CRUD 配置类型定义 - 严格泛型版本
 *
 * 设计理念：
 * - 配置扁平化，最多 3 层嵌套
 * - 约定优于配置，提供合理的默认值
 * - 保留扩展点，支持自定义
 * - 严格类型检查，不允许 any
 */

import type { RowData } from 'naive-ui/es/data-table/src/interface'
import type { FormRules } from 'naive-ui'

// ==================== 基础类型 ====================

/** 列表模式：普通分页列表 或 树形结构 */
export type ListMode = 'list' | 'tree'

/** 字段类型 */
export type FieldType =
  | 'input'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'date-range'
  | 'tree-select'

// ==================== 表格列配置 ====================

/** 列渲染类型 */
export type ColumnRenderType = 'status' | 'tag' | 'date' | 'datetime'

/** 表格列配置 */
export interface ColumnConfig<T = Record<string, unknown>> {
  /** 列标题 */
  title: string
  /** 列键名 */
  key: keyof T | string
  /** 列宽度 */
  width?: number
  /** 自定义渲染函数 */
  render?: ((row: T) => unknown) | ColumnRenderType
  /** 渲染函数需要的选项（用于 status、tag 等） */
  options?: Array<{ label: string; value: number | string; type?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default' }>
}

// ==================== 操作按钮配置 ====================

/** 内置操作类型 */
export type BuiltInAction = 'add' | 'edit' | 'delete' | 'refresh' | 'toggle-expand'

/** 操作按钮配置 */
export interface ActionConfig {
  /** 按钮标识（内置类型或自定义） */
  key: string
  /** 按钮类型 */
  type?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default'
  /** 按钮文字 */
  text?: string
  /** 按钮图标 */
  icon?: Record<string, unknown>
  /** 权限标识 */
  permission?: string
  /** 自定义处理函数（不使用内置处理） */
  handler?: () => void | Promise<void>
}

// ==================== 表单字段配置 ====================

/** 表单字段配置 */
export interface FormFieldConfig {
  /** 字段键名 */
  key: string
  /** 字段标签 */
  label: string
  /** 字段类型 */
  type?: FieldType
  /** 是否必填 */
  required?: boolean
  /** 占位符 */
  placeholder?: string
  /** 栅格占用列数 */
  span?: number
  /** 选项（用于 select、radio、checkbox） */
  options?: Array<{ label: string; value: number | string; type?: string }>
  /** 动态选项字段名（用于级联加载） */
  dynamicOptions?: string
  /** 字段级联加载函数 */
  load?: (mode: 'create' | 'update', formData?: Record<string, unknown>) => Promise<unknown[]>
  /** 验证函数 */
  validator?: (value: unknown) => boolean | string
  /** 数字输入框的 inputType 属性 */
  inputType?: string
}

/** 表单配置 */
export interface FormConfig {
  /** 表单标题 */
  title?: string
  /** 字段配置 */
  fields: FormFieldConfig[]
  /** 验证规则 */
  rules?: FormRules
  /** 栅格列数 */
  gridCols?: number
  /** 表单尺寸 */
  size?: 'small' | 'medium' | 'large'
}

// ==================== API 配置（严格泛型）====================

/** API 配置 */
export interface ApiConfig<
  TListVO,
  TQuery,
  TCreateDTO,
  TUpdateDTO,
  TDetailVO
> {
  /** 列表查询 API（分页或树形） */
  list: (params?: TQuery) => Promise<TListVO[]>

  /** 详情查询 API */
  detail?: (id: string | number) => Promise<TDetailVO>

  /** 新增 API */
  create?: (data: TCreateDTO) => Promise<void>

  /** 更新 API */
  update?: (data: TUpdateDTO) => Promise<void>

  /** 删除 API */
  delete?: (id: string | number) => Promise<void>

  /** 批量删除 API */
  batchDelete?: (ids: (string | number)[]) => Promise<void>
}

// ==================== 主配置（严格泛型）====================

/** CRUD 扁平化配置 */
export interface CrudFlatConfig<
  TListVO extends RowData,
  TQuery = unknown,
  TCreateDTO = unknown,
  TUpdateDTO = unknown,
  TDetailVO = unknown,
> {
  // ==================== 基础信息 ====================
  /** 页面标题 */
  title?: string

  /** 列表模式 */
  mode?: ListMode

  /** 主键字段名（默认 'id'） */
  idKey?: keyof TListVO | ((row: TListVO) => string | number)

  /** 显示名称字段（用于删除确认等，默认 'name'） */
  nameKey?: keyof TListVO | ((row: TListVO) => string)

  // ==================== API 配置 ====================
  /** API 配置 */
  api: ApiConfig<TListVO, TQuery, TCreateDTO, TUpdateDTO, TDetailVO>

  // ==================== 表格配置 ====================
  /** 表格列配置 */
  columns: Array<ColumnConfig<TListVO>>

  /** 是否显示选择列 */
  showSelection?: boolean

  /** 是否显示分页（树形模式下默认 false） */
  showPagination?: boolean

  /** 分页配置 */
  pagination?: {
    pageSizes?: number[]
    showSizePicker?: boolean
  }

  // ==================== 操作按钮配置 ====================
  /** 页面操作按钮 */
  actions?: Array<BuiltInAction | ActionConfig>

  /** 表格行操作按钮 */
  rowActions?: Array<'edit' | 'delete' | 'view' | ActionConfig>

  /** 操作列宽度 */
  actionWidth?: number

  // ==================== 表单配置 ====================
  /** 表单配置 */
  form?: FormConfig

  // ==================== 默认值配置 ====================
  /** 默认值配置 */
  defaults?: {
    /** 新增时的默认值 */
    create?: Partial<TCreateDTO> | (() => Partial<TCreateDTO>)
  }

  // ==================== 树形配置 ====================
  /** 树形配置（mode 为 'tree' 时使用） */
  tree?: {
    /** 子节点字段名（默认 'children'） */
    childrenKey?: string
    /** 是否默认展开所有（默认 false） */
    defaultExpandAll?: boolean
  }

  // ==================== 扩展配置 ====================
  /** 详情配置（用于查看详情功能） */
  detail?: {
    title?: string | ((data: TDetailVO) => string)
    fields: Array<{
      key: keyof TDetailVO | string
      label: string
      render?: (value: unknown, data: TDetailVO) => unknown
    }>
  }

  /** 提交前数据转换 */
  transformBeforeSubmit?: (
    data: Partial<TCreateDTO | TUpdateDTO>,
    mode: 'create' | 'update',
  ) => TCreateDTO | TUpdateDTO

  /** 详情到表单的数据转换 */
  transformDetailToForm?: (detail: TDetailVO) => Partial<TUpdateDTO>
}

// ==================== 配置定义函数（类型推断辅助）====================

/**
 * 定义 CRUD 配置
 * 用于类型推断，让 TypeScript 自动推断泛型参数
 */
export function defineCrudConfig<
  TListVO extends RowData,
  TQuery = Record<string, unknown>,
  TCreateDTO = Record<string, unknown>,
  TUpdateDTO = Record<string, unknown>,
  TDetailVO = Record<string, unknown>,
>(
  config: CrudFlatConfig<TListVO, TQuery, TCreateDTO, TUpdateDTO, TDetailVO>,
): CrudFlatConfig<TListVO, TQuery, TCreateDTO, TUpdateDTO, TDetailVO> {
  return config
}
