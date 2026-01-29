<!--
  Loading 状态管理使用示例
-->
<script setup lang="ts">
import { useLoading } from '@/hooks/useLoading'
import { userApi } from '@/api'
import { NButton, NSpace, NSpin, NCard, NCode } from 'naive-ui'

// 示例 1: 基础用法
const { isLoading: example1Loading, wrapLoading } = useLoading('example-1')

async function handleExample1() {
  await wrapLoading(
    'demo',
    new Promise(resolve => setTimeout(resolve, 2000)),
    { text: '加载中（2秒）...' }
  )
}

// 示例 2: 表单提交
const { isLoading: isSubmitting, startLoading, stopLoading } = useLoading('form-submit')

async function handleSubmit() {
  startLoading('submit', { text: '提交中...' })
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    window.$message?.success('提交成功')
  } finally {
    stopLoading('submit')
  }
}

// 示例 3: 模块化使用
const userTableLoading = useLoading('user-table')
const { isPrefixLoading: isUserTableLoading } = userTableLoading

async function fetchUsers() {
  try {
    await userTableLoading.wrapLoading('fetch', userApi.getList({
      page: 1,
      pageSize: 10
    }))
  } catch (error) {
    console.error('加载失败:', error)
  }
}

// 示例 4: 全局 Loading
const { isGlobalLoading, loadingText } = useLoading()

async function handleGlobalLoading() {
  const { wrapLoading } = useLoading('global-task')
  await wrapLoading(
    'heavy',
    new Promise(resolve => setTimeout(resolve, 3000)),
    { global: true, text: '处理大量数据中...' }
  )
}

// 示例 5: 多个并行操作
const { loadingCount, isPrefixLoading: isParallelLoading } = useLoading('parallel')

async function handleParallel() {
  const tasks = [
    useLoading('parallel').wrapLoading('task1', new Promise(resolve => setTimeout(resolve, 1000))),
    useLoading('parallel').wrapLoading('task2', new Promise(resolve => setTimeout(resolve, 1500))),
    useLoading('parallel').wrapLoading('task3', new Promise(resolve => setTimeout(resolve, 800)))
  ]

  await Promise.all(tasks)
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold mb-4">Loading 状态管理示例</h1>
      <p class="text-gray-600 mb-6">
        展示如何使用 useLoading Hook 管理加载状态
      </p>
    </div>

    <!-- 示例 1: 基础用法 -->
    <n-card title="示例 1: 基础用法" hoverable>
      <n-space vertical>
        <p>使用 wrapLoading 自动管理异步操作的 loading 状态</p>
        <n-space>
          <n-spin :show="example1Loading">
            <n-button type="primary" @click="handleExample1">
              开始加载（2秒）
            </n-button>
          </n-spin>
        </n-space>
        <n-code language="typescript" :code="`const { isLoading, wrapLoading } = useLoading('example-1')

async function handleClick() {
  await wrapLoading(
    'demo',
    apiCall(),
    { text: '加载中...' }
  )
}`" />
      </n-space>
    </n-card>

    <!-- 示例 2: 表单提交 -->
    <n-card title="示例 2: 表单提交" hoverable>
      <n-space vertical>
        <p>手动控制 loading 状态</p>
        <n-space>
          <n-button :loading="isSubmitting" type="success" @click="handleSubmit">
            提交表单
          </n-button>
        </n-space>
        <n-code language="typescript" :code="`const { isLoading: isSubmitting, startLoading, stopLoading } = useLoading('form-submit')

async function handleSubmit() {
  startLoading('submit', { text: '提交中...' })
  try {
    await submitForm()
    window.$message?.success('提交成功')
  } finally {
    stopLoading('submit')
  }
}`" />
      </n-space>
    </n-card>

    <!-- 示例 3: 模块化使用 -->
    <n-card title="示例 3: 模块化使用（推荐）" hoverable>
      <n-space vertical>
        <p>使用模块前缀避免 loading 冲突</p>
        <n-space>
          <n-spin :show="isUserTableLoading">
            <n-button type="info" @click="fetchUsers">
              加载用户列表
            </n-button>
          </n-spin>
        </n-space>
        <n-code language="typescript" :code="`const userTableLoading = useLoading('user-table')
const { isPrefixLoading } = userTableLoading

async function fetchUsers() {
  await userTableLoading.wrapLoading('fetch', userApi.getList({
    page: 1,
    pageSize: 10
  }))
}`" />
      </n-space>
    </n-card>

    <!-- 示例 4: 全局 Loading -->
    <n-card title="示例 4: 全局 Loading" hoverable>
      <n-space vertical>
        <p>全屏遮罩 loading，提示文本: {{ loadingText }}</p>
        <n-space>
          <n-spin :show="isGlobalLoading" description="全局加载中">
            <n-button type="warning" @click="handleGlobalLoading">
              开始全局加载（3秒）
            </n-button>
          </n-spin>
        </n-space>
        <n-code language="typescript" :code="`const { isGlobalLoading, loadingText } = useLoading()

async function handleGlobalLoading() {
  const { wrapLoading } = useLoading('global-task')
  await wrapLoading(
    'heavy',
    heavyTask(),
    { global: true, text: '处理中...' }
  )
}`" />
      </n-space>
    </n-card>

    <!-- 示例 5: 多个并行操作 -->
    <n-card title="示例 5: 多个并行操作" hoverable>
      <n-space vertical>
        <p>当前 loading 数量: <strong>{{ loadingCount }}</strong></p>
        <n-space>
          <n-spin :show="isParallelLoading">
            <n-button type="error" @click="handleParallel">
              并行执行 3 个任务
            </n-button>
          </n-spin>
        </n-space>
        <n-code language="typescript" :code="`const { loadingCount } = useLoading('parallel')

async function handleParallel() {
  const tasks = [
    wrapLoading('task1', apiCall1()),
    wrapLoading('task2', apiCall2()),
    wrapLoading('task3', apiCall3())
  ]
  await Promise.all(tasks)
}`" />
      </n-space>
    </n-card>
  </div>
</template>
