<!--
  首页
  提供项目概览和导航
-->
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NButton, NSpace } from 'naive-ui'

const router = useRouter()
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
              @click="router.push('/loading')"
            >
              测试 Loading 页面
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
