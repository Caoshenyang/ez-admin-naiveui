<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">
        主题测试页面
      </h1>
      <p class="text-slate-600">
        验证 NaiveUI 主题切换是否正常工作
      </p>
    </div>

    <!-- 主题切换控制 -->
    <n-card title="当前主题状态">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-500 mb-1">当前模式</p>
          <p class="text-lg font-semibold" :class="isDark ? 'text-primary-500' : 'text-orange-500'">
            {{ isDark ? '🌙 暗色' : '☀️ 亮色' }}
          </p>
        </div>
        <n-space>
          <n-button type="primary" @click="toggleTheme">
            切换主题
          </n-button>
        </n-space>
      </div>
    </n-card>

    <!-- NaiveUI 组件测试 -->
    <n-card title="NaiveUI 组件测试">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="space-y-3">
          <p class="text-sm text-slate-600">按钮</p>
          <n-space>
            <n-button type="primary">主要按钮</n-button>
            <n-button type="success">成功按钮</n-button>
            <n-button type="warning">警告按钮</n-button>
            <n-button type="error">错误按钮</n-button>
          </n-space>
        </div>
        <div class="space-y-3">
          <p class="text-sm text-slate-600">输入框</p>
          <n-input placeholder="请输入内容" />
          <n-input type="textarea" placeholder="多行输入" />
        </div>
        <div class="space-y-3">
          <p class="text-sm text-slate-600">开关</p>
          <n-space>
            <n-switch />
            <n-switch disabled />
          </n-space>
          <p class="text-sm text-slate-600 mt-4">选择器</p>
          <n-select
            :options="[
              { label: '选项1', value: 1 },
              { label: '选项2', value: 2 }
            ]"
            placeholder="请选择"
          />
        </div>
      </div>
    </n-card>

    <!-- 颜色测试 -->
    <n-card title="颜色测试">
      <n-space>
        <n-tag type="primary">主要</n-tag>
        <n-tag type="success">成功</n-tag>
        <n-tag type="warning">警告</n-tag>
        <n-tag type="error">错误</n-tag>
        <n-tag type="info">信息</n-tag>
      </n-space>
    </n-card>
  </div>
</template>
