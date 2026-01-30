<!--
  Loading 状态管理使用示例
  演示 useLoading Hook 的各种使用场景
-->
<script setup lang="ts">
import { useLoading } from '@/hooks/useLoading'
import { message } from '@/hooks/useNaiveApi'
import { NButton, NSpace, NSpin, NCard, NCode, NSkeleton } from 'naive-ui'

// ========== 示例 1: 基础用法 ==========
const basicLoading = useLoading('basic')
const { isLoading: isBasicLoading } = basicLoading

async function handleBasicLoading() {
  await basicLoading.wrapLoading('demo',
    new Promise(resolve => setTimeout(resolve, 2000))
  )
  message.success('基础加载完成！')
}

// ========== 示例 2: 表单提交 ==========
const { isLoading: isSubmitting, startLoading, stopLoading } = useLoading('form')

async function handleSubmit() {
  startLoading('submit', { text: '提交表单中...' })
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    message.success('表单提交成功！')
  } finally {
    stopLoading('submit')
  }
}

// ========== 示例 3: 模块化使用（推荐） ==========
const userTable = useLoading('user-table')
const { isLoading: isUserTableLoading } = userTable

async function fetchUsers() {
  try {
    await userTable.wrapLoading('fetch',
      new Promise(resolve => setTimeout(resolve, 1500))
    )
    message.success('用户数据加载成功！')
  } catch (error) {
    console.error('加载失败:', error)
  }
}

// ========== 示例 4: 全局 Loading ==========
const {  loadingText } = useLoading()

async function handleGlobalLoading() {
  const globalTask = useLoading('global-task')
  await globalTask.wrapLoading('heavy',
    new Promise(resolve => setTimeout(resolve, 3000)),
    { global: true, text: '处理大量数据中...' }
  )
  message.success('全局任务处理完成！')
}

// ========== 示例 5: 多个并行操作 ==========
const parallel = useLoading('parallel')
const { loadingCount: parallelLoadingCount } = parallel

async function handleParallel() {
  const tasks = [
    parallel.wrapLoading('task1', new Promise(resolve => setTimeout(resolve, 1000))),
    parallel.wrapLoading('task2', new Promise(resolve => setTimeout(resolve, 1500))),
    parallel.wrapLoading('task3', new Promise(resolve => setTimeout(resolve, 800)))
  ]

  await Promise.all(tasks)
  message.success('并行任务全部完成！')
}

// ========== 示例 6: 骨架屏加载 ==========
const { isLoading: isSkeletonLoading } = useLoading('skeleton')

async function handleSkeletonLoading() {
  const skeleton = useLoading('skeleton')
  await skeleton.wrapLoading('data',
    new Promise(resolve => setTimeout(resolve, 2000))
  )
  message.success('数据加载完成！')
}

// 代码示例
const basicCode = `const basicLoading = useLoading('basic')
const { isLoading } = basicLoading

async function handleBasicLoading() {
  await basicLoading.wrapLoading('demo',
    new Promise(resolve => setTimeout(resolve, 2000))
  )
}`

const formCode = `const { isLoading: isSubmitting, startLoading, stopLoading } = useLoading('form')

async function handleSubmit() {
  startLoading('submit', { text: '提交表单中...' })
  try {
    await submitForm()
    window.$message?.success('提交成功')
  } finally {
    stopLoading('submit')
  }
}`

const moduleCode = `const userTable = useLoading('user-table')
const { isLoading } = userTable

async function fetchUsers() {
  await userTable.wrapLoading('fetch', userApi.getList({
    page: 1,
    pageSize: 10
  }))
}`

const globalCode = `// 监听全局 loading 状态
const { isGlobalLoading, loadingText } = useLoading()

// 在其他地方触发全局 loading
const globalTask = useLoading('global-task')
await globalTask.wrapLoading('heavy',
  heavyTask(),
  { global: true, text: '处理中...' }
)`

const parallelCode = `const parallel = useLoading('parallel')
const { loadingCount } = parallel

async function handleParallel() {
  const tasks = [
    parallel.wrapLoading('task1', apiCall1()),
    parallel.wrapLoading('task2', apiCall2()),
    parallel.wrapLoading('task3', apiCall3())
  ]
  await Promise.all(tasks)
}`

const skeletonCode = `const { isLoading } = useLoading('skeleton')

async function fetchData() {
  await wrapLoading('data', api.getData())
}

// 模板中
<NSkeleton :loading="isLoading">
  <div>实际内容</div>
</NSkeleton>`
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="border-b border-gray-200 pb-4">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Loading 状态管理示例</h1>
      <p class="text-gray-600">
        演示如何使用 <code class="px-2 py-1 bg-gray-100 rounded text-sm">useLoading</code> Hook 管理加载状态
      </p>
    </div>

    <!-- 示例 1: 基础用法 -->
    <NCard title="示例 1: 基础用法" hoverable>
      <NSpace vertical>
        <p class="text-gray-700">
          使用 <code class="px-2 py-1 bg-gray-100 rounded text-sm">wrapLoading</code> 自动管理异步操作的 loading 状态
        </p>
        <NSpace>
          <NSpin :show="isBasicLoading">
            <NButton type="primary" @click="handleBasicLoading">
              开始加载（2秒）
            </NButton>
          </NSpin>
        </NSpace>
        <NCode language="typescript" :code="basicCode" />
      </NSpace>
    </NCard>

    <!-- 示例 2: 表单提交 -->
    <NCard title="示例 2: 手动控制状态" hoverable>
      <NSpace vertical>
        <p class="text-gray-700">
          使用 <code class="px-2 py-1 bg-gray-100 rounded text-sm">startLoading</code> / <code class="px-2 py-1 bg-gray-100 rounded text-sm">stopLoading</code> 手动控制
        </p>
        <NSpace>
          <NButton :loading="isSubmitting" type="success" @click="handleSubmit">
            提交表单
          </NButton>
        </NSpace>
        <NCode language="typescript" :code="formCode" />
      </NSpace>
    </NCard>

    <!-- 示例 3: 模块化使用 -->
    <NCard title="示例 3: 模块化使用（推荐）" hoverable>
      <NSpace vertical>
        <p class="text-gray-700">
          使用模块前缀避免不同模块间的 loading 冲突
        </p>
        <NSpace>
          <NSpin :show="isUserTableLoading">
            <NButton type="info" @click="fetchUsers">
              加载用户列表
            </NButton>
          </NSpin>
        </NSpace>
        <NCode language="typescript" :code="moduleCode" />
      </NSpace>
    </NCard>

    <!-- 示例 4: 全局 Loading -->
    <NCard title="示例 4: 全局 Loading" hoverable>
      <NSpace vertical>
        <p class="text-gray-700">
          全屏遮罩 loading，当前提示文本: <code class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">{{ loadingText }}</code>
        </p>
        <NSpace>
          <NButton type="warning" @click="handleGlobalLoading">
            开始全局加载（3秒）
          </NButton>
        </NSpace>
        <div class="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          <span class="font-semibold">提示：</span> 点击按钮后，观察页面顶部的全局 loading 效果
        </div>
        <NCode language="typescript" :code="globalCode" />
      </NSpace>
    </NCard>

    <!-- 示例 5: 多个并行操作 -->
    <NCard title="示例 5: 多个并行操作" hoverable>
      <NSpace vertical>
        <p class="text-gray-700">
          当前模块 loading 数量: <strong class="text-2xl text-blue-600">{{ parallelLoadingCount }}</strong>
        </p>
        <NSpace>
          <NButton type="error" @click="handleParallel">
            并行执行 3 个任务
          </NButton>
        </NSpace>
        <NCode language="typescript" :code="parallelCode" />
      </NSpace>
    </NCard>

    <!-- 示例 6: 骨架屏加载 -->
    <NCard title="示例 6: 骨架屏加载" hoverable>
      <NSpace vertical>
        <p class="text-gray-700">
          使用骨架屏提升加载体验
        </p>
        <NSpace>
          <NButton type="tertiary" @click="handleSkeletonLoading">
            重新加载数据
          </NButton>
        </NSpace>
        <div class="mt-4">
          <NSkeleton :loading="isSkeletonLoading" :repeat="3">
            <div class="space-y-3">
              <div class="p-4 bg-gray-50 rounded">数据项 1：用户信息加载完成</div>
              <div class="p-4 bg-gray-50 rounded">数据项 2：订单信息加载完成</div>
              <div class="p-4 bg-gray-50 rounded">数据项 3：统计数据加载完成</div>
            </div>
          </NSkeleton>
        </div>
        <NCode language="typescript" :code="skeletonCode" />
      </NSpace>
    </NCard>

    <!-- 使用提示 -->
    <NCard title="使用建议" hoverable>
      <div class="space-y-3 text-sm">
        <div class="flex items-start gap-2">
          <span class="text-green-500 font-bold">✓</span>
          <span>为不同模块使用不同的 <code class="px-1 bg-gray-100 rounded">prefix</code>，避免状态冲突</span>
        </div>
        <div class="flex items-start gap-2">
          <span class="text-green-500 font-bold">✓</span>
          <span>优先使用 <code class="px-1 bg-gray-100 rounded">wrapLoading</code>，自动管理 loading 状态</span>
        </div>
        <div class="flex items-start gap-2">
          <span class="text-green-500 font-bold">✓</span>
          <span>复杂场景可手动使用 <code class="px-1 bg-gray-100 rounded">startLoading</code> / <code class="px-1 bg-gray-100 rounded">stopLoading</code></span>
        </div>
        <div class="flex items-start gap-2">
          <span class="text-green-500 font-bold">✓</span>
          <span>全局 loading 适合耗时较长的操作（如导出、批量处理）</span>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
:deep(.n-card) {
  border-radius: 8px;
}
</style>
