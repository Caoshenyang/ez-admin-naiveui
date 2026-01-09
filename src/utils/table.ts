import type { DataTableColumns } from 'naive-ui'
import type { RowData } from 'naive-ui/es/data-table/src/interface'
import type { VNode } from 'vue'
import { TrashOutline, CreateOutline, EyeOutline } from '@vicons/ionicons5'
import { createButton, createButtonGroup } from '@/utils/renderers'
import type { TableConfigOptions, TableColumnConfig } from '@/hooks/types/table'

/**
 * 表格工具类
 * 用于创建和管理表格列配置
 */

/**
 * 计算表格总宽度
 * 遍历所有列，累加每列的宽度，用于设置表格的横向滚动宽度
 *
 * @param columns - 表格列配置数组
 * @returns 所有列的总宽度
 */
export function calculateTableScrollWidth<T extends RowData>(columns: DataTableColumns<T>): number {
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
export function createSelectionColumn() {
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
export function createDataColumns<T>(columnsConfig: TableColumnConfig<T>[]): DataTableColumns<T> {
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
export function createActionButtons<T extends RowData>(
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
export function createActionColumn<T extends RowData>(
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
export function createTableColumns<T extends RowData>(
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

