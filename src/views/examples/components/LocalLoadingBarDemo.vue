<!--
  局部进度条演示组件
  使用内部子组件来获取局部的 loadingBar 实例

  ⚠️ 为什么需要子组件模式？
  useLoadingBar() 会自动向上查找组件树中最近的 NLoadingBarProvider。
  由于 App.vue 中已有全局 Provider，如果在当前组件直接调用 useLoadingBar()，
  会优先使用全局 Provider 而非本组件的局部 Provider。

  解决方案：
  1. 创建子组件 LocalLoadingBarTrigger.vue
  2. 子组件在 NLoadingBarProvider 内部调用 useLoadingBar()
  3. 父组件通过 ref 获取子组件的 loadingBar 实例
  4. 这样确保 useLoadingBar() 使用局部 Provider 而非全局 Provider
-->
<script setup lang="ts">
import { ref } from 'vue'
import { NLoadingBarProvider } from 'naive-ui'
import { message } from '@/hooks/useNaiveApi'
import LocalLoadingBarTrigger from './LocalLoadingBarTrigger.vue'

const localTargetRef = ref<HTMLElement | undefined>(undefined)
const triggerRef = ref<InstanceType<typeof LocalLoadingBarTrigger> | null>(null)

async function handleLocalLoading() {
  if (!triggerRef.value?.localLoadingBar) return

  triggerRef.value.localLoadingBar.start()
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    message.success('局部容器加载完成！（进度条只在容器内显示）')
  } finally {
    triggerRef.value.localLoadingBar.finish()
  }
}
</script>

<template>
  <!-- 外层容器：相对定位 -->
  <div class="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50" style="min-height: 150px; position: relative;">
    <NLoadingBarProvider
      :to="localTargetRef"
      container-style="position: absolute;"
    >
      <!-- 进度条目标容器：绝对定位，占满外层容器 -->
      <div
        ref="localTargetRef"
        style="
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          border-radius: var(--n-border-radius);
          overflow: hidden;
          pointer-events: none;
        "
      />

      <!-- 实际内容 -->
      <div class="flex flex-col items-center justify-center space-y-3 p-4">
        <p class="text-sm text-gray-600">这是一个局部容器（进度条会显示在容器顶部）</p>
        <LocalLoadingBarTrigger ref="triggerRef" @click="handleLocalLoading" />
      </div>
    </NLoadingBarProvider>
  </div>
</template>
