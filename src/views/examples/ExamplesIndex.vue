<!--
  组件示例测试合集
  集成所有示例页面，方便测试和查看
-->
<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { NTabs, NTabPane, NCard, NSpace, NButton } from 'naive-ui'
import FormExample from './FormExample.vue'
import LoadingExample from './LoadingExample.vue'

interface ExampleTab {
  key: string
  label: string
  icon?: string
  description: string
  component: unknown
}

// 示例列表（使用 markRaw 避免组件被包装成响应式对象）
const examples = ref<ExampleTab[]>([
  {
    key: 'form',
    label: 'EzForm 表单',
    description: '配置式表单组件，支持 16+ 种表单项类型、表单验证、条件显示等功能',
    component: markRaw(FormExample),
  },
  {
    key: 'loading',
    label: 'Loading 状态',
    description: '全局加载状态管理系统，支持 LoadingBar、Message、Notification、Dialog',
    component: markRaw(LoadingExample),
  },
])

const activeKey = ref('form')

// 使用 markRaw 标记组件
const currentComponent = ref(markRaw(FormExample))
const currentExample = ref(examples.value[0])

// 切换示例
const handleSwitch = (key: string) => {
  const example = examples.value.find(e => e.key === key)
  if (example) {
    currentExample.value = example
    currentComponent.value = example.component
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <!-- 页面标题 -->
    <div class="max-w-7xl mx-auto mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">组件示例测试合集</h1>
          <p class="text-gray-600">
            集成所有组件示例，方便开发和测试
          </p>
        </div>
        <NButton type="primary" @click="$router.push('/')">
          返回首页
        </NButton>
      </div>
    </div>

    <!-- Tab 导航 -->
    <div class="max-w-7xl mx-auto">
      <NCard>
        <NTabs
          v-model:value="activeKey"
          type="segment"
          animated
          @update:value="handleSwitch"
        >
          <NTabPane
            v-for="example in examples"
            :key="example.key"
            :name="example.key"
          >
            <template #tab>
              <div class="flex items-center gap-2">
                <span class="font-semibold">{{ example.label }}</span>
              </div>
            </template>
          </NTabPane>
        </NTabs>

        <!-- 示例描述 -->
        <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-sm text-blue-800">
            <span class="font-semibold">📝 {{ currentExample.label }}</span>
            <span class="ml-2">{{ currentExample.description }}</span>
          </p>
        </div>

        <!-- 示例内容 -->
        <div class="mt-4">
          <component :is="currentComponent" />
        </div>
      </NCard>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-card) {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

:deep(.n-tabs .n-tab-pane) {
  padding: 0;
}
</style>
