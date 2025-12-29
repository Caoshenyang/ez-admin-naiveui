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

/** 表格配置选项接口 */
export interface TableConfigOptions<T = Record<string, unknown>> {
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
    custom?: Array<{
      type: 'primary' | 'success' | 'warning' | 'error' | 'info'
      tertiary?: boolean
      icon: Record<string, unknown>
      onClick: (row: T) => void
    }>
  }
  /** 操作列宽度 */
  actionWidth?: number
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

