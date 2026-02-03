<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NSpin, NText } from 'naive-ui'

const router = useRouter()

onMounted(() => {
  // 如果没有 redirect 参数，说明是直接访问 /loading，跳转到首页
  if (!router.currentRoute.value.query.redirect) {
    router.replace('/')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <NSpin size="large" />
      <NText class="mt-4 block text-gray-600">正在加载资源，请稍候...</NText>
    </div>
  </div>
</template>
