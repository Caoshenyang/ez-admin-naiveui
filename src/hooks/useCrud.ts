/**
 * useCrud - 通用 CRUD 管理 Hook
 *
 * 这是一个高度集成的 CRUD（增删改查）管理工具，通过配置即可自动处理：
 * - 数据列表的加载和展示（支持普通分页和树形结构两种模式）
 * - 表格的自动生成（包括选择列、数据列、操作列）
 * - 表单的新增和编辑功能
 * - 数据的删除和批量删除（带确认提示）
 * - 详情查看功能
 * - 分页控制
 *
 * 设计理念：约定大于配置，通过配置驱动，减少重复代码
 *
 * 使用示例：
 * ```ts
 * // 1. 定义配置
 * const config = {
 *   tableConfig: { ... },
 *   pageApi: async (params) => { ... },
 *   createApi: async (data) => { ... },
 *   // ... 其他配置
 * }
 *
 * // 2. 使用 Hook
 * const crud = useCrud(config)
 *
 * // 3. 解构需要的数据和方法
 * const { dataList, loading, handleAdd, handleSubmit } = crud
 * ```
 */

import { ref, reactive, computed } from 'vue'
import type { PageQuery, PageResult } from '@/types/modules/api'
import type { DataTableColumns } from 'naive-ui'
import { TrashOutline, CreateOutline, EyeOutline } from '@vicons/ionicons5'
import { message, dialog, logger } from '@/hooks/useMessage'
import { createButton, createButtonGroup } from '@/utils/renderers'
import type { TableConfigOptions, PaginationConfigOptions, TableColumnConfig, DetailModalConfig } from './types/table'
import type { RowData } from 'naive-ui/es/data-table/src/interface'
import type { VNode } from 'vue'

// ==================== 工具函数 ====================

/**
 * 创建默认的查询参数
 * 用于分页查询场景，自动设置初始页码和每页大小
 *
 * @param searchDefaults - 搜索条件的默认值
 * @returns 包含分页信息和搜索条件的查询参数对象
 *
 * 示例：
 * ```ts
 * const queryParams = createDefaultQueryParams<UserQuery>({
 *   keywords: '',
 *   status: 1
 * })
 * // 结果：{ pageNum: 1, pageSize: 10, search: { keywords: '', status: 1 } }
 * ```
 */
export function createDefaultQueryParams<T extends PageQuery>(searchDefaults: T['search'] = {} as T['search']): T {
  return {
    pageNum: 1,
    pageSize: 10,
    search: searchDefaults,
  } as T
}

/**
 * CRUD 配置接口
 * 定义所有可配置的选项，用于定制化 CRUD 行为
 *
 * 泛型说明：
 * - TListVO: 列表数据项的类型（表格中每一行的数据类型）
 * - TQuery: 查询参数类型（用于搜索和分页）
 * - TCreateDTO: 新增时的数据传输对象类型
 * - TUpdateDTO: 更新时的数据传输对象类型
 * - TDetailVO: 详情数据的类型
 */
export interface CrudConfig<
  TListVO extends RowData = RowData,
  TQuery = Record<string, unknown>,
  TCreateDTO = Record<string, unknown>,
  TUpdateDTO = Record<string, unknown>,
  TDetailVO = Record<string, unknown>,
> {
  /** 查询参数初始值（可选，用于设置默认搜索条件） */
  queryParams?: TQuery
  /** 是否启用树形模式（true=树形结构，false=普通列表分页） */
  treeMode?: boolean
  /** 分页查询API（普通列表模式使用，需要返回分页结果） */
  pageApi?: (params: TQuery) => Promise<PageResult<TListVO>>
  /** 树形查询API（树形模式使用，返回完整树形数据） */
  treeApi?: (params?: TQuery) => Promise<TListVO[]>
  /** 获取详情API（编辑和查看详情时使用） */
  detailApi?: (id: string | number) => Promise<TDetailVO>
  /** 新增API（提交新增表单时调用） */
  createApi?: (data: TCreateDTO) => Promise<void>
  /** 更新API（提交编辑表单时调用） */
  updateApi?: (data: TUpdateDTO) => Promise<void>
  /** 删除API（删除单条数据时调用） */
  removeApi?: (id: string | number) => Promise<void>
  /** 批量删除API（批量删除时调用） */
  batchRemoveApi?: (ids: (string | number)[]) => Promise<void>
  /** 表格配置（列定义、操作按钮等） */
  tableConfig: TableConfigOptions<TListVO>
  /** 分页配置选项（树形模式下可设置为 false 禁用分页） */
  paginationOptions?: PaginationConfigOptions | false
  /** 详情模态框配置（可选，用于查看详情功能） */
  detailConfig?: DetailModalConfig
  /** 主键字段名（用于从数据行中获取唯一标识，默认 'id'） */
  idKey?: keyof TListVO | ((row: TListVO) => string | number)
  /** 显示名称字段（用于删除确认等场景的提示信息，默认 'name'） */
  nameKey?: keyof TListVO | ((row: TListVO) => string)
  /** 新增表单默认值（打开新增表单时自动填充的值） */
  createDefaultValues?: Partial<TCreateDTO> | (() => Partial<TCreateDTO>)
  /** 编辑时数据转换函数（将详情数据转换为表单需要的格式） */
  transformDetailToUpdate?: (detail: TDetailVO) => Partial<TUpdateDTO>
  /** 提交前数据转换函数（用于处理特殊字段，如密码加密等） */
  transformBeforeSubmit?: (
    data: Partial<TCreateDTO | TUpdateDTO>,
    mode: 'create' | 'update',
  ) => TCreateDTO | TUpdateDTO
  /** 删除确认对话框的自定义文案 */
  deleteConfirm?: {
    title?: string
    content?: (row: TListVO) => string
    positiveText?: string
    negativeText?: string
  }
  /** 批量删除确认对话框的自定义文案 */
  batchDeleteConfirm?: {
    title?: string
    content?: (count: number) => string
    positiveText?: string
    negativeText?: string
  }
  /** 操作成功时的提示文案（支持函数动态生成） */
  successMessage?: {
    create?: string | (() => string)
    update?: string | (() => string)
    delete?: string | ((name: string) => string)
    batchDelete?: string | ((count: number) => string)
  }
  /** 操作失败时的提示文案 */
  errorMessage?: {
    create?: string
    update?: string
    delete?: string
    detail?: string
  }
  /** 自定义操作按钮处理函数（用于表格操作列中的自定义按钮） */
  customActionHandlers?: Record<string, (row: TListVO) => void>
  /** 自定义数据加载函数（可选，用于特殊的数据加载逻辑） */
  customLoadData?: (queryParams: TQuery) => Promise<void>
}

/**
 * 创建分页配置
 * 根据选项生成分页组件的配置对象
 *
 * @param reloadCallback - 页码或每页大小改变时的回调函数
 * @param options - 分页选项（每页大小选项、是否显示快速跳转等）
 * @returns 响应式的分页配置对象
 */
function createPagination(reloadCallback?: () => void, options: PaginationConfigOptions = {}) {
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

/**
 * 计算表格总宽度
 * 遍历所有列，累加每列的宽度，用于设置表格的横向滚动宽度
 *
 * @param columns - 表格列配置数组
 * @returns 所有列的总宽度
 */
function calculateTableScrollWidth<T extends RowData>(columns: DataTableColumns<T>): number {
  return columns.reduce((total, col) => {
    if (col.type === 'selection') {
      return total + 50 // 选择列的固定宽度
    }
    return total + Number(col.width || 0)
  }, 0)
}

/**
 * 创建选择列
 * 生成表格的多选列配置
 *
 * @returns 选择列配置对象
 */
function createSelectionColumn() {
  return {
    type: 'selection' as const,
  }
}

/**
 * 创建数据列
 * 将配置中的列定义转换为 Naive UI 表格需要的列格式
 *
 * @param columnsConfig - 列配置数组
 * @returns Naive UI 格式的列配置数组
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

    if (col.render) {
      column.render = col.render
    }

    if (col.cellProps) {
      column.cellProps = col.cellProps
    }

    return column as unknown as DataTableColumns<T>[0]
  })
}

/**
 * 创建操作按钮
 * 根据配置生成表格操作列中的按钮（查看、编辑、删除、自定义按钮）
 *
 * @param actionButtons - 操作按钮配置（哪些按钮需要显示）
 * @param actionOrder - 按钮显示顺序
 * @param handleEdit - 编辑按钮的处理函数
 * @param handleDelete - 删除按钮的处理函数
 * @param handleView - 查看按钮的处理函数
 * @param customActionHandlers - 自定义按钮的处理函数映射
 * @param row - 当前行数据
 * @returns 按钮节点数组
 */
function createActionButtons<T extends RowData>(
  actionButtons: NonNullable<TableConfigOptions<T>['actionButtons']>,
  actionOrder: Array<'custom' | 'view' | 'edit' | 'delete'>,
  handleEdit?: (row: T) => void,
  handleDelete?: (row: T) => void,
  handleView?: (row: T) => void,
  customActionHandlers?: Record<string, (row: T) => void>,
  row?: T,
) {
  const buttons: VNode[] = []
  const buttonGenerators = {
    view: () => {
      if (actionButtons.view && row) {
        buttons.push(createButton({ type: 'info', tertiary: true, onClick: () => handleView?.(row) }, EyeOutline))
      }
    },
    edit: () => {
      if (actionButtons.edit && row) {
        buttons.push(createButton({ type: 'primary', tertiary: true, onClick: () => handleEdit?.(row) }, CreateOutline))
      }
    },
    delete: () => {
      if (actionButtons.delete && row) {
        buttons.push(createButton({ type: 'error', tertiary: true, onClick: () => handleDelete?.(row) }, TrashOutline))
      }
    },
    custom: () => {
      if (actionButtons.custom && row) {
        actionButtons.custom.forEach((btn) => {
          const handler = customActionHandlers?.[btn.actionKey]
          buttons.push(
            createButton({ type: btn.type, tertiary: btn.tertiary ?? true, onClick: () => handler?.(row) }, btn.icon),
          )
        })
      }
    },
  }
  // 按照指定的顺序生成按钮
  actionOrder.forEach((actionType) => {
    buttonGenerators[actionType]?.()
  })

  return buttons
}

/**
 * 创建操作列
 * 生成表格的操作列配置（包含多个操作按钮）
 *
 * @param actionButtons - 操作按钮配置
 * @param actionOrder - 按钮顺序
 * @param actionWidth - 操作列宽度
 * @param fixedActionColumn - 是否固定操作列（固定在右侧）
 * @param handleEdit - 编辑处理函数
 * @param handleDelete - 删除处理函数
 * @param handleView - 查看处理函数
 * @param customActionHandlers - 自定义按钮处理函数
 * @returns 操作列配置对象
 */
function createActionColumn<T extends RowData>(
  actionButtons: NonNullable<TableConfigOptions<T>['actionButtons']>,
  actionOrder: Array<'custom' | 'view' | 'edit' | 'delete'>,
  actionWidth: number,
  fixedActionColumn: boolean = true,
  handleEdit?: (row: T) => void,
  handleDelete?: (row: T) => void,
  handleView?: (row: T) => void,
  customActionHandlers?: Record<string, (row: T) => void>,
) {
  return {
    title: '操作',
    key: 'action',
    width: actionWidth,
    align: 'center' as const, // 操作栏表头默认居中
    fixed: fixedActionColumn ? ('right' as const) : undefined,
    render(row: T) {
      const buttons = createActionButtons(
        actionButtons,
        actionOrder,
        handleEdit,
        handleDelete,
        handleView,
        customActionHandlers,
        row,
      )
      return createButtonGroup(buttons, { justify: 'center' })
    },
  }
}

/**
 * 创建通用表格列配置
 * 根据配置自动生成完整的表格列（包括选择列、数据列、操作列）
 *
 * @param options - 表格配置选项
 * @param handleEdit - 编辑处理函数
 * @param handleDelete - 删除处理函数
 * @param handleView - 查看处理函数
 * @param customActionHandlers - 自定义按钮处理函数
 * @returns 完整的表格列配置数组
 */
function createTableColumns<T extends RowData>(
  options: TableConfigOptions<T>,
  handleEdit?: (row: T) => void,
  handleDelete?: (row: T) => void,
  handleView?: (row: T) => void,
  customActionHandlers?: Record<string, (row: T) => void>,
): DataTableColumns<T> {
  const {
    columns,
    showSelection = true,
    showActions = true,
    actionButtons = { edit: true, delete: true, view: false },
    actionOrder = ['custom', 'view', 'edit', 'delete'],
    actionWidth = 140,
  } = options

  const tableColumns: DataTableColumns<T> = []

  // 添加选择列（如果需要）
  if (showSelection) {
    tableColumns.push(createSelectionColumn())
  }

  // 添加数据列
  tableColumns.push(...createDataColumns(columns))

  // 添加操作列（如果需要）
  if (showActions) {
    const fixedActionColumn = options.fixedActionColumn ?? true
    tableColumns.push(
      createActionColumn(
        actionButtons,
        actionOrder,
        actionWidth,
        fixedActionColumn,
        handleEdit,
        handleDelete,
        handleView,
        customActionHandlers,
      ),
    )
  }

  return tableColumns
}

// ==================== 核心 Hook ====================

/**
 * useCrud - 通用 CRUD 管理 Hook
 *
 * 这是整个 CRUD 系统的核心，通过配置驱动的方式，自动处理所有增删改查相关逻辑。
 * 你只需要传入配置，就能获得完整的数据管理能力，包括：
 * - 自动生成表格（列、操作按钮、分页）
 * - 表单状态管理（新增/编辑模式）
 * - 数据加载和刷新
 * - 删除确认和批量操作
 * - 详情查看
 *
 * 设计理念：约定大于配置，通过合理的默认值减少配置负担
 *
 * 使用示例：
 * ```ts
 * // 方式一：使用预定义的配置类型（推荐）
 * const crud = useCrud(userCrudConfig)
 *
 * // 方式二：手动指定泛型类型（用于复杂场景）
 * const crud = useCrud<UserListVO, UserQuery, UserCreateDTO, UserUpdateDTO, UserDetailVO>(config)
 * ```
 *
 * @param config - CRUD 配置对象，包含 API、表格配置等
 * @returns 返回所有状态和方法，可以在组件中解构使用
 */
export function useCrud<
  TListVO extends RowData = RowData,
  TQuery = Record<string, unknown>,
  TCreateDTO = Record<string, unknown>,
  TUpdateDTO = Record<string, unknown>,
  TDetailVO = Record<string, unknown>,
>(config: CrudConfig<TListVO, TQuery, TCreateDTO, TUpdateDTO, TDetailVO>) {
  // 解构配置项，并设置默认值
  const {
    queryParams: configQueryParams,
    treeMode = false,
    pageApi,
    treeApi,
    detailApi,
    createApi,
    updateApi,
    removeApi,
    batchRemoveApi,
    tableConfig,
    paginationOptions = {},
    detailConfig,
    idKey = 'id' as keyof TListVO,
    nameKey = 'name' as keyof TListVO,
    createDefaultValues = {},
    transformDetailToUpdate,
    transformBeforeSubmit,
    deleteConfirm = {},
    batchDeleteConfirm = {},
    successMessage = {},
    errorMessage = {},
    customActionHandlers,
    customLoadData,
  } = config

  // ==================== 响应式状态定义 ====================

  // 列表相关状态
  const loading = ref(false) // 数据加载状态（加载中/加载完成）
  const dataList = ref<TListVO[]>([]) // 列表数据
  const total = ref(0) // 数据总数（用于分页）
  const checkedRowKeys = ref<Array<string | number>>([]) // 表格中选中的行 ID 数组

  // 查询参数（用于搜索和分页）
  const queryParams = ref<TQuery>(configQueryParams || ({} as TQuery))

  // 表单相关状态
  const formVisible = ref(false) // 表单是否显示
  const formLoading = ref(false) // 表单提交中的加载状态
  const formMode = ref<'create' | 'update'>('create') // 表单模式：新增 or 编辑
  const formData = reactive<Partial<TCreateDTO | TUpdateDTO>>({}) // 表单数据

  // 详情相关状态
  const detailVisible = ref(false) // 详情模态框是否显示
  const detailLoading = ref(false) // 详情加载状态
  const detailData = reactive<Partial<TDetailVO>>({}) // 详情数据

  // ==================== 分页配置 ====================

  // 数据加载函数的引用（用于分页回调，需要在函数定义后才能赋值）
  let loadDataListRef: () => Promise<void> = () => Promise.resolve()

  // 创建分页配置（树形模式下可以禁用分页）
  const pagination =
    paginationOptions === false ? null : createPagination(() => loadDataListRef(), paginationOptions || {})

  // ==================== 工具函数 ====================

  /**
   * 从数据行中获取唯一标识（ID）
   * 支持字段名或函数两种方式
   */
  const getRowId = (row: TListVO): string | number => {
    if (typeof idKey === 'function') {
      return idKey(row)
    }
    return (row[idKey] as string | number) || ''
  }

  /**
   * 从数据行中获取显示名称
   * 用于删除确认等场景的提示信息
   */
  const getRowName = (row: TListVO): string => {
    if (typeof nameKey === 'function') {
      return nameKey(row)
    }
    const value = row[nameKey]
    return value ? String(value) : '未知'
  }

  // ==================== 核心方法 ====================

  /**
   * 加载数据（内部方法）
   * 根据模式（树形/列表）调用不同的 API 获取数据
   *
   * @param queryParams - 查询参数
   */
  const loadData = async (queryParams: TQuery) => {
    try {
      loading.value = true

      if (treeMode) {
        // 树形模式：获取完整树形结构数据
        if (!treeApi) {
          throw new Error('树形模式下必须提供treeApi')
        }
        const treeData = await treeApi(queryParams)
        dataList.value = treeData
        total.value = treeData.length
        // 树形模式不需要分页，所以不设置分页总数
      } else {
        // 普通列表模式：分页查询
        if (!pageApi) {
          throw new Error('普通列表模式下必须提供pageApi')
        }
        const res = await pageApi(queryParams)
        dataList.value = res.records // 列表数据
        total.value = Number(res.total) // 总数
        if (pagination) {
          pagination.itemCount = Number(res.total) // 更新分页组件的总数
        }
        return res
      }
    } catch (error) {
      logger.error('加载数据列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载数据列表（对外暴露的方法）
   * 这是页面最常用的方法，支持自定义加载逻辑
   * 如果配置了 customLoadData，则使用自定义逻辑，否则使用默认的 loadData
   */
  const loadDataList = async () => {
    if (customLoadData) {
      // 使用自定义加载逻辑（用于特殊需求，如需要加载额外数据）
      await customLoadData(queryParams.value)
    } else {
      // 使用默认加载逻辑
      await loadData(queryParams.value)
    }
  }

  // 设置分页回调引用（分页组件需要这个引用来触发数据重新加载）
  loadDataListRef = loadDataList

  // ==================== CRUD 操作方法 ====================

  /**
   * 打开新增表单
   * 清空表单数据，设置默认值，显示表单
   */
  const handleAdd = () => {
    formMode.value = 'create'
    // 清空表单数据，避免残留编辑时的旧数据
    Object.keys(formData).forEach((key) => {
      delete formData[key as keyof typeof formData]
    })
    // 设置默认值（支持对象或函数两种方式）
    const defaults = typeof createDefaultValues === 'function' ? createDefaultValues() : createDefaultValues
    Object.assign(formData, defaults)
    formVisible.value = true
  }

  /**
   * 打开编辑表单
   * 根据选中行获取详情数据，填充到表单中
   *
   * @param row - 表格中选中的行数据
   */
  const handleEdit = async (row: TListVO) => {
    try {
      formLoading.value = true
      const id = getRowId(row)

      if (!detailApi) {
        throw new Error('编辑功能需要配置detailApi')
      }

      // 获取详情数据
      const detail = await detailApi(id)

      formMode.value = 'update'

      // 数据转换（如果需要）
      if (transformDetailToUpdate) {
        Object.assign(formData, transformDetailToUpdate(detail))
      } else {
        Object.assign(formData, detail)
      }

      formVisible.value = true
    } catch (error) {
      logger.error(errorMessage?.detail || '获取详情失败:', error)
      message.error(errorMessage?.detail || '获取详情失败')
    } finally {
      formLoading.value = false
    }
  }

  /**
   * 查看详情
   * 在详情模态框中显示数据（只读）
   *
   * @param row - 表格中选中的行数据
   */
  const handleView = async (row: TListVO) => {
    try {
      detailLoading.value = true
      const id = getRowId(row)

      if (!detailApi) {
        throw new Error('查看详情功能需要配置detailApi')
      }

      const detail = await detailApi(id)
      Object.assign(detailData, detail)
      detailVisible.value = true
    } catch (error) {
      logger.error(errorMessage?.detail || '获取详情失败:', error)
      message.error(errorMessage?.detail || '获取详情失败')
    } finally {
      detailLoading.value = false
    }
  }

  /**
   * 提交表单（新增或编辑）
   * 根据表单模式调用不同的 API，处理数据转换，显示成功/失败提示
   *
   * @param data - 表单数据
   * @returns 是否提交成功
   */
  const handleSubmit = async (data: Partial<TCreateDTO | TUpdateDTO>) => {
    try {
      formLoading.value = true

      // 数据转换（用于处理特殊字段，如密码加密等）
      let submitData: TCreateDTO | TUpdateDTO
      if (transformBeforeSubmit) {
        submitData = transformBeforeSubmit(data, formMode.value)
      } else {
        submitData = data as TCreateDTO | TUpdateDTO
      }

      // 根据模式调用不同的 API
      if (formMode.value === 'create') {
        if (!createApi) {
          throw new Error('新增功能需要配置createApi')
        }
        await createApi(submitData as TCreateDTO)
        // 显示成功提示（支持函数动态生成）
        const msg = typeof successMessage?.create === 'function' ? successMessage.create() : successMessage?.create
        message.success(msg || '新增成功')
      } else {
        if (!updateApi) {
          throw new Error('更新功能需要配置updateApi')
        }
        await updateApi(submitData as TUpdateDTO)
        const msg = typeof successMessage?.update === 'function' ? successMessage.update() : successMessage?.update
        message.success(msg || '更新成功')
      }

      formVisible.value = false
      return true
    } catch (error) {
      const msg = formMode.value === 'create' ? errorMessage?.create || '新增失败' : errorMessage?.update || '更新失败'
      logger.error(msg, error)
      message.error(msg)
      throw error
    } finally {
      formLoading.value = false
    }
  }

  /**
   * 删除单条数据
   * 显示确认对话框，确认后调用删除 API，删除成功后执行回调
   *
   * @param row - 要删除的行数据
   * @param onSuccess - 删除成功后的回调函数（通常用于刷新列表）
   */
  const handleDelete = async (row: TListVO, onSuccess?: () => void) => {
    try {
      const id = getRowId(row)
      const name = getRowName(row)

      // 显示删除确认对话框
      await dialog.warning({
        title: deleteConfirm?.title || '删除确认',
        content: deleteConfirm?.content?.(row) || `确定要删除 "${name}" 吗？此操作不可撤销。`,
        positiveText: deleteConfirm?.positiveText || '确定删除',
        negativeText: deleteConfirm?.negativeText || '取消',
        onPositiveClick: async () => {
          try {
            if (!removeApi) {
              throw new Error('删除功能需要配置removeApi')
            }
            await removeApi(id)
            // 显示成功提示
            const msg =
              typeof successMessage?.delete === 'function' ? successMessage.delete(name) : successMessage?.delete
            message.success(msg || `删除 ${name} 成功`)
            // 执行成功回调（通常用于刷新列表）
            onSuccess?.()
          } catch (error) {
            logger.error(errorMessage?.delete || '删除失败:', error)
            message.error(errorMessage?.delete || '删除失败')
          }
        },
      })
    } catch (error) {
      logger.error('删除操作异常:', error)
    }
  }

  /**
   * 批量删除
   * 删除多条选中的数据，显示确认对话框和删除数量
   *
   * @param ids - 要删除的数据 ID 数组
   * @param onSuccess - 删除成功后的回调函数
   */
  const handleBatchDelete = async (ids: (string | number)[], onSuccess?: () => void) => {
    if (!batchRemoveApi) {
      message.warning('未配置批量删除API')
      return
    }

    if (ids.length === 0) {
      message.warning('请先选择要删除的数据')
      return
    }

    try {
      const count = ids.length
      await dialog.warning({
        title: batchDeleteConfirm?.title || '批量删除确认',
        content: batchDeleteConfirm?.content?.(count) || `确定要删除选中的 ${count} 条数据吗？此操作不可撤销。`,
        positiveText: batchDeleteConfirm?.positiveText || '确定删除',
        negativeText: batchDeleteConfirm?.negativeText || '取消',
        onPositiveClick: async () => {
          try {
            await batchRemoveApi(ids)
            const msg =
              typeof successMessage?.batchDelete === 'function'
                ? successMessage.batchDelete(count)
                : successMessage?.batchDelete
            message.success(msg || `成功删除 ${count} 条数据`)
            onSuccess?.()
          } catch (error) {
            logger.error('批量删除失败:', error)
            message.error('批量删除失败')
          }
        },
      })
    } catch (error) {
      logger.error('批量删除操作异常:', error)
    }
  }

  // ==================== 表单辅助方法 ====================

  /**
   * 关闭表单
   */
  const handleCancel = () => {
    formVisible.value = false
  }

  /**
   * 更新表单数据
   * 用于表单组件内部更新表单数据时调用
   *
   * @param data - 要更新的表单数据
   */
  const handleFormDataUpdate = (data: Partial<TCreateDTO | TUpdateDTO>) => {
    Object.assign(formData, data)
  }

  // ==================== 表格辅助方法 ====================

  /**
   * 处理表格行选择变化
   * 当用户勾选/取消勾选表格行时调用，更新选中的行 ID 数组
   *
   * @param keys - 选中的行 ID 数组
   */
  const handleCheck = (keys: Array<string | number>) => {
    checkedRowKeys.value = keys
  }

  /**
   * 表格列中使用的删除函数
   * 这个函数会在删除后自动刷新列表，用于表格操作列的删除按钮
   */
  const handleDeleteForTable = (row: TListVO) => {
    handleDelete(row, () => {
      loadDataListRef()
    })
  }

  // ==================== 计算属性 ====================

  /**
   * 自动生成的表格列配置
   * 包含选择列、数据列、操作列，会根据配置自动组合
   */
  const columns = computed(() =>
    createTableColumns(
      tableConfig,
      handleEdit,
      handleDeleteForTable,
      detailConfig ? handleView : undefined,
      customActionHandlers,
    ),
  )

  /**
   * 表格横向滚动宽度
   * 根据所有列的宽度自动计算，用于设置表格的横向滚动
   */
  const tableScrollWidth = computed(() => calculateTableScrollWidth(columns.value))

  // ==================== 通用工具方法 ====================

  /**
   * 重置分页并重新加载数据
   * 用于搜索、筛选等场景，将分页重置到第一页并重新加载数据
   */
  const resetPaginationAndLoad = () => {
    if (pagination) {
      pagination.page = 1
    }
    loadDataList()
  }

  // ==================== 返回值 ====================

  return {
    // ========== 状态 ==========
    loading, // 数据加载状态
    dataList, // 列表数据
    total, // 数据总数
    formVisible, // 表单是否显示
    formLoading, // 表单提交状态
    formMode, // 表单模式（新增/编辑）
    formData, // 表单数据
    detailVisible, // 详情模态框是否显示
    detailLoading, // 详情加载状态
    detailData, // 详情数据
    checkedRowKeys, // 表格选中的行 ID
    pagination, // 分页配置（可能为 null，如果禁用了分页）
    columns, // 表格列配置
    tableScrollWidth, // 表格横向滚动宽度
    treeMode, // 是否为树形模式

    // ========== 核心方法 ==========
    loadData, // 内部加载数据方法（直接调用 API）
    loadDataList, // 对外暴露的加载数据方法（推荐使用这个）

    // ========== CRUD 操作方法 ==========
    handleAdd, // 打开新增表单
    handleEdit, // 打开编辑表单
    handleView, // 查看详情
    handleSubmit, // 提交表单（新增/编辑）
    handleDelete, // 删除单条数据
    handleBatchDelete, // 批量删除

    // ========== 辅助方法 ==========
    handleCancel, // 关闭表单
    handleFormDataUpdate, // 更新表单数据
    handleCheck, // 处理表格行选择
    resetPaginationAndLoad, // 重置分页并加载

    // ========== 工具方法 ==========
    getRowId, // 获取行的 ID
    getRowName, // 获取行的显示名称
  }
}
