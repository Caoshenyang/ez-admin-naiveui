# 5.2 EzForm 表单组件

## 本节目标

- ✅ 封装表单配置
- ✅ 实现表单验证
- ✅ 支持多种表单项类型

---

## 1. 组件设计

### 1.1 类型定义

**src/types/form.ts**:

```typescript
export type FormItemType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'number'
  | 'switch'

export interface FormItem {
  /** 字段名 */
  prop: string
  /** 标签 */
  label: string
  /** 类型 */
  type: FormItemType
  /** 占位符 */
  placeholder?: string
  /** 选项（select、radio、checkbox） */
  options?: Array<{ label: string; value: any }>
  /** 是否必填 */
  required?: boolean
  /** 验证规则 */
  rules?: any[]
  /** 是否禁用 */
  disabled?: boolean
  /** 默认值 */
  defaultValue?: any
}

export interface FormSchema {
  /** 表单项配置 */
  items: FormItem[]
  /** 标签宽度 */
  labelWidth?: number
  /** 标签位置 */
  labelPlacement?: 'left' | 'top'
  /** 列数 */
  columns?: number
}
```

---

## 2. EzForm 组件

**src/components/EzForm.vue**:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormSchema, FormItem } from '@/types/form'
import { NForm, NFormItem, NInput, NSelect, NDatePicker } from 'naive-ui'

interface Props {
  schema: FormSchema
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

const formRef = ref()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

/**
 * 渲染表单项
 */
const renderFormItem = (item: FormItem) => {
  const commonProps = {
    value: model.value[item.prop],
    'onUpdate:value': (value: any) => {
      model.value[item.prop] = value
    },
    placeholder: item.placeholder,
    disabled: item.disabled,
  }

  switch (item.type) {
    case 'input':
      return h(NInput, commonProps)
    case 'textarea':
      return h(NInput, { ...commonProps, type: 'textarea' })
    case 'select':
      return h(NSelect, {
        ...commonProps,
        options: item.options,
      })
    case 'date':
      return h(NDatePicker, {
        ...commonProps,
        type: 'date',
      })
    default:
      return h(NInput, commonProps)
  }
}

/**
 * 验证表单
 */
const validate = () => {
  return formRef.value?.validate()
}

/**
 * 重置表单
 */
const reset = () => {
  formRef.value?.restoreValidation()
}

defineExpose({ validate, reset })
</script>

<template>
  <n-form
    ref="formRef"
    :model="model"
    :label-width="schema.labelWidth || 100"
    :label-placement="schema.labelPlacement || 'left'"
  >
    <n-grid :cols="schema.columns || 1" :x-gap="24" :y-gap="16">
      <n-grid-item v-for="item in schema.items" :key="item.prop">
        <n-form-item
          :label="item.label"
          :path="item.prop"
          :rule="item.rules"
        >
          <component :is="renderFormItem(item)" />
        </n-form-item>
      </n-grid-item>
    </n-grid>
  </n-form>
</template>
```

---

## 3. 使用示例

### 3.1 基础使用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import EzForm from '@/components/EzForm.vue'

const formData = ref({
  username: '',
  email: '',
  role: '',
})

const formSchema = {
  items: [
    {
      prop: 'username',
      label: '用户名',
      type: 'input',
      placeholder: '请输入用户名',
      required: true,
      rules: [{ required: true, message: '请输入用户名' }],
    },
    {
      prop: 'email',
      label: '邮箱',
      type: 'input',
      placeholder: '请输入邮箱',
      rules: [
        { required: true, message: '请输入邮箱' },
        { type: 'email', message: '邮箱格式不正确' },
      ],
    },
    {
      prop: 'role',
      label: '角色',
      type: 'select',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '用户', value: 'user' },
      ],
    },
  ],
  labelWidth: 100,
  columns: 1,
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  console.log('提交:', formData.value)
}
</script>

<template>
  <EzForm v-model="formData" :schema="formSchema" ref="formRef" />
  <n-button @click="handleSubmit">提交</n-button>
</template>
```

---

## 4. 本节小结

✅ 完成的工作：
- 封装了 EzForm 组件
- 实现了配置化表单
- 支持多种表单项类型

**下一步**: [5.3 EzTable 表格组件](./03-EzTable表格组件.md)
