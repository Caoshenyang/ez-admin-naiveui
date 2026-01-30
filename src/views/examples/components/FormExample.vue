<!--
  EzForm 完整示例
  演示所有表单项类型和功能
-->
<script setup lang="ts">
import { ref } from 'vue'
import type { FormOptions, FormValues } from '@/types/form'

const formRef = ref()
const formData = ref<FormValues>({})
const formData2 = ref<FormValues>({})
const formData3 = ref<FormValues>({})

// 完整表单配置 - 包含所有类型
const fullFormOptions: FormOptions = {
  layout: 'horizontal',
  labelWidth: 120,
  labelAlign: 'right',
  labelPlacement: 'left',
  size: 'medium',
  columns: 2,
  gutter: 16,
  items: [
    // ===== 基础输入类 =====
    {
      field: 'username',
      label: '用户名',
      type: 'input',
      placeholder: '请输入用户名',
      defaultValue: '',
      rules: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
      ],
    },
    {
      field: 'password',
      label: '密码',
      type: 'input-password',
      placeholder: '请输入密码',
      props: {
        autocomplete: 'current-password',
      },
      rules: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
      ],
    },
    {
      field: 'email',
      label: '邮箱',
      type: 'input',
      placeholder: '请输入邮箱地址',
      rules: [
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
      ],
    },
    {
      field: 'age',
      label: '年龄',
      type: 'input-number',
      placeholder: '请输入年龄',
      props: {
        min: 0,
        max: 150,
        step: 1,
      },
    },
    {
      field: 'price',
      label: '价格',
      type: 'input-number',
      placeholder: '请输入价格',
      props: {
        min: 0,
        precision: 2,
        step: 0.01,
      },
      defaultValue: 0,
    },

    // ===== 选择类 =====
    {
      field: 'gender',
      label: '性别',
      type: 'select',
      placeholder: '请选择性别',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '其他', value: 'other' },
      ],
    },
    {
      field: 'hobbies',
      label: '爱好',
      type: 'multi-select',
      placeholder: '请选择爱好',
      options: [
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
        { label: '游戏', value: 'games' },
        { label: '旅行', value: 'travel' },
        { label: '摄影', value: 'photography' },
      ],
      defaultValue: [],
    },
    {
      field: 'country',
      label: '国家',
      type: 'select',
      placeholder: '请选择国家',
      props: {
        filterable: true,
        tag: true,
      },
      options: [
        { label: '中国', value: 'china' },
        { label: '美国', value: 'usa' },
        { label: '日本', value: 'japan' },
        { label: '韩国', value: 'korea' },
      ],
    },

    // ===== 日期时间类 =====
    {
      field: 'birthday',
      label: '生日',
      type: 'date-picker',
      placeholder: '请选择生日',
      props: {
        format: 'yyyy-MM-dd',
      },
    },
    {
      field: 'workStartDate',
      label: '工作开始日期',
      type: 'date-picker',
      placeholder: '请选择日期',
      props: {
        type: 'date',
        format: 'yyyy-MM-dd',
      },
    },
    {
      field: 'dateRange',
      label: '日期范围',
      type: 'date-range-picker',
      placeholder: '请选择日期范围',
      span: 12,
    },
    {
      field: 'createdAt',
      label: '创建时间',
      type: 'datetime-picker',
      placeholder: '请选择日期时间',
      props: {
        format: 'yyyy-MM-dd HH:mm:ss',
      },
    },
    {
      field: 'workTime',
      label: '工作时间',
      type: 'time-picker',
      placeholder: '请选择时间',
      props: {
        format: 'HH:mm:ss',
      },
    },
    {
      field: 'timeRange',
      label: '时间段',
      type: 'time-picker',
      placeholder: '请选择时间段',
      props: {
        isRange: true,
      },
    },

    // ===== 开关和选择类 =====
    {
      field: 'isActive',
      label: '是否激活',
      type: 'switch',
      defaultValue: false,
    },
    {
      field: 'notifications',
      label: '接收通知',
      type: 'switch',
      defaultValue: true,
    },
    {
      field: 'status',
      label: '状态',
      type: 'radio-group',
      options: [
        { label: '启用', value: 'enabled' },
        { label: '禁用', value: 'disabled' },
        { label: '待审核', value: 'pending' },
      ],
      defaultValue: 'enabled',
    },
    {
      field: 'priority',
      label: '优先级',
      type: 'radio-group',
      options: [
        { label: '高', value: 'high' },
        { label: '中', value: 'medium' },
        { label: '低', value: 'low' },
      ],
    },
    {
      field: 'agree',
      label: '同意协议',
      type: 'checkbox',
      defaultValue: false,
      props: {
        checkboxLabel: '我已阅读并同意用户协议和隐私政策',
      },
      rules: [
        {
          validator: (rule, value) => {
            return value === true
          },
          message: '请同意协议后继续',
          trigger: 'change',
        },
      ],
    },
    {
      field: 'permissions',
      label: '权限',
      type: 'checkbox-group',
      options: [
        { label: '读取', value: 'read' },
        { label: '写入', value: 'write' },
        { label: '删除', value: 'delete' },
        { label: '管理', value: 'admin' },
      ],
      defaultValue: [],
    },
    {
      field: 'tags',
      label: '标签',
      type: 'checkbox-group',
      options: [
        { label: 'Vue', value: 'vue' },
        { label: 'React', value: 'react' },
        { label: 'Angular', value: 'angular' },
        { label: 'Svelte', value: 'svelte' },
      ],
    },

    // ===== 范围和评分类 =====
    {
      field: 'score',
      label: '评分',
      type: 'slider',
      defaultValue: 50,
      props: {
        min: 0,
        max: 100,
        step: 5,
      },
    },
    {
      field: 'volume',
      label: '音量',
      type: 'slider',
      defaultValue: 30,
      props: {
        min: 0,
        max: 100,
        step: 1,
        marks: {
          0: '0',
          50: '50',
          100: '100',
        },
      },
    },
    {
      field: 'rating',
      label: '星级评分',
      type: 'rate',
      defaultValue: 3,
      props: {
        count: 5,
        allowHalf: true,
      },
    },
    {
      field: 'satisfaction',
      label: '满意度',
      type: 'rate',
      defaultValue: 4,
      props: {
        count: 10,
        allowHalf: true,
      },
    },

    // ===== 多行文本 =====
    {
      field: 'remark',
      label: '备注',
      type: 'textarea',
      placeholder: '请输入备注',
      span: 24,
      props: {
        rows: 3,
        maxlength: 200,
        showCount: true,
      },
    },
    {
      field: 'description',
      label: '详细描述',
      type: 'textarea',
      placeholder: '请输入详细描述',
      span: 24,
      props: {
        rows: 5,
        maxlength: 500,
        showCount: true,
      },
    },
  ],
}

// 条件显示和联动示例
const conditionalFormOptions: FormOptions = {
  layout: 'horizontal',
  labelWidth: 120,
  columns: 2,
  items: [
    {
      field: 'hasAddress',
      label: '有地址信息',
      type: 'checkbox',
      defaultValue: false,
    },
    // 只有勾选了"有地址信息"才显示地址相关字段
    {
      field: 'province',
      label: '省份',
      type: 'select',
      placeholder: '请选择省份',
      show: (values) => values.hasAddress === true,
      options: [
        { label: '广东省', value: 'guangdong' },
        { label: '北京市', value: 'beijing' },
        { label: '上海市', value: 'shanghai' },
      ],
    },
    {
      field: 'city',
      label: '城市',
      type: 'select',
      placeholder: '请先选择省份',
      show: (values) => values.hasAddress === true && !!values.province,
      options: async () => {
        const province = formData2.value.province
        if (!province) return []
        // 模拟异步加载
        return new Promise((resolve) => {
          setTimeout(() => {
            if (province === 'guangdong') {
              resolve([
                { label: '广州市', value: 'guangzhou' },
                { label: '深圳市', value: 'shenzhen' },
                { label: '珠海市', value: 'zhuhai' },
              ])
            } else if (province === 'beijing') {
              resolve([{ label: '北京市', value: 'beijing-city' }])
            } else {
              resolve([{ label: '上海市', value: 'shanghai-city' }])
            }
          }, 300)
        })
      },
    },
    {
      field: 'address',
      label: '详细地址',
      type: 'textarea',
      placeholder: '请输入详细地址',
      show: (values) => values.hasAddress === true,
      props: {
        rows: 2,
      },
      span: 24,
    },
    {
      field: 'isVip',
      label: 'VIP 用户',
      type: 'switch',
      defaultValue: false,
    },
    // 只有 VIP 用户才显示折扣设置
    {
      field: 'discount',
      label: '折扣率',
      type: 'input-number',
      placeholder: 'VIP 折扣率',
      show: (values) => values.isVip === true,
      props: {
        min: 0,
        max: 100,
        suffix: '%',
      },
      defaultValue: 100,
    },
  ],
}

// 垂直布局示例
const verticalFormOptions: FormOptions = {
  layout: 'vertical',
  labelPlacement: 'top',
  columns: 1,
  items: [
    {
      field: 'title',
      label: '标题',
      type: 'input',
      placeholder: '请输入标题',
      rules: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    },
    {
      field: 'content',
      label: '内容',
      type: 'textarea',
      placeholder: '请输入内容',
      props: {
        rows: 8,
      },
    },
    {
      field: 'category',
      label: '分类',
      type: 'select',
      placeholder: '请选择分类',
      options: [
        { label: '技术', value: 'tech' },
        { label: '生活', value: 'life' },
        { label: '娱乐', value: 'entertainment' },
      ],
    },
  ],
}

// 提交处理
const handleSubmit = (values: FormValues) => {
  console.log('表单提交：', values)
  // formData 会通过 v-model 自动更新
}

// 重置处理
const handleReset = (values: FormValues) => {
  console.log('表单重置：', values)
  // formData 会通过 v-model 自动更新
}

// 手动验证
const handleValidate = async () => {
  const valid = await formRef.value?.validate()
  if (valid) {
    console.log('验证通过')
  } else {
    console.log('验证失败')
  }
}

// 获取数据
const handleGetData = () => {
  const values = formRef.value?.getValues()
  if (values) {
    formData.value = values
    console.log('表单数据：', values)
  }
}

// 设置数据
const handleSetData = () => {
  formRef.value?.setValues({
    username: 'admin',
    email: 'admin@example.com',
    age: 25,
    gender: 'male',
  })
}

// 重置表单
const handleResetForm = () => {
  formRef.value?.reset()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">EzForm 表单组件完整示例</h1>
        <p class="text-gray-600">
          基于 NaiveUI 的配置式表单封装，支持 16+ 种表单项类型
        </p>
      </div>

      <!-- 示例 1: 完整表单 -->
      <div class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">示例 1: 完整表单（所有类型）</h2>
          <div class="flex gap-2">
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              @click="handleValidate"
            >
              验证
            </button>
            <button
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              @click="handleGetData"
            >
              获取数据
            </button>
            <button
              class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
              @click="handleSetData"
            >
              设置数据
            </button>
            <button
              class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              @click="handleResetForm"
            >
              重置
            </button>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <EzForm
            ref="formRef"
            v-model="formData"
            :options="fullFormOptions"
            submit-text="提交表单"
            reset-text="重置表单"
            @submit="handleSubmit"
            @reset="handleReset"
          />
        </div>
      </div>

      <!-- 表单数据展示 -->
      <div class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">表单数据</h2>
          <button
            class="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            @click="handleGetData"
          >
            刷新数据
          </button>
        </div>
        <div class="bg-gray-900 rounded-lg p-4 overflow-auto">
          <pre class="text-sm text-green-400 font-mono">{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>
        <p class="mt-2 text-sm text-gray-500">
          💡 提示：表单数据只在提交/重置时更新。点击"刷新数据"可获取当前表单内容。
        </p>
      </div>

      <!-- 示例 2: 条件显示和联动 -->
      <div class="mb-10">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">示例 2: 条件显示与联动</h2>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="mb-4 p-4 bg-blue-50 rounded text-sm text-blue-700">
            <p class="font-semibold mb-2">功能说明：</p>
            <ul class="list-disc list-inside space-y-1">
              <li>勾选"有地址信息"后才会显示地址相关字段</li>
              <li>选择省份后才会显示城市选项，并动态加载城市数据</li>
              <li>开启"VIP 用户"后才会显示折扣率设置</li>
            </ul>
          </div>
          <EzForm
            v-model="formData2"
            :options="conditionalFormOptions"
            @submit="handleSubmit"
          />
        </div>
      </div>

      <!-- 示例 3: 垂直布局 -->
      <div class="mb-10">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">示例 3: 垂直布局</h2>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <EzForm
            v-model="formData3"
            :options="verticalFormOptions"
            @submit="handleSubmit"
          />
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="mb-10">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">使用说明</h2>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="space-y-4 text-sm text-gray-700">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">支持的表单项类型：</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">input</span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">input-password</span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">input-number</span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">select</span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">multi-select</span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">date-picker</span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">date-range-picker</span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">datetime-picker</span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">time-picker</span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">switch</span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">radio-group</span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">checkbox</span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">checkbox-group</span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">textarea</span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">slider</span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">rate</span>
              </div>
            </div>

            <div>
              <h3 class="font-semibold text-gray-900 mb-2">核心特性：</h3>
              <ul class="list-disc list-inside space-y-1">
                <li>配置驱动：通过 JSON 配置生成表单</li>
                <li>类型安全：完整的 TypeScript 类型支持</li>
                <li>表单验证：内置验证规则和自定义验证</li>
                <li>条件显示：根据条件动态显示/隐藏表单项</li>
                <li>条件禁用：根据条件动态禁用表单项</li>
                <li>动态选项：支持异步加载选项数据</li>
                <li>响应式布局：支持 1-6 列布局</li>
                <li>自定义插槽：支持自定义表单项和操作按钮</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-900 mb-2">文档位置：</h3>
              <code class="px-2 py-1 bg-gray-100 rounded text-xs">docs/ez-form-guide.md</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
