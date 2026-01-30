<!--
  EzLoadingBar 进度条示例
  演示全局加载进度条的各种使用场景
-->
<script setup lang="ts">
import { ref } from 'vue'
import { useLoading } from '@/hooks/useLoading'
import { message } from '@/hooks/useNaiveApi'
import { NButton, NSpace, NCard, NCode, NAlert, NInputNumber, NSwitch } from 'naive-ui'
import LocalLoadingBarDemo from './LocalLoadingBarDemo.vue'

// ========== 示例 1: 基础用法 ==========
const basicLoading = useLoading('loadingbar-basic')

async function handleBasicLoading() {
  await basicLoading.wrapLoading('demo', new Promise((resolve) => setTimeout(resolve, 2000)), {
    global: true,
    text: '基础加载中...'
  })
  message.success('基础加载完成！')
}

// ========== 示例 2: 模拟页面切换 ==========
const pageLoading = useLoading('loadingbar-page')

async function handlePageSwitch(pageName: string) {
  await pageLoading.wrapLoading('switch', new Promise((resolve) => setTimeout(resolve, 1500)), {
    global: true,
    text: `正在加载 ${pageName}...`
  })
  message.success(`已切换到 ${pageName}`)
}

// ========== 示例 3: 模拟数据请求（含错误处理） ==========
const apiLoading = useLoading('loadingbar-api')

async function handleFetchData(shouldFail?: boolean) {
  try {
    await apiLoading.wrapLoading(
      'fetch',
      new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟成功或失败
          if (shouldFail) {
            reject(new Error('网络请求失败'))
          } else {
            resolve({ data: '模拟数据' })
          }
        }, 2000)
      }),
      { global: true, text: shouldFail ? '正在获取数据（将失败）...' : '正在获取数据...' }
    )
    message.success('数据加载成功！')
  } catch (error) {
    message.error('数据加载失败！（进度条会显示红色）')
    console.error(error)
  }
}

// ========== 示例 4: 文件上传进度模拟 ==========
const uploadLoading = useLoading('loadingbar-upload')
const uploadProgress = ref(0)

async function handleFileUpload() {
  uploadProgress.value = 0
  const interval = setInterval(() => {
    uploadProgress.value += 10
    if (uploadProgress.value >= 100) {
      clearInterval(interval)
    }
  }, 200)

  await uploadLoading.wrapLoading('upload', new Promise((resolve) => setTimeout(resolve, 2000)), {
    global: true,
    text: `文件上传中... ${uploadProgress.value}%`
  })
  message.success('文件上传成功！')
}

// ========== 示例 5: 多步骤操作 ==========
const stepLoading = useLoading('loadingbar-step')
const currentStep = ref(0)
const steps = ['初始化', '处理数据', '验证结果', '保存到服务器']

async function handleMultiStep() {
  for (let i = 0; i < steps.length; i++) {
    currentStep.value = i + 1
    // 动态更新进度条文本
    stepLoading.startLoading('multistep', {
      global: true,
      text: `执行步骤 ${i + 1}/${steps.length}: ${steps[i]}`
    })
    await new Promise((resolve) => setTimeout(resolve, 800))
  }
  currentStep.value = 0
  message.success('所有步骤已完成！')
}

async function handleMultiStepWithLoading() {
  try {
    // 初始启动 loading
    stepLoading.startLoading('multistep', {
      global: true,
      text: `执行步骤 0/${steps.length}: 准备中`
    })
    await handleMultiStep()
    stepLoading.stopLoading('multistep')
  } catch (error) {
    console.error(error)
    stepLoading.stopLoading('multistep')
  }
}

// ========== 示例 6: 自定义配置 ==========
const customDuration = ref(2000)
const useCustomConfig = ref(false)

const customLoading = useLoading('loadingbar-custom')

async function handleCustomLoading() {
  const options = useCustomConfig.value ? { global: true as const, text: '自定义加载文本' } : undefined

  await customLoading.wrapLoading(
    'custom',
    new Promise((resolve) => setTimeout(resolve, customDuration.value)),
    options
  )
  message.success('自定义配置加载完成！')
}

// ========== 示例 7: 错误处理（重点展示） ==========
const errorLoading = useLoading('loadingbar-error')

async function handleErrorScenario(shouldFail: boolean) {
  try {
    await errorLoading.wrapLoading(
      'error-test',
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (shouldFail) {
            reject(new Error('模拟业务错误'))
          } else {
            resolve('成功')
          }
        }, 1500)
      }),
      { global: true, text: shouldFail ? '正在执行失败操作...' : '正在执行成功操作...' }
    )
    message.success('操作成功完成！')
  } catch (error) {
    message.error('操作失败：' + (error as Error).message + '（注意进度条变红）')
  }
}

// ========== 示例 8: 局部进度条（新功能） ==========
// 局部进度条实现见 LocalLoadingBarDemo.vue 和 LocalLoadingBarTrigger.vue 组件
//
// ⚠️ 重要：为什么需要子组件模式？
//
// 原因：useLoadingBar() 会自动向上查找组件树中最近的 NLoadingBarProvider。
//       由于 App.vue 中已经配置了全局 NLoadingBarProvider，如果在同一组件内
//       直接调用 useLoadingBar()，会优先使用全局 Provider 而非局部 Provider。
//
// 解决方案：父子组件分离模式
//   1. LocalLoadingBarDemo.vue（父组件）：包含 NLoadingBarProvider 和目标容器
//   2. LocalLoadingBarTrigger.vue（子组件）：在 Provider 内部调用 useLoadingBar()
//   3. 父组件通过 ref 和 defineExpose 获取子组件的 loadingBar 实例
//
// 这样可以确保子组件的 setup 执行时，位于局部 Provider 的作用域内，
// 从而正确使用局部 Provider 而非全局 Provider。

// 代码示例
const basicCode = `const basicLoading = useLoading('loadingbar-basic')

async function handleBasicLoading() {
  await basicLoading.wrapLoading(
    'demo',
    fetchData(),
    { global: true, text: '加载中...' }
  )
  // 进度条自动显示和消失
}`

const errorCode = `const apiLoading = useLoading('loadingbar-api')

async function fetchData() {
  try {
    const data = await apiLoading.wrapLoading(
      'fetch',
      api.getUserInfo(),
      { global: true, text: '正在获取数据...' }
    )
    // 成功时进度条正常完成
  } catch (error) {
    // 失败时进度条自动显示错误状态（红色）
    console.error(error)
  }
}`

const localCode = `// 局部进度条必须使用父子组件分离模式
//
// 原因：useLoadingBar() 会自动向上查找最近的 Provider
//       App.vue 中有全局 Provider，需要避免冲突
//
// 解决方案：
//   1. 父组件：创建 NLoadingBarProvider 和目标容器
//   2. 子组件：在 Provider 内部调用 useLoadingBar()
//   3. 通过 ref + defineExpose 在父组件中调用子组件的 loadingBar
//
// 核心要点：
//   - 容器使用 position: relative
//   - 目标元素使用 position: absolute (top/right/bottom/left: 0)
//   - 子组件必须在 Provider 内部渲染
//
// 参见：LocalLoadingBarDemo.vue 和 LocalLoadingBarTrigger.vue`
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="border-b border-gray-200 pb-4">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">EzLoadingBar 进度条示例</h1>
      <p class="text-gray-600">
        全局加载进度条组件，配合 <code class="px-2 py-1 bg-gray-100 rounded text-sm">useLoading</code> Hook 使用
      </p>
      <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
        <span class="font-semibold">💡 提示：</span>
        进度条显示在页面顶部，需要全局配置 <code class="px-1 bg-blue-100 rounded">EzLoadingBar</code> 组件。
        当操作失败时，进度条会自动显示红色错误状态。
      </div>
    </div>

    <!-- 示例 1: 基础用法 -->
    <NCard title="示例 1: 基础用法" hoverable>
      <NSpace vertical>
        <p class="text-gray-700">
          使用 <code class="px-2 py-1 bg-gray-100 rounded text-sm">wrapLoading</code> +
          <code class="px-2 py-1 bg-gray-100 rounded text-sm">{ global: true }</code> 触发全局进度条
        </p>
        <NSpace>
          <NButton type="primary" @click="handleBasicLoading"> 开始加载（2秒） </NButton>
        </NSpace>
        <NCode language="typescript" :code="basicCode" />
      </NSpace>
    </NCard>

    <!-- 示例 2: 模拟页面切换 -->
    <NCard title="示例 2: 页面切换" hoverable>
      <NSpace vertical>
        <p class="text-gray-700">模拟路由切换时的加载效果</p>
        <NSpace>
          <NButton type="info" @click="() => handlePageSwitch('用户管理')"> 切换到用户管理 </NButton>
          <NButton type="success" @click="() => handlePageSwitch('订单列表')"> 切换到订单列表 </NButton>
          <NButton type="warning" @click="() => handlePageSwitch('系统设置')"> 切换到系统设置 </NButton>
        </NSpace>
      </NSpace>
    </NCard>

    <!-- 示例 3: 模拟数据请求（含错误处理） -->
    <NCard title="示例 3: 数据请求（含错误处理）✨" hoverable>
      <NSpace vertical>
        <p class="text-gray-700">模拟 API 请求，展示成功和失败时的不同进度条状态</p>
        <NSpace>
          <NButton type="success" @click="() => handleFetchData(false)"> 模拟成功请求（绿色进度条） </NButton>
          <NButton type="error" @click="() => handleFetchData(true)"> 模拟失败请求（红色进度条）✨ </NButton>
        </NSpace>
        <div class="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          <span class="font-semibold">✨ 新功能：</span>
          当请求失败时，进度条会自动显示红色错误状态！
        </div>
        <NCode language="typescript" :code="errorCode" />
      </NSpace>
    </NCard>

    <!-- 示例 4: 文件上传 -->
    <NCard title="示例 4: 文件上传" hoverable>
      <NSpace vertical>
        <p class="text-gray-700">模拟文件上传时的进度反馈</p>
        <div class="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <div class="flex items-center justify-between text-sm">
            <span class="text-yellow-800">上传进度：</span>
            <span class="font-bold text-yellow-900">{{ uploadProgress }}%</span>
          </div>
          <div class="mt-2 h-2 bg-yellow-200 rounded-full overflow-hidden">
            <div class="h-full bg-yellow-600 transition-all duration-300" :style="{ width: uploadProgress + '%' }" />
          </div>
        </div>
        <NSpace>
          <NButton type="success" @click="handleFileUpload"> 上传文件 </NButton>
        </NSpace>
      </NSpace>
    </NCard>

    <!-- 示例 5: 多步骤操作 -->
    <NCard title="示例 5: 多步骤操作" hoverable>
      <NSpace vertical>
        <p class="text-gray-700">模拟需要多个步骤的复杂操作</p>
        <div class="mb-3">
          <div class="flex items-center gap-2">
            <span
              v-for="(step, index) in steps"
              :key="index"
              class="px-3 py-1 rounded text-sm transition-colors"
              :class="{
                'bg-green-500 text-white': index < currentStep,
                'bg-blue-500 text-white': index === currentStep - 1,
                'bg-gray-200 text-gray-600': index >= currentStep
              }"
            >
              {{ index + 1 }}. {{ step }}
            </span>
          </div>
        </div>
        <NSpace>
          <NButton type="primary" @click="handleMultiStepWithLoading"> 执行多步骤操作 </NButton>
        </NSpace>
      </NSpace>
    </NCard>

    <!-- 示例 6: 自定义配置 -->
    <NCard title="示例 6: 自定义配置" hoverable>
      <NSpace vertical>
        <p class="text-gray-700">自定义加载时长和是否使用全局进度条</p>
        <div class="flex items-center gap-4 mb-3">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">加载时长：</span>
            <NInputNumber v-model:value="customDuration" :min="500" :max="10000" :step="500" class="w-32" />
            <span class="text-sm text-gray-500">ms</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">使用全局进度条：</span>
            <NSwitch v-model:value="useCustomConfig" />
          </div>
        </div>
        <NSpace>
          <NButton type="tertiary" @click="handleCustomLoading"> 开始加载 </NButton>
        </NSpace>
      </NSpace>
    </NCard>

    <!-- 示例 7: 错误处理（重点展示） -->
    <NCard title="示例 7: 错误处理（重点）✨" hoverable>
      <NSpace vertical>
        <p class="text-gray-700">测试错误情况下的进度条行为</p>
        <NSpace>
          <NButton type="success" @click="() => handleErrorScenario(false)"> 模拟成功操作（绿色进度条） </NButton>
          <NButton type="error" @click="() => handleErrorScenario(true)"> 模拟失败操作（红色进度条）✨ </NButton>
        </NSpace>
        <NAlert type="warning" title="注意观察">
          点击"模拟失败操作"后，进度条会显示红色错误状态。这是自动处理的结果，无需手动调用 error()！
        </NAlert>
      </NSpace>
    </NCard>

    <!-- 示例 8: 局部进度条 -->
    <NCard title="示例 8: 局部进度条（新功能）✨" hoverable>
      <NSpace vertical>
        <p class="text-gray-700">在指定容器内显示进度条，而不是全局</p>
        <div class="mb-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
          <span class="font-semibold">✨ 新功能：</span>
          支持局部进度条！可以在组件内部显示独立的进度条。
          <br />
          <span class="text-xs">提示：点击按钮后，进度条只会显示在下方虚线框容器顶部，而不是页面顶部</span>
          <br />
          <span class="text-xs text-green-700"
            >⚠️ 注意：局部进度条必须使用独立组件实现，避免与全局 App.vue 中的 Provider 冲突</span
          >
        </div>

        <!-- 局部进度条容器示例 - 使用独立组件 -->
        <LocalLoadingBarDemo />
        <NCode language="vue" :code="localCode" />
      </NSpace>
    </NCard>

    <!-- 使用说明 -->
    <NCard title="使用说明" hoverable>
      <div class="space-y-4 text-sm">
        <div>
          <h3 class="font-semibold text-gray-900 mb-2">全局配置：</h3>
          <p class="text-gray-700 mb-2">
            在应用根组件中配置 <code class="px-2 py-1 bg-gray-100 rounded">EzLoadingBar</code> 组件：
          </p>
          <div class="bg-gray-900 rounded-lg p-4">
            <pre class="text-sm text-green-400 font-mono whitespace-pre-wrap">
// App.vue
&lt;template&gt;
  &lt;n-config-provider&gt;
    &lt;n-loading-bar-provider&gt;
      &lt;EzLoadingBar&gt;
        &lt;n-message-provider&gt;
          &lt;n-dialog-provider&gt;
            &lt;n-notification-provider&gt;
              &lt;n-spin :show="isGlobalLoading"&gt;
                &lt;router-view /&gt;
              &lt;/n-spin&gt;
            &lt;/n-notification-provider&gt;
          &lt;/n-dialog-provider&gt;
        &lt;/n-message-provider&gt;
      &lt;/EzLoadingBar&gt;
    &lt;/n-loading-bar-provider&gt;
  &lt;/n-config-provider&gt;
&lt;/template&gt;</pre
            >
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-gray-900 mb-2">核心特性：</h3>
          <ul class="list-disc list-inside space-y-1 text-gray-700">
            <li>自动管理：使用 <code class="px-1 bg-gray-100 rounded">wrapLoading</code> 自动触发和结束</li>
            <li>全局状态：设置 <code class="px-1 bg-gray-100 rounded">{ global: true }</code> 显示全局进度条</li>
            <li>自定义文本：通过 <code class="px-1 bg-gray-100 rounded">text</code> 参数自定义提示文本</li>
            <li><strong class="text-red-600">错误处理：</strong>Promise 失败时自动显示红色错误状态 ✨</li>
            <li><strong class="text-blue-600">局部容器：</strong>支持在指定容器内显示进度条 ✨</li>
            <li>模块化：使用前缀避免不同模块的状态冲突</li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold text-gray-900 mb-2">适用场景：</h3>
          <div class="grid grid-cols-2 gap-2">
            <div class="p-2 bg-gray-50 rounded text-xs">✓ 页面路由切换</div>
            <div class="p-2 bg-gray-50 rounded text-xs">✓ 数据异步加载</div>
            <div class="p-2 bg-gray-50 rounded text-xs">✓ 文件上传/下载</div>
            <div class="p-2 bg-gray-50 rounded text-xs">✓ 批量数据处理</div>
            <div class="p-2 bg-gray-50 rounded text-xs">✓ 表单提交</div>
            <div class="p-2 bg-gray-50 rounded text-xs">✓ 多步骤操作流程</div>
            <div class="p-2 bg-gray-50 rounded text-xs">✓ 组件内局部加载 ✨</div>
            <div class="p-2 bg-gray-50 rounded text-xs">✓ 错误提示 ✨</div>
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-gray-900 mb-2">新功能亮点：</h3>
          <div class="space-y-2">
            <div class="p-3 bg-red-50 border border-red-200 rounded">
              <h4 class="font-semibold text-red-800 mb-1">🔴 错误处理</h4>
              <p class="text-sm text-red-700">
                当异步操作失败时，进度条会自动显示红色错误状态，无需手动调用 error()。 只需要在 try-catch
                中处理错误，进度条会自动响应。
              </p>
            </div>
            <div class="p-3 bg-blue-50 border border-blue-200 rounded">
              <h4 class="font-semibold text-blue-800 mb-1">📦 局部容器</h4>
              <p class="text-sm text-blue-700">
                支持在组件内部显示独立的进度条，通过 <code class="px-1 bg-blue-100 rounded">to</code> 属性指定容器。
                适合需要在局部区域显示加载状态的场景。
              </p>
            </div>
          </div>
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
