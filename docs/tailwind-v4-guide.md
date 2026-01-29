# Tailwind CSS 4.x 使用指南

> 更新时间：2026-01-29
> 当前版本：4.1.18

## ✅ 当前配置状态

项目已完全按照 Tailwind CSS 4.x 最新方式配置：

### 1. 依赖安装（已完成）
```json
{
  "dependencies": {
    "tailwindcss": "^4.1.18",
    "@tailwindcss/vite": "^4.1.18"
  }
}
```

### 2. Vite 配置（已完成）
```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(), // ✅ Vite 插件模式
  ],
})
```

### 3. CSS 导入（已完成）
```css
/* src/assets/index.css */
@import "tailwindcss";
```

### 4. PostCSS 配置（无需配置）
- ❌ 不需要 `postcss.config.js`
- ❌ 不需要 `tailwind.config.js`（除非需要自定义主题）

---

## 🎨 使用规范

### 基础使用

直接在 Vue 组件中使用 utility classes：

```vue
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold text-gray-900">标题</h1>
      <p class="mt-2 text-gray-600">内容</p>
    </div>
  </div>
</template>
```

### 响应式设计

```vue
<template>
  <!-- 移动端: 单列, 平板: 双列, 桌面: 四列 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div v-for="item in items" :key="item.id" class="p-4 bg-white rounded">
      {{ item.name }}
    </div>
  </div>
</template>
```

### 状态变体

```vue
<template>
  <!-- Hover, Focus, Active 等状态 -->
  <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
    按钮
  </button>

  <!-- Dark mode 支持 -->
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
    深色模式支持
  </div>
</template>
```

---

## 🚫 避免使用 `@apply`

### ❌ 不推荐
```css
/* 不要这样写 */
.btn {
  @apply px-4 py-2 bg-blue-500 text-white rounded;
}
```

### ✅ 推荐方案 1：直接使用 utility classes
```vue
<template>
  <button class="px-4 py-2 bg-blue-500 text-white rounded">
    按钮
  </button>
</template>
```

### ✅ 推荐方案 2：使用 `@utility`（Tailwind 4.x 新增）
```css
/* src/assets/index.css */
@import "tailwindcss";

@utility btn {
  padding-inline: 1rem;
  padding-block: 0.5rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

@utility btn:hover {
  background-color: #2563eb;
}
```

```vue
<template>
  <button class="btn">按钮</button>
</template>
```

### ✅ 推荐方案 3：使用 CSS 变量
```css
/* src/assets/index.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --radius-md: 0.375rem;
}
```

```vue
<style scoped>
.button {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
}

.button:hover {
  background-color: var(--color-primary-hover);
}
</style>
```

---

## 🎯 主题自定义

### 方式 1：使用 `@theme`（推荐）

```css
/* src/assets/index.css */
@import "tailwindcss";

@theme {
  /* 自定义颜色 */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;

  /* 自定义间距 */
  --spacing-72: 18rem;
  --spacing-84: 21rem;

  /* 自定义字体 */
  --font-family-sans: 'Inter', system-ui, sans-serif;

  /* 自定义圆角 */
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
}
```

使用时：
```vue
<template>
  <div class="bg-primary-500 p-72 rounded-lg font-sans">
    自定义主题
  </div>
</template>
```

### 方式 2：使用 `tailwind.config.js`（传统方式，仍支持）

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      }
    }
  }
}
```

---

## 📐 常用布局模式

### Flex 布局
```vue
<template>
  <!-- 水平居中 -->
  <div class="flex justify-center">...</div>

  <!-- 垂直居中 -->
  <div class="flex items-center">...</div>

  <!-- 完全居中 -->
  <div class="flex items-center justify-center min-h-screen">...</div>

  <!-- 两端对齐 -->
  <div class="flex justify-between">
    <div>左侧</div>
    <div>右侧</div>
  </div>
</template>
```

### Grid 布局
```vue
<template>
  <!-- 自适应列 -->
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div v-for="i in 8">Item {{ i }}</div>
  </div>

  <!-- 固定宽度列 */
  <div class="grid grid-cols-200px auto gap-4">
    <div>固定 200px</div>
    <div>自适应</div>
  </div>
</template>
```

### 容器查询（Tailwind 4.x 新增）
```vue
<template>
  <div class="@container">
    <div class="@lg:block @hidden">
      容器宽度大于 lg 时显示
    </div>
  </div>
</template>
```

---

## 🎭 与 NaiveUI 配合使用

### 原则
- **NaiveUI 组件**：负责复杂交互（表格、表单、弹窗、数据展示）
- **Tailwind CSS**：负责布局、间距、响应式、基础样式

### 示例 1：布局 + NaiveUI 组件
```vue
<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Tailwind 处理布局 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 侧边栏 -->
        <aside class="lg:col-span-1">
          <n-card>
            <n-menu :options="menuOptions" />
          </n-card>
        </aside>

        <!-- 主内容区 -->
        <main class="lg:col-span-2">
          <n-data-table :columns="columns" :data="data" />
        </main>
      </div>
    </div>
  </div>
</template>
```

### 示例 2：NaiveUI 表单 + Tailwind 间距
```vue
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <n-form
      ref="formRef"
      :model="formValue"
      class="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
    >
      <n-form-item label="用户名" path="username">
        <n-input v-model:value="formValue.username" placeholder="请输入用户名" />
      </n-form-item>

      <n-form-item label="密码" path="password">
        <n-input v-model:value="formValue.password" type="password" />
      </n-form-item>

      <div class="flex justify-end gap-2 mt-4">
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" @click="handleSubmit">提交</n-button>
      </div>
    </n-form>
  </div>
</template>
```

### 示例 3：响应式布局
```vue
<template>
  <!-- 移动端：垂直排列，桌面端：水平排列 -->
  <div class="flex flex-col md:flex-row gap-4">
    <n-card class="flex-1">卡片 1</n-card>
    <n-card class="flex-1">卡片 2</n-card>
    <n-card class="flex-1">卡片 3</n-card>
  </div>
</template>
```

---

## 📱 响应式断点

Tailwind 4.x 默认断点：

| 断点 | 宽度 | 设备 |
|------|------|------|
| `sm` | 640px | 小型平板 |
| `md` | 768px | 平板 |
| `lg` | 1024px | 桌面 |
| `xl` | 1280px | 大屏桌面 |
| `2xl` | 1536px | 超大屏 |

使用示例：
```vue
<template>
  <!-- 移动端隐藏，桌面端显示 -->
  <div class="hidden md:block">桌面端可见</div>

  <!-- 移动端显示，桌面端隐藏 -->
  <div class="block md:hidden">移动端可见</div>

  <!-- 响应式字体 */
  <h1 class="text-2xl md:text-3xl lg:text-4xl">响应式标题</h1>

  <!-- 响应式间距 -->
  <div class="p-4 md:p-6 lg:p-8">响应式内边距</div>
</template>
```

---

## 🌓 深色模式

### 启用深色模式
```css
/* src/assets/index.css */
@import "tailwindcss";

@theme {
  --color-background: #ffffff;
  --color-text: #111827;
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: #111827;
    --color-text: #f9fafb;
  }
}
```

### 使用深色模式类
```vue
<template>
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
    <h1 class="text-2xl">标题</h1>
    <p class="text-gray-600 dark:text-gray-400">内容</p>
  </div>
</template>
```

---

## ⚡ 性能优化建议

### 1. JIT 模式（自动启用）
Tailwind 4.x 默认使用 JIT 模式，按需生成样式。

### 2. 避免动态拼接类名
```vue
<script setup>
// ❌ 错误：动态拼接无法被 JIT 识别
const btnClass = computed(() => `bg-${color}-500 text-white`)

// ✅ 正确：使用完整的类名
const colorClasses = {
  blue: 'bg-blue-500 text-white',
  red: 'bg-red-500 text-white',
  green: 'bg-green-500 text-white',
}
</script>
```

### 3. 使用 `@layer` 组织样式
```css
/* src/assets/index.css */
@import "tailwindcss";

@layer components {
  /* 组件级样式覆盖 */
}

@layer utilities {
  /* 自定义工具类 */
}
```

---

## 🛠️ 调试技巧

### 1. 使用浏览器开发工具
Tailwind 4.x 的类名会被转换为 CSS，在开发工具中可以看到对应的样式。

### 2. 使用 Tailwind CSS IntelliSense
确保安装了 VSCode 插件：
- **Tailwind CSS IntelliSense**：提供类名自动补全和预览

### 3. 启用 Source Map
```typescript
// vite.config.ts
export default defineConfig({
  css: {
    devSourcemap: true,
  },
})
```

---

## 📚 参考资源

- [Tailwind CSS 4.x 官方文档](https://tailwindcss.com/docs/installation/using-vite)
- [Tailwind CSS 4.x 升级指南](https://tailwindcss.com/docs/upgrade-guide)
- [为什么不再推荐 @apply](https://tailwindcss.com/docs/reusing-styles#avoiding-premature-abstraction)
- [Tailwind CSS 主题变量](https://tailwindcss.com/docs/theme-variables)

---

## ✅ 检查清单

- [x] 使用 `@tailwindcss/vite` 插件
- [x] CSS 使用 `@import "tailwindcss"`
- [x] 避免 `@apply` 指令
- [x] 新组件直接使用 utility classes
- [x] 复杂样式使用 `@utility` 或 CSS 变量
- [x] 主题自定义使用 `@theme`
- [x] 与 NaiveUI 配合使用时明确职责划分

---

**更新日期**：2026-01-29
**适用版本**：Tailwind CSS 4.1.18
