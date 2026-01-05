/**
 * 用户管理配置
 *
 * 统一导出所有用户相关的配置项
 */
import type { UserCrudConfig } from '@/types'
import type { FormConfig } from '@/components/common/EzForm.vue'
import type { FormRules } from 'naive-ui'
import type { UserCreateDTO, UserUpdateDTO, UserListVO } from '@/types'
import { type TableConfigOptions } from '@/hooks/types/table'
import type { ActionButton } from '@/components/common/EzButtonGroup.vue'
import { userApi } from '@/api/user'
import { renderTag, renderStatusTag } from '@/utils/renderers'
import { SyncOutline, TrashOutline } from '@vicons/ionicons5'
import { PlusOutlined } from '@vicons/antd'
import type { DetailModalConfig } from '@/hooks/types/table'

// === 基础选项配置 ===
// 这些选项被表单和表格共同使用，确保数据一致性
const genderOptions = [
  { label: '男', value: 1 },
  { label: '女', value: 2 },
]

const statusOptions = [
  { label: '启用', value: 1, type: 'success' as const },
  { label: '禁用', value: 0, type: 'error' as const },
]

// === 表单验证规则配置 ===
// 定义所有表单字段的验证规则，新增和编辑共用
const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3-20个字符之间', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  password: [{ min: 6, max: 20, message: '密码长度应在6-20个字符之间', trigger: 'blur' }],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度应在2-20个字符之间', trigger: 'blur' },
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
  phoneNumber: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
}

// === 表单配置 ===
// 用户表单的基础配置，包含所有字段定义和验证规则
// 注意：具体的字段差异（如必填、禁用状态）在组件中使用时动态调整
export const userFormConfig: FormConfig<UserCreateDTO | UserUpdateDTO> = {
  title: '用户表单',
  gridCols: 24,
  fields: [
    { key: 'username', label: '用户名', type: 'input', required: true, placeholder: '请输入用户名', span: 12 },
    { key: 'password', label: '密码', type: 'password', placeholder: '请输入密码', span: 12 },
    { key: 'nickname', label: '昵称', type: 'input', required: true, placeholder: '请输入昵称', span: 12 },
    { key: 'email', label: '邮箱', type: 'input', inputType: 'email', placeholder: '请输入邮箱地址', span: 12 },
    { key: 'phoneNumber', label: '手机号', type: 'input', inputType: 'tel', placeholder: '请输入手机号码', span: 12 },
    { key: 'gender', label: '性别', type: 'radio', options: genderOptions, span: 12 },
    { key: 'status', label: '状态', type: 'radio', options: statusOptions, required: true, span: 12 },
    { key: 'deptId', label: '所属部门', type: 'input', placeholder: '请输入所属部门', span: 24 },
  ],
  // 表单验证规则
  rules: formRules,
}

// === 表格配置 ===
// 用户列表表格的列定义和显示配置
export const userTableConfig: TableConfigOptions<UserListVO> = {
  columns: [
    { title: '用户名', key: 'username', width: 100 },
    { title: '昵称', key: 'nickname', width: 100 },
    { title: '邮箱', key: 'email', width: 180 },
    { title: '手机号', key: 'phoneNumber', width: 130 },
    { title: '状态', key: 'status', width: 80, render: renderStatusTag(statusOptions) },
    { title: '创建时间', key: 'createTime', width: 200 },
  ],
  // 操作按钮配置
  actionButtons: {
    view: true,
    edit: true,
    delete: true,
  },
  // 增加操作列宽度以容纳查看按钮
  actionWidth: 180,
}

// === 操作按钮配置 ===
// 页面顶部操作按钮的定义，每个按钮通过key唯一标识
export const userActionButtons: ActionButton[] = [
  { key: 'add', text: '新增', type: 'primary', icon: PlusOutlined, permission: 'sys:user:add' },
  { key: 'batch-delete', text: '批量删除', type: 'warning', icon: TrashOutline, permission: 'sys:user:delete' },
  { key: 'refresh', text: '刷新', icon: SyncOutline, permission: '' },
]

// === 详情配置 ===
export const userDetailConfig: DetailModalConfig = {
  title: (data) => `用户详情 - ${data.username || ''}`,
  column: 2,
  fields: [
    { key: 'username', label: '用户名' },
    { key: 'nickname', label: '昵称' },
    { key: 'email', label: '邮箱' },
    { key: 'phoneNumber', label: '手机号' },
    {
      key: 'gender',
      label: '性别',
      format: (value) => (value === 1 ? '男' : value === 2 ? '女' : '-'),
    },
    {
      key: 'status',
      label: '状态',
      render: (value) => {
        const statusOptions = [
          { label: '启用', value: 1, type: 'success' as const },
          { label: '禁用', value: 0, type: 'error' as const },
        ]
        const option = statusOptions.find((opt) => opt.value === value)
        return option ? renderTag(option.label, { type: option.type })() : '-'
      },
    },
    { key: 'deptId', label: '所属部门' },
    { key: 'createTime', label: '创建时间' },
  ],
}

// === CRUD 配置 ===
// 用户管理 CRUD 配置，约定：只配置业务相关的动态值，通用逻辑由 hooks 处理
export const userCrudConfig: UserCrudConfig = {
  // 表格配置
  tableConfig: userTableConfig,
  // 详情配置
  detailConfig: userDetailConfig,
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
