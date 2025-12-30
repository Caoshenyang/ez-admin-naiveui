/**
 * 用户管理页面按钮配置
 *
 * 设计思路：
 * - 通过ActionButtonGroup组件的action事件触发
 * - 父组件根据key处理具体的业务逻辑
 * - 权限控制通过permission字段实现
 */

import type { ActionButton } from '@/components/common/ActionButtonGroup.vue'
import { SyncOutline, TrashOutline } from '@vicons/ionicons5'
import { PlusOutlined } from '@vicons/antd'

/**
 * 用户管理页面操作按钮配置
 * 每个按钮通过key唯一标识，父组件监听action事件进行处理
 */
export const userActionButtons: ActionButton[] = [
  {
    key: 'add',                    // 新增按钮标识
    text: '新增',                  // 按钮显示文本
    type: 'primary',              // 主要按钮样式
    icon: PlusOutlined,           // 新增图标
    permission: 'sys:user:add',   // 需要的权限标识
  },
  {
    key: 'batch-delete',          // 批量删除按钮标识
    text: '批量删除',              // 按钮显示文本
    type: 'warning',              // 警告按钮样式
    icon: TrashOutline,           // 删除图标
    permission: 'sys:user:delete', // 需要的权限标识
  },
  {
    key: 'refresh',               // 刷新按钮标识
    text: '刷新',                  // 按钮显示文本
    icon: SyncOutline,            // 刷新图标
    permission: '',               // 空字符串表示不需要权限验证，始终显示
  }
]
