import type { FormConfig, FormField } from '@/components/common/EzForm.vue'
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
const baseFields : FormField<UserCreateDTO|UserUpdateDTO>[] = [
  { key: 'username', label: '用户名', type: 'input', required: true, placeholder: '请输入用户名', span: 12 },
  { key: 'password', label: '密码', type: 'password',  placeholder: '请输入密码', span: 12 },
  { key: 'nickname', label: '昵称', type: 'input', required: true, placeholder: '请输入昵称', span: 12 },
  { key: 'email', label: '邮箱', type: 'input', inputType: 'email', placeholder: '请输入邮箱地址', span: 12 },
  { key: 'phoneNumber', label: '手机号', type: 'input', inputType: 'tel', placeholder: '请输入手机号码', span: 12 },
  { key: 'gender', label: '性别', type: 'radio', options: genderOptions, span: 12 },
  { key: 'status', label: '状态', type: 'radio', options: statusOptions, required: true, span: 12 },
  { key: 'deptId', label: '所属部门', type: 'input', placeholder: '请输入所属部门', span: 24 },
]

/**
 * 用户表单配置
 * 根据模式动态生成配置，确保类型安全
 */
export const userFormConfig: FormConfig<UserCreateDTO | UserUpdateDTO> = {
  title: '用户表单',
  gridCols: 24,
  fields: baseFields,
  rules: formRules,
}
