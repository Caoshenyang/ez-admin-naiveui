<!--
  首页
  提供项目概览和导航
-->
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NButton, NCard, NSpace, NIcon } from 'naive-ui'

const router = useRouter()

// 快速入口卡片
const quickLinks = [
  {
    title: '组件示例',
    description: '查看所有组件示例和测试合集',
    icon: '📦',
    path: '/examples',
    color: 'bg-blue-500',
  },
  {
    title: '表格示例',
    description: 'EzTable 增强型表格组件演示',
    icon: '📊',
    path: '/examples',
    color: 'bg-cyan-500',
  },
  {
    title: '表单示例',
    description: 'EzForm 配置式表单组件演示',
    icon: '📝',
    path: '/examples',
    color: 'bg-green-500',
  },
  {
    title: '弹窗示例',
    description: 'EzModal 极简弹窗组件演示',
    icon: '🪟',
    path: '/examples',
    color: 'bg-purple-500',
  },
  {
    title: 'LoadingBar 示例',
    description: '全局进度条组件演示（支持错误处理和局部容器）',
    icon: '📈',
    path: '/examples',
    color: 'bg-orange-500',
  },
]
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
    <!-- Hero 区域 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-16">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-gray-900 mb-4">
            Ez Admin NaiveUI
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            基于 Vue 3 + TypeScript + NaiveUI 的高效率后台管理系统模板
          </p>
          <NSpace justify="center">
            <NButton
              type="primary"
              size="large"
              @click="router.push('/examples')"
            >
              查看组件示例
            </NButton>
            <NButton
              size="large"
              @click="router.push('/examples')"
            >
              快速开始
            </NButton>
          </NSpace>
        </div>
      </div>
    </div>

    <!-- 特性展示 -->
    <div class="max-w-7xl mx-auto px-6 py-16">
      <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
        核心技术栈
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-sm text-center">
          <div class="text-4xl mb-3">⚡️</div>
          <h3 class="font-semibold text-gray-900 mb-2">Vue 3.5+</h3>
          <p class="text-sm text-gray-600">Composition API</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm text-center">
          <div class="text-4xl mb-3">🎨</div>
          <h3 class="font-semibold text-gray-900 mb-2">NaiveUI</h3>
          <p class="text-sm text-gray-600">组件库</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm text-center">
          <div class="text-4xl mb-3">🎯</div>
          <h3 class="font-semibold text-gray-900 mb-2">TypeScript</h3>
          <p class="text-sm text-gray-600">完整类型支持</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm text-center">
          <div class="text-4xl mb-3">💨</div>
          <h3 class="font-semibold text-gray-900 mb-2">Tailwind CSS</h3>
          <p class="text-sm text-gray-600">4.x 最新版</p>
        </div>
      </div>
    </div>

    <!-- 快速入口 -->
    <div class="max-w-7xl mx-auto px-6 pb-16">
      <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
        快速入口
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <NCard
          v-for="link in quickLinks"
          :key="link.path"
          class="hover:shadow-lg transition-shadow cursor-pointer"
          @click="router.push(link.path)"
        >
          <div class="text-center">
            <div class="text-5xl mb-4">{{ link.icon }}</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ link.title }}
            </h3>
            <p class="text-gray-600 mb-4">
              {{ link.description }}
            </p>
            <NButton
              :type="
                link.color.includes('blue')
                  ? 'primary'
                  : link.color.includes('green')
                    ? 'success'
                    : link.color.includes('purple')
                      ? 'info'
                      : link.color.includes('orange')
                        ? 'warning'
                        : link.color.includes('cyan')
                          ? 'info'
                          : 'default'
              "
            >
              查看详情 →
            </NButton>
          </div>
        </NCard>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="bg-gray-900 text-white py-8">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <p class="text-gray-400">
          Ez Admin NaiveUI - 基于 Vue 3 的高效率后台管理系统模板
        </p>
        <p class="text-gray-500 text-sm mt-2">
          使用 Vue 3 + TypeScript + NaiveUI + Tailwind CSS 构建
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.n-card {
  transition: all 0.3s ease;
}

.n-card:hover {
  transform: translateY(-4px);
}
</style>
