import type { ActionButton } from '@/components/common/ActionButtonGroup.vue'
import { SyncOutline, TrashOutline } from '@vicons/ionicons5'
import { DownloadOutlined, PlusOutlined } from '@vicons/antd'

/**
 * 用户管理页面按钮配置
 * 直接在用户模块配置，简单明了
 */
export const userActionButtons: ActionButton[] = [
  {
    key: 'add',
    text: '新增',
    type: 'primary',
    icon: PlusOutlined,
    permission: 'sys:user:add',
    onClick: () => {}, // 运行时会被替换
  },
  {
    key: 'batch-delete',
    text: '批量删除',
    type: 'warning',
    icon: TrashOutline,
    permission: 'sys:user:delete',
    onClick: () => {}, // 运行时会被替换
  },
  {
    key: 'export',
    text: '导出',
    type: 'info',
    icon: DownloadOutlined,
    permission: 'sys:user:export',
    onClick: () => {}, // 运行时会被替换
  },
  {
    key: 'refresh',
    text: '刷新',
    icon: SyncOutline,
    permission: '', // 刷新不需要权限
    onClick: () => {}, // 运行时会被替换
  },
]

/**
 * 创建用户按钮配置，注入处理函数
 * @param handlers 按钮点击处理函数
 * @returns 完整的按钮配置数组
 */
export function createUserActionButtons(handlers: {
  handleAdd: () => void
  handleBatchDelete: () => void
  handleExport: () => void
  handleRefresh: () => void
}): ActionButton[] {
  // 按钮key到处理函数名的映射
  const keyToHandlerMap: Record<string, keyof typeof handlers> = {
    'add': 'handleAdd',
    'batch-delete': 'handleBatchDelete',
    'export': 'handleExport',
    'refresh': 'handleRefresh',
  }

  return userActionButtons.map(button => ({
    ...button,
    onClick: handlers[keyToHandlerMap[button.key]!] || (() => {}),
  }))
}
