import { h } from 'vue'
import { NTag } from 'naive-ui'
import type { UserListVO } from '@/types/modules/user'
import { createTableColumns, type TableConfigOptions } from '@/hooks/useTableConfig'

// 状态选项（保持向后兼容）
export const statusOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
]

// 用户表格配置选项
export const userTableConfig: TableConfigOptions<UserListVO> = {
  columns: [
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
          }
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
  ],
}

// 生成用户表格列配置（保持向后兼容）
export function createUserTableColumns(
  handleEdit?: (row: UserListVO) => void,
  handleDelete?: (row: UserListVO) => void,
) {
  return createTableColumns(userTableConfig, handleEdit, handleDelete)
}
