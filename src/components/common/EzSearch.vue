<!--
  EzSearch 搜索组件
-->
<template>
  <!-- 搜索组件布局容器，使用flexbox水平排列搜索框和按钮 -->
  <div class="flex gap-3 items-center justify-center mb-4">
    <!-- 输入框组，包含搜索输入框和搜索按钮 -->
    <n-input-group :style="{ width }">
      <!-- 搜索输入框，支持清空功能和回车搜索 -->
      <n-input
        :value="modelValue || ''"
        :placeholder="placeholder"
        clearable
        @input="handleInput"
        @keydown.enter="handleSearch"
      />
      <!-- 搜索按钮，点击触发搜索事件 -->
      <n-button type="primary" @click="handleSearch">
        <template #icon>
          <n-icon size="20">
            <search />
          </n-icon>
        </template>
      </n-button>
    </n-input-group>
    <!-- 重置按钮，点击清空搜索条件并触发重置事件 -->
    <n-button @click="handleReset">重置</n-button>
  </div>
</template>

<script lang="ts" setup>
// 导入搜索图标组件
import { Search } from '@vicons/ionicons5'

// 定义组件接收的属性接口
interface Props {
  modelValue: string | undefined  // 双向绑定值，搜索关键词
  placeholder?: string           // 输入框占位符文本
  width?: string                 // 输入框组宽度
}

// 定义组件发出的事件接口
interface Emits {
  (e: 'update:modelValue', value: string): void  // 更新搜索关键词事件
  (e: 'search'): void                            // 触发搜索事件
  (e: 'reset'): void                             // 触发重置事件
}

// 设置属性默认值
withDefaults(defineProps<Props>(), {
  placeholder: '请输入搜索关键词',
  width: '320px',
})

// 定义emit函数，用于触发自定义事件
const emit = defineEmits<Emits>()

// 处理输入框内容变化，触发v-model更新
const handleInput = (value: string | undefined) => {
  emit('update:modelValue', value || '')
}

// 处理搜索操作，触发search事件
const handleSearch = () => {
  emit('search')
}

// 处理重置操作，清空输入并触发reset事件
const handleReset = () => {
  emit('update:modelValue', '')
  emit('reset')
}
</script>
