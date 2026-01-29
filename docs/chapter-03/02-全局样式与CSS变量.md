# 3.2 全局样式与 CSS 变量

## 本节目标

- ✅ 定义全局 CSS 变量
- ✅ 创建基础样式
- ✅ 设置常用组件样式
- ✅ 实现主题切换

---

## 1. CSS 变量定义

### 1.1 创建变量文件

**src/styles/variables.css**:

```css
:root {
  /* 颜色 */
  --color-primary: #22c55e;
  --color-primary-hover: #16a34a;
  --color-primary-active: #15803d;

  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #3b82f6;

  /* 文字 */
  --color-text-primary: #1f2937;
  --color-text-regular: #4b5563;
  --color-text-secondary: #9ca3af;
  --color-text-placeholder: #d1d5db;

  /* 边框 */
  --color-border-base: #e5e7eb;
  --color-border-light: #f3f4f6;
  --color-border-lighter: #f9fafb;

  /* 背景 */
  --color-bg-page: #f3f4f6;
  --color-bg-component: #ffffff;

  /* 间距 */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */

  /* 字体 */
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */

  /* 圆角 */
  --border-radius-sm: 0.125rem;  /* 2px */
  --border-radius-base: 0.25rem; /* 4px */
  --border-radius-lg: 0.5rem;    /* 8px */

  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* 动画 */
  --transition-base: all 0.3s ease;
  --transition-fast: all 0.15s ease;
}

/* 深色主题 */
.dark {
  --color-text-primary: #f9fafb;
  --color-text-regular: #e5e7eb;
  --color-text-secondary: #9ca3af;

  --color-bg-page: #111827;
  --color-bg-component: #1f2937;

  --color-border-base: #374151;
}
```

### 1.2 使用 CSS 变量

```vue
<template>
  <div class="custom-box">使用 CSS 变量</div>
</template>

<style scoped>
.custom-box {
  padding: var(--spacing-md);
  background: var(--color-bg-component);
  border: 1px solid var(--color-border-base);
  border-radius: var(--border-radius-base);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
}
</style>
```

---

## 2. 基础样式

### 2.1 重置样式

**src/styles/base.css**:

```css
@layer base {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body,
  #app {
    width: 100%;
    height: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, sans-serif;
    font-size: var(--font-size-base);
    line-height: 1.5;
    color: var(--color-text-primary);
    background-color: var(--color-bg-page);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* 滚动条 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-border-lighter);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-text-secondary);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-regular);
  }

  /* 链接 */
  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: var(--transition-fast);
  }

  a:hover {
    color: var(--color-primary-hover);
  }
}
```

### 2.2 排版样式

**src/styles/typography.css**:

```css
@layer base {
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: 600;
    line-height: 1.2;
  }

  h1 { font-size: 2.25rem; }    /* 36px */
  h2 { font-size: 1.875rem; }   /* 30px */
  h3 { font-size: 1.5rem; }     /* 24px */
  h4 { font-size: 1.25rem; }    /* 20px */
  h5 { font-size: 1.125rem; }   /* 18px */
  h6 { font-size: 1rem; }       /* 16px */

  p {
    margin: 0.5rem 0;
  }
}
```

---

## 3. 组件样式

### 3.1 按钮样式

**src/styles/components.css**:

```css
@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 rounded border;
    @apply transition-all duration-200 cursor-pointer;
    @apply font-medium text-sm;
  }

  .btn-primary {
    @apply bg-primary-500 text-white border-primary-500;
  }

  .btn-primary:hover {
    @apply bg-primary-600 border-primary-600;
  }

  .btn-success {
    @apply bg-success-500 text-white border-success-500;
  }

  .btn-danger {
    @apply bg-danger-500 text-white border-danger-500;
  }
}
```

### 3.2 卡片样式

```css
@layer components {
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
    @apply transition-shadow duration-200;
  }

  .card:hover {
    @apply shadow-lg;
  }

  .card-header {
    @apply mb-4 pb-4 border-b border-gray-200;
  }

  .card-body {
    @apply text-gray-700;
  }
}
```

---

## 4. 工具类

### 4.1 常用工具类

**src/styles/utilities.css**:

```css
@layer utilities {
  /* 文本省略 */
  .text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text-ellipsis-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  /* 居中 */
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 全屏 */
  .fullscreen {
    width: 100vw;
    height: 100vh;
  }

  /* 隐藏滚动条 */
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
}
```

---

## 5. 主题切换实现

### 5.1 主题切换工具

**src/composables/useTheme.ts**:

```typescript
import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'app-theme'

export function useTheme() {
  const theme = ref<Theme>((localStorage.getItem(STORAGE_KEY) as Theme) || 'light')

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem(STORAGE_KEY, newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  // 初始化
  setTheme(theme.value)

  return {
    theme,
    setTheme,
    toggleTheme,
  }
}
```

### 5.2 使用主题切换

```vue
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button @click="toggleTheme">
    {{ theme === 'light' ? '🌙' : '☀️' }}
  </button>
</template>
```

---

## 6. 样式组织

### 6.1 统一导入

**src/styles/index.css**:

```css
/* Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS 变量 */
@import './variables.css';

/* 基础样式 */
@import './base.css';
@import './typography.css';

/* 组件样式 */
@import './components.css';

/* 工具类 */
@import './utilities.css';
```

### 6.2 在 main.ts 中导入

```typescript
import './styles/index.css'
```

---

## 7. 本节小结

✅ 完成的工作：
- 定义了 CSS 变量系统
- 创建了基础样式
- 实现了主题切换

**下一步**: [3.3 NaiveUI 主题定制](./03-NaiveUI主题定制.md)
