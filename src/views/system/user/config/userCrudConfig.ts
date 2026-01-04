/**
 * 用户管理 CRUD 配置
 * 约定：只配置业务相关的动态值，通用逻辑由 hooks 处理
 */
import type { UserCrudConfig } from '@/types'
import { userApi } from '@/api/user'
import { userTableConfig } from './userConfig'

/**
 * 用户管理 CRUD 配置
 */
export const userCrudConfig: UserCrudConfig = {
  // 表格配置
  tableConfig: userTableConfig,
  // API配置
  pageApi: userApi.page,
  detailApi: userApi.detail,
  createApi: userApi.create,
  updateApi: userApi.update,
  removeApi: userApi.remove,
  batchRemoveApi: userApi.batchRemove,

  // 主键字段
  idKey: 'userId' as const,

  // 显示名称字段（用于删除确认等）
  nameKey: 'username' as const,

  // 新增表单默认值
  createDefaultValues: {
    status: 1, // 默认启用
    gender: 1, // 默认男
  },
}
