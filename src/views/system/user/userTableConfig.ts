import { h, reactive } from 'vue'
import { NButton, NIcon, NTag, type DataTableColumns } from 'naive-ui'
import type { UserListVO } from '@/types/modules/user'
import { TrashOutline, CreateOutline } from '@vicons/ionicons5'

// 状态选项
export const statusOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
]

// 创建分页配置
export function createPagination(reloadCallback?: () => void) {
  const paginationConfig = reactive({
    page: 1,
    pageSize: 1,
    showSizePicker: true,
    showQuickJumper: true,
    pageSizes: [1, 15, 30],
    itemCount: 0,
    prefix: (info: { itemCount: number | undefined }) => {
      return info.itemCount ? `共 ${info.itemCount} 条` : ''
    },
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

// 计算表格总宽度
export function calculateTableScrollWidth(columns: DataTableColumns<UserListVO>): number {
  return columns.reduce((total, col) => {
    // 选择列默认宽度
    if (col.type === 'selection') {
      return total + 50
    }
    // 其他列使用设置的宽度，确保转换为数字类型
    return total + Number(col.width || 0)
  }, 0)
}

// 生成表格列配置
export function createUserTableColumns(
  handleEdit?: (row: UserListVO) => void,
  handleDelete?: (row: UserListVO) => void,
): DataTableColumns<UserListVO> {
  return [
    {
      type: 'selection',
    },
    {
      title: '用户名',
      key: 'username',
      width: 100,
    },
    {
      title: '昵称',
      key: 'nickname',
      width: 100,
    },
    {
      title: '邮箱',
      key: 'email',
      width: 180,
      ellipsis: false,
      cellProps: () => ({
        style: 'white-space: nowrap;',
      }),
    },
    {
      title: '手机号',
      key: 'phoneNumber',
      width: 130,
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
      render: (row: UserListVO) => {
        const status = statusOptions.find((option) => option.value === row.status)
        return h(
          NTag,
          {
            type: row.status === 1 ? 'success' : 'error',
          },
          {
            default: () => status?.label || '未知',
          },
        )
      },
    },
    {
      title: '创建时间',
      key: 'createTime',
      width: 200,
      ellipsis: false,
      cellProps: () => ({
        style: 'white-space: nowrap;',
      }),
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      fixed: 'right',
      render(row) {
        return h('div', { style: { display: 'flex', gap: '8px' } }, [
          h(
            NButton,
            {
              type: 'primary',
              tertiary: true,
              onClick: () => handleEdit?.(row),
            },
            {
              default: () => h(NIcon, { size: 20 }, { default: () => h(CreateOutline) }),
            },
          ),
          h(
            NButton,
            {
              type: 'error',
              tertiary: true,
              onClick: () => handleDelete?.(row),
            },
            {
              default: () => h(NIcon, { size: 20 }, { default: () => h(TrashOutline) }),
            },
          ),
        ])
      },
    },
  ]
}
