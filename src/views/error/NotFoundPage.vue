<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
    <div class="text-center">
      <!-- 404 大数字 -->
      <div class="relative mb-8">
        <div class="text-[180px] font-bold text-slate-200 select-none leading-none">
          404
        </div>
        <!-- 漂浮的元素装饰 -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex gap-4 animate-bounce">
            <div class="w-4 h-4 rounded-full bg-indigo-500/60" />
            <div class="w-3 h-3 rounded-full bg-purple-500/60" style="animation-delay: 0.1s" />
            <div class="w-4 h-4 rounded-full bg-pink-500/60" style="animation-delay: 0.2s" />
          </div>
        </div>
      </div>

      <!-- 提示信息 -->
      <h1 class="text-2xl font-semibold text-slate-700 mb-3">
        页面走丢了
      </h1>
      <p class="text-slate-500 mb-8 max-w-md mx-auto">
        抱歉，您访问的页面不存在或已被移除。
        <br>
        请检查URL是否正确，或返回首页重新开始。
      </p>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <n-button
          type="primary"
          size="large"
          @click="goHome"
        >
          <template #icon>
            <div class="i-carbon-home text-lg" />
          </template>
          返回首页
        </n-button>
        <n-button
          size="large"
          @click="goBack"
        >
          <template #icon>
            <div class="i-carbon-arrow-left text-lg" />
          </template>
          返回上一页
        </n-button>
      </div>

      <!-- 额外提示 -->
      <div class="mt-12 pt-8 border-t border-slate-200">
        <p class="text-sm text-slate-400">
          需要帮助？请联系管理员或查看文档
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可选：添加自定义动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
