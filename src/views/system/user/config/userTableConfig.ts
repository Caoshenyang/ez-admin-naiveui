/**
 * 用户管理页面配置
 *
 * 包含表格配置和操作按钮配置
 */

import type { UserListVO } from '@/types/modules/user'
import { type TableConfigOptions } from '@/hooks/types/table'
import type { ActionButton } from '@/components/common/EzButtonGroup.vue'
import { renderStatusTag } from '@/utils/icon'
import { SyncOutline, TrashOutline } from '@vicons/ionicons5'
import { PlusOutlined } from '@vicons/antd'

// 状态选项配置
export const statusOptions = [
  { label: '启用', value: 1, type: 'success' as const },
  { label: '禁用', value: 0, type: 'error' as const },
]

// 用户表格配置选项
export const userTableConfig: TableConfigOptions<UserListVO> = {
  columns: [
    { title: '用户名', key: 'username', width: 100 },
    { title: '昵称', key: 'nickname', width: 100 },
    { title: '邮箱', key: 'email', width: 180 },
    { title: '手机号', key: 'phoneNumber', width: 130 },
    { title: '状态', key: 'status', width: 80, render: renderStatusTag(statusOptions) },
    { title: '创建时间', key: 'createTime', width: 200 },
  ],
}

/**
 * 用户管理页面操作按钮配置
 * 每个按钮通过key唯一标识，父组件监听action事件进行处理
 */
export const userActionButtons: ActionButton[] = [
  { key: 'add', text: '新增', type: 'primary', icon: PlusOutlined, permission: 'sys:user:add' },
  { key: 'batch-delete', text: '批量删除', type: 'warning', icon: TrashOutline, permission: 'sys:user:delete' },
  { key: 'refresh', text: '刷新', icon: SyncOutline, permission: '' },
]
