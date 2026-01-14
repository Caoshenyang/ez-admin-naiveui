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

import { ref, reactive, computed, toRaw } from 'vue'
import type { PageResult } from '@/types/modules/api'
import { message, dialog, logger } from '@/hooks/useMessage'
import { createPagination } from '@/utils/pagination'
import { createTableColumns, calculateTableScrollWidth } from '@/utils/table'
import type { TableConfigOptions, PaginationConfigOptions, DetailModalConfig } from './types/table'
import type { RowData } from 'naive-ui/es/data-table/src/interface'

// ==================== 导出工具函数 ====================

/**
 * 创建默认的查询参数（导出以供外部使用）
 * @deprecated 请使用 @/utils/query 中的 createDefaultQueryParams
 */
export { createDefaultQueryParams } from '@/utils/query'

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

  /** 字段级联加载配置（用于表单字段需要异步加载数据的场景） */
  fieldCascadeLoad?: FieldCascadeLoadConfig<TCreateDTO, TUpdateDTO>[]

  /**
   * 页面级按钮处理函数映射（用于页面上方的操作按钮，如新增、刷新等）
   *
   * 支持两种形式：
   * 1. 函数形式（推荐）：接收 crud 实例作为参数，可以访问所有 crud 的状态和方法
   * 2. 对象形式：直接提供处理函数映射（适用于不需要访问 crud 状态的场景）
   *
   * @example
   * // 函数形式（推荐）
   * actionHandlers: (crud) => ({
   *   add: () => crud.handleAdd(),
   *   refresh: () => crud.loadDataList(),
   * })
   *
   * @example
   * // 对象形式
   * actionHandlers: {
   *   customAction: () => console.log('custom'),
   * }
   */
  actionHandlers?:
    | Record<string, () => void | Promise<void>>
    | ((crud: ReturnType<typeof useCrud>) => Record<string, () => void | Promise<void>>)

  /**
   * 树形结构配置选项（当 treeMode 为 true 时使用）
   *
   * 用于配置树形表格的展开/收起行为
   */
  treeOptions?: {
    /** 子节点字段名（默认 'children'） */
    childrenKey?: string
    /** 是否默认展开所有节点（默认 false） */
    defaultExpandAll?: boolean
    /** 展开/收起按钮的 key（用于 actionHandlers 中的映射，默认 'toggle-expand'） */
    toggleActionKey?: string
  }
}

/**
 * 字段级联加载配置
 * 用于表单字段需要根据表单模式或表单数据动态加载选项的场景
 * 例如：部门管理的上级部门选择，需要根据编辑/新增模式加载不同的树形数据
 */
export interface FieldCascadeLoadConfig<TCreateDTO, TUpdateDTO> {
  /** 字段名（表单中的字段 key） */
  fieldKey: string
  /** 加载函数（返回选项数据） */
  loader: (mode: 'create' | 'update', formData?: Partial<TCreateDTO | TUpdateDTO>) => Promise<any[]>
  /** 是否在编辑时排除当前节点（用于树形结构的父子关系） */
  excludeSelfOnEdit?: boolean
  /** 加载后的数据转换函数（可选，用于将API数据转换为组件需要的格式） */
  transformer?: (data: any[]) => any[]
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
    fieldCascadeLoad,
    actionHandlers,
    treeOptions,
  } = config

  // ==================== 响应式状态定义 ====================

  // 列表相关状态
  const loading = ref(false) // 数据加载状态（加载中/加载完成）
  const dataList = ref<TListVO[]>([]) // 列表数据
  const total = ref(0) // 数据总数（用于分页）
  const checkedRowKeys = ref<Array<string | number>>([]) // 表格中选中的行 ID 数组

  // 查询参数（用于搜索和分页）
  const queryParams = ref<TQuery>(configQueryParams || ({} as TQuery))

  // 树形相关状态（仅在 treeMode 为 true 时使用）
  const expandedKeys = ref<Array<string | number>>([]) // 展开的节点 keys

  // 表单相关状态
  const formVisible = ref(false) // 表单是否显示
  const formLoading = ref(false) // 表单提交中的加载状态
  const formMode = ref<'create' | 'update'>('create') // 表单模式：新增 or 编辑
  const formData = reactive<Partial<TCreateDTO | TUpdateDTO>>({}) // 表单数据

  // 详情相关状态
  const detailVisible = ref(false) // 详情模态框是否显示
  const detailLoading = ref(false) // 详情加载状态
  const detailData = reactive<Partial<TDetailVO>>({}) // 详情数据

  // 字段级联加载相关状态
  const fieldOptionsMap = ref<Record<string, any[]>>({}) // 存储字段的选项数据

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

  // ==================== 字段级联加载方法 ====================

  /**
   * 加载字段级联选项数据
   * 根据 fieldCascadeLoad 配置自动加载需要的字段选项
   */
  const loadFieldOptions = async () => {
    if (!fieldCascadeLoad || fieldCascadeLoad.length === 0) {
      return
    }

    const mode = formMode.value
    // 使用 toRaw 将 reactive 对象转换为普通对象
    const currentFormData = toRaw(formData) as Partial<TCreateDTO | TUpdateDTO>

    // 并行加载所有字段的选项
    const loadPromises = fieldCascadeLoad.map(async (config) => {
      try {
        let data = await config.loader(mode, currentFormData)
        // 如果配置了转换函数，进行数据转换
        if (config.transformer) {
          data = config.transformer(data)
        }
        fieldOptionsMap.value[config.fieldKey] = data
      } catch (error) {
        logger.error(`加载字段 ${config.fieldKey} 的选项失败:`, error)
        fieldOptionsMap.value[config.fieldKey] = []
      }
    })

    await Promise.all(loadPromises)
  }

  /**
   * 获取字段的选项数据
   * 用于表单组件获取字段的动态选项
   */
  const getFieldOptions = (fieldKey: string): any[] => {
    return fieldOptionsMap.value[fieldKey] || []
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
  const handleAdd = async () => {
    formMode.value = 'create'
    // 清空表单数据，避免残留编辑时的旧数据
    Object.keys(formData).forEach((key) => {
      delete formData[key as keyof typeof formData]
    })
    // 设置默认值（支持对象或函数两种方式）
    const defaults = typeof createDefaultValues === 'function' ? createDefaultValues() : createDefaultValues
    Object.assign(formData, defaults)

    // 加载字段级联选项
    await loadFieldOptions()

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

      // 加载字段级联选项
      await loadFieldOptions()

      // 延迟显示表单，确保数据设置完成
      setTimeout(() => {
        formVisible.value = true
      }, 10)
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

  // ==================== 树形操作方法 ====================

  /**
   * 获取树形配置的默认值
   */
  const getTreeConfig = () => ({
    childrenKey: treeOptions?.childrenKey || 'children',
    defaultExpandAll: treeOptions?.defaultExpandAll || false,
    toggleActionKey: treeOptions?.toggleActionKey || 'toggle-expand',
  })

  /**
   * 收集所有可展开的节点 ID
   * 用于树形结构的展开/收起功能
   */
  const collectExpandableKeys = (data: TListVO[], childrenKey: string): (string | number)[] => {
    const keys: (string | number)[] = []
    const traverse = (nodes: any[]) => {
      nodes.forEach((node) => {
        const children = node[childrenKey]
        if (children && Array.isArray(children) && children.length > 0) {
          const nodeId = typeof idKey === 'function' ? idKey(node) : node[idKey]
          keys.push(nodeId as string | number)
          traverse(children)
        }
      })
    }
    traverse(data as any[])
    return keys
  }

  /**
   * 展开所有节点
   */
  const expandAll = () => {
    if (!treeMode) return
    const { childrenKey } = getTreeConfig()
    expandedKeys.value = collectExpandableKeys(dataList.value as TListVO[], childrenKey)
  }

  /**
   * 收起所有节点
   */
  const collapseAll = () => {
    expandedKeys.value = []
  }

  /**
   * 切换展开/收起状态
   */
  const toggleExpand = () => {
    expandedKeys.value.length > 0 ? collapseAll() : expandAll()
  }

  /**
   * 是否有展开的节点
   */
  const isExpanded = computed(() => expandedKeys.value.length > 0)

  /**
   * 展开节点的数量
   */
  const expandedCount = computed(() => expandedKeys.value.length)

  /**
   * 统一的页面按钮处理函数
   * 根据 actionHandlers 配置自动分发到对应的处理函数
   *
   * @param key - 按钮的 key 值
   */
  const handlePageAction = (key: string) => {
    // 判断 actionHandlers 是函数还是对象
    const handlers =
      typeof actionHandlers === 'function'
        ? actionHandlers({
            // 传入一个包含所有必要状态和方法的 crud 对象
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
            queryParams,
            fieldOptionsMap,
            loadDataList,
            handleAdd,
            handleEdit,
            handleView,
            handleSubmit,
            handleDelete,
            handleBatchDelete,
            handleCancel,
            handleFormDataUpdate,
            handleCheck,
            resetPaginationAndLoad,
            getFieldOptions,
            handlePageAction,
          } as any)
        : actionHandlers

    const handler = handlers?.[key]
    if (handler) {
      handler()
    } else {
      console.warn(`未定义的按钮 action: ${key}，请在 actionHandlers 配置中添加对应的处理函数`)
    }
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
    queryParams, // 查询参数（用于外部访问和修改）
    fieldOptionsMap, // 字段级联选项数据
    expandedKeys, // 树形展开的节点 keys
    isExpanded, // 树形是否已展开
    expandedCount, // 树形展开节点的数量

    // ========== 核心方法 ==========
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
    getFieldOptions, // 获取字段级联选项数据
    handlePageAction, // 统一的页面按钮处理函数（根据 actionHandlers 配置自动分发）

    // ========== 树形操作方法（仅在 treeMode 为 true 时可用）==========
    expandAll, // 展开所有节点
    collapseAll, // 收起所有节点
    toggleExpand, // 切换展开/收起状态
  }
}
