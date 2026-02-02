<script setup lang="ts">
/**
 * EzCRUD 组件使用示例
 * 演示如何使用 EzCRUD 组件快速构建完整的 CRUD 页面
 */
import { computed, h } from 'vue'
import { NTag, NStatistic, NNumberAnimation } from 'naive-ui'
import EzCRUD from '@/components/EzCRUD.vue'
import type { TableColumn } from 'naive-ui/es/data-table/src/interface'
import type { FormOptions, FormValues } from '@/types/form'

// ==================== 类型定义 ====================

/**
 * 用户角色枚举
 */
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

/**
 * 用户状态枚举
 */
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/**
 * 用户数据类型
 */
interface User {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  department: string
  phone?: string
  createdAt: string
}

// ==================== 常量定义 ====================

/**
 * 角色选项
 */
const ROLE_OPTIONS = [
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
  { label: '访客', value: 'guest' },
]

/**
 * 状态选项
 */
const STATUS_OPTIONS = [
  { label: '激活', value: 'active' },
  { label: '停用', value: 'inactive' },
]

/**
 * 角色标签类型
 */
const getRoleTagType = (role: string) => {
  const map: Record<string, 'error' | 'info' | 'default'> = {
    admin: 'error',
    user: 'info',
    guest: 'default',
  }
  return map[role] || 'default'
}

/**
 * 状态标签类型
 */
const getStatusTagType = (status: string) => {
  const map: Record<string, 'success' | 'warning'> = {
    active: 'success',
    inactive: 'warning',
  }
  return map[status] || 'default'
}

/**
 * 部门选项
 */
const DEPARTMENT_OPTIONS = [
  '技术部',
  '产品部',
  '设计部',
  '运营部',
  '市场部',
  '人事部',
]

// ==================== 模拟数据 ====================

let mockIdCounter = 10
const mockData: User[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: UserRole.ADMIN, status: UserStatus.ACTIVE, department: '技术部', phone: '13800138000', createdAt: '2024-01-15' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: UserRole.USER, status: UserStatus.ACTIVE, department: '产品部', phone: '13800138001', createdAt: '2024-02-20' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: UserRole.USER, status: UserStatus.INACTIVE, department: '设计部', phone: '13800138002', createdAt: '2024-03-10' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: UserRole.GUEST, status: UserStatus.ACTIVE, department: '运营部', phone: '13800138003', createdAt: '2024-04-05' },
  { id: 5, name: '孙七', email: 'sunqi@example.com', role: UserRole.USER, status: UserStatus.ACTIVE, department: '技术部', phone: '13800138004', createdAt: '2024-05-12' },
  { id: 6, name: '周八', email: 'zhouba@example.com', role: UserRole.USER, status: UserStatus.ACTIVE, department: '市场部', phone: '13800138005', createdAt: '2024-06-01' },
  { id: 7, name: '吴九', email: 'wujiu@example.com', role: UserRole.GUEST, status: UserStatus.INACTIVE, department: '人事部', phone: '13800138006', createdAt: '2024-06-15' },
  { id: 8, name: '郑十', email: 'zhengshi@example.com', role: UserRole.ADMIN, status: UserStatus.ACTIVE, department: '技术部', phone: '13800138007', createdAt: '2024-07-01' },
  { id: 9, name: '钱十一', email: 'qianshiyi@example.com', role: UserRole.USER, status: UserStatus.ACTIVE, department: '产品部', phone: '13800138008', createdAt: '2024-07-20' },
]

/**
 * 模拟网络延迟
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// ==================== 统计数据 ====================

const stats = computed(() => {
  const total = mockData.length
  const active = mockData.filter((u) => u.status === UserStatus.ACTIVE).length
  const admins = mockData.filter((u) => u.role === UserRole.ADMIN).length
  const departments = new Set(mockData.map((u) => u.department)).size
  return { total, active, admins, departments }
})

// ==================== 表单配置 ====================

/**
 * 搜索表单配置
 */
const searchSchema: FormOptions = {
  items: [
    {
      field: 'name',
      label: '姓名',
      type: 'input',
      placeholder: '请输入姓名',
      props: { clearable: true },
    },
    {
      field: 'email',
      label: '邮箱',
      type: 'input',
      placeholder: '请输入邮箱',
      props: { clearable: true },
    },
    {
      field: 'role',
      label: '角色',
      type: 'select',
      placeholder: '请选择角色',
      options: ROLE_OPTIONS,
      props: { clearable: true },
    },
    {
      field: 'status',
      label: '状态',
      type: 'select',
      placeholder: '请选择状态',
      options: STATUS_OPTIONS,
      props: { clearable: true },
    },
  ],
  layout: 'inline',
  columns: 4,
}

/**
 * 新增/编辑表单配置
 */
const formSchema: FormOptions = {
  items: [
    {
      field: 'name',
      label: '姓名',
      type: 'input',
      placeholder: '请输入姓名',
      props: { clearable: true },
      rules: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, max: 20, message: '姓名长度应为 2-20 个字符', trigger: 'blur' },
      ],
      span: 12,
    },
    {
      field: 'email',
      label: '邮箱',
      type: 'input',
      placeholder: '请输入邮箱',
      props: { clearable: true },
      rules: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
      ],
      span: 12,
    },
    {
      field: 'phone',
      label: '手机号',
      type: 'input',
      placeholder: '请输入手机号',
      props: { clearable: true },
      rules: [
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
      ],
      span: 12,
    },
    {
      field: 'department',
      label: '部门',
      type: 'select',
      placeholder: '请选择部门',
      options: DEPARTMENT_OPTIONS.map((d) => ({ label: d, value: d })),
      props: { clearable: true },
      rules: [{ required: true, message: '请选择部门', trigger: 'change' }],
      span: 12,
    },
    {
      field: 'role',
      label: '角色',
      type: 'select',
      placeholder: '请选择角色',
      options: ROLE_OPTIONS,
      props: { clearable: true },
      rules: [{ required: true, message: '请选择角色', trigger: 'change' }],
      span: 12,
    },
    {
      field: 'status',
      label: '状态',
      type: 'select',
      placeholder: '请选择状态',
      options: STATUS_OPTIONS,
      rules: [{ required: true, message: '请选择状态', trigger: 'change' }],
      span: 12,
    },
  ],
  layout: 'horizontal',
  labelWidth: 100,
  columns: 2,
}

// ==================== 表格配置 ====================

/**
 * 表格列配置
 */
const columns: TableColumn[] = [
  { type: 'selection', multiple: true },
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name', width: 120 },
  { title: '邮箱', key: 'email', width: 220 },
  {
    title: '手机号',
    key: 'phone',
    width: 140,
    render: (row) => row.phone || '-',
  },
  {
    title: '角色',
    key: 'role',
    width: 100,
    render: (row) => {
      const option = ROLE_OPTIONS.find((o) => o.value === row.role)
      return h(NTag, { type: getRoleTagType(row.role) }, { default: () => option?.label || row.role })
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (row) => {
      const option = STATUS_OPTIONS.find((o) => o.value === row.status)
      return h(NTag, { type: getStatusTagType(row.status) }, { default: () => option?.label || row.status })
    },
  },
  { title: '部门', key: 'department', width: 120 },
  { title: '创建时间', key: 'createdAt', width: 120 },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right' as const,
  },
]

// ==================== CRUD API 实现 ====================

const userApi = {
  /**
   * 获取用户列表
   */
  async list(params: FormValues): Promise<{ items: User[]; total: number }> {
    await delay(500)
    let filteredData = [...mockData]

    if (params.name) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes((params.name as string).toLowerCase())
      )
    }
    if (params.email) {
      filteredData = filteredData.filter((item) =>
        item.email.toLowerCase().includes((params.email as string).toLowerCase())
      )
    }
    if (params.role) {
      filteredData = filteredData.filter((item) => item.role === params.role)
    }
    if (params.status) {
      filteredData = filteredData.filter((item) => item.status === params.status)
    }

    return { items: filteredData, total: filteredData.length }
  },

  /**
   * 创建用户
   */
  async create(data: Record<string, unknown>): Promise<User> {
    await delay(300)

    const existingUser = mockData.find((u) => u.email === data.email)
    if (existingUser) {
      throw new Error('邮箱已被使用')
    }

    const newUser: User = {
      id: mockIdCounter++,
      name: data.name as string,
      email: data.email as string,
      phone: (data.phone as string) || undefined,
      role: data.role as UserRole,
      status: data.status as UserStatus,
      department: data.department as string,
      createdAt: new Date().toISOString().split('T')[0],
    }

    mockData.push(newUser)
    return newUser
  },

  /**
   * 更新用户
   */
  async update(id: string | number, data: Record<string, unknown>): Promise<User> {
    await delay(300)

    const index = mockData.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('用户不存在')
    }

    const existingUser = mockData.find((u) => u.email === data.email && u.id !== id)
    if (existingUser) {
      throw new Error('邮箱已被使用')
    }

    const updatedUser: User = {
      ...mockData[index],
      name: data.name as string,
      email: data.email as string,
      phone: (data.phone as string) || undefined,
      role: data.role as UserRole,
      status: data.status as UserStatus,
      department: data.department as string,
    }

    mockData[index] = updatedUser
    return updatedUser
  },

  /**
   * 删除用户
   */
  async delete(id: string | number): Promise<void> {
    await delay(300)

    const index = mockData.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('用户不存在')
    }

    mockData.splice(index, 1)
  },
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">EzCRUD 组件示例</h1>
      <p class="text-gray-600">
        完整的用户管理系统，展示 EzCRUD 组件的增删改查、搜索、验证等功能。
      </p>
    </div>

    <!-- 数据统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <NStatistic label="总用户数">
          <NNumberAnimation :from="0" :to="stats.total" />
        </NStatistic>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <NStatistic label="激活用户">
          <NNumberAnimation :from="0" :to="stats.active" />
        </NStatistic>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <NStatistic label="管理员">
          <NNumberAnimation :from="0" :to="stats.admins" />
        </NStatistic>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <NStatistic label="覆盖部门">
          <NNumberAnimation :from="0" :to="stats.departments" />
        </NStatistic>
      </div>
    </div>

    <!-- CRUD 组件 -->
    <EzCRUD
      title="用户"
      :columns="columns"
      :form-schema="formSchema"
      :search-schema="searchSchema"
      :api="userApi"
    />

    <!-- 功能说明 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-blue-900 mb-4">📋 功能特性</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div class="space-y-2">
          <div class="text-gray-700">✅ <strong>数据搜索</strong>：支持按姓名、邮箱、角色、状态进行组合筛选</div>
          <div class="text-gray-700">✅ <strong>新增用户</strong>：完整的表单验证，包括必填项、邮箱格式、手机号格式</div>
          <div class="text-gray-700">✅ <strong>编辑功能</strong>：自动回显数据，支持修改所有字段</div>
        </div>
        <div class="space-y-2">
          <div class="text-gray-700">✅ <strong>删除功能</strong>：二次确认删除，防止误操作</div>
          <div class="text-gray-700">✅ <strong>表格增强</strong>：多选、排序、列设置、密度调整、全屏模式</div>
          <div class="text-gray-700">✅ <strong>数据统计</strong>：实时统计用户总数、激活用户、管理员数量</div>
        </div>
      </div>

      <div class="mt-4 pt-4 border-t border-blue-200">
        <h4 class="font-semibold text-blue-900 mb-2">💡 技术亮点</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
          <div>• 使用枚举类型管理角色和状态</div>
          <div>• 使用 Tag 标签美化角色和状态显示</div>
          <div>• 支持邮箱唯一性校验</div>
          <div>• 支持手机号格式验证</div>
          <div>• 表单字段实时统计字符数</div>
          <div>• 数据统计卡片带动画效果</div>
        </div>
      </div>
    </div>
  </div>
</template>
