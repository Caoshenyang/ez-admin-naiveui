<script setup lang="ts">
import { ref, h } from 'vue'
import { NButton, NCode, NInput, NSpace, useMessage, type FormInst } from 'naive-ui'
import EzModal from '@/components/EzModal.vue'
import EzForm from '@/components/EzForm.vue'
import type { FormOptions } from '@/types/form'

const message = useMessage()

// ==================== 基础弹窗 ====================
const showBasic = ref(false)

const handleBasicConfirm = () => {
  message.success('点击了确定')
  showBasic.value = false
}

// ==================== 确认弹窗 ====================
const showConfirm = ref(false)

const handleConfirmPositive = () => {
  message.warning('执行删除操作')
  showConfirm.value = false
}

const handleConfirmNegative = () => {
  message.info('已取消删除')
}

// ==================== 表单弹窗 ====================
const showFormModal = ref(false)
const formRef = ref<FormInst | null>(null)

const formOptions: FormOptions = {
  layout: 'horizontal',
  labelWidth: 80,
  items: [
    {
      field: 'name',
      label: '用户名',
      type: 'input',
      placeholder: '请输入用户名',
      rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    },
    {
      field: 'email',
      label: '邮箱',
      type: 'input',
      placeholder: '请输入邮箱',
      rules: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
      ],
    },
    {
      field: 'role',
      label: '角色',
      type: 'select',
      placeholder: '请选择角色',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
        { label: '访客', value: 'guest' },
      ],
      defaultValue: 'user',
      rules: [{ required: true, message: '请选择角色', trigger: 'change' }],
    },
  ],
}

const handleFormSubmit = (values: Record<string, unknown>) => {
  message.success(`提交成功：${JSON.stringify(values)}`)
  showFormModal.value = false
}

// ==================== 自定义内容弹窗 ====================
const showCustom = ref(false)

// ==================== 不同尺寸弹窗 ====================
const showSmall = ref(false)
const showMedium = ref(false)
const showLarge = ref(false)
const showHuge = ref(false)

// ==================== 异步操作弹窗 ====================
const showAsync = ref(false)
const asyncLoading = ref(false)

const handleAsyncPositive = async () => {
  asyncLoading.value = true
  // 模拟异步操作
  await new Promise((resolve) => setTimeout(resolve, 2000))
  asyncLoading.value = false
  message.success('异步操作完成')
  showAsync.value = false
}

// ==================== 不可关闭弹窗 ====================
const showForce = ref(false)

// ==================== 自定义样式弹窗 ====================
const showStyled = ref(false)
</script>

<template>
  <div class="modal-example-page min-h-screen bg-gray-50 p-6">
    <!-- 页面头部 -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">EzModal 弹窗组件示例</h1>
      <p class="text-gray-600">基于 NaiveUI Modal 的极简封装</p>
    </div>

    <!-- 示例网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- 基础弹窗 -->
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">基础弹窗</h3>
        <p class="text-sm text-gray-500 mb-3">最简单的弹窗使用方式</p>
        <NButton type="primary" @click="showBasic = true">打开弹窗</NButton>
      </div>

      <!-- 确认弹窗 -->
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">确认弹窗</h3>
        <p class="text-sm text-gray-500 mb-3">危险操作确认</p>
        <NButton type="warning" @click="showConfirm = true">删除确认</NButton>
      </div>

      <!-- 表单弹窗 -->
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">表单弹窗</h3>
        <p class="text-sm text-gray-500 mb-3">在弹窗中使用表单</p>
        <NButton type="info" @click="showFormModal = true">新建用户</NButton>
      </div>

      <!-- 自定义内容 -->
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">自定义内容</h3>
        <p class="text-sm text-gray-500 mb-3">使用默认插槽自定义内容</p>
        <NButton type="success" @click="showCustom = true">查看详情</NButton>
      </div>

      <!-- 异步操作 -->
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">异步操作</h3>
        <p class="text-sm text-gray-500 mb-3">带加载状态的异步操作</p>
        <NButton type="tertiary" @click="showAsync = true">异步提交</NButton>
      </div>

      <!-- 强制关闭 -->
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">强制操作</h3>
        <p class="text-sm text-gray-500 mb-3">必须做出选择的弹窗</p>
        <NButton type="error" @click="showForce = true">重要提示</NButton>
      </div>
    </div>

    <!-- 尺寸示例 -->
    <div class="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">不同尺寸</h3>
      <NSpace>
        <NButton @click="showSmall = true">小 (400px)</NButton>
        <NButton @click="showMedium = true">中 (600px)</NButton>
        <NButton @click="showLarge = true">大 (800px)</NButton>
        <NButton @click="showHuge = true">超大 (1200px)</NButton>
      </NSpace>
    </div>

    <!-- ==================== 弹窗组件 ==================== -->

    <!-- 基础弹窗 -->
    <EzModal v-model:show="showBasic" title="基础弹窗" @positive-click="handleBasicConfirm">
      <div class="py-4">
        <p class="text-gray-700">这是一个基础的弹窗示例，支持 v-model 双向绑定显示状态。</p>
      </div>
    </EzModal>

    <!-- 确认弹窗 -->
    <EzModal
      v-model:show="showConfirm"
      title="确认删除"
      positive-text="删除"
      negative-text="取消"
      positive-type="error"
      @positive-click="handleConfirmPositive"
      @negative-click="handleConfirmNegative"
    >
      <div class="py-4">
        <p class="text-red-600 font-semibold mb-2">⚠️ 危险操作</p>
        <p class="text-gray-700">删除后数据将无法恢复，确定要删除吗？</p>
      </div>
    </EzModal>

    <!-- 表单弹窗 -->
    <EzModal v-model:show="showFormModal" title="新建用户" width="700px" @positive-click="formRef?.validate()">
      <EzForm
        ref="formRef"
        :options="formOptions"
        submit-text="确定"
        reset-text="取消"
        :show-actions="false"
        @submit="handleFormSubmit"
      />
      <template #action>
        <NSpace>
          <NButton @click="showFormModal = false">取消</NButton>
          <NButton type="primary" @click="formRef?.validate()">确定</NButton>
        </NSpace>
      </template>
    </EzModal>

    <!-- 自定义内容弹窗 -->
    <EzModal v-model:show="showCustom" title="用户详情" positive-text="关闭">
      <div class="py-4">
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-500">用户名</label>
            <p class="text-gray-900 mt-1">张三</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">邮箱</label>
            <p class="text-gray-900 mt-1">zhangsan@example.com</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">角色</label>
            <p class="text-gray-900 mt-1">
              <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">管理员</span>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">创建时间</label>
            <p class="text-gray-900 mt-1">2024-01-01 12:00:00</p>
          </div>
        </div>
      </div>
    </EzModal>

    <!-- 异步操作弹窗 -->
    <EzModal
      v-model:show="showAsync"
      title="异步操作"
      :loading="asyncLoading"
      positive-text="提交"
      @positive-click="handleAsyncPositive"
    >
      <div class="py-4">
        <p class="text-gray-700 mb-2">这将执行一个异步操作，需要等待 2 秒钟。</p>
        <p v-if="asyncLoading" class="text-blue-600">正在处理中...</p>
      </div>
    </EzModal>

    <!-- 强制操作弹窗 -->
    <EzModal
      v-model:show="showForce"
      title="重要提示"
      :mask-closable="false"
      :closable="false"
      positive-text="我已知晓"
      negative-text="返回"
    >
      <div class="py-4">
        <p class="text-orange-600 font-semibold mb-2">📢 重要通知</p>
        <p class="text-gray-700">此弹窗必须做出选择才能关闭，无法通过点击遮罩或关闭图标关闭。</p>
      </div>
    </EzModal>

    <!-- 尺寸弹窗 -->
    <EzModal v-model:show="showSmall" title="小尺寸弹窗" size="small">
      <div class="py-4">
        <p class="text-gray-700">宽度: 400px</p>
      </div>
    </EzModal>

    <EzModal v-model:show="showMedium" title="中等尺寸弹窗" size="medium">
      <div class="py-4">
        <p class="text-gray-700">宽度: 600px</p>
      </div>
    </EzModal>

    <EzModal v-model:show="showLarge" title="大尺寸弹窗" size="large">
      <div class="py-4">
        <p class="text-gray-700">宽度: 800px</p>
      </div>
    </EzModal>

    <EzModal v-model:show="showHuge" title="超大尺寸弹窗" size="huge">
      <div class="py-4">
        <p class="text-gray-700">宽度: 1200px</p>
      </div>
    </EzModal>
  </div>
</template>
