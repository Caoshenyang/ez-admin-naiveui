import { ref, reactive, computed } from 'vue'
import type { PageQuery, PageResult } from '@/types/modules/api'
import type { DataTableColumns } from 'naive-ui'
import { TrashOutline, CreateOutline, EyeOutline } from '@vicons/ionicons5'
import { message, dialog, logger } from '@/hooks/useMessage'
import { createButton, createButtonGroup } from '@/utils/renderers'
import type { TableConfigOptions, PaginationConfigOptions, TableColumnConfig, DetailModalConfig } from './types/table'
import type { RowData } from 'naive-ui/es/data-table/src/interface'

/**
 * 创建默认的查询参数
 * 用于减少组件中的样板代码
 */
export function createDefaultQueryParams<T extends PageQuery>(
  searchDefaults: T['search'] = {} as T['search']
): T {
  return {
    pageNum: 1,
    pageSize: 10,
    search: searchDefaults,
  } as T
}

/**
 * CRUD配置接口
 */
export interface CrudConfig<
  TListVO extends RowData = RowData,
  TQuery extends PageQuery = PageQuery,
  TCreateDTO = Record<string, unknown>,
  TUpdateDTO = Record<string, unknown>,
  TDetailVO = Record<string, unknown>,
> {
  /** 查询参数初始值 */
  queryParams?: TQuery
  /** 分页查询API */
  pageApi: (params: TQuery) => Promise<PageResult<TListVO>>
  /** 获取详情API */
  detailApi: (id: string | number) => Promise<TDetailVO>
  /** 新增API */
  createApi: (data: TCreateDTO) => Promise<void>
  /** 更新API */
  updateApi: (data: TUpdateDTO) => Promise<void>
  /** 删除API */
  removeApi: (id: string | number) => Promise<void>
  /** 批量删除API */
  batchRemoveApi?: (ids: (string | number)[]) => Promise<void>
  /** 表格配置 */
  tableConfig: TableConfigOptions<TListVO>
  /** 分页配置选项 */
  paginationOptions?: PaginationConfigOptions
  /** 详情模态框配置 */
  detailConfig?: DetailModalConfig
  /** 主键字段名（用于获取ID） */
  idKey?: keyof TListVO | ((row: TListVO) => string | number)
  /** 显示名称字段（用于确认对话框） */
  nameKey?: keyof TListVO | ((row: TListVO) => string)
  /** 新增表单默认值 */
  createDefaultValues?: Partial<TCreateDTO> | (() => Partial<TCreateDTO>)
  /** 编辑时数据转换（从详情VO转换为更新DTO） */
  transformDetailToUpdate?: (detail: TDetailVO) => Partial<TUpdateDTO>
  /** 提交前数据转换（处理特殊字段，如密码等） */
  transformBeforeSubmit?: (data: Partial<TCreateDTO | TUpdateDTO>, mode: 'create' | 'update') => TCreateDTO | TUpdateDTO
  /** 删除确认文案 */
  deleteConfirm?: {
    title?: string
    content?: (row: TListVO) => string
    positiveText?: string
    negativeText?: string
  }
  /** 批量删除确认文案 */
  batchDeleteConfirm?: {
    title?: string
    content?: (count: number) => string
    positiveText?: string
    negativeText?: string
  }
  /** 成功提示文案 */
  successMessage?: {
    create?: string | (() => string)
    update?: string | (() => string)
    delete?: string | ((name: string) => string)
    batchDelete?: string | ((count: number) => string)
  }
  /** 错误提示文案 */
  errorMessage?: {
    create?: string
    update?: string
    delete?: string
    detail?: string
  }
}

/**
 * 创建分页配置
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
 */
function calculateTableScrollWidth<T extends RowData>(columns: DataTableColumns<T>): number {
  return columns.reduce((total, col) => {
    if (col.type === 'selection') {
      return total + 50
    }
    return total + Number(col.width || 0)
  }, 0)
}

/**
 * 创建选择列
 */
function createSelectionColumn() {
  return {
    type: 'selection' as const,
  }
}

/**
 * 创建数据列
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
 */
function createActionButtons<T extends RowData>(
  actionButtons: NonNullable<TableConfigOptions<T>['actionButtons']>,
  handleEdit?: (row: T) => void,
  handleDelete?: (row: T) => void,
  handleView?: (row: T) => void,
  row?: T,
) {
  const buttons = []

  if (actionButtons.view && row) {
    buttons.push(
      createButton(
        {
          type: 'info',
          tertiary: true,
          onClick: () => handleView?.(row),
        },
        EyeOutline,
      ),
    )
  }

  if (actionButtons.edit && row) {
    buttons.push(
      createButton(
        {
          type: 'primary',
          tertiary: true,
          onClick: () => handleEdit?.(row),
        },
        CreateOutline,
      ),
    )
  }

  if (actionButtons.delete && row) {
    buttons.push(
      createButton(
        {
          type: 'error',
          tertiary: true,
          onClick: () => handleDelete?.(row),
        },
        TrashOutline,
      ),
    )
  }

  if (actionButtons.custom && row) {
    actionButtons.custom.forEach((btn) => {
      buttons.push(
        createButton(
          {
            type: btn.type,
            tertiary: btn.tertiary ?? true,
            onClick: () => btn.onClick(row),
          },
          btn.icon,
        ),
      )
    })
  }

  return buttons
}

/**
 * 创建操作列
 */
function createActionColumn<T extends RowData>(
  actionButtons: NonNullable<TableConfigOptions<T>['actionButtons']>,
  actionWidth: number,
  fixedActionColumn: boolean = true,
  handleEdit?: (row: T) => void,
  handleDelete?: (row: T) => void,
  handleView?: (row: T) => void,
) {
  return {
    title: '操作',
    key: 'action',
    width: actionWidth,
    fixed: fixedActionColumn ? ('right' as const) : undefined,
    render(row: T) {
      const buttons = createActionButtons(actionButtons, handleEdit, handleDelete, handleView, row)
      return createButtonGroup(buttons)
    },
  }
}

/**
 * 创建通用表格列配置
 */
function createTableColumns<T extends RowData>(
  options: TableConfigOptions<T>,
  handleEdit?: (row: T) => void,
  handleDelete?: (row: T) => void,
  handleView?: (row: T) => void,
): DataTableColumns<T> {
  const {
    columns,
    showSelection = true,
    showActions = true,
    actionButtons = { edit: true, delete: true, view: false },
    actionWidth = 140,
  } = options

  const tableColumns: DataTableColumns<T> = []

  if (showSelection) {
    tableColumns.push(createSelectionColumn())
  }

  tableColumns.push(...createDataColumns(columns))

  if (showActions) {
    const fixedActionColumn = options.fixedActionColumn ?? true
    tableColumns.push(createActionColumn(actionButtons, actionWidth, fixedActionColumn, handleEdit, handleDelete, handleView))
  }

  return tableColumns
}

/**
 * 通用CRUD Hook
 * 约定大于配置：通过配置即可完成完整的CRUD功能（包含表格）
 *
 * 调用示例：
 * // 传统方式（推荐用于复杂场景）
 * const crud = useCrud<UserListVO, UserQuery, UserCreateDTO, UserUpdateDTO, UserDetailVO>(config)
 *
 * // 简化方式（当有预定义配置类型时）
 * const crud = useCrud(config) // TypeScript 会自动推断类型
 */
export function useCrud<
  TListVO extends RowData = RowData,
  TQuery extends PageQuery = PageQuery,
  TCreateDTO = Record<string, unknown>,
  TUpdateDTO = Record<string, unknown>,
  TDetailVO = Record<string, unknown>,
>(config: CrudConfig<TListVO, TQuery, TCreateDTO, TUpdateDTO, TDetailVO>) {
  const {
    pageApi,
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
  } = config

  // === 响应式状态 ===
  const loading = ref(false)
  const dataList = ref<TListVO[]>([])
  const total = ref(0)
  const checkedRowKeys = ref<Array<string | number>>([])

  // 表单状态
  const formVisible = ref(false)
  const formLoading = ref(false)
  const formMode = ref<'create' | 'update'>('create')
  const formData = reactive<Partial<TCreateDTO | TUpdateDTO>>({})

  // 详情状态
  const detailVisible = ref(false)
  const detailLoading = ref(false)
  const detailData = reactive<Partial<TDetailVO>>({})

  // === 表格和分页配置 ===
  let loadDataFn: () => Promise<void> | void = () => {
    throw new Error('loadData function must be implemented')
  }

  const pagination = createPagination(() => loadDataFn(), paginationOptions)

  // === 计算属性 ===
  // 表格列中使用的删除函数（自动刷新列表）
  const handleDeleteForTable = (row: TListVO) => {
    handleDelete(row, () => {
      loadDataFn()
    })
  }
  const columns = computed(() => createTableColumns(tableConfig, handleEdit, handleDeleteForTable, detailConfig ? handleView : undefined))
  const tableScrollWidth = computed(() => calculateTableScrollWidth(columns.value))

  // === 工具函数 ===
  const getRowId = (row: TListVO): string | number => {
    if (typeof idKey === 'function') {
      return idKey(row)
    }
    return (row[idKey] as string | number) || ''
  }

  const getRowName = (row: TListVO): string => {
    if (typeof nameKey === 'function') {
      return nameKey(row)
    }
    const value = row[nameKey]
    return value ? String(value) : '未知'
  }

  // === 核心方法 ===
  const loadData = async (queryParams: TQuery) => {
    try {
      loading.value = true
      const res = await pageApi(queryParams)
      dataList.value = res.records
      total.value = Number(res.total)
      pagination.itemCount = Number(res.total)
      return res
    } catch (error) {
      logger.error('加载数据列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const handleAdd = () => {
    formMode.value = 'create'
    const defaults = typeof createDefaultValues === 'function' ? createDefaultValues() : createDefaultValues
    Object.assign(formData, defaults)
    formVisible.value = true
  }

  const handleEdit = async (row: TListVO) => {
    try {
      formLoading.value = true
      const id = getRowId(row)
      const detail = await detailApi(id)

      formMode.value = 'update'

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

  const handleView = async (row: TListVO) => {
    try {
      detailLoading.value = true
      const id = getRowId(row)
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

  const handleSubmit = async (data: Partial<TCreateDTO | TUpdateDTO>) => {
    try {
      formLoading.value = true

      let submitData: TCreateDTO | TUpdateDTO
      if (transformBeforeSubmit) {
        submitData = transformBeforeSubmit(data, formMode.value)
      } else {
        submitData = data as TCreateDTO | TUpdateDTO
      }

      if (formMode.value === 'create') {
        await createApi(submitData as TCreateDTO)
        const msg = typeof successMessage?.create === 'function' ? successMessage.create() : successMessage?.create
        message.success(msg || '新增成功')
      } else {
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

  const handleDelete = async (row: TListVO, onSuccess?: () => void) => {
    try {
      const id = getRowId(row)
      const name = getRowName(row)

      await dialog.warning({
        title: deleteConfirm?.title || '删除确认',
        content: deleteConfirm?.content?.(row) || `确定要删除 "${name}" 吗？此操作不可撤销。`,
        positiveText: deleteConfirm?.positiveText || '确定删除',
        negativeText: deleteConfirm?.negativeText || '取消',
        onPositiveClick: async () => {
          try {
            await removeApi(id)
            const msg =
              typeof successMessage?.delete === 'function' ? successMessage.delete(name) : successMessage?.delete
            message.success(msg || `删除 ${name} 成功`)
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

  const handleCancel = () => {
    formVisible.value = false
  }

  const handleFormDataUpdate = (data: Partial<TCreateDTO | TUpdateDTO>) => {
    Object.assign(formData, data)
  }

  const handleCheck = (keys: Array<string | number>) => {
    checkedRowKeys.value = keys
  }

  const handleSearch = () => {
    pagination.page = 1
    loadDataFn()
  }

  const handleReset = () => {
    pagination.page = 1
    loadDataFn()
  }

  // === 设置加载数据函数 ===
  const setLoadData = (fn: () => Promise<void> | void) => {
    loadDataFn = fn
    pagination.onChange = (page: number) => {
      pagination.page = page
      loadDataFn()
    }
    pagination.onUpdatePageSize = (pageSize: number) => {
      pagination.pageSize = pageSize
      pagination.page = 1
      loadDataFn()
    }
  }

  // === 返回值 ===
  return {
    // 状态
    loading,
    dataList,
    total,
    formVisible,
    formLoading,
    formMode,
    formData,
    detailVisible,
    detailLoading,
    detailData,
    checkedRowKeys,
    pagination,
    columns,
    tableScrollWidth,

    // 方法
    loadData,
    setLoadData,
    handleAdd,
    handleEdit,
    handleView,
    handleSubmit,
    handleDelete,
    handleBatchDelete,
    handleCancel,
    handleFormDataUpdate,
    handleCheck,
    handleSearch,
    handleReset,

    // 工具方法
    getRowId,
    getRowName,
  }
}
