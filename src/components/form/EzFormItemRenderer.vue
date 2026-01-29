<!--
  EzFormItemRenderer - 表单项渲染器
  根据配置动态渲染不同类型的表单项
-->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { FormItem, FormValues, SelectOption } from '@/types/form'

interface Props {
  item: FormItem
  value: unknown
  values: FormValues
  disabled?: boolean
  readonly?: boolean
  loading?: boolean
}

interface Emits {
  'update:value': [value: unknown]
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  readonly: false,
  loading: false,
})

const emit = defineEmits<Emits>()

// 内部值
const internalValue = ref<unknown>(props.value)

// 动态加载的选项
const dynamicOptions = ref<SelectOption[]>([])

// 初始化
onMounted(async () => {
  internalValue.value = props.value
  // 如果选项是函数，动态加载
  if (typeof props.item.options === 'function') {
    dynamicOptions.value = await props.item.options()
  }
})

// 监听外部值变化
watch(
  () => props.value,
  (newVal) => {
    internalValue.value = newVal
  }
)

// 更新值
const updateValue = (value: unknown) => {
  internalValue.value = value
  emit('update:value', value)
}

// 计算表单项配置
const itemProps = computed(() => {
  const baseProps = {
    label: props.item.label,
    path: props.item.field,
  }

  if (props.item.itemProps) {
    const { labelWidth, labelAlign, labelPlacement, showLabel, showFeedback, required } = props.item.itemProps
    return {
      ...baseProps,
      labelWidth: labelWidth || undefined,
      labelAlign: labelAlign || undefined,
      labelPlacement: labelPlacement || undefined,
      showLabel: showLabel ?? undefined,
      showFeedback: showFeedback ?? undefined,
      required: required ?? undefined,
    }
  }

  return baseProps
})

// 计算禁用状态
const isDisabled = computed(() => props.disabled || (props.item.disabled?.(props.values) ?? false))

// 计算占位符
const placeholder = computed(() => props.item.placeholder || `请输入${props.item.label}`)

// 计算选项
const options = computed<SelectOption[]>(() => {
  if (typeof props.item.options === 'function') {
    return dynamicOptions.value
  }
  return props.item.options || []
})

// 合并自定义属性
const mergedProps = computed(() => {
  return {
    placeholder: placeholder.value,
    disabled: isDisabled.value,
    readonly: props.readonly,
    loading: props.loading,
    ...(props.item.props || {}),
  }
})

// 文本输入框值
const inputValue = computed({
  get: () => internalValue.value as string,
  set: (v: string) => updateValue(v),
})

// 数字输入框值
const numberValue = computed({
  get: () => internalValue.value as number | null,
  set: (v: number | null) => updateValue(v),
})

// 选择框值
const selectValue = computed({
  get: () => internalValue.value as string,
  set: (v: string) => updateValue(v),
})

// 多选值
const multiSelectValue = computed({
  get: () => internalValue.value as string[],
  set: (v: string[]) => updateValue(v),
})

// 日期值
const dateValue = computed({
  get: () => internalValue.value as number | null,
  set: (v: number | null) => updateValue(v),
})

// 日期范围值
const dateRangeValue = computed({
  get: () => internalValue.value as [number, number] | null,
  set: (v: [number, number] | null) => updateValue(v),
})

// 时间值
const timeValue = computed({
  get: () => internalValue.value as number | null,
  set: (v: number | null) => updateValue(v),
})

// 开关值
const switchValue = computed({
  get: () => internalValue.value as boolean,
  set: (v: boolean) => updateValue(v),
})

// 单选值
const radioValue = computed({
  get: () => internalValue.value as string | number,
  set: (v: string | number) => updateValue(v),
})

// 复选框值
const checkboxValue = computed({
  get: () => internalValue.value as boolean,
  set: (v: boolean) => updateValue(v),
})

// 复选框组值
const checkboxGroupValue = computed({
  get: () => internalValue.value as (string | number)[],
  set: (v: (string | number)[]) => updateValue(v),
})

// 多行文本值
const textareaValue = computed({
  get: () => internalValue.value as string,
  set: (v: string) => updateValue(v),
})

// 滑块值
const sliderValue = computed({
  get: () => internalValue.value as number,
  set: (v: number) => updateValue(v),
})

// 评分值
const rateValue = computed({
  get: () => internalValue.value as number,
  set: (v: number) => updateValue(v),
})
</script>

<template>
  <NFormItem v-bind="itemProps" :class="item.className">
    <!-- 输入框 -->
    <NInput
      v-if="item.type === 'input'"
      v-model:value="inputValue"
      v-bind="mergedProps"
    />

    <!-- 密码输入框 -->
    <NInput
      v-else-if="item.type === 'input-password'"
      v-model:value="inputValue"
      type="password"
      show-password-on="click"
      v-bind="mergedProps"
      :autocomplete="(item.props?.autocomplete as string) || 'current-password'"
    />

    <!-- 数字输入框 -->
    <NInputNumber
      v-else-if="item.type === 'input-number'"
      v-model:value="numberValue"
      class="w-full"
      v-bind="mergedProps"
    />

    <!-- 下拉选择 -->
    <NSelect
      v-else-if="item.type === 'select'"
      v-model:value="selectValue"
      :options="options"
      v-bind="mergedProps"
    />

    <!-- 多选下拉 -->
    <NSelect
      v-else-if="item.type === 'multi-select'"
      v-model:value="multiSelectValue"
      :options="options"
      multiple
      v-bind="mergedProps"
    />

    <!-- 日期选择器 -->
    <NDatePicker
      v-else-if="item.type === 'date-picker'"
      v-model:value="dateValue"
      type="date"
      class="w-full"
      v-bind="mergedProps"
    />

    <!-- 日期范围选择器 -->
    <NDatePicker
      v-else-if="item.type === 'date-range-picker'"
      v-model:value="dateRangeValue"
      type="daterange"
      class="w-full"
      v-bind="mergedProps"
    />

    <!-- 日期时间选择器 -->
    <NDatePicker
      v-else-if="item.type === 'datetime-picker'"
      v-model:value="dateValue"
      type="datetime"
      class="w-full"
      v-bind="mergedProps"
    />

    <!-- 时间选择器 -->
    <NTimePicker
      v-else-if="item.type === 'time-picker'"
      v-model:value="timeValue"
      class="w-full"
      v-bind="mergedProps"
    />

    <!-- 开关 -->
    <NSwitch
      v-else-if="item.type === 'switch'"
      v-model:value="switchValue"
      v-bind="mergedProps"
    />

    <!-- 单选组 -->
    <NRadioGroup
      v-else-if="item.type === 'radio' || item.type === 'radio-group'"
      v-model:value="radioValue"
      v-bind="mergedProps"
    >
      <NRadio
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </NRadio>
    </NRadioGroup>

    <!-- 复选框 -->
    <NCheckbox
      v-else-if="item.type === 'checkbox'"
      v-model:checked="checkboxValue"
      v-bind="mergedProps"
    >
      {{ item.props?.checkboxLabel || '勾选' }}
    </NCheckbox>

    <!-- 复选框组 -->
    <NCheckboxGroup
      v-else-if="item.type === 'checkbox-group'"
      v-model:value="checkboxGroupValue"
      v-bind="mergedProps"
    >
      <NCheckbox
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </NCheckbox>
    </NCheckboxGroup>

    <!-- 多行文本 -->
    <NInput
      v-else-if="item.type === 'textarea'"
      v-model:value="textareaValue"
      type="textarea"
      v-bind="mergedProps"
    />

    <!-- 滑块 -->
    <NSlider
      v-else-if="item.type === 'slider'"
      v-model:value="sliderValue"
      v-bind="mergedProps"
    />

    <!-- 评分 -->
    <NRate
      v-else-if="item.type === 'rate'"
      v-model:value="rateValue"
      v-bind="mergedProps"
    />

    <!-- 提示文本 -->
    <template v-if="item.tip" #feedback>
      <span class="text-gray-400 text-xs">{{ item.tip }}</span>
    </template>
  </NFormItem>
</template>

<style scoped>
:deep(.n-input-number) {
  width: 100%;
}
</style>
