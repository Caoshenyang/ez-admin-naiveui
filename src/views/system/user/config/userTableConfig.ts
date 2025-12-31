import type { UserListVO } from '@/types/modules/user'
import { type TableConfigOptions } from '@/hooks/types/table'
import { renderStatusTag } from '@/utils/icon'

// 状态选项配置
export const statusOptions = [
  { label: '启用', value: 1, type: 'success' as const },
  { label: '禁用', value: 0, type: 'error' as const },
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
      render: renderStatusTag(statusOptions),
    },
    {
      title: '创建时间',
      key: 'createTime',
      width: 200,
    },
  ],
}
