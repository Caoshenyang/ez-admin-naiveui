/**
 * useCrud - 通用 CRUD 管理 Hook（简化版）
 *
 * 这是唯一的 CRUD Hook，直接接受扁平化配置。
 * 通过配置驱动的方式，自动处理所有增删改查相关逻辑。
 *
 * 使用示例：
 * ```ts
 * const crud = useCrud({
 *   title: '部门管理',
 *   mode: 'tree',
 *   api: { list, create, update, delete },
 *   columns: [...],
 *   actions: ['add', 'refresh'],
 *   rowActions: ['edit', 'delete'],
 *   form: { fields: [...] },
 * })
 * ```
 */

import { ref, reactive, computed, toRaw } from 'vue'
import type { PageResult } from '@/types/modules/api'
import { message, dialog, logger } from '@/hooks/useMessage'
import { createPagination } from '@/utils/pagination'
import { createTableColumns, calculateTableScrollWidth } from '@/utils/table'
import type { TableColumnConfig } from './types/table'
import type { RowData } from 'naive-ui/es/data-table/src/interface'
import type { CrudFlatConfig } from './types/crud-config'
import { PlusOutlined } from '@vicons/antd'
import { SyncOutline, ChevronDownOutline, ChevronUpOutline } from '@vicons/ionicons5'
import type { ActionButton } from '@/components/common/EzButtonGroup.vue'
import { renderStatusTag } from '@/utils/renderers'

// ==================== 导出工具函数 ====================

export { createDefaultQueryParams } from '@/utils/query'

// ==================== 类型定义 ====================

/** 分页配置类型 */
type Pagination = ReturnType<typeof createPagination>

// ==================== 核心 Hook ====================

/**
 * useCrud - 通用 CRUD 管理 Hook
 *
 * @param flatConfig 扁平化配置对象
 * @returns CRUD 状态和方法
 */
export function useCrud<
  TListVO extends RowData,
  TQuery = unknown,
  TCreateDTO = unknown,
  TUpdateDTO = unknown,
  TDetailVO = unknown,
>(
  flatConfig: CrudFlatConfig<TListVO, TQuery, TCreateDTO, TUpdateDTO, TDetailVO>,
) {
  const {
    title,
    mode = 'list',
    idKey = 'id',
    nameKey = 'name',
    api,
    columns: flatColumns,
    showSelection = true,
    showPagination = mode === 'list',
    pagination,
    actions: flatActions,
    rowActions: flatRowActions,
    actionWidth = 180,
    form: flatForm,
    defaults,
    tree,
    detail,
    transformBeforeSubmit,
    transformDetailToForm,
  } = flatConfig

  // ==================== 响应式状态定义 ====================

  const loading = ref(false)
  const dataList = ref<TListVO[]>([])
  const total = ref(0)
  const checkedRowKeys = ref<Array<string | number>>([])
  const queryParams = ref<TQuery>({} as TQuery)
  const expandedKeys = ref<Array<string | number>>([])

  const formVisible = ref(false)
  const formLoading = ref(false)
  const formMode = ref<'create' | 'update'>('create')
  const formData = reactive<Partial<TCreateDTO | TUpdateDTO>>({})

  const detailVisible = ref(false)
  const detailLoading = ref(false)
  const detailData = reactive<Partial<TDetailVO>>({})

  const fieldOptionsMap = ref<Record<string, unknown[]>>({})

  // ==================== 分页配置 ====================

  let loadDataListRef: () => Promise<void> = () => Promise.resolve()

  const paginationRef: Pagination | null =
    showPagination && pagination
      ? createPagination(() => loadDataListRef(), pagination)
      : null

  // ==================== 工具函数 ====================

  const getRowId = (row: TListVO): string | number => {
    if (typeof idKey === 'function') {
      return idKey(row)
    }
    return (row[idKey as keyof TListVO] as string | number) || ''
  }

  const getRowName = (row: TListVO): string => {
    if (typeof nameKey === 'function') {
      return nameKey(row)
    }
    const value = row[nameKey as keyof TListVO]
    return value ? String(value) : '未知'
  }

  // ==================== 字段级联加载 ====================

  const loadFieldOptions = async (): Promise<void> => {
    if (!flatForm) return

    const cascadeFields = flatForm.fields.filter((f) => f.load)
    if (cascadeFields.length === 0) return

    const mode = formMode.value
    const currentFormData = toRaw(formData) as Partial<TCreateDTO | TUpdateDTO>

    await Promise.all(
      cascadeFields.map(async (field) => {
        if (!field.load) return
        try {
          fieldOptionsMap.value[field.key] = await field.load(mode, currentFormData)
        } catch {
          fieldOptionsMap.value[field.key] = []
        }
      }),
    )
  }

  // ==================== 核心方法 ====================

  const loadData = async (params: TQuery): Promise<void> => {
    try {
      loading.value = true

      if (mode === 'tree') {
        if (!api.list) {
          throw new Error('树形模式下必须提供 api.list')
        }
        const treeData = await api.list(params)
        dataList.value = treeData
        total.value = treeData.length
      } else {
        if (!api.list) {
          throw new Error('必须提供 api.list')
        }
        const res = await api.list(params)
        const pageResult = res as unknown as PageResult<TListVO>
        dataList.value = pageResult.records
        total.value = Number(pageResult.total)
        if (paginationRef) {
          paginationRef.itemCount = Number(pageResult.total)
        }
      }
    } catch (error) {
      logger.error('加载数据列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const loadDataList = async (): Promise<void> => {
    await loadData(queryParams.value)
  }

  loadDataListRef = loadDataList

  // ==================== CRUD 操作方法 ====================

  const handleAdd = async (): Promise<void> => {
    formMode.value = 'create'
    Object.keys(formData).forEach((key) => {
      delete formData[key as keyof typeof formData]
    })
    const defaultValues = typeof defaults?.create === 'function' ? defaults.create() : defaults?.create || {}
    Object.assign(formData, defaultValues)
    await loadFieldOptions()
    formVisible.value = true
  }

  const handleEdit = async (row: TListVO): Promise<void> => {
    try {
      formLoading.value = true
      const id = getRowId(row)

      if (!api.detail) {
        throw new Error('编辑功能需要配置 api.detail')
      }

      const detail = await api.detail(id)
      formMode.value = 'update'

      if (transformDetailToForm) {
        Object.assign(formData, transformDetailToForm(detail))
      } else {
        Object.assign(formData, detail as Partial<TUpdateDTO>)
      }

      await loadFieldOptions()

      setTimeout(() => {
        formVisible.value = true
      }, 10)
    } catch (error) {
      logger.error('获取详情失败:', error)
      message.error('获取详情失败')
    } finally {
      formLoading.value = false
    }
  }

  const handleView = async (row: TListVO): Promise<void> => {
    try {
      detailLoading.value = true
      const id = getRowId(row)

      if (!api.detail) {
        throw new Error('查看详情功能需要配置 api.detail')
      }

      const detail = await api.detail(id)
      Object.assign(detailData, detail)
      detailVisible.value = true
    } catch (error) {
      logger.error('获取详情失败:', error)
      message.error('获取详情失败')
    } finally {
      detailLoading.value = false
    }
  }

  const handleSubmit = async (data: Partial<TCreateDTO | TUpdateDTO>): Promise<boolean> => {
    try {
      formLoading.value = true

      const submitData = transformBeforeSubmit
        ? transformBeforeSubmit(data, formMode.value)
        : (data as TCreateDTO | TUpdateDTO)

      if (formMode.value === 'create') {
        if (!api.create) {
          throw new Error('新增功能需要配置 api.create')
        }
        await api.create(submitData as TCreateDTO)
        message.success('新增成功')
      } else {
        if (!api.update) {
          throw new Error('更新功能需要配置 api.update')
        }
        await api.update(submitData as TUpdateDTO)
        message.success('更新成功')
      }

      formVisible.value = false
      return true
    } catch (error) {
      const msg = formMode.value === 'create' ? '新增失败' : '更新失败'
      logger.error(msg, error)
      message.error(msg)
      throw error
    } finally {
      formLoading.value = false
    }
  }

  const handleDelete = async (row: TListVO, onSuccess?: () => void): Promise<void> => {
    try {
      const id = getRowId(row)
      const name = getRowName(row)

      await dialog.warning({
        title: '删除确认',
        content: `确定要删除 "${name}" 吗？此操作不可撤销。`,
        positiveText: '确定删除',
        negativeText: '取消',
        onPositiveClick: async () => {
          try {
            if (!api.delete) {
              throw new Error('删除功能需要配置 api.delete')
            }
            await api.delete(id)
            message.success(`删除 ${name} 成功`)
            onSuccess?.()
          } catch (error) {
            logger.error('删除失败:', error)
            message.error('删除失败')
          }
        },
      })
    } catch {
      // dialog.warning 可能抛出异常
    }
  }

  const handleBatchDelete = async (ids: Array<string | number>, onSuccess?: () => void): Promise<void> => {
    const batchDeleteApi = api.batchDelete
    if (!batchDeleteApi) {
      message.warning('未配置批量删除 API')
      return
    }

    if (ids.length === 0) {
      message.warning('请先选择要删除的数据')
      return
    }

    try {
      const count = ids.length
      await dialog.warning({
        title: '批量删除确认',
        content: `确定要删除选中的 ${count} 条数据吗？此操作不可撤销。`,
        positiveText: '确定删除',
        negativeText: '取消',
        onPositiveClick: async () => {
          try {
            await batchDeleteApi(ids)
            message.success(`成功删除 ${count} 条数据`)
            onSuccess?.()
          } catch (error) {
            logger.error('批量删除失败:', error)
            message.error('批量删除失败')
          }
        },
      })
    } catch {
      // dialog.warning 可能抛出异常
    }
  }

  // ==================== 表单辅助方法 ====================

  const handleCancel = (): void => {
    formVisible.value = false
  }

  const handleFormDataUpdate = (data: Partial<TCreateDTO | TUpdateDTO>): void => {
    Object.assign(formData, data)
  }

  // ==================== 表格辅助方法 ====================

  const handleCheck = (keys: Array<string | number>): void => {
    checkedRowKeys.value = keys
  }

  const handleDeleteForTable = (row: TListVO) => {
    handleDelete(row, () => {
      loadDataListRef()
    })
  }

  // ==================== 计算属性 ====================

  // 生成表格列配置
  const tableColumns = computed(() => {
    const cols: TableColumnConfig<TListVO>[] = flatColumns.map((col) => {
      const column: TableColumnConfig<TListVO> = {
        title: col.title,
        key: col.key as string,
        width: col.width,
      }

      if (typeof col.render === 'function') {
        column.render = col.render
      } else if (col.render === 'status') {
        column.render = renderStatusTag(col.options || [])
      }

      return column
    })

    return createTableColumns(
      { columns: cols, showSelection, showActions: flatRowActions !== undefined && flatRowActions.length > 0 },
      handleEdit,
      handleDeleteForTable,
      detail ? handleView : undefined,
      undefined,
    )
  })

  const columns = tableColumns

  const tableScrollWidth = computed(() => calculateTableScrollWidth(columns.value))

  // ==================== 通用工具方法 ====================

  const resetPaginationAndLoad = (): void => {
    if (paginationRef) {
      paginationRef.page = 1
    }
    loadDataList()
  }

  // ==================== 树形操作方法 ====================

  const getTreeConfig = () => ({
    childrenKey: tree?.childrenKey || 'children',
    defaultExpandAll: tree?.defaultExpandAll || false,
  })

  const collectExpandableKeys = (data: TListVO[], childrenKey: string): Array<string | number> => {
    const keys: Array<string | number> = []

    const traverse = (nodes: unknown[]): void => {
      nodes.forEach((node) => {
        const nodeData = node as TListVO
        const nodeDataRecord = nodeData as Record<string, unknown>
        const children = nodeDataRecord[childrenKey] as unknown[] | undefined

        if (children && Array.isArray(children) && children.length > 0) {
          const nodeId = typeof idKey === 'function' ? idKey(nodeData) : nodeDataRecord[idKey as string]
          keys.push(nodeId as string | number)
          traverse(children)
        }
      })
    }

    traverse(data)
    return keys
  }

  const expandAll = (): void => {
    if (mode !== 'tree') return
    const { childrenKey } = getTreeConfig()
    const data = dataList.value.map((item) => item) as TListVO[]
    expandedKeys.value = collectExpandableKeys(data, childrenKey)
  }

  const collapseAll = (): void => {
    expandedKeys.value = []
  }

  const toggleExpand = (): void => {
    expandedKeys.value.length > 0 ? collapseAll() : expandAll()
  }

  const isExpanded = computed(() => expandedKeys.value.length > 0)

  // ==================== 页面按钮处理 ====================

  const handlePageAction = (key: string): void => {
    switch (key) {
      case 'add':
        handleAdd()
        break
      case 'refresh':
        loadDataList()
        break
      case 'toggle-expand':
        toggleExpand()
        break
      default:
        console.warn(`未定义的按钮 action: ${key}`)
    }
  }

  // ==================== 生成操作按钮 ====================

  const actionButtons = computed((): ActionButton[] => {
    const buttons: ActionButton[] = []

    if (flatActions) {
      flatActions.forEach((action) => {
        if (action === 'add') {
          buttons.push({
            key: 'add',
            text: '新增',
            type: 'primary',
            icon: PlusOutlined,
          })
        } else if (action === 'refresh') {
          buttons.push({
            key: 'refresh',
            text: '刷新',
            icon: SyncOutline,
          })
        } else if (action === 'toggle-expand') {
          buttons.push({
            key: 'toggle-expand',
            text: isExpanded.value ? '收起' : '展开',
            icon: isExpanded.value ? ChevronUpOutline : ChevronDownOutline,
          })
        } else if (typeof action === 'object') {
          buttons.push({
            key: action.key,
            text: action.text || action.key,
            type: (action.type || 'default') as 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default',
            icon: action.icon,
            permission: action.permission,
          })
        }
      })
    }

    return buttons
  })

  // ==================== 返回值 ====================

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
    pagination: paginationRef,
    columns,
    tableScrollWidth,
    queryParams,
    fieldOptionsMap,
    expandedKeys,
    isExpanded,

    // 核心方法
    loadDataList,

    // CRUD 操作方法
    handleAdd,
    handleEdit,
    handleView,
    handleSubmit,
    handleDelete,
    handleBatchDelete,

    // 辅助方法
    handleCancel,
    handleFormDataUpdate,
    handleCheck,
    resetPaginationAndLoad,
    handlePageAction,

    // 树形操作方法
    expandAll,
    collapseAll,
    toggleExpand,

    // 操作按钮
    actionButtons,
  }
}
