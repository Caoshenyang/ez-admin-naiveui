# EzForm 表单组件使用指南

## 概述

EzForm 是基于 NaiveUI 的配置式表单封装组件，通过 JSON 配置即可生成完整的表单，支持多种表单项类型、表单验证、条件显示等功能。

## 特性

- 配置驱动，通过 JSON 配置生成表单
- 支持 16+ 种表单项类型
- 内置表单验证规则
- 支持条件显示/禁用
- 支持动态加载选项
- 支持响应式布局（1-6列）
- 完整的 TypeScript 类型支持
- 支持自定义插槽扩展

## 支持的表单项类型

| 类型 | 说明 | 配置示例 |
|------|------|----------|
| `input` | 文本输入框 | `{ field: 'username', label: '用户名', type: 'input' }` |
| `input-password` | 密码输入框 | `{ field: 'password', label: '密码', type: 'input-password' }` |
| `input-number` | 数字输入框 | `{ field: 'age', label: '年龄', type: 'input-number' }` |
| `select` | 下拉选择 | `{ field: 'gender', label: '性别', type: 'select', options: [...] }` |
| `multi-select` | 多选下拉 | `{ field: 'hobbies', label: '爱好', type: 'multi-select' }` |
| `date-picker` | 日期选择器 | `{ field: 'birthday', label: '生日', type: 'date-picker' }` |
| `date-range-picker` | 日期范围选择器 | `{ field: 'range', label: '日期范围', type: 'date-range-picker' }` |
| `datetime-picker` | 日期时间选择器 | `{ field: 'createdAt', label: '创建时间', type: 'datetime-picker' }` |
| `time-picker` | 时间选择器 | `{ field: 'workTime', label: '工作时间', type: 'time-picker' }` |
| `switch` | 开关 | `{ field: 'isActive', label: '是否激活', type: 'switch' }` |
| `radio` / `radio-group` | 单选组 | `{ field: 'status', label: '状态', type: 'radio-group' }` |
| `checkbox` | 单个复选框 | `{ field: 'agree', label: '同意协议', type: 'checkbox' }` |
| `checkbox-group` | 复选框组 | `{ field: 'permissions', label: '权限', type: 'checkbox-group' }` |
| `textarea` | 多行文本（使用 NInput 的 textarea 模式） | `{ field: 'remark', label: '备注', type: 'textarea' }` |
| `slider` | 滑块 | `{ field: 'score', label: '评分', type: 'slider' }` |
| `rate` | 评分组件 | `{ field: 'rating', label: '星级', type: 'rate' }` |
| `custom` | 自定义插槽 | `{ field: 'avatar', label: '头像', type: 'custom' }` |

## 基础用法

### 最简单的表单

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormOptions } from '@/types/form'

const formData = ref({})

const formOptions: FormOptions = {
  items: [
    {
      field: 'username',
      label: '用户名',
      type: 'input',
      placeholder: '请输入用户名',
      rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    },
    {
      field: 'password',
      label: '密码',
      type: 'input-password',
      rules: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    },
  ],
}

const handleSubmit = (values) => {
  console.log('表单数据：', values)
}
</script>

<template>
  <EzForm v-model="formData" :options="formOptions" @submit="handleSubmit" />
</template>
```

## 表单布局

### 响应式列布局

```typescript
const formOptions: FormOptions = {
  columns: 2,        // 2 列布局，可选 1 | 2 | 3 | 4 | 6
  gutter: 16,        // 列间距 16px
  items: [...]
}
```

### 自定义列宽

```typescript
{
  field: 'remark',
  label: '备注',
  type: 'textarea',
  span: 24,  // 占满整行（24 列系统）
}
```

### 表单全局配置

```typescript
const formOptions: FormOptions = {
  layout: 'horizontal',           // 布局方式: horizontal | vertical | inline
  labelWidth: 120,                // 标签宽度
  labelAlign: 'right',            // 标签对齐: left | center | right
  labelPlacement: 'left',         // 标签位置: left | top
  size: 'medium',                 // 尺寸: small | medium | large
  showLabel: true,                // 是否显示标签
  requireMarkPlacement: 'right',  // 必填标记位置: left | right | right-hanging
  showFeedback: true,             // 是否显示验证反馈
  columns: 2,                     // 列数
  gutter: 16,                     // 间距
  items: [...]
}
```

## 表单项配置

### 基础配置

```typescript
{
  field: 'username',        // 字段名（必填）
  label: '用户名',          // 标签文本（必填）
  type: 'input',            // 表单项类型（必填）
  placeholder: '请输入用户名',
  defaultValue: '',         // 默认值
  className: 'custom-class' // 自定义类名
}
```

### 选项配置

用于 `select`、`radio`、`checkbox` 等类型：

```typescript
{
  field: 'gender',
  label: '性别',
  type: 'select',
  options: [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
  ]
}
```

### 额外属性配置

通过 `props` 传递给 NaiveUI 组件的额外属性：

```typescript
{
  field: 'age',
  label: '年龄',
  type: 'input-number',
  props: {
    min: 0,
    max: 150,
    step: 1,
    precision: 0
  }
}
```

### 单项布局配置

```typescript
{
  field: 'email',
  label: '邮箱',
  type: 'input',
  itemProps: {
    labelWidth: 100,
    labelAlign: 'left',
    labelPlacement: 'top',
    showLabel: true,
    showFeedback: true,
    required: true
  }
}
```

## 表单验证

### 基础验证规则

```typescript
{
  field: 'email',
  label: '邮箱',
  type: 'input',
  rules: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' },
    { pattern: /^[a-z0-9]+$/, message: '只能包含小写字母和数字', trigger: 'blur' },
  ]
}
```

### 自定义验证函数

```typescript
{
  field: 'confirmPassword',
  label: '确认密码',
  type: 'input-password',
  rules: [
    {
      required: true,
      message: '请确认密码',
      trigger: 'blur',
    },
    {
      validator: (rule, value) => {
        if (value !== formData.value.password) {
          return new Error('两次输入的密码不一致')
        }
        return true
      },
      trigger: 'blur',
    },
  ]
}
```

## 条件显示与禁用

### 条件显示

只有满足条件时才显示表单项：

```typescript
{
  field: 'city',
  label: '城市',
  type: 'select',
  show: (values) => !!values.province,  // 只有选择了省份才显示
  options: [...]
}
```

### 条件禁用

根据条件禁用表单项：

```typescript
{
  field: 'phone',
  label: '手机号',
  type: 'input',
  disabled: (values) => !values.agree,  // 只有勾选了协议才启用
}
```

## 动态加载选项

### 异步加载选项

```typescript
{
  field: 'province',
  label: '省份',
  type: 'select',
  options: async () => {
    const response = await fetch('/api/provinces')
    return response.json()
  }
}
```

### 联动加载选项

```typescript
{
  field: 'city',
  label: '城市',
  type: 'select',
  show: (values) => !!values.province,
  options: async () => {
    const province = formValues.province
    if (!province) return []
    const response = await fetch(`/api/cities?province=${province}`)
    return response.json()
  }
}
```

## 自定义插槽

### 自定义表单项

```vue
<template>
  <EzForm v-model="formData" :options="formOptions">
    <!-- 自定义头像上传 -->
    <template #item-avatar="{ item, value, setValue }">
      <NFormItem label="头像" path="avatar">
        <NUpload
          :default-file-list="value ? [{ name: 'avatar', url: value }] : []"
          @finish="(data) => setValue(data.file.url)"
        >
          <NButton>选择头像</NButton>
        </NUpload>
      </NFormItem>
    </template>
  </EzForm>
</template>

<script setup lang="ts">
const formOptions: FormOptions = {
  items: [
    // ...
    {
      field: 'avatar',
      label: '头像',
      type: 'custom',  // 使用 custom 类型
    }
  ]
}
</script>
```

### 自定义操作按钮

```vue
<template>
  <EzForm v-model="formData" :options="formOptions">
    <template #actions="{ values, submit, reset }">
      <NSpace>
        <NButton type="primary" @click="submit">保存</NButton>
        <NButton @click="reset">重置</NButton>
        <NButton @click="handleCancel">取消</NButton>
      </NSpace>
    </template>
  </EzForm>
</template>
```

## 组件方法

### 通过 ref 调用方法

```vue
<script setup lang="ts">
const formRef = ref()

// 验证表单
const handleValidate = async () => {
  const valid = await formRef.value.validate()
  if (valid) {
    console.log('验证通过')
  }
}

// 获取表单数据
const getData = () => {
  const values = formRef.value.getValues()
  console.log('表单数据：', values)
}

// 设置表单数据
const setData = () => {
  formRef.value.setValues({ username: 'admin' })
}

// 设置单个字段值
const setField = () => {
  formRef.value.setFieldValue('username', 'admin')
}

// 获取单个字段值
const getField = () => {
  const value = formRef.value.getFieldValue('username')
  console.log('用户名：', value)
}

// 重置表单
const resetForm = () => {
  formRef.value.reset()
}

// 清除验证状态
const clearValidation = () => {
  formRef.value.restoreValidation()
}
</script>

<template>
  <EzForm ref="formRef" v-model="formData" :options="formOptions" />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| options | `FormOptions` | - | 表单配置（必填） |
| modelValue | `FormValues` | `{}` | 表单数据（v-model） |
| disabled | `boolean` | `false` | 是否禁用整个表单 |
| readonly | `boolean` | `false` | 是否只读模式 |
| loading | `boolean` | `false` | 加载状态 |
| submitText | `string` | `'提交'` | 提交按钮文本 |
| resetText | `string` | `'重置'` | 重置按钮文本 |
| showActions | `boolean` | `true` | 是否显示操作按钮 |
| actionAlign | `'left' \| 'center' \| 'right'` | `'left'` | 按钮对齐方式 |

## Events

| 事件 | 说明 | 回调参数 | 触发时机 |
|------|------|----------|----------|
| update:modelValue | 表单数据更新 | `(values: FormValues)` | 表单提交或重置时 |
| submit | 表单提交（验证通过后） | `(values: FormValues)` | 点击提交按钮且验证通过 |
| reset | 表单重置 | `(values: FormValues)` | 点击重置按钮 |
| validate | 表单验证通过 | `(values: FormValues)` | 表单验证通过时 |

**注意：** `update:modelValue` 不会在用户输入时实时触发，只在表单提交或重置时同步数据。这是为了优化性能，避免频繁的父子组件通信。如需实时预览，请参考 [ADR 002: EzForm 表单状态管理方案](./adr/002-form-state-management.md)。

## EzFormInstance

通过 ref 可以访问以下方法：

| 方法 | 类型 | 说明 |
|------|------|------|
| validate | `() => Promise<boolean>` | 验证表单，返回是否通过 |
| restoreValidation | `() => void` | 恢复表单验证状态（清除错误提示） |
| reset | `() => void` | 重置表单到初始值 |
| getValues | `() => FormValues` | 获取表单数据 |
| setValues | `(values: FormValues) => void` | 设置表单数据 |
| setFieldValue | `(field: string, value: unknown) => void` | 设置单个字段值 |
| getFieldValue | `(field: string) => unknown` | 获取单个字段值 |

## 完整示例

查看 `src/views/FormExample.vue` 获取包含所有表单项类型的完整示例。

## 最佳实践

1. **分离配置和组件**：将表单配置单独定义在文件中，便于维护
2. **使用类型定义**：充分利用 TypeScript 类型提示
3. **合理使用布局**：根据表单复杂度选择合适的列数
4. **表单验证**：必填字段和格式验证要明确
5. **条件显示**：简化表单，只显示相关字段
6. **异步选项**：使用函数返回 Promise 来实现动态加载
