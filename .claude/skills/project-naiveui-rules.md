# 项目 NaiveUI 使用规范

本项目使用 **NaiveUI** 作为组件库，负责所有复杂交互组件。

## 1. 组件使用原则

```
NaiveUI 负责：
- 表格 (n-data-table)
- 表单 (n-form, n-input, n-select...)
- 弹窗 (n-modal)
- 消息提示 (n-message)
- 对话框 (n-dialog)
- 通知 (n-notification)
- 加载条 (n-loading-bar)
- 下拉/选择/日期等复杂组件

Tailwind CSS 负责：
- 布局
- 间距
- 颜色
- 响应式设计
- 字体样式
```

## 2. NaiveUI API 使用（强制！）

```typescript
// ❌ 禁止直接使用全局变量
// window.$message.success('保存成功') // 禁止！

// ✅ 必须使用 useNaiveApi hook
import { useNaiveApi } from '@/hooks/useNaiveApi'

const { message, dialog, notification, loadingBar, modal } = useNaiveApi()

message.success('保存成功')
dialog.warning({ title: '警告', content: '确定删除？' })
```

## 3. 常用组件规范

### 表格 (n-data-table)

```vue
<template>
  <!-- 优先使用封装的 EzTable 组件 -->
  <EzTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    @refresh="handleRefresh"
  />

  <!-- 复杂场景才直接使用 n-data-table -->
  <n-data-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :loading="loading"
  />
</template>
```

### 表单 (n-form)

```vue
<template>
  <!-- 优先使用封装的 EzForm 组件 -->
  <EzForm
    :schemas="formSchemas"
    :model="formData"
    @submit="handleSubmit"
  />

  <!-- 复杂场景才直接使用 n-form -->
  <n-form ref="formRef" :model="formData" :rules="rules">
    <n-form-item label="用户名" path="username">
      <n-input v-model:value="formData.username" />
    </n-form-item>
  </n-form>
</template>
```

### 弹窗 (n-modal)

```vue
<template>
  <!-- 优先使用封装的 EzModal 组件 -->
  <EzModal v-model:show="visible" title="编辑" @confirm="handleConfirm">
    <EzForm :schemas="formSchemas" :model="formData" />
  </EzModal>
</template>
```

## 4. 消息提示规范

```typescript
const { message } = useNaiveApi()

// ✅ 成功
message.success('操作成功')

// ✅ 错误
message.error('操作失败')

// ✅ 警告
message.warning('请检查输入')

// ✅ 信息
message.info('正在处理中...')

// ✅ 加载中
const loading = message.loading('保存中...')
loading.destroy() // 完成后销毁
```

## 5. 对话框规范

```typescript
const { dialog } = useNaiveApi()

// 确认对话框
dialog.warning({
  title: '确认删除',
  content: '删除后无法恢复，确定继续？',
  positiveText: '确定',
  negativeText: '取消',
  onPositiveClick: () => {
    // 执行删除
  }
})

// 警告对话框
dialog.error({
  title: '操作失败',
  content: error.message
})
```

## 6. 主题颜色规范

```typescript
// ✅ 使用 CSS 变量，支持主题切换
const customStyle = {
  color: 'var(--color-primary)',
  backgroundColor: 'var(--bg-color)'
}

// ❌ 禁止硬编码颜色
// const badStyle = { color: '#5B6BF0' }
```

## 7. 响应式规范

```vue
<template>
  <!-- ✅ 使用 Tailwind 响应式类 -->
  <n-form :label-width="isMobile ? undefined : 100">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 表单项 -->
    </div>
  </n-form>
</template>

<script setup lang="ts">
const isMobile = ref(window.innerWidth < 768)
</script>
```

## 8. 图标规范

```vue
<template>
  <!-- ✅ 使用 @vicons -->
  <template #icon>
    <component :is="ChevronForwardOutline" />
  </template>

  <!-- 或者使用 NaiveUI 内置图标 -->
  <n-icon :component="ChevronForwardOutline" />
</template>

<script setup lang="ts">
import { ChevronForwardOutline } from '@vicons/ionicons5'
</script>
```

---

**任何涉及 NaiveUI 组件的代码，必须遵守以上规范！**
