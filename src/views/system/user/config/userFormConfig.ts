import type { FormConfig } from '@/components/common/EzForm.vue'
import type { FormRules } from 'naive-ui'
import type { UserCreateDTO, UserUpdateDTO } from '@/types'

// 表单验证规则（新增和编辑使用相同的规则）
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

/**
 * 用户表单配置常量
 * 基于基础字段配置，通过模式差异化处理，避免重复代码
 */
// 性别选项
const genderOptions = [
  { label: '男', value: 1 },
  { label: '女', value: 2 },
]
// 状态选项
const statusOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
]

// 基础字段配置（共同的部分）
/* prettier-ignore */
const baseFields = [
  { key: 'username' as const, label: '用户名', type: 'input' as const, required: true, placeholder: '请输入用户名', span: 12 },
  { key: 'password' as const, label: '密码', type: 'password' as const, placeholder: '请输入密码', span: 12 },
  { key: 'nickname' as const, label: '昵称', type: 'input' as const, required: true, placeholder: '请输入昵称', span: 12 },
  { key: 'email' as const, label: '邮箱', type: 'input' as const, inputType: 'email' as const, placeholder: '请输入邮箱地址', span: 12 },
  { key: 'phoneNumber' as const, label: '手机号', type: 'input' as const, inputType: 'tel' as const, placeholder: '请输入手机号码', span: 12 },
  { key: 'gender' as const, label: '性别', type: 'radio' as const, options: genderOptions, span: 12 },
  { key: 'status' as const, label: '状态', type: 'radio' as const, options: statusOptions, required: true, span: 12 },
  { key: 'deptId' as const, label: '所属部门', type: 'input' as const, placeholder: '请输入所属部门', span: 24 },
]

// 表单基础配置
const baseFormConfig = {
  submitText: '保存' as const,
  gridCols: 24 as const,
  rules: formRules,
}

/**
 * 用户表单配置类型
 */
export type UserFormConfigType = {
  create: FormConfig<UserCreateDTO>
  update: FormConfig<UserUpdateDTO>
}

/**
 * 用户表单配置
 * 统一配置形式，与其他配置保持一致
 */
export const userFormConfig: UserFormConfigType = {
  create: {
    ...baseFormConfig,
    title: '新增用户',
    fields: baseFields.map((field) =>
      field.key === 'password'
        ? { ...field, required: true }
        : field
    ),
  },

  update: {
    ...baseFormConfig,
    title: '编辑用户',
    fields: baseFields.map((field) => {
      switch (field.key) {
        case 'username':
          return { ...field, disabled: true }
        case 'password':
          return { ...field, required: false, placeholder: '留空表示不修改密码' }
        default:
          return field
      }
    }),
  },
}
