/**
 * 表格相关类型定义
 */

/** 表格列配置接口 */
export interface TableColumnConfig<T = Record<string, unknown>> {
  /** 列标题 */
  title: string
  /** 列键名 */
  key: string
  /** 列宽度 */
  width?: number
  /** 是否省略显示 */
  ellipsis?: boolean
  /** 列固定位置 */
  fixed?: 'left' | 'right'
  /** 单元格属性 */
  cellProps?: () => Record<string, unknown>
  /** 自定义渲染函数 */
  render?: (row: T) => unknown
}

import type { RowData } from 'naive-ui/es/data-table/src/interface'

/** 表格配置选项接口（用于配置生成最终的表格配置） */
export interface TableConfigOptions<T extends RowData = RowData> {
  /** 列配置 */
  columns: TableColumnConfig<T>[]
  /** 是否显示选择列 */
  showSelection?: boolean
  /** 是否显示操作列 */
  showActions?: boolean
  /** 自定义操作按钮配置 */
  actionButtons?: {
    edit?: boolean
    delete?: boolean
    view?: boolean
    custom?: Array<{
      type: 'primary' | 'success' | 'warning' | 'error' | 'info'
      tertiary?: boolean
      icon: Record<string, unknown>
      actionKey: string // 引用 customActionHandlers 中的函数名
    }>
  }
  /** 操作按钮显示顺序，默认 ['custom', 'view', 'edit', 'delete'] */
  actionOrder?: Array<'custom' | 'view' | 'edit' | 'delete'>
  /** 操作列宽度 */
  actionWidth?: number
  /** 是否固定操作列 */
  fixedActionColumn?: boolean
}

/** EzTable 组件配置接口（最终传递给 EzTable 组件的配置） */
export interface EzTableConfig<T extends RowData = RowData> {
  /** 表格列配置 */
  columns: import('naive-ui').DataTableColumns<T>
  /** 表格数据源 */
  data: T[]
  /** 是否显示加载状态 */
  loading?: boolean
  /** 分页配置 */
  pagination?: import('naive-ui').PaginationProps
  /** 行主键字段 */
  rowKey?: (row: T) => string | number
  /** 横向滚动宽度，默认：自动按列宽计算总宽度 */
  scrollX?: string | number
  /** 最大高度，默认值：'calc(100vh - 320px)' */
  maxHeight?: string | number
  /** 是否显示斑马纹，默认值：true */
  striped?: boolean
  /** 是否远程分页，默认值：true */
  remote?: boolean
  /** 是否单行显示，默认值：true */
  singleLine?: boolean
  /** 表格尺寸，默认值：'small' */
  size?: 'small' | 'medium' | 'large'
  /** 是否显示边框，默认值：true */
  bordered?: boolean
  /** 是否显示底部边框 */
  bottomBordered?: boolean
  /** 是否单列模式 */
  singleColumn?: boolean
  /** 是否启用树形结构，默认值：false */
  treeStructure?: boolean
  /** 子节点字段名，默认值：'children' */
  childrenKey?: string
  /** 是否默认展开所有行，默认值：false */
  defaultExpandAll?: boolean
}

/** 分页配置选项接口 */
export interface PaginationConfigOptions {
  /** 每页大小选项 */
  pageSizes?: number[]
  /** 是否显示大小选择器 */
  showSizePicker?: boolean
  /** 是否显示快速跳转 */
  showQuickJumper?: boolean
  /** 分页前缀函数 */
  prefix?: (info: { itemCount: number | undefined }) => string
}

/** 详情模态框字段配置接口 */
export interface DetailField {
  key: string
  label: string
  /** 自定义渲染函数 */
  render?: (value: unknown, data: Record<string, unknown>) => unknown
  /** 值格式化函数 */
  format?: (value: unknown) => string
}

/** 详情模态框配置接口 */
export interface DetailModalConfig {
  title?: string | ((data: Record<string, unknown>) => string)
  column?: number
  fields: DetailField[]
}
