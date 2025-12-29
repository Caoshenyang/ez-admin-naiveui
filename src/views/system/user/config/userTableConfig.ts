import { h } from 'vue'
import { NTag } from 'naive-ui'
import type { UserListVO } from '@/types/modules/user'
import { type TableConfigOptions, type TableColumnConfig } from '@/hooks/types/table'

// 状态选项类型
export interface StatusOption {
  label: string
  value: number | string
  type?: 'success' | 'error' | 'warning' | 'info' | 'default'
}

// 状态渲染辅助函数
export function createStatusColumn<T>(
  options: StatusOption[],
  statusKey: keyof T = 'status' as keyof T
): TableColumnConfig<T>['render'] {
  return (row: T) => {
    const statusValue = row[statusKey] as number | string
    const option = options.find((opt) => opt.value === statusValue)
    return h(
      NTag,
      {
        type: option?.type || (statusValue === 1 ? 'success' : 'error'),
      },
      {
        default: () => option?.label || '未知',
      },
    )
  }
}

// 状态选项（保持向后兼容）
export const statusOptions: StatusOption[] = [
  { label: '启用', value: 1, type: 'success' },
  { label: '禁用', value: 0, type: 'error' },
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
      render: createStatusColumn(statusOptions, 'status'),
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
