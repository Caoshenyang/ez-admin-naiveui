<!--
  内部子组件：在局部 Provider 内部使用 useLoadingBar

  关键点：
  - 这个组件在父组件的 NLoadingBarProvider 内部渲染
  - 在 setup 中调用 useLoadingBar() 会使用最近的 Provider（即局部 Provider）
  - 通过 defineExpose 暴露 loadingBar 实例供父组件使用
  - 避免了使用 App.vue 中的全局 Provider
-->
<script setup lang="ts">
import { NButton } from 'naive-ui'
import { useLoadingBar } from 'naive-ui'

// 在 Provider 内部调用，会使用局部的 Provider
const localLoadingBar = useLoadingBar()

defineExpose({
  localLoadingBar
})

defineEmits<{
  click: []
}>()
</script>

<template>
  <NButton type="primary" @click="$emit('click')">
    在容器内显示进度条
  </NButton>
</template>
