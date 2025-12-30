import type { ActionButton } from '@/components/common/ActionButtonGroup.vue'
import { SyncOutline, TrashOutline } from '@vicons/ionicons5'
import { PlusOutlined } from '@vicons/antd'

/**
 * 用户管理页面按钮配置
 * 约定：onClick 在页面中运行时注入
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
    key: 'refresh',
    text: '刷新',
    icon: SyncOutline,
    permission: '', // 刷新不需要权限
    onClick: () => {}, // 运行时会被替换
  }
]
