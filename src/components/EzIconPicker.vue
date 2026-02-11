<!--
  EzIconPicker - Iconify 图标选择器
  支持搜索、预览、选择
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { NInput, NModal, NScrollbar, NEmpty } from 'naive-ui'
import EzIcon from './EzIcon.vue'
import type { EzIconPickerProps, EzIconPickerEmits } from '@/types/icon'
import { popularIcons } from '@/settings/icon-library'

const props = withDefaults(defineProps<EzIconPickerProps>(), {
  width: 800,
  pageSize: 80,
  clearable: true,
  showCategory: false,
  searchable: true,
  placeholder: '请选择图标'
})

const emit = defineEmits<EzIconPickerEmits>()

// 内部状态
const showPicker = ref(false)
const searchQuery = ref('')

// 当前选中的图标
const currentIcon = computed(() => props.modelValue)

// 过滤后的图标列表
const filteredIcons = computed(() => {
  if (!searchQuery.value) {
    return popularIcons
  }

  const query = searchQuery.value.toLowerCase()
  return popularIcons.filter(
    (icon) => icon.name.toLowerCase().includes(query) || icon.label.toLowerCase().includes(query)
  )
})

// 处理图标选择
function handleSelectIcon(iconName: string) {
  emit('update:modelValue', iconName)
  emit('change', iconName)
  showPicker.value = false
}

// 处理清空
function handleClear() {
  emit('update:modelValue', undefined)
}
</script>

<template>
  <div class="ez-icon-picker">
    <!-- 触发器 -->
    <NInput
      :value="currentIcon"
      :placeholder="placeholder"
      :clearable="clearable"
      readonly
      @click="showPicker = true"
      @clear="handleClear"
    >
      <template #prefix>
        <EzIcon v-if="currentIcon" :icon="currentIcon" :size="18" />
        <EzIcon v-else icon="mdi:magnify-outline" :size="18" />
      </template>
    </NInput>

    <!-- 图标选择弹窗 -->
    <NModal v-model:show="showPicker" preset="card" title="选择图标" :style="{ width: '800px' }">
      <!-- 搜索框 -->
      <NInput v-if="searchable" v-model:value="searchQuery" placeholder="搜索图标..." clearable class="mb-4">
        <template #prefix>
          <EzIcon icon="mdi:magnify-outline" :size="18" />
        </template>
      </NInput>

      <!-- 图标网格 -->
      <NScrollbar style="max-height: 500px">
        <div v-if="filteredIcons.length > 0" class="icon-grid">
          <div
            v-for="icon in filteredIcons"
            :key="icon.name"
            class="flex flex-col items-center justify-center p-3 border border-slate-200 rounded cursor-pointer transition-all duration-200 hover:bg-slate-100 hover:border-slate-300"
            :class="{ 'bg-info-50 border-info-500': currentIcon === icon.name }"
            @click="handleSelectIcon(icon.name)"
          >
            <EzIcon :icon="icon.name" :size="24" />
            <div class="mt-2 text-xs text-slate-500 text-center break-anywhere leading-tight">{{ icon.label }}</div>
          </div>
        </div>
        <NEmpty v-else description="暂无匹配的图标" size="small" />
      </NScrollbar>
    </NModal>
  </div>
</template>

<style scoped>
.ez-icon-picker {
  display: inline-block;
  width: 100%;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
}
</style>
