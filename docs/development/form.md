# 表单配置指南

EzForm 组件支持丰富的表单配置，包括多种字段类型、验证规则、布局控制等。

## 表单配置结构

```typescript
export interface FormConfig<T = any> {
  title: string                    // 表单标题
  gridCols?: number               // 栅格列数，默认24
  fields: FormField<T>[]          // 表单字段配置数组
  rules?: FormRules               // 表单验证规则
  labelWidth?: number             // 标签宽度，默认80
  labelAlign?: 'left' | 'right'   // 标签对齐方式，默认'right'
  labelPlacement?: 'left' | 'top' // 标签位置，默认'left'
}
```

## 字段配置

### 基础字段属性

```typescript
export interface FormField<T = any> {
  key: keyof T                    // 字段键，与数据对象属性对应
  label: string                   // 字段标签
  type: FormFieldType            // 字段类型
  required?: boolean             // 是否必填，会自动添加红色星号
  disabled?: boolean             // 是否禁用
  placeholder?: string           // 占位符文本
  span?: number                  // 栅格跨度，默认24（占满一行）
  offset?: number                // 栅格偏移
  tooltip?: string               // 提示信息，会显示问号图标
  help?: string                  // 帮助文本，显示在字段下方
}
```

### 字段类型

#### 文本输入框 (input)

```typescript
{
  key: 'username',
  label: '用户名',
  type: 'input',
  required: true,
  placeholder: '请输入用户名',
  span: 12,
  inputType: 'text',  // 可选: text, email, tel, url, password
  minlength: 3,       // 最小长度
  maxlength: 20,      // 最大长度
  showCount: true,    // 显示字符计数
}
```

#### 密码输入框 (password)

```typescript
{
  key: 'password',
  label: '密码',
  type: 'password',
  required: true,
  placeholder: '请输入密码',
  span: 12,
  minlength: 6,
  maxlength: 20,
  showPasswordToggle: true,  // 显示密码切换按钮
}
```

#### 数字输入框 (number)

```typescript
{
  key: 'age',
  label: '年龄',
  type: 'number',
  placeholder: '请输入年龄',
  span: 12,
  min: 0,           // 最小值
  max: 120,         // 最大值
  step: 1,          // 步长
  precision: 0,     // 小数位数
}
```

#### 文本域 (textarea)

```typescript
{
  key: 'description',
  label: '描述',
  type: 'textarea',
  placeholder: '请输入描述',
  span: 24,
  rows: 4,          // 显示行数
  minlength: 10,
  maxlength: 500,
  showCount: true,
  autosize: true,   // 自适应高度
}
```

#### 下拉选择 (select)

```typescript
{
  key: 'status',
  label: '状态',
  type: 'select',
  required: true,
  placeholder: '请选择状态',
  span: 12,
  options: [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 },
  ],
  multiple: false,     // 是否多选
  filterable: true,    // 是否可搜索
  clearable: true,     // 是否可清空
}
```

#### 单选框 (radio)

```typescript
{
  key: 'gender',
  label: '性别',
  type: 'radio',
  placeholder: '请选择性别',
  span: 12,
  options: [
    { label: '男', value: 1 },
    { label: '女', value: 2 },
  ],
}
```

#### 复选框 (checkbox)

```typescript
{
  key: 'hobbies',
  label: '兴趣爱好',
  type: 'checkbox',
  span: 24,
  options: [
    { label: '阅读', value: 'reading' },
    { label: '运动', value: 'sports' },
    { label: '音乐', value: 'music' },
  ],
  min: 1,    // 最少选择项
  max: 3,    // 最多选择项
}
```

#### 开关 (switch)

```typescript
{
  key: 'enabled',
  label: '启用',
  type: 'switch',
  span: 12,
  checkedValue: 1,     // 选中时的值
  uncheckedValue: 0,   // 未选中时的值
}
```

#### 日期选择 (date)

```typescript
{
  key: 'birthday',
  label: '生日',
  type: 'date',
  placeholder: '请选择生日',
  span: 12,
  format: 'yyyy-MM-dd',    // 显示格式
  valueFormat: 'yyyy-MM-dd', // 值格式
  clearable: true,
}
```

#### 日期时间选择 (datetime)

```typescript
{
  key: 'createTime',
  label: '创建时间',
  type: 'datetime',
  placeholder: '请选择创建时间',
  span: 12,
  format: 'yyyy-MM-dd HH:mm:ss',
  valueFormat: 'yyyy-MM-dd HH:mm:ss',
  clearable: true,
}
```

#### 级联选择 (cascader)

```typescript
{
  key: 'region',
  label: '地区',
  type: 'cascader',
  placeholder: '请选择地区',
  span: 12,
  options: [
    {
      label: '北京',
      value: 'beijing',
      children: [
        { label: '朝阳区', value: 'chaoyang' },
        { label: '海淀区', value: 'haidian' },
      ],
    },
  ],
  filterable: true,
  clearable: true,
}
```

#### 文件上传 (upload)

```typescript
{
  key: 'avatar',
  label: '头像',
  type: 'upload',
  span: 24,
  accept: 'image/*',        // 接受的文件类型
  maxSize: 2 * 1024 * 1024, // 最大文件大小（字节）
  maxCount: 1,              // 最大文件数量
  listType: 'image-card',   // 列表类型
  action: '/api/upload',    // 上传地址
}
```

## 表单验证

### 验证规则配置

```typescript
const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3-20个字符之间', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应在6-20个字符之间', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  phoneNumber: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  age: [
    { type: 'number', min: 0, max: 120, message: '年龄应在0-120之间', trigger: 'blur' },
  ],
}
```

### 内置验证规则

- `required`: 必填验证
- `type`: 数据类型验证 (`string`, `number`, `boolean`, `email`, `url`)
- `min` / `max`: 长度或数值范围验证
- `pattern`: 正则表达式验证
- `validator`: 自定义验证函数

### 自定义验证

```typescript
{
  key: 'confirmPassword',
  label: '确认密码',
  type: 'password',
  required: true,
  placeholder: '请再次输入密码',
}

// 在 rules 中添加自定义验证
confirmPassword: [
  { required: true, message: '请确认密码', trigger: 'blur' },
  {
    validator: (rule, value, callback) => {
      if (value !== formData.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }
]
```

## 布局控制

### 栅格布局

```typescript
{
  title: '用户表单',
  gridCols: 24,  // 总共24列
  fields: [
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      span: 12,   // 占12列（一半宽度）
    },
    {
      key: 'email',
      label: '邮箱',
      type: 'input',
      span: 12,   // 占12列（一半宽度）
    },
    {
      key: 'description',
      label: '描述',
      type: 'textarea',
      span: 24,   // 占24列（全宽度）
    },
  ]
}
```

### 响应式布局

```typescript
{
  key: 'content',
  label: '内容',
  type: 'textarea',
  span: 24,
  // 响应式跨度
  xs: 24,  // 超小屏幕全宽
  sm: 24,  // 小屏幕全宽
  md: 12,  // 中屏幕一半宽
  lg: 12,  // 大屏幕一半宽
  xl: 8,   // 超大屏幕1/3宽
}
```

### 字段分组

```typescript
{
  title: '高级配置',
  fields: [
    // 基本信息组
    { /* 基本信息字段 */ },
    // 分组分隔符（空字段实现）
    { type: 'divider', title: '权限配置' },
    // 权限配置组
    { /* 权限相关字段 */ },
  ]
}
```

## 动态表单

### 条件显示

```typescript
{
  key: 'userType',
  label: '用户类型',
  type: 'select',
  options: [
    { label: '普通用户', value: 'normal' },
    { label: '管理员', value: 'admin' },
  ],
},
{
  key: 'adminLevel',
  label: '管理员等级',
  type: 'select',
  // 仅在用户类型为管理员时显示
  visible: (formData) => formData.userType === 'admin',
  options: [
    { label: '初级', value: 1 },
    { label: '中级', value: 2 },
    { label: '高级', value: 3 },
  ],
}
```

### 动态选项

```typescript
{
  key: 'province',
  label: '省份',
  type: 'select',
  options: provinceOptions,
},
{
  key: 'city',
  label: '城市',
  type: 'select',
  // 根据省份动态加载城市选项
  options: (formData) => getCityOptions(formData.province),
}
```

### 字段联动

```typescript
{
  key: 'country',
  label: '国家',
  type: 'select',
  options: countryOptions,
  onChange: (value, formData, setFieldValue) => {
    // 切换国家时清空省份和城市
    setFieldValue('province', null)
    setFieldValue('city', null)
  }
}
```

## 高级配置

### 自定义渲染

```typescript
{
  key: 'customField',
  label: '自定义字段',
  type: 'custom',
  render: (h, { model, field, formData }) => {
    return h('div', { class: 'custom-field' }, [
      h('span', '自定义内容'),
      h('input', {
        value: model[field.key],
        onInput: (e) => model[field.key] = e.target.value
      })
    ])
  }
}
```

### 异步验证

```typescript
{
  key: 'username',
  label: '用户名',
  type: 'input',
  rules: [
    {
      validator: async (rule, value) => {
        if (!value) return
        const exists = await checkUsernameExists(value)
        if (exists) {
          throw new Error('用户名已存在')
        }
      },
      trigger: 'blur'
    }
  ]
}
```

## 使用示例

```vue
<template>
  <EzForm
    v-model="formVisible"
    :config="formConfig"
    :loading="formLoading"
    :form-data="formData"
    @update:form-data="handleFormDataUpdate"
    @submit="handleFormSubmit"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import EzForm from '@/components/common/EzForm.vue'
import type { UserCreateDTO } from '@/types'

// 表单数据
const formData = ref<Partial<UserCreateDTO>>({})

// 表单配置
const formConfig = computed(() => ({
  title: '新增用户',
  gridCols: 24,
  fields: [
    {
      key: 'username',
      label: '用户名',
      type: 'input' as const,
      required: true,
      placeholder: '请输入用户名',
      span: 12,
    },
    {
      key: 'password',
      label: '密码',
      type: 'password' as const,
      required: true,
      placeholder: '请输入密码',
      span: 12,
    },
    {
      key: 'email',
      label: '邮箱',
      type: 'input' as const,
      inputType: 'email',
      placeholder: '请输入邮箱地址',
      span: 12,
    },
    {
      key: 'phoneNumber',
      label: '手机号',
      type: 'input' as const,
      inputType: 'tel',
      placeholder: '请输入手机号码',
      span: 12,
    },
    {
      key: 'gender',
      label: '性别',
      type: 'radio' as const,
      options: [
        { label: '男', value: 1 },
        { label: '女', value: 2 },
      ],
      span: 12,
    },
    {
      key: 'status',
      label: '状态',
      type: 'radio' as const,
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
      required: true,
      span: 12,
    },
  ],
  rules: {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '用户名长度应在3-20个字符之间', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度应在6-20个字符之间', trigger: 'blur' },
    ],
    email: [
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
    phoneNumber: [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
    ],
  },
}))
</script>
```

## 注意事项

1. **类型安全**: 为表单数据定义明确的 TypeScript 类型
2. **性能优化**: 大表单建议使用 `computed` 缓存配置
3. **验证时机**: 合理设置验证触发时机 (`blur`, `change`, `input`)
4. **用户体验**: 为复杂字段提供适当的占位符和帮助信息
5. **响应式**: 考虑不同屏幕尺寸下的布局适配
6. **可访问性**: 为表单字段提供适当的标签和描述
