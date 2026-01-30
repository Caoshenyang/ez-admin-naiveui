<!--
  全局加载进度条组件
  使用 NaiveUI 的 NLoadingBarProvider
-->
<script setup lang="ts">
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useLoadingStore } from '@/stores/modules/loading'
import { useLoadingBar } from 'naive-ui'

const loadingStore = useLoadingStore()
const { isGlobalLoading, loadingError } = storeToRefs(loadingStore)
const loadingBar = useLoadingBar()

// 监听全局 loading 状态变化
watch(isGlobalLoading, (loading) => {
  if (loading) {
    loadingBar.start()
  } else {
    // 根据错误状态决定调用 finish() 还是 error()
    if (loadingError.value) {
      loadingBar.error()
      // 重置错误状态
      setTimeout(() => {
        loadingStore.loadingError = false
      }, 1000)
    } else {
      loadingBar.finish()
    }
  }
})
</script>

<template>
  <!-- NLoadingBarProvider 需要在根组件中配置 -->
  <slot />
</template>
