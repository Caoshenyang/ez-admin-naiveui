<!--
  EzForm - 配置式表单组件
  基于 NaiveUI 的二次封装，支持 JSON 配置生成表单
-->
<script setup lang="ts">
import { computed, ref, watch, useSlots } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { NForm, NGrid, NGridItem, NSpace, NButton } from 'naive-ui'
import EzFormItemRenderer from './form/EzFormItemRenderer.vue'
import type {
  FormItem,
  FormValues,
  EzFormEmits,
  EzFormInstance,
  EzFormProps,
} from '@/types/form'

const props = withDefaults(defineProps<EzFormProps>(), {
  submitText: '提交',
  resetText: '重置',
  showActions: true,
  actionAlign: 'left',
})

const emit = defineEmits<EzFormEmits>()

const slots = useSlots()

const formRef = ref<FormInst | null>(null)

// 表单数据（内部状态）
const formValues = ref<FormValues>({})

// 初始化表单数据
const initFormValues = () => {
  const values: FormValues = {}
  props.options.items.forEach((item) => {
    if (item.field in (props.modelValue || {})) {
      values[item.field] = props.modelValue![item.field]
    } else if (item.defaultValue !== undefined) {
      values[item.field] = item.defaultValue
    }
  })
  formValues.value = values
}

// 监听外部 modelValue 变化（单向同步：外部 → 内部）
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      Object.assign(formValues.value, newVal)
    }
  },
  { deep: true }
)

// 初始化
initFormValues()

// 计算表单布局配置
const formProps = computed(() => {
  const { layout, labelWidth, labelAlign, labelPlacement, size, showLabel, requireMarkPlacement, showFeedback } =
    props.options
  return {
    layout: layout || 'horizontal',
    labelWidth: labelWidth || 120,
    labelAlign: labelAlign || 'right',
    labelPlacement: labelPlacement || 'left',
    size: size || 'medium',
    showLabel: showLabel ?? true,
    requireMarkPlacement: requireMarkPlacement || 'right',
    showFeedback: showFeedback ?? true,
  }
})

// 计算栅格配置
const gridProps = computed(() => {
  const { columns = 1, gutter = 16 } = props.options
  return {
    cols: columns,
    xGap: gutter,
    yGap: gutter,
  }
})

// 计算每个表单项的栅格配置
const getItemGridProps = (item: FormItem) => {
  const { columns = 1 } = props.options
  const defaultSpan = 24 / columns
  return {
    span: item.span || defaultSpan,
    offset: item.offset || 0,
  }
}

// 过滤需要显示的表单项
const visibleItems = computed(() => {
  return props.options.items.filter((item) => {
    if (item.show) {
      return item.show(formValues.value)
    }
    return true
  })
})

// 表单验证规则
const formRules = computed(() => {
  const rules: FormRules = {}
  props.options.items.forEach((item) => {
    if (item.rules && item.rules.length > 0) {
      rules[item.field] = item.rules
    }
  })
  return rules
})

// 提交表单（验证通过后同步数据到外部）
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    const values = { ...formValues.value }
    emit('update:modelValue', values) // 同步到外部
    emit('submit', values)
    emit('validate', values)
  } catch {
    // 验证失败
  }
}

// 重置表单
const handleReset = () => {
  formRef.value?.restoreValidation()
  initFormValues()
  const values = { ...formValues.value }
  emit('update:modelValue', values) // 同步到外部
  emit('reset', values)
}

// 暴露的方法
const validate = async () => {
  try {
    await formRef.value?.validate()
    return true
  } catch {
    return false
  }
}

const restoreValidation = () => {
  formRef.value?.restoreValidation()
}

const reset = () => {
  handleReset()
}

const getValues = () => {
  return { ...formValues.value }
}

const setValues = (values: FormValues) => {
  formValues.value = { ...formValues.value, ...values }
}

const setFieldValue = (field: string, value: unknown) => {
  formValues.value[field] = value
}

const getFieldValue = (field: string) => {
  return formValues.value[field]
}

// 暴露实例方法
defineExpose<EzFormInstance>({
  validate,
  restoreValidation,
  reset,
  getValues,
  setValues,
  setFieldValue,
  getFieldValue,
})
</script>

<template>
  <div class="ez-form">
    <NForm
      ref="formRef"
      :model="formValues"
      :rules="formRules"
      v-bind="formProps"
    >
      <NGrid v-bind="gridProps">
        <NGridItem
          v-for="item in visibleItems"
          :key="item.field"
          v-bind="getItemGridProps(item)"
        >
          <!-- 自定义插槽 -->
          <slot
            v-if="item.type === 'custom' && slots[`item-${item.field}`]"
            :name="`item-${item.field}`"
            :item="item"
            :value="formValues[item.field]"
            :values="formValues"
            :disabled="disabled || (item.disabled?.(formValues) ?? false)"
            :set-value="(v: unknown) => setFieldValue(item.field, v)"
          />

          <!-- 默认渲染器 -->
          <EzFormItemRenderer
            v-else
            :item="item"
            :value="formValues[item.field]"
            :values="formValues"
            :disabled="disabled || (item.disabled?.(formValues) ?? false)"
            :readonly="readonly"
            :loading="loading"
            @update:value="(v: unknown) => setFieldValue(item.field, v)"
          />
        </NGridItem>
      </NGrid>

      <!-- 操作按钮 -->
      <NSpace
        v-if="showActions"
        class="ez-form-actions"
        :justify="actionAlign === 'left' ? 'start' : actionAlign === 'center' ? 'center' : 'end'"
      >
        <slot name="actions" :values="formValues" :submit="handleSubmit" :reset="handleReset">
          <NButton type="primary" :loading="loading" @click="handleSubmit">
            {{ submitText }}
          </NButton>
          <NButton v-if="resetText" @click="handleReset">
            {{ resetText }}
          </NButton>
        </slot>
      </NSpace>
    </NForm>
  </div>
</template>

<style scoped>
.ez-form-actions {
  margin-top: 16px;
}
</style>
