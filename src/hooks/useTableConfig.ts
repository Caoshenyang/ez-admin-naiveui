// === 外部依赖 ===
import { h, reactive, computed, ref } from 'vue'
import { NButton, NIcon, type DataTableColumns } from 'naive-ui'
import { TrashOutline, CreateOutline } from '@vicons/ionicons5'

// === 类型定义 ===

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

// === 分页相关功能 ===

/**
 * 创建分页配置
 * @param reloadCallback 数据重新加载回调函数
 * @param options 分页配置选项
 * @returns 分页配置对象
 */
export function createPagination(
  reloadCallback?: () => void,
  options: PaginationConfigOptions = {}
) {
  const {
    pageSizes = [10, 15, 30],
    showSizePicker = true,
    showQuickJumper = true,
    prefix = (info: { itemCount: number | undefined }) => {
      return info.itemCount ? `共 ${info.itemCount} 条` : ''
    },
  } = options

  const paginationConfig = reactive({
    page: 1,
    pageSize: pageSizes[0],
    showSizePicker,
    showQuickJumper,
    pageSizes,
    itemCount: 0,
    prefix,
    onChange: (page: number) => {
      paginationConfig.page = page
      reloadCallback?.()
    },
    onUpdatePageSize: (pageSize: number) => {
      paginationConfig.pageSize = pageSize
      paginationConfig.page = 1
      reloadCallback?.()
    },
  })

  return paginationConfig
}

// === 表格工具函数 ===

/**
 * 计算表格总宽度
 * @param columns 表格列配置
 * @returns 表格总宽度
 */
export function calculateTableScrollWidth<T = Record<string, unknown>>(columns: DataTableColumns<T>): number {
  return columns.reduce((total, col) => {
    // 选择列默认宽度为 50px
    if (col.type === 'selection') {
      return total + 50
    }
    // 其他列使用设置的宽度
    return total + Number(col.width || 0)
  }, 0)
}

// === 表格列生成 ===

/**
 * 创建选择列
 * @returns 选择列配置
 */
function createSelectionColumn() {
  return {
    type: 'selection' as const,
  }
}

/**
 * 创建数据列
 * @param columnsConfig 列配置数组
 * @returns 数据列配置数组
 */
function createDataColumns<T>(columnsConfig: TableColumnConfig<T>[]): DataTableColumns<T> {
  return columnsConfig.map((col) => {
    const column: Record<string, unknown> = {
      title: col.title,
      key: col.key,
      width: col.width,
      ellipsis: col.ellipsis ?? false,
      fixed: col.fixed,
    }

    // 自定义渲染函数
    if (col.render) {
      column.render = col.render
    }

    // 单元格属性
    if (col.cellProps) {
      column.cellProps = col.cellProps
    }

    return column as unknown as DataTableColumns<T>[0]
  })
}

/**
 * 创建操作按钮
 * @param actionButtons 操作按钮配置
 * @param handleEdit 编辑处理函数
 * @param handleDelete 删除处理函数
 * @param row 当前行数据
 * @returns 操作按钮VNode数组
 */
function createActionButtons<T>(
  actionButtons: NonNullable<TableConfigOptions<T>['actionButtons']>,
  handleEdit?: (row: T) => void,
  handleDelete?: (row: T) => void,
  row?: T
) {
  const buttons = []

  // 编辑按钮
  if (actionButtons.edit && row) {
    buttons.push(
      h(
        NButton,
        {
          type: 'primary',
          tertiary: true,
          onClick: () => handleEdit?.(row),
        },
        {
          default: () => h(NIcon, { size: 20 }, { default: () => h(CreateOutline) }),
        }
      )
    )
  }

  // 删除按钮
  if (actionButtons.delete && row) {
    buttons.push(
      h(
        NButton,
        {
          type: 'error',
          tertiary: true,
          onClick: () => handleDelete?.(row),
        },
        {
          default: () => h(NIcon, { size: 20 }, { default: () => h(TrashOutline) }),
        }
      )
    )
  }

  // 自定义按钮
  if (actionButtons.custom && row) {
    actionButtons.custom.forEach((btn) => {
      buttons.push(
        h(
          NButton,
          {
            type: btn.type,
            tertiary: btn.tertiary ?? true,
            onClick: () => btn.onClick(row),
          },
          {
            default: () => h(NIcon, { size: 20 }, { default: () => h(btn.icon) }),
          }
        )
      )
    })
  }

  return buttons
}

/**
 * 创建操作列
 * @param actionButtons 操作按钮配置
 * @param actionWidth 操作列宽度
 * @param handleEdit 编辑处理函数
 * @param handleDelete 删除处理函数
 * @returns 操作列配置
 */
function createActionColumn<T>(
  actionButtons: NonNullable<TableConfigOptions<T>['actionButtons']>,
  actionWidth: number,
  handleEdit?: (row: T) => void,
  handleDelete?: (row: T) => void
) {
  return {
    title: '操作',
    key: 'action',
    width: actionWidth,
    fixed: 'right' as const,
    render(row: T) {
      const buttons = createActionButtons(actionButtons, handleEdit, handleDelete, row)
      return h('div', { style: { display: 'flex', gap: '8px' } }, buttons)
    },
  }
}

/**
 * 创建通用表格列配置
 * @param options 表格配置选项
 * @param handleEdit 编辑处理函数
 * @param handleDelete 删除处理函数
 * @returns 完整的表格列配置
 */
export function createTableColumns<T = Record<string, unknown>>(
  options: TableConfigOptions<T>,
  handleEdit?: (row: T) => void,
  handleDelete?: (row: T) => void
): DataTableColumns<T> {
  const {
    columns,
    showSelection = true,
    showActions = true,
    actionButtons = { edit: true, delete: true },
    actionWidth = 140,
  } = options

  const tableColumns: DataTableColumns<T> = []

  // 1. 添加选择列
  if (showSelection) {
    tableColumns.push(createSelectionColumn())
  }

  // 2. 添加数据列
  tableColumns.push(...createDataColumns(columns))

  // 3. 添加操作列
  if (showActions) {
    tableColumns.push(createActionColumn(actionButtons, actionWidth, handleEdit, handleDelete))
  }

  return tableColumns
}

// === 主 Composable 函数 ===

/**
 * 通用的表格配置 Composable
 * @param configOptions 表格配置选项
 * @param paginationOptions 分页配置选项
 * @returns 表格配置和处理器对象
 *
 * @example
 * ```typescript
 * const { loading, dataList, columns, handlers } = useTableConfig(tableConfig)
 *
 * // 设置业务逻辑
 * handlers.loadData = loadUserList
 * handlers.handleEdit = handleEdit
 * handlers.handleDelete = handleDelete
 * ```
 */
export function useTableConfig<T = Record<string, unknown>>(
  configOptions: TableConfigOptions<T>,
  paginationOptions: PaginationConfigOptions = {}
) {
  // === 响应式状态 ===
  const loading = ref(false)
  const dataList = ref<T[]>([])
  const checkedRowKeys = ref<Array<string | number>>([])

  // === 函数存储 ===
  let loadDataFn: () => Promise<void> | void = () => {
    throw new Error('loadData function must be implemented. Please assign handlers.loadData = yourFunction')
  }

  let handleEditFn: (row: T) => void = () => {
    throw new Error('handleEdit function must be implemented. Please assign handlers.handleEdit = yourFunction')
  }

  let handleDeleteFn: (row: T) => void = () => {
    throw new Error('handleDelete function must be implemented. Please assign handlers.handleDelete = yourFunction')
  }

  // === 分页配置 ===
  const pagination = createPagination(undefined, paginationOptions)

  // === 计算属性 ===
  const columns = computed(() =>
    createTableColumns(configOptions, handleEditFn, handleDeleteFn)
  )

  const tableScrollWidth = computed(() => calculateTableScrollWidth(columns.value))

  // === 事件处理函数 ===
  const handleCheck = (keys: Array<string | number>) => {
    checkedRowKeys.value = keys
  }

  // === 处理器对象 ===
  const handlers = {
    /**
     * 加载数据函数
     * 设置后会自动更新分页的回调函数
     */
    set loadData(fn: () => Promise<void> | void) {
      loadDataFn = fn
      // 更新分页回调
      pagination.onChange = (page: number) => {
        pagination.page = page
        loadDataFn()
      }
      pagination.onUpdatePageSize = (pageSize: number) => {
        pagination.pageSize = pageSize
        pagination.page = 1
        loadDataFn()
      }
    },

    /** 编辑处理函数 */
    set handleEdit(fn: (row: T) => void) {
      handleEditFn = fn
    },

    /** 删除处理函数 */
    set handleDelete(fn: (row: T) => void) {
      handleDeleteFn = fn
    },
  }

  // === 返回值 ===
  return {
    // --- 响应式数据 ---
    loading,
    dataList,
    pagination,
    columns,
    tableScrollWidth,
    checkedRowKeys,

    // --- 事件处理 ---
    handleCheck,

    // --- 业务逻辑处理器 ---
    handlers,
  }
}
