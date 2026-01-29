# Loading 状态管理 - 实际使用案例

本文档展示真实业务场景中 Loading 状态管理的最佳实践。

## 案例 1: 用户管理页面

### 场景描述
典型的 CRUD 页面，包含列表查询、新增、编辑、删除操作。

### 实现代码

```vue
<!-- src/views/user/UserManagement.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLoading } from '@/hooks/useLoading'
import { userApi } from '@/api'
import type { UserInfo } from '@/stores/types/user'

// ========== Loading 状态管理 ==========
const tableLoading = useLoading('user-table')
const formLoading = useLoading('user-form')
const deleteLoading = useLoading('user-delete')

// ========== 数据状态 ==========
const tableData = ref<UserInfo[]>([])
const total = ref(0)
const pagination = ref({
  page: 1,
  pageSize: 10
})

// ========== 操作方法 ==========

/**
 * 加载用户列表
 */
async function loadTableData() {
  try {
    const data = await tableLoading.wrapLoading('fetch', userApi.getList({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    }))
    tableData.value = data.list
    total.value = data.total
  } catch (error) {
    window.$message?.error('加载失败')
  }
}

/**
 * 创建用户
 */
async function handleCreate(formData: Partial<UserInfo>) {
  try {
    await formLoading.wrapLoading('create', userApi.create(formData), {
      text: '创建用户中...'
    })
    window.$message?.success('创建成功')
    await loadTableData() // 刷新列表
  } catch (error) {
    window.$message?.error('创建失败')
  }
}

/**
 * 更新用户
 */
async function handleUpdate(id: string, formData: Partial<UserInfo>) {
  try {
    await formLoading.wrapLoading('update', userApi.update(id, formData), {
      text: '更新用户中...'
    })
    window.$message?.success('更新成功')
    await loadTableData()
  } catch (error) {
    window.$message?.error('更新失败')
  }
}

/**
 * 删除用户
 */
async function handleDelete(id: string) {
  try {
    await deleteLoading.wrapLoading('delete', userApi.delete(id), {
      text: '删除中...'
    })
    window.$message?.success('删除成功')
    await loadTableData()
  } catch (error) {
    window.$message?.error('删除失败')
  }
}

// ========== 生命周期 ==========
onMounted(() => {
  loadTableData()
})

// ========== 清理 ==========
onBeforeUnmount(() => {
  tableLoading.clearLoading()
  formLoading.clearLoading()
  deleteLoading.clearLoading()
})
</script>

<template>
  <div class="p-6">
    <!-- 页面标题 -->
    <div class="mb-4">
      <h1 class="text-2xl font-bold">用户管理</h1>
    </div>

    <!-- 搜索表单 -->
    <n-card class="mb-4">
      <n-form inline label-placement="left">
        <n-grid :cols="4" :x-gap="12">
          <n-gi>
            <n-input placeholder="搜索用户名" />
          </n-gi>
          <n-gi>
            <n-button type="primary" @click="loadTableData">
              查询
            </n-button>
          </n-gi>
        </n-grid>
      </n-form>
    </n-card>

    <!-- 数据表格 -->
    <n-spin :show="tableLoading.isLoading">
      <n-data-table
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
      />
    </n-spin>

    <!-- 表单弹窗 -->
    <UserFormModal
      @submit="handleCreate"
      @update="handleUpdate"
    >
      <template #default="{ open }">
        <n-button type="primary" @click="open">
          新增用户
        </n-button>
      </template>
    </UserFormModal>
  </div>
</template>
```

### 关键点

✅ **分离不同操作的 loading**：列表、表单、删除各自独立
✅ **语义化命名**：`user-table:fetch`, `user-form:create`
✅ **及时清理**：组件卸载时清理所有 loading
✅ **错误处理**：try-catch 包裹，提供友好提示

---

## 案例 2: 登录页面

### 场景描述
登录表单提交，需要显示全局 loading 和提示文本。

### 实现代码

```vue
<!-- src/views/login/LoginPage.vue -->
<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useLoading } from '@/hooks/useLoading'
import { useUserStore } from '@/stores/modules/user'
import { authApi } from '@/api'

const router = useRouter()
const userStore = useUserStore()

// ========== Loading 状态 ==========
const loginLoading = useLoading('login')

// ========== 表单数据 ==========
const loginForm = reactive({
  username: '',
  password: ''
})

// ========== 提交处理 ==========
async function handleLogin() {
  try {
    // 显示全局 loading + 自定义提示
    const data = await loginLoading.wrapLoading(
      'submit',
      authApi.login({
        username: loginForm.username,
        password: loginForm.password
      }),
      {
        global: true,
        text: '登录中，请稍候...'
      }
    )

    // 保存用户信息
    userStore.setToken(data.token)
    userStore.setUserInfo(data.user)

    window.$message?.success('登录成功')

    // 跳转到首页
    router.push('/')
  } catch (error: any) {
    window.$message?.error(error.message || '登录失败')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <n-card class="w-96">
      <template #header>
        <h1 class="text-2xl font-bold text-center">系统登录</h1>
      </template>

      <n-form :model="loginForm" label-placement="left">
        <n-form-item label="用户名">
          <n-input
            v-model:value="loginForm.username"
            placeholder="请输入用户名"
            @keyup.enter="handleLogin"
          />
        </n-form-item>

        <n-form-item label="密码">
          <n-input
            v-model:value="loginForm.password"
            type="password"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
          />
        </n-form-item>

        <n-form-item>
          <n-button
            type="primary"
            block
            :loading="loginLoading.isLoading"
            @click="handleLogin"
          >
            登录
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>
```

### 关键点

✅ **全局 loading**：使用 `{ global: true }` 显示全屏遮罩
✅ **自定义提示文本**：`text: '登录中，请稍候...'`
✅ **按钮 loading 状态**：`:loading="loginLoading.isLoading"`
✅ **回车键支持**：输入框按回车触发登录

---

## 案例 3: 仪表板页面（Dashboard）

### 场景描述
页面包含多个数据卡片，需要并行加载数据，显示统一的 loading 状态。

### 实现代码

```vue
<!-- src/views/dashboard/DashboardPage.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLoading } from '@/hooks/useLoading'
import { statisticsApi, orderApi, userApi } from '@/api'

// ========== Loading 状态 ==========
const dashboardLoading = useLoading('dashboard')

// ========== 数据卡片 ==========
const stats = ref({
  totalUsers: 0,
  totalOrders: 0,
  todayRevenue: 0
})

const recentOrders = ref([])
const activeUsers = ref([])

/**
 * 加载仪表板数据
 * 多个请求并行，共享 loading 状态
 */
async function loadDashboardData() {
  try {
    // 并行加载多个数据源
    await Promise.all([
      // 加载统计数据
      dashboardLoading.wrapLoading(
        'stats',
        statisticsApi.getOverview().then(data => {
          stats.value = data
        })
      ),

      // 加载最近订单
      dashboardLoading.wrapLoading(
        'orders',
        orderApi.getRecent({ limit: 10 }).then(data => {
          recentOrders.value = data
        })
      ),

      // 加载活跃用户
      dashboardLoading.wrapLoading(
        'users',
        userApi.getActiveUsers({ limit: 5 }).then(data => {
          activeUsers.value = data
        })
      )
    ])

    console.log('所有数据加载完成')
  } catch (error) {
    window.$message?.error('数据加载失败')
  }
}

/**
 * 刷新数据
 */
function refreshData() {
  loadDashboardData()
}

onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div class="p-6">
    <!-- 页面标题和刷新按钮 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">数据仪表板</h1>
      <n-button
        :loading="dashboardLoading.isLoading"
        @click="refreshData"
      >
        刷新数据
      </n-button>
    </div>

    <!-- Loading 遮罩 -->
    <n-spin :show="dashboardLoading.isLoading">
      <!-- 统计卡片 -->
      <n-grid :cols="3" :x-gap="16" class="mb-6">
        <n-gi>
          <n-statistic label="总用户数" :value="stats.totalUsers" />
        </n-gi>
        <n-gi>
          <n-statistic label="总订单数" :value="stats.totalOrders" />
        </n-gi>
        <n-gi>
          <n-statistic
            label="今日收入"
            :value="stats.todayRevenue"
            :precision="2"
            prefix="¥"
          />
        </n-gi>
      </n-grid>

      <!-- 最近订单 -->
      <n-card title="最近订单" class="mb-6">
        <n-data-table :data="recentOrders" :columns="orderColumns" />
      </n-card>

      <!-- 活跃用户 -->
      <n-card title="活跃用户">
        <n-list>
          <n-list-item v-for="user in activeUsers" :key="user.id">
            <n-thing :title="user.name" :description="user.email" />
          </n-list-item>
        </n-list>
      </n-card>
    </n-spin>
  </div>
</template>
```

### 关键点

✅ **并行加载**：使用 `Promise.all` 并行请求多个接口
✅ **统一 loading**：所有请求共享 `dashboardLoading`
✅ **刷新功能**：手动触发数据重新加载
✅ **嵌套 key**：`dashboard:stats`, `dashboard:orders` 等

---

## 案例 4: 文件上传

### 场景描述
上传文件时需要显示进度和 loading 状态。

### 实现代码

```vue
<!-- src/views/file/FileUpload.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useLoading } from '@/hooks/useLoading'
import { userApi } from '@/api'

// ========== Loading 状态 ==========
const uploadLoading = useLoading('avatar-upload')

// ========== 上传状态 ==========
const fileList = ref([])
const uploadProgress = ref(0)

/**
 * 处理文件上传
 */
async function handleUpload({ file }: { file: any }) {
  try {
    uploadLoading.startLoading('upload', {
      text: '上传中...'
    })

    const formData = new FormData()
    formData.append('file', file.file)

    // 模拟进度（实际应该从上传接口获取）
    const progressTimer = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)

    const result = await userApi.uploadAvatar(formData)

    clearInterval(progressTimer)
    uploadProgress.value = 100

    window.$message?.success('上传成功')

    // 更新用户头像
    // userStore.updateAvatar(result.url)
  } catch (error) {
    window.$message?.error('上传失败')
  } finally {
    uploadLoading.stopLoading('upload')
    uploadProgress.value = 0
  }
}

/**
 * 移除文件
 */
function handleRemove() {
  fileList.value = []
}
</script>

<template>
  <div class="p-6">
    <n-card title="头像上传">
      <n-upload
        :file-list="fileList"
        :custom-request="handleUpload"
        @remove="handleRemove"
        accept="image/*"
        :max="1"
      >
        <n-button :loading="uploadLoading.isLoading">
          选择文件
        </n-button>
      </n-upload>

      <!-- 上传进度 -->
      <div v-if="uploadLoading.isLoading" class="mt-4">
        <n-progress
          type="line"
          :percentage="uploadProgress"
          :indicator-placement="'inside'"
        />
      </div>
    </n-card>
  </div>
</template>
```

### 关键点

✅ **手动控制 loading**：`startLoading` / `stopLoading`
✅ **进度显示**：配合 `n-progress` 显示上传进度
✅ **文件限制**：`accept="image/*"` 和 `:max="1"`

---

## 案例 5: 批量操作

### 场景描述
表格批量删除，需要显示操作进度。

### 实现代码

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLoading } from '@/hooks/useLoading'
import { userApi } from '@/api'

// ========== Loading 状态 ==========
const batchDeleteLoading = useLoading('batch-delete')

// ========== 数据状态 ==========
const selectedRowKeys = ref<string[]>([])
const tableData = ref([])

/**
 * 批量删除
 */
async function handleBatchDelete() {
  if (selectedRowKeys.value.length === 0) {
    window.$message?.warning('请选择要删除的数据')
    return
  }

  try {
    const count = selectedRowKeys.value.length

    await batchDeleteLoading.wrapLoading(
      'execute',
      userApi.batchDelete(selectedRowKeys.value),
      {
        text: `正在删除 ${count} 条数据...`
      }
    )

    window.$message?.success(`成功删除 ${count} 条数据`)

    // 清空选择
    selectedRowKeys.value = []

    // 刷新列表
    await loadTableData()
  } catch (error) {
    window.$message?.error('删除失败')
  }
}

/**
 * 检查是否可以批量操作
 */
const canBatchDelete = computed(() => selectedRowKeys.value.length > 0)
</script>

<template>
  <div class="p-6">
    <!-- 工具栏 -->
    <n-space class="mb-4">
      <n-button
        type="error"
        :disabled="!canBatchDelete"
        :loading="batchDeleteLoading.isLoading"
        @click="handleBatchDelete"
      >
        批量删除 ({{ selectedRowKeys.length }})
      </n-button>
    </n-space>

    <!-- 数据表格 -->
    <n-data-table
      v-model:checked-row-keys="selectedRowKeys"
      :data="tableData"
      :columns="columns"
      :row-key="(row: any) => row.id"
    />
  </div>
</template>
```

### 关键点

✅ **动态提示文本**：显示删除数量
✅ **条件禁用**：未选择数据时禁用按钮
✅ **状态重置**：操作完成后清空选择

---

## 总结

### 使用模式

| 场景 | 推荐方式 | 示例 |
|------|---------|------|
| 单次异步操作 | `wrapLoading` | `await wrapLoading('fetch', api.call())` |
| 并行加载 | `Promise.all` + `wrapLoading` | 见案例 3 |
| 手动精确控制 | `startLoading` / `stopLoading` | 见案例 4 |
| 表单提交 | `wrapLoading` + `{ global: true }` | 见案例 2 |
| 批量操作 | `wrapLoading` + 动态文本 | 见案例 5 |

### 最佳实践

1. ✅ **语义化命名**：`user-table:fetch` 而不是 `loading1`
2. ✅ **使用前缀**：避免不同模块的 loading 冲突
3. ✅ **及时清理**：`onBeforeUnmount` 中调用 `clearLoading`
4. ✅ **错误处理**：try-catch 包裹，提供友好提示
5. ✅ **按需使用**：不是所有请求都需要 loading

### 避免的反模式

❌ 在拦截器中自动管理 loading
❌ 使用模糊的 key 名称（如 `loading1`, `temp`）
❌ 忘记在组件卸载时清理 loading
❌ 所有请求都显示全局 loading
❌ 并发请求时不使用 Promise.all

这些案例涵盖了实际开发中的常见场景，可以作为参考模板。
