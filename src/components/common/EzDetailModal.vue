<!--
  EzDetailModal 详情模态框组件
-->
<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    :title="title"
    size="huge"
    :bordered="false"
    :segmented="false"
    :loading="loading"
     style="width: 720px; max-width: 90vw"
  >
    <n-descriptions :column="config?.column || 2" size="large" :label-placement="'left'">
      <n-descriptions-item
        v-for="field in config?.fields || []"
        :key="field.key"
        :label="field.label"
      >
        <template v-if="field.render">
          <component :is="field.render(data[field.key], data)" />
        </template>
        <template v-else>
          {{ formatValue(data[field.key], field) }}
        </template>
      </n-descriptions-item>
    </n-descriptions>
    <template #footer>
      <n-space justify="end">
        <n-button @click="$emit('update:show', false)">关闭</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

/**
 * 详情模态框字段配置接口
 */
export interface DetailField {
  key: string
  label: string
  /** 自定义渲染函数 */
  render?: (value: unknown, data: Record<string, unknown>) => unknown
  /** 值格式化函数 */
  format?: (value: unknown) => string
}

/**
 * 详情模态框配置接口
 */
export interface DetailModalConfig {
  title?: string | ((data: Record<string, unknown>) => string)
  column?: number
  fields: DetailField[]
}

/**
 * 组件属性接口
 */
interface Props {
  show: boolean
  data: Record<string, unknown>
  config?: DetailModalConfig
  loading?: boolean
}

/**
 * 组件事件接口
 */
interface Emits {
  (e: 'update:show', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

/**
 * 处理 v-model 绑定
 */
const visible = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

/**
 * 计算标题
 */
const title = computed(() => {
  if (!props.config?.title) return '详情'
  if (typeof props.config.title === 'function') {
    return props.config.title(props.data)
  }
  return props.config.title
})

/**
 * 格式化字段值
 */
const formatValue = (value: unknown, field: DetailField): string => {
  if (field.format) {
    return field.format(value)
  }

  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return String(value)
}
</script>

<style lang="scss" scoped></style>
