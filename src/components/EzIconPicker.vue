<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ICON_SETS,
  getIconCategories,
  getIconsByCategory,
  searchIcons,
  type IconMeta,
} from '@/constants/icons'
import EzIconRender from './EzIconRender.vue'

interface Props {
  modelValue?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<Emits>()

const showPicker = ref(false)
const searchText = ref('')
const selectedCategory = ref('全部')

const categories = computed(() => ['全部', ...getIconCategories()])

const filteredIcons = computed(() => {
  let icons: IconMeta[] = []

  if (searchText.value) {
    icons = searchIcons(searchText.value)
  } else if (selectedCategory.value === '全部') {
    icons = ICON_SETS
  } else {
    icons = getIconsByCategory(selectedCategory.value)
  }

  return icons
})

const selectedIcon = computed({
  get: () => props.modelValue || '',
  set: (value) => emit('update:modelValue', value),
})

function handleSelectIcon(iconName: string) {
  selectedIcon.value = iconName
  showPicker.value = false
}

function handleClear() {
  selectedIcon.value = ''
}
</script>

<template>
  <div class="inline-block">
    <n-input-group>
      <n-input
        :value="selectedIcon"
        placeholder="请选择图标"
        readonly
        :disabled="disabled"
        @click="showPicker = true"
      >
        <template #prefix>
          <EzIconRender v-if="selectedIcon" :icon="selectedIcon" :size="18" />
          <span v-else class="text-gray-400">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </span>
        </template>
      </n-input>
      <n-button v-if="selectedIcon && !disabled" quaternary @click="handleClear">
        <template #icon>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </template>
      </n-button>
    </n-input-group>

    <n-modal v-model:show="showPicker" preset="card" title="选择图标" class="w-[800px]">
      <div class="space-y-4">
        <!-- 搜索框 -->
        <n-input v-model:value="searchText" placeholder="搜索图标..." clearable>
          <template #prefix>
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </template>
        </n-input>

        <!-- 分类标签 -->
        <n-space>
          <n-tag
            v-for="category in categories"
            :key="category"
            :type="selectedCategory === category ? 'primary' : 'default'"
            checkable
            @checked="selectedCategory = category"
          >
            {{ category }}
          </n-tag>
        </n-space>

        <!-- 图标列表 -->
        <div class="max-h-[400px] overflow-y-auto">
          <n-grid :x-gap="12" :y-gap="12" :cols="6">
            <n-grid-item v-for="icon in filteredIcons" :key="icon.name">
              <div
                class="flex cursor-pointer flex-col items-center justify-center rounded-lg border p-3 transition-all hover:border-primary hover:bg-primary/10"
                :class="
                  selectedIcon === icon.name ? 'border-primary bg-primary/10' : 'border-gray-200'
                "
                @click="handleSelectIcon(icon.name)"
              >
                <EzIconRender :icon="icon.name" :size="24" />
                <span class="mt-2 text-xs text-gray-600">{{ icon.label }}</span>
              </div>
            </n-grid-item>
          </n-grid>
        </div>

        <!-- 空状态 -->
        <n-empty v-if="filteredIcons.length === 0" description="未找到相关图标" />
      </div>

      <template #footer>
        <div class="flex justify-end">
          <n-button @click="showPicker = false">取消</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>
