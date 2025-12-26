<template>
  <div class="flex gap-3 items-center justify-center mb-4">
    <n-input-group :style="{ width }">
      <n-input
        :value="modelValue || ''"
        :placeholder="placeholder"
        clearable
        @input="handleInput"
        @keydown.enter="handleSearch"
      />
      <n-button type="primary" @click="handleSearch">
        <template #icon>
          <n-icon size="20">
            <search />
          </n-icon>
        </template>
      </n-button>
    </n-input-group>
    <n-button @click="handleReset">重置</n-button>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@vicons/ionicons5'

interface Props {
  modelValue: string | undefined
  placeholder?: string
  width?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
  (e: 'reset'): void
}

withDefaults(defineProps<Props>(), {
  placeholder: '请输入搜索关键词',
  width: '320px',
})

const emit = defineEmits<Emits>()

const handleInput = (value: string | undefined) => {
  emit('update:modelValue', value || '')
}

const handleSearch = () => {
  emit('search')
}

const handleReset = () => {
  emit('update:modelValue', '')
  emit('reset')
}
</script>

<style lang="scss" scoped></style>
