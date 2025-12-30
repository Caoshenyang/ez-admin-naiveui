<!--
  EzForm 表单组件
-->
<template>
  <n-modal
    v-model:show="show"
    :title="title"
    preset="card"
    size="medium"
    :bordered="false"
    :segmented="false"
    :loading="loading"
    style="width: 720px; max-width: 90vw"
    @after-leave="handleAfterLeave"
  >
    <n-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-placement="left"
      :disabled="loading"
    >
      <n-grid :cols="gridCols" :x-gap="16" :y-gap="16">
        <n-grid-item v-for="field in visibleFields" :key="field.key" :span="field.span || 24">
          <n-form-item :label="field.label" :path="field.key" :required="field.required">
            <!-- 输入框 -->
            <n-input
              v-if="field.type === 'input'"
              :value="formData[field.key] as any"
              :placeholder="field.placeholder"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              :type="(field.inputType || 'text') as any"
              :maxlength="field.maxlength"
              @update:value="(value) => updateFormData(field.key, value)"
            />

            <!-- 密码框 -->
            <n-input
              v-else-if="field.type === 'password'"
              :value="formData[field.key] as any"
              :placeholder="field.placeholder"
              type="password"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              :maxlength="field.maxlength"
              @update:value="(value) => updateFormData(field.key, value)"
            />

            <!-- 文本域 -->
            <n-input
              v-else-if="field.type === 'textarea'"
              :value="formData[field.key] as any"
              :placeholder="field.placeholder"
              type="textarea"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              :maxlength="field.maxlength"
              :autosize="{ minRows: field.minRows || 3, maxRows: field.maxRows || 6 }"
              @update:value="(value) => updateFormData(field.key, value)"
            />

            <!-- 数字输入框 -->
            <n-input-number
              v-else-if="field.type === 'number'"
              :value="formData[field.key] as any"
              :placeholder="field.placeholder"
              :disabled="field.disabled"
              :min="field.min"
              :max="field.max"
              :precision="field.precision"
              :step="field.step"
              @update:value="(value) => updateFormData(field.key, value)"
            />

            <!-- 下拉选择 -->
            <n-select
              v-else-if="field.type === 'select'"
              :value="formData[field.key] as any"
              :placeholder="field.placeholder"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              :options="field.options as any"
              :multiple="field.multiple"
              :filterable="field.filterable !== false"
              @update:value="(value) => updateFormData(field.key, value)"
            />

            <!-- 单选框组 -->
            <n-radio-group
              v-else-if="field.type === 'radio'"
              :value="formData[field.key] as any"
              :disabled="field.disabled"
              @update:value="(value) => updateFormData(field.key, value)"
            >
              <n-radio
                v-for="option in field.options"
                :key="option.value"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </n-radio>
            </n-radio-group>

            <!-- 复选框组 -->
            <n-checkbox-group
              v-else-if="field.type === 'checkbox'"
              :value="formData[field.key] as any"
              :disabled="field.disabled"
              @update:value="(value) => updateFormData(field.key, value)"
            >
              <n-checkbox
                v-for="option in field.options"
                :key="option.value"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </n-checkbox>
            </n-checkbox-group>

            <!-- 开关 -->
            <n-switch
              v-else-if="field.type === 'switch'"
              :value="formData[field.key] as any"
              :disabled="field.disabled"
              @update:value="(value) => updateFormData(field.key, value)"
            />

            <!-- 日期选择器 -->
            <n-date-picker
              v-else-if="field.type === 'date'"
              :value="formData[field.key] as any"
              :placeholder="field.placeholder"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              :type="field.dateType || 'date'"
              format="yyyy-MM-dd"
              @update:value="(value) => updateFormData(field.key, value)"
            />

            <!-- 日期时间选择器 -->
            <n-date-picker
              v-else-if="field.type === 'datetime'"
              :value="formData[field.key] as any"
              :placeholder="field.placeholder"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              @update:value="(value) => updateFormData(field.key, value)"
            />

            <!-- 自定义插槽 -->
            <slot
              v-else-if="field.type === 'custom'"
              :name="field.key"
              :field="field"
              :form-data="formData"
            />

            <!-- 默认输入框 -->
            <n-input
              v-else
              :value="formData[field.key] as any"
              :placeholder="field.placeholder"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              @update:value="(value) => updateFormData(field.key, value)"
            />
          </n-form-item>
        </n-grid-item>
      </n-grid>
    </n-form>

    <template #action>
      <div class="flex justify-end gap-2">
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" :loading="loading" @click="handleSubmit">
          {{ submitText }}
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { logger } from '@/utils/logger'

// 表单字段选项
export interface FormFieldOption {
  label: string
  value: string | number
  disabled?: boolean
}

// 类型安全的表单字段定义
export interface FormField<T = Record<string, unknown>, K extends keyof T = keyof T> {
  key: K
  label: string
  type:
    | 'input'
    | 'password'
    | 'textarea'
    | 'number'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'switch'
    | 'date'
    | 'datetime'
    | 'custom'
  required?: boolean
  disabled?: boolean
  placeholder?: string
  span?: number
  // input相关
  inputType?: 'text' | 'email' | 'tel' | 'url'
  maxlength?: number
  clearable?: boolean
  // textarea相关
  minRows?: number
  maxRows?: number
  // number相关
  min?: number
  max?: number
  precision?: number
  step?: number
  // select/radio/checkbox相关
  options?: FormFieldOption[]
  multiple?: boolean
  filterable?: boolean
  // date相关
  dateType?: 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'month' | 'year'
  // 条件显示
  condition?: (formData: T) => boolean
}

// 类型安全的表单配置
export interface FormConfig<T = Record<string, unknown>> {
  title: string
  submitText?: string
  cancelText?: string
  gridCols?: number
  fields: FormField<T>[]
  rules?: FormRules
}

interface Props<T = Record<string, unknown>> {
  config: FormConfig<T>
  modelValue: boolean
  loading?: boolean
  formData: T
}

interface Emits<T = Record<string, unknown>> {
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:formData', value: T): void
  (e: 'submit', data: T): void
  (e: 'cancel'): void
}

// 类型安全的表单组件定义
const props = withDefaults(defineProps<Props<Record<string, unknown>>>(), {
  loading: false,
  formData: () => ({}),
})

const emit = defineEmits<Emits<Record<string, unknown>>>()

// 响应式数据
const show = ref(false)
const formRef = ref<FormInst>()

// 计算属性
const title = computed(() => props.config.title)
const submitText = computed(() => props.config.submitText || '确定')
const gridCols = computed(() => props.config.gridCols || 24)
const formRules = computed(() => props.config.rules || {})

// 可见字段（支持条件显示）
const visibleFields = computed(() =>
  props.config.fields.filter((field) => !field.condition || field.condition(props.formData)),
)

// 监听弹窗显示状态
watch(
  () => props.modelValue,
  (newValue) => {
    show.value = newValue
    if (newValue) {
      // 打开弹窗时重置表单验证
      nextTick(() => {
        formRef.value?.restoreValidation()
      })
    }
  },
)

// 监听show变化，同步到modelValue
watch(show, (newValue) => {
  emit('update:modelValue', newValue)
})

// 更新表单数据
const updateFormData = (key: string, value: unknown) => {
  const newFormData = { ...props.formData, [key]: value }
  emit('update:formData', newFormData)
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    emit('submit', { ...props.formData })
  } catch (error) {
    logger.warn('表单验证失败:', error)
  }
}

// 取消操作
const handleCancel = () => {
  emit('cancel')
  show.value = false
}

// 弹窗关闭后的处理
const handleAfterLeave = () => {
  // 表单数据由父组件管理，不需要重置
}

// 类型安全的表单创建函数（移到文件末尾单独导出）
// 暴露方法给父组件
defineExpose({
  validate: () => formRef.value?.validate(),
})
</script>

<style lang="scss" scoped></style>
