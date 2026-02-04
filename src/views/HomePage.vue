<!--
  系统首页 - 组件示例展示
-->
<script setup lang="ts">
import { ref } from 'vue'
import EzIcon from '@/components/EzIcon.vue'
import EzIconPicker from '@/components/EzIconPicker.vue'

// 示例数据
const selectedIcon = ref('mdi:view-dashboard-outline')
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- 欢迎标题 -->
    <div class="bg-linear-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
      <h1 class="text-3xl font-bold">欢迎使用 Ez Admin</h1>
      <p class="mt-2 text-blue-100">基于 Vue 3 + NaiveUI + Tailwind CSS 的高效率后台管理系统</p>
    </div>

    <!-- EzIcon 基础使用 -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4 text-gray-900">EzIcon 图标组件</h2>
      <p class="text-gray-600 text-sm mb-4">基于 Iconify 的企业级图标系统，支持 100,000+ 图标，风格统一为 Material Design Icons</p>

      <div class="space-y-4">
        <!-- 不同尺寸 -->
        <div>
          <p class="text-sm font-medium text-gray-700 mb-2">不同尺寸：</p>
          <div class="flex gap-4 items-center">
            <div class="flex flex-col items-center gap-1">
              <EzIcon icon="mdi:home-outline" :size="16" color="#3b82f6" />
              <span class="text-xs text-gray-500">16px</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <EzIcon icon="mdi:home-outline" :size="20" color="#3b82f6" />
              <span class="text-xs text-gray-500">20px</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <EzIcon icon="mdi:home-outline" :size="24" color="#3b82f6" />
              <span class="text-xs text-gray-500">24px</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <EzIcon icon="mdi:home-outline" :size="32" color="#3b82f6" />
              <span class="text-xs text-gray-500">32px</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <EzIcon icon="mdi:home-outline" :size="48" color="#3b82f6" />
              <span class="text-xs text-gray-500">48px</span>
            </div>
          </div>
        </div>

        <!-- 不同颜色 -->
        <div>
          <p class="text-sm font-medium text-gray-700 mb-2">不同颜色：</p>
          <div class="flex gap-4 items-center">
            <EzIcon icon="mdi:account-outline" :size="28" color="#ef4444" />
            <EzIcon icon="mdi:account-group-outline" :size="28" color="#f59e0b" />
            <EzIcon icon="mdi:cog-outline" :size="28" color="#10b981" />
            <EzIcon icon="mdi:shield-outline" :size="28" color="#3b82f6" />
            <EzIcon icon="mdi:star-outline" :size="28" color="#8b5cf6" />
          </div>
        </div>

        <!-- 常用图标展示 -->
        <div>
          <p class="text-sm font-medium text-gray-700 mb-2">常用图标：</p>
          <div class="flex flex-wrap gap-3">
            <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded">
              <EzIcon icon="mdi:home-outline" :size="20" color="#3b82f6" />
              <span class="text-xs text-gray-600">首页</span>
            </div>
            <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded">
              <EzIcon icon="mdi:account-outline" :size="20" color="#3b82f6" />
              <span class="text-xs text-gray-600">用户</span>
            </div>
            <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded">
              <EzIcon icon="mdi:cog-outline" :size="20" color="#3b82f6" />
              <span class="text-xs text-gray-600">设置</span>
            </div>
            <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded">
              <EzIcon icon="mdi:file-document-outline" :size="20" color="#3b82f6" />
              <span class="text-xs text-gray-600">文档</span>
            </div>
            <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded">
              <EzIcon icon="mdi:chart-bar" :size="20" color="#3b82f6" />
              <span class="text-xs text-gray-600">图表</span>
            </div>
            <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded">
              <EzIcon icon="mdi:database-outline" :size="20" color="#3b82f6" />
              <span class="text-xs text-gray-600">数据</span>
            </div>
            <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded">
              <EzIcon icon="mdi:pencil-outline" :size="20" color="#3b82f6" />
              <span class="text-xs text-gray-600">编辑</span>
            </div>
            <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded">
              <EzIcon icon="mdi:delete-outline" :size="20" color="#3b82f6" />
              <span class="text-xs text-gray-600">删除</span>
            </div>
            <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded">
              <EzIcon icon="mdi:search" :size="20" color="#3b82f6" />
              <span class="text-xs text-gray-600">搜索</span>
            </div>
            <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded">
              <EzIcon icon="mdi:refresh" :size="20" color="#3b82f6" />
              <span class="text-xs text-gray-600">刷新</span>
            </div>
          </div>
        </div>

        <!-- 旋转动画 -->
        <div>
          <p class="text-sm font-medium text-gray-700 mb-2">旋转动画：</p>
          <div class="flex gap-4 items-center">
            <EzIcon icon="mdi:refresh" :size="24" :spin="true" color="#3b82f6" />
            <span class="text-xs text-gray-500">加载中...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- EzIconPicker 图标选择器 -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4 text-gray-900">EzIconPicker 图标选择器</h2>
      <p class="text-gray-600 text-sm mb-4">点击下方输入框，从 88 个精选的 Material Design Icons 中选择图标</p>

      <div class="max-w-md">
        <EzIconPicker v-model="selectedIcon" placeholder="请选择图标" />
      </div>

      <div v-if="selectedIcon" class="mt-4 p-4 bg-gray-50 rounded">
        <p class="text-sm font-medium text-gray-700 mb-2">当前选中图标：</p>
        <div class="flex items-center gap-4">
          <EzIcon :icon="selectedIcon" :size="48" color="#3b82f6" />
          <div>
            <code class="text-xs bg-gray-200 px-2 py-1 rounded block">{{ selectedIcon }}</code>
            <p class="text-xs text-gray-500 mt-2">可直接用于菜单配置、表单等场景</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术栈说明 -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4 text-gray-900">技术栈</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 bg-gray-50 rounded text-center">
          <p class="font-semibold text-gray-900">Vue 3.5+</p>
          <p class="text-xs text-gray-500 mt-1">渐进式框架</p>
        </div>
        <div class="p-4 bg-gray-50 rounded text-center">
          <p class="font-semibold text-gray-900">NaiveUI</p>
          <p class="text-xs text-gray-500 mt-1">组件库</p>
        </div>
        <div class="p-4 bg-gray-50 rounded text-center">
          <p class="font-semibold text-gray-900">Tailwind CSS 4</p>
          <p class="text-xs text-gray-500 mt-1">样式框架</p>
        </div>
        <div class="p-4 bg-gray-50 rounded text-center">
          <p class="font-semibold text-gray-900">Iconify</p>
          <p class="text-xs text-gray-500 mt-1">图标系统</p>
        </div>
      </div>
    </div>
  </div>
</template>
