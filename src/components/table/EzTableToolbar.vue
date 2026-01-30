<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NTooltip, NIcon } from 'naive-ui'
import { RefreshOutline, ContractOutline, ExpandOutline } from '@vicons/ionicons5'
import type { ToolbarConfig } from '@/types/table'

interface Props {
  toolbar: ToolbarConfig
  isFullscreen: boolean
}

interface Emits {
  refresh: []
  fullscreen: []
}

const props = withDefaults(defineProps<Props>(), {
  toolbar: () => ({}),
  isFullscreen: false,
})

const emit = defineEmits<Emits>()

// 是否显示工具栏
const showToolbar = computed(() => {
  return (
    props.toolbar.showRefresh ||
    props.toolbar.showFullscreen ||
    props.toolbar.left ||
    props.toolbar.right ||
    Boolean(props.toolbar.title)
  )
})

/**
 * 处理刷新
 */
const handleRefresh = () => {
  emit('refresh')
}

/**
 * 处理全屏切换
 */
const handleFullscreen = () => {
  emit('fullscreen')
}
</script>

<template>
  <div v-if="showToolbar" class="ez-table-toolbar flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
    <!-- 左侧：标题和自定义内容 -->
    <div class="toolbar-left flex items-center gap-3">
      <slot name="left">
        <h3 v-if="toolbar.title" class="text-base font-semibold text-gray-700">
          {{ toolbar.title }}
        </h3>
        <component v-if="toolbar.left" :is="toolbar.left()" />
      </slot>
    </div>

    <!-- 右侧：操作按钮 -->
    <div class="toolbar-right flex items-center">
      <div class="flex items-center gap-2">
        <!-- 右侧自定义内容（按钮组之前） -->
        <slot name="right">
          <component v-if="toolbar.right" :is="toolbar.right()" />
        </slot>

        <!-- 刷新按钮 -->
        <NTooltip v-if="toolbar.showRefresh" placement="bottom">
          <template #trigger>
            <NButton quaternary circle size="small" @click="handleRefresh">
              <template #icon>
                <NIcon :component="RefreshOutline" />
              </template>
            </NButton>
          </template>
          刷新
        </NTooltip>

        <!-- 全屏按钮 -->
        <NTooltip v-if="toolbar.showFullscreen" placement="bottom">
          <template #trigger>
            <NButton quaternary circle size="small" @click="handleFullscreen">
              <template #icon>
                <NIcon :component="isFullscreen ? ContractOutline : ExpandOutline" />
              </template>
            </NButton>
          </template>
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </NTooltip>
      </div>
    </div>
  </div>
</template>
