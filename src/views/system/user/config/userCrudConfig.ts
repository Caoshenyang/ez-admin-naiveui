/**
 * 用户管理 CRUD 配置
 * 约定：只配置业务相关的动态值，通用逻辑由 hooks 处理
 */
import type { UserQuery, UserCreateDTO, UserUpdateDTO, UserDetailVO, UserListVO } from '@/types'
import { userApi } from '@/api/user'
import { userTableConfig } from './userConfig'

/**
 * 用户管理 CRUD 配置
 */
export const userCrudConfig = {
  // 查询参数初始值
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    search: {
      keywords: '',
    },
  } as UserQuery,
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
  } as Partial<UserCreateDTO>,

  // 编辑时数据转换（处理密码字段）
  transformDetailToUpdate: (detail: UserDetailVO): Partial<UserUpdateDTO> => {
    return {
      userId: detail.userId,
      username: detail.username,
      password: '', // 编辑时密码字段为空，留空表示不修改
      nickname: detail.nickname,
      email: detail.email,
      phoneNumber: detail.phoneNumber,
      gender: detail.gender,
      status: detail.status,
      deptId: detail.deptId,
    }
  },

  // 提交前数据转换（处理密码字段：空密码则不提交）
  transformBeforeSubmit: (
    data: Partial<UserCreateDTO | UserUpdateDTO>,
    mode: 'create' | 'update',
  ): UserCreateDTO | UserUpdateDTO => {
    if (mode === 'update') {
      const updateData = data as UserUpdateDTO
      // 如果密码为空，删除密码字段（表示不修改密码）
      if (!updateData.password || updateData.password.trim() === '') {
        const { password, ...restData } = updateData
        return restData as UserUpdateDTO
      }
    }
    return data as UserCreateDTO | UserUpdateDTO
  },

  // 删除确认文案
  deleteConfirm: {
    title: '删除确认',
    content: (row: UserListVO) => `确定要删除用户 "${row.username}" 吗？此操作不可撤销。`,
    positiveText: '确定删除',
    negativeText: '取消',
  },

  // 批量删除确认文案
  batchDeleteConfirm: {
    title: '批量删除确认',
    content: (count: number) => `确定要删除选中的 ${count} 个用户吗？此操作不可撤销。`,
    positiveText: '确定删除',
    negativeText: '取消',
  },

  // 成功提示文案
  successMessage: {
    create: '新增用户成功',
    update: '编辑用户成功',
    delete: (name: string) => `删除用户 ${name} 成功`,
    batchDelete: (count: number) => `成功删除 ${count} 个用户`,
  } as const,

  // 错误提示文案
  errorMessage: {
    create: '新增用户失败',
    update: '编辑用户失败',
    delete: '删除用户失败',
    detail: '获取用户详情失败',
  },
}
