# 2.3 NaiveUI 安装与基础配置

## 本节目标

- ✅ 安装 NaiveUI
- ✅ 配置 NaiveUI 全局组件
- ✅ 配置 NaiveUI 主题
- ✅ 了解常用组件

---

## 1. 安装 NaiveUI

```bash
pnpm add naive-ui
# 图标库（可选）
pnpm add @vicons/ionicons5
```

---

## 2. 基础配置

### 2.1 完整引入

**src/main.ts**:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import { setupStore } from './stores'

// NaiveUI
import naive from 'naive-ui'

const app = createApp(App)

// 注册 NaiveUI
app.use(naive)

setupStore(app)
setupRouter(app)

app.mount('#app')
```

### 2.2 按需引入（推荐）

NaiveUI 支持自动导入，使用插件可以更方便：

**安装插件**:
```bash
pnpm add -D unplugin-vue-components unplugin-auto-import
```

**vite.config.ts**:
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [NaiveUiResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
})
```

---

## 3. 配置主题

### 3.1 创建主题配置

**src/settings/naiveui-theme.ts**:

```typescript
import type { GlobalTheme } from 'naive-ui'

/**
 * 浅色主题
 */
export const lightTheme: GlobalTheme = {
  common: {
    primaryColor: '#18a058',
    primaryColorHover: '#36ad6a',
    primaryColorPressed: '#0c7a43',
    primaryColorSuppl: '#36ad6a',
  },
}

/**
 * 深色主题
 */
export const darkTheme: GlobalTheme = {
  common: {
    primaryColor: '#18a058',
    primaryColorHover: '#36ad6a',
    primaryColorPressed: '#0c7a43',
    primaryColorSuppl: '#36ad6a',
  },
}
```

### 3.2 使用主题

**App.vue**:

```vue
<script setup lang="ts">
import { lightTheme, darkTheme } from '@/settings/naiveui-theme'
import { ref } from 'vue'

const theme = ref(lightTheme)

const toggleTheme = () => {
  theme.value = theme.value === lightTheme ? darkTheme : lightTheme
}
</script>

<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <router-view />
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
```

---

## 4. 常用组件示例

### 4.1 按钮

```vue
<template>
  <n-space>
    <n-button type="primary">主要按钮</n-button>
    <n-button type="info">信息按钮</n-button>
    <n-button type="success">成功按钮</n-button>
    <n-button type="warning">警告按钮</n-button>
    <n-button type="error">错误按钮</n-button>
  </n-space>
</template>
```

### 4.2 表格

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

const data = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
])

const columns = [
  { title: 'ID', key: 'id' },
  { title: '姓名', key: 'name' },
  { title: '邮箱', key: 'email' },
]
</script>

<template>
  <n-data-table :columns="columns" :data="data" />
</template>
```

### 4.3 表单

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface FormValue {
  username: string
  password: string
}

const formRef = ref()
const formValue = ref<FormValue>({
  username: '',
  password: '',
})

const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
}

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      console.log('提交:', formValue.value)
    }
  })
}
</script>

<template>
  <n-form ref="formRef" :model="formValue" :rules="rules" label-placement="left">
    <n-form-item label="用户名" path="username">
      <n-input v-model:value="formValue.username" placeholder="请输入用户名" />
    </n-form-item>
    <n-form-item label="密码" path="password">
      <n-input
        v-model:value="formValue.password"
        type="password"
        placeholder="请输入密码"
      />
    </n-form-item>
    <n-form-item>
      <n-button type="primary" @click="handleSubmit">提交</n-button>
    </n-form-item>
  </n-form>
</template>
```

---

## 5. 组件库最佳实践

### 5.1 语义化使用

```vue
<!-- ✅ 语义化：使用语义化的标签 -->
<n-button type="primary" @click="submit">提交</n-button>
<n-button type="error" @click="delete">删除</n-button>

<!-- ❌ 不语义化 -->
<n-button type="primary" @click="delete">删除</n-button>
```

### 5.2 尺寸一致性

```vue
<template>
  <!-- ✅ 统一尺寸 -->
  <n-config-provider :component-size="'medium'">
    <n-button size="medium">按钮</n-button>
    <n-input size="medium">输入框</n-input>
  </n-config-provider>
</template>
```

### 5.3 国际化

**src/settings/naiveui-locale.ts**:

```typescript
import { zhCN, dateZhCN } from 'naive-ui'

export { zhCN, dateZhCN }
```

**App.vue**:
```vue
<script setup lang="ts">
import { zhCN, dateZhCN } from '@/settings/naiveui-locale'
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <!-- ... -->
  </n-config-provider>
</template>
```

---

## 6. 常见问题

### Q1: 组件样式不生效？

**A**: 确保正确设置了主题和全局样式：
```vue
<n-config-provider :theme="theme">
  <n-message-provider>
    <router-view />
  </n-message-provider>
</n-config-provider>
```

### Q2: 如何覆盖组件样式？

**A**: 使用 `:deep()` 选择器：
```vue
<style scoped>
:deep(.n-button) {
  border-radius: 8px;
}
</style>
```

---

## 7. 本节小结

✅ 完成的工作：
- 安装并配置了 NaiveUI
- 配置了主题
- 了解了常用组件的使用

**下一步**: [2.4 Tailwind CSS 安装](./04-Tailwind-CSS安装.md)
