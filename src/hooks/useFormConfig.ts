import { reactive, computed, type Reactive } from 'vue'
import type { FormRules } from 'naive-ui'
import type { FormConfig, FormField } from '@/components/common/SimpleForm.vue'

export interface FormConfigOptions<T extends Record<string, unknown> = Record<string, unknown>> {
  title: string
  submitText?: string
  cancelText?: string
  gridCols?: number
  fields: FormField[]
  rules?: FormRules
  initialData?: Partial<T>
}

export interface UseFormConfigReturn<T extends Record<string, unknown> = Record<string, unknown>> {
  // 响应式数据
  formData: Reactive<T>

  // 计算属性
  config: FormConfig

  // 方法
  reset: (data?: Partial<T>) => void
}

/**
 * 表单配置Hook
 * 提供统一的表单配置管理，只负责数据和配置
 */
export function useFormConfig<T extends Record<string, unknown> = Record<string, unknown>>(
  formConfig: FormConfigOptions<T>
): UseFormConfigReturn<T> {
  // 响应式表单数据
  const formData = reactive<T>({} as T)

  // 配置对象
  const config = computed((): FormConfig => ({
    title: formConfig.title,
    submitText: formConfig.submitText,
    cancelText: formConfig.cancelText,
    gridCols: formConfig.gridCols,
    fields: formConfig.fields,
    rules: formConfig.rules,
  }))

  // 重置表单数据
  const reset = (data?: Partial<T>) => {
    Object.assign(formData, formConfig.initialData || {}, data || {})
  }

  // 初始化表单数据
  reset()

  return {
    // 响应式数据
    formData,

    // 计算属性
    config: config.value,

    // 方法
    reset,
  }
}

/**
 * 创建表单字段配置的辅助函数
 */
export const createFormField = {
  input: (
    key: string,
    label: string,
    options: Partial<FormField> = {}
  ): FormField => ({
    key,
    label,
    type: 'input',
    ...options,
  }),

  password: (
    key: string,
    label: string,
    options: Partial<FormField> = {}
  ): FormField => ({
    key,
    label,
    type: 'password',
    ...options,
  }),

  textarea: (
    key: string,
    label: string,
    options: Partial<FormField> = {}
  ): FormField => ({
    key,
    label,
    type: 'textarea',
    ...options,
  }),

  number: (
    key: string,
    label: string,
    options: Partial<FormField> = {}
  ): FormField => ({
    key,
    label,
    type: 'number',
    ...options,
  }),

  select: (
    key: string,
    label: string,
    options: FormField['options'] = [],
    fieldOptions: Partial<FormField> = {}
  ): FormField => ({
    key,
    label,
    type: 'select',
    options,
    ...fieldOptions,
  }),

  radio: (
    key: string,
    label: string,
    options: FormField['options'] = [],
    fieldOptions: Partial<FormField> = {}
  ): FormField => ({
    key,
    label,
    type: 'radio',
    options,
    ...fieldOptions,
  }),

  checkbox: (
    key: string,
    label: string,
    options: FormField['options'] = [],
    fieldOptions: Partial<FormField> = {}
  ): FormField => ({
    key,
    label,
    type: 'checkbox',
    options,
    ...fieldOptions,
  }),

  switch: (
    key: string,
    label: string,
    fieldOptions: Partial<FormField> = {}
  ): FormField => ({
    key,
    label,
    type: 'switch',
    ...fieldOptions,
  }),

  date: (
    key: string,
    label: string,
    fieldOptions: Partial<FormField> = {}
  ): FormField => ({
    key,
    label,
    type: 'date',
    ...fieldOptions,
  }),

  datetime: (
    key: string,
    label: string,
    fieldOptions: Partial<FormField> = {}
  ): FormField => ({
    key,
    label,
    type: 'datetime',
    ...fieldOptions,
  }),

  custom: (
    key: string,
    label: string,
    fieldOptions: Partial<FormField> = {}
  ): FormField => ({
    key,
    label,
    type: 'custom',
    ...fieldOptions,
  }),
}
