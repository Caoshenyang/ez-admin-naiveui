import type { FormRules } from 'naive-ui'

/**
 * 创建密码确认验证器
 * @param getPassword 获取密码值的函数
 * @returns 验证规则
 */
export const createPasswordConfirmRule = (getPassword: () => string) => ({
  validator: (rule: unknown, value: string) => {
    const password = getPassword()
    if (value !== password) {
      return new Error('两次输入密码不一致')
    }
    return true
  },
  message: '两次输入密码不一致',
  trigger: ['blur', 'input'] as const
})

/**
 * 用户表单验证规则
 */
export const userFormRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: ['blur', 'input'] },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: ['blur', 'input'] },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: ['blur', 'input'] },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: ['blur', 'input'] },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: ['blur', 'input'] },
    {
      validator: (rule: unknown, value: string) => {
        // 这里需要通过表单上下文获取密码字段的值
        // 在实际使用时，这个验证器需要在表单组件中通过第二个参数获取表单数据
        const formData = (rule as { formData?: Record<string, unknown> }).formData || {}
        if (value !== formData.password) {
          return new Error('两次输入密码不一致')
        }
        return true
      },
      message: '两次输入密码不一致',
      trigger: ['blur', 'input']
    }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'input'] }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'input'] }
  ]
}

/**
 * 角色表单验证规则
 */
export const roleFormRules: FormRules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: ['blur', 'input'] },
    { min: 2, max: 20, message: '角色名称长度在 2 到 20 个字符', trigger: ['blur', 'input'] },
  ],
  roleKey: [
    { required: true, message: '请输入角色标识', trigger: ['blur', 'input'] },
    { pattern: /^[A-Z][A-Z0-9_]*$/, message: '角色标识必须以大写字母开头，只能包含大写字母、数字和下划线', trigger: ['blur', 'input'] },
  ],
  description: [
    { max: 200, message: '描述不能超过200个字符', trigger: ['blur', 'input'] }
  ]
}

/**
 * 部门表单验证规则
 */
export const departmentFormRules: FormRules = {
  departmentName: [
    { required: true, message: '请输入部门名称', trigger: ['blur', 'input'] },
    { min: 2, max: 50, message: '部门名称长度在 2 到 50 个字符', trigger: ['blur', 'input'] },
  ],
  departmentKey: [
    { required: true, message: '请输入部门标识', trigger: ['blur', 'input'] },
    { pattern: /^[A-Z][A-Z0-9_]*$/, message: '部门标识必须以大写字母开头，只能包含大写字母、数字和下划线', trigger: ['blur', 'input'] },
  ],
  leader: [
    { min: 2, max: 20, message: '负责人姓名长度在 2 到 20 个字符', trigger: ['blur', 'input'] }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'input'] }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'input'] }
  ]
}

/**
 * 字典类型表单验证规则
 */
export const dictTypeFormRules: FormRules = {
  dictName: [
    { required: true, message: '请输入字典名称', trigger: ['blur', 'input'] },
    { min: 2, max: 50, message: '字典名称长度在 2 到 50 个字符', trigger: ['blur', 'input'] },
  ],
  dictType: [
    { required: true, message: '请输入字典类型', trigger: ['blur', 'input'] },
    { pattern: /^[a-z][a-z0-9_]*$/, message: '字典类型必须以小写字母开头，只能包含小写字母、数字和下划线', trigger: ['blur', 'input'] },
  ],
  remark: [
    { max: 200, message: '备注不能超过200个字符', trigger: ['blur', 'input'] }
  ]
}

/**
 * 字典数据表单验证规则
 */
export const dictDataFormRules: FormRules = {
  dictType: [
    { required: true, message: '请选择字典类型', trigger: ['blur', 'change'] }
  ],
  dictLabel: [
    { required: true, message: '请输入字典标签', trigger: ['blur', 'input'] },
    { min: 1, max: 50, message: '字典标签长度在 1 到 50 个字符', trigger: ['blur', 'input'] },
  ],
  dictValue: [
    { required: true, message: '请输入字典键值', trigger: ['blur', 'input'] },
    { min: 1, max: 50, message: '字典键值长度在 1 到 50 个字符', trigger: ['blur', 'input'] },
  ],
  dictSort: [
    { type: 'number', min: 0, max: 999, message: '排序值必须在 0-999 之间', trigger: ['blur', 'input'] }
  ],
  remark: [
    { max: 200, message: '备注不能超过200个字符', trigger: ['blur', 'input'] }
  ]
}

/**
 * 文件上传验证规则
 */
export const fileFormRules: FormRules = {
  fileName: [
    { required: true, message: '请选择要上传的文件', trigger: ['blur', 'change'] }
  ]
}

/**
 * 通用验证规则生成器
 */
export const createRequiredRule = (fieldName: string, trigger: string[] = ['blur', 'input']) => ({
  required: true,
  message: `请输入${fieldName}`,
  trigger
})

export const createLengthRule = (min: number, max: number, trigger: string[] = ['blur', 'input']) => ({
  min,
  max,
  message: `长度在 ${min} 到 ${max} 个字符`,
  trigger
})

export const createPatternRule = (pattern: RegExp, message: string, trigger: string[] = ['blur', 'input']) => ({
  pattern,
  message,
  trigger
})
