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
    :style="modalStyle"
    @after-leave="handleAfterLeave"
  >
    <n-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-placement="left"
      :disabled="loading"
      label-width="80"
    >
      <n-grid :cols="gridCols" :x-gap="16" :y-gap="4">
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
              style="width: 100%;"
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
              style="width: 100%;"
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
              style="width: 100%;"
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
              :validator="field.validator"
              style="width: 100%;"
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
              style="width: 100%;"
              @update:value="(value) => updateFormData(field.key, value)"
            />

            <!-- 树形选择框 -->
            <n-tree-select
              v-else-if="field.type === 'tree-select'"
              :value="formData[field.key] as any"
              :placeholder="field.placeholder"
              :disabled="field.disabled"
              :multiple="field.treeMultiple"
              :clearable="field.treeClearable !== false"
              :filterable="field.treeFilterable !== false"
              :options="field.treeOptions as any"
              style="width: 100%;"
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
            <slot v-else-if="field.type === 'custom'" :name="field.key" :field="field" :form-data="formData" />

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
import { logger } from '@/hooks/useMessage'

/**
 * 表单字段选项定义
 * 用于select、radio、checkbox等选择型字段的选项配置
 */
export interface FormFieldOption {
  /** 显示的文本标签 */
  label: string

  /** 选项的值 */
  value: string | number

  /** 是否禁用该选项，默认false */
  disabled?: boolean
}

/**
 * 树形选择选项定义
 * 基于Naive UI的TreeOption
 */
export interface TreeOption {
  /** 选项的唯一标识 */
  key: string | number

  /** 显示的文本标签 */
  label: string

  /** 子选项列表 */
  children?: TreeOption[]

  /** 是否禁用该选项 */
  disabled?: boolean

  /** 其他扩展属性 */
  [key: string]: unknown
}

/**
 * 类型安全的表单字段定义
 *
 * @template T - 表单数据类型
 * @template K - 表单字段键类型，必须是T的键
 */
export interface FormField<T = Record<string, unknown>, K extends keyof T = keyof T> {
  /** 字段键名，对应表单数据中的属性名 */
  key: K

  /** 字段标签，显示在表单项左侧 */
  label: string

  /** 字段类型，决定渲染哪种输入组件 */
  type:
    | 'input'        // 普通文本输入框
    | 'password'     // 密码输入框
    | 'textarea'     // 多行文本输入框
    | 'number'       // 数字输入框
    | 'select'       // 下拉选择框
    | 'tree-select'  // 树形选择框
    | 'radio'        // 单选框组
    | 'checkbox'     // 多选框/复选框组
    | 'switch'       // 开关组件
    | 'date'         // 日期选择器
    | 'datetime'     // 日期时间选择器
    | 'custom'       // 自定义组件（需要配合render插槽使用）

  /** 是否必填字段，会显示红色星号标记 */
  required?: boolean

  /** 是否禁用字段 */
  disabled?: boolean

  /** 占位符文本，当输入框为空时显示的提示信息 */
  placeholder?: string

  /** 字段在网格布局中占据的列数，基于24列网格系统，默认24（整行） */
  span?: number

  // ========== input相关属性 ==========
  /** 输入框类型，仅对type='input'有效 */
  inputType?: 'text' | 'email' | 'tel' | 'url'

  /** 最大输入长度，仅对文本输入框有效 */
  maxlength?: number

  /** 是否显示清空按钮，默认true */
  clearable?: boolean

  // ========== textarea相关属性 ==========
  /** 最小行数，仅对type='textarea'有效，默认2 */
  minRows?: number

  /** 最大行数，仅对type='textarea'有效，默认6 */
  maxRows?: number

  // ========== number相关属性 ==========
  /** 最小值，仅对type='number'有效 */
  min?: number

  /** 最大值，仅对type='number'有效 */
  max?: number

  /** 数值精度（小数位数），仅对type='number'有效 */
  precision?: number

  /** 步长，每次增减的数值，仅对type='number'有效，默认1 */
  step?: number

  /** 自定义验证函数，仅对type='number'有效，返回true表示验证通过 */
  validator?: (value: number) => boolean

  // ========== select/radio/checkbox相关属性 ==========
  /** 选项列表，仅对type='select'|'radio'|'checkbox'有效 */
  options?: FormFieldOption[]

  /** 是否支持多选，仅对type='select'|'checkbox'有效 */
  multiple?: boolean

  /** 是否支持搜索过滤，仅对type='select'有效 */
  filterable?: boolean

  // ========== tree-select相关属性 ==========
  /** 树形选项列表，仅对type='tree-select'有效 */
  treeOptions?: TreeOption[]

  /** 是否支持多选，仅对type='tree-select'有效 */
  treeMultiple?: boolean

  /** 是否可清空，仅对type='tree-select'有效，默认true */
  treeClearable?: boolean

  /** 是否可搜索，仅对type='tree-select'有效，默认true */
  treeFilterable?: boolean

  // ========== date相关属性 ==========
  /** 日期选择器类型，仅对type='date'|'datetime'有效 */
  dateType?: 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'month' | 'year'

  // ========== 条件显示 ==========
  /** 条件显示函数，返回true时显示该字段，false时隐藏 */
  condition?: (formData: T) => boolean
}

/**
 * 类型安全的表单配置
 *
 * @template T - 表单数据类型
 */
export interface FormConfig<T = Record<string, unknown>> {
  /** 表单标题，显示在模态框顶部 */
  title: string

  /** 提交按钮文本，默认'确定' */
  submitText?: string

  /** 取消按钮文本，默认'取消' */
  cancelText?: string

  /** 网格布局列数，决定一行显示多少个字段，默认24 */
  gridCols?: number

  /** 表单控件尺寸 */
  size?: 'small' | 'medium' | 'large'

  /** 表单字段配置列表 */
  fields: FormField<T>[]

  /** 表单验证规则，基于Naive UI的FormRules */
  rules?: FormRules
}

/**
 * EzForm 组件属性接口
 *
 * @template T - 表单数据类型
 */
interface Props<T = Record<string, unknown>> {
  /** 表单配置对象 */
  config: FormConfig<T>

  /** 控制模态框显示/隐藏的双向绑定值 */
  modelValue: boolean

  /** 表单提交时的加载状态 */
  loading?: boolean

  /** 表单数据对象，支持双向绑定 */
  formData: T
}

/**
 * EzForm 组件事件接口
 *
 * @template T - 表单数据类型
 */
interface Emits<T = Record<string, unknown>> {
  /** 模态框显示状态更新事件 */
  (e: 'update:modelValue', value: boolean): void

  /** 表单数据更新事件 */
  (e: 'update:formData', value: T): void

  /** 表单提交事件，携带验证通过的表单数据 */
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

// 弹窗尺寸样式
const modalStyle = computed(() => {
  const size = props.config.size || 'medium'
  const sizeMap = {
    small: 'width: 480px; max-width: 90vw',
    medium: 'width: 720px; max-width: 90vw',
    large: 'width: 960px; max-width: 95vw'
  }
  return sizeMap[size]
})

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
