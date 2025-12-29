
// 表单验证规则
const createFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3-20个字符之间', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应在6-20个字符之间', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度应在2-20个字符之间', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  phoneNumber: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
}

const updateFormRules = {
  ...createFormRules,
  password: [
    { min: 6, max: 20, message: '密码长度应在6-20个字符之间', trigger: 'blur' },
  ],
}

/**
 * 根据模式生成用户表单配置（完全类型安全）
 * @param mode 表单模式：'create' | 'update'
 * @returns 类型安全的表单配置对象
 */
export function createUserFormConfig(mode: 'create' | 'update') {
  const isCreate = mode === 'create'
  const isUpdate = mode === 'update'

  return {
    title: isCreate ? '新增用户' : '编辑用户',
    submitText: '保存',
    gridCols: 24,
    fields: [
      // 编辑模式特有的userId字段
      ...(isUpdate
        ? [
            {
              key: 'userId',
              label: '用户ID',
              type: 'input' as const,
              disabled: true,
              span: 12,
            },
          ]
        : []),
      // 用户名字段
      {
        key: 'username',
        label: '用户名',
        type: 'input',
        required: true,
        placeholder: '请输入用户名',
        span: 12,
        disabled: isUpdate, // 编辑时不可修改用户名
      },
      // 密码字段
      {
        key: 'password',
        label: '密码',
        type: 'password',
        required: isCreate, // 新增时必填，编辑时可选
        placeholder: isCreate ? '请输入密码' : '留空表示不修改密码',
        span: 12,
      },
      // 昵称字段
      {
        key: 'nickname',
        label: '昵称',
        type: 'input',
        required: true,
        placeholder: '请输入昵称',
        span: 12,
      },
      // 邮箱字段
      {
        key: 'email',
        label: '邮箱',
        type: 'input',
        inputType: 'email',
        placeholder: '请输入邮箱地址',
        span: 12,
      },
      // 手机号字段
      {
        key: 'phoneNumber',
        label: '手机号',
        type: 'input',
        inputType: 'tel',
        placeholder: '请输入手机号码',
        span: 12,
      },
      // 性别字段
      {
        key: 'gender',
        label: '性别',
        type: 'radio',
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 2 },
        ],
        span: 12,
      },
      // 状态字段
      {
        key: 'status',
        label: '状态',
        type: 'radio',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
        required: true,
        span: 12,
      },
      // 部门字段
      {
        key: 'deptId',
        label: '所属部门',
        type: 'input',
        placeholder: '请输入所属部门',
        span: 24,
      },
    ],
    rules: isCreate ? createFormRules : updateFormRules,
  }
}
