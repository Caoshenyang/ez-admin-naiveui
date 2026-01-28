# 第3章：Tailwind CSS 样式系统搭建

## 3.1 安装 Tailwind CSS 与配置初始化

### 最新版本

**Tailwind CSS v4.1** - 全新的安装方式，更简洁、更快速

### 安装步骤

#### 1. 安装依赖

```bash
pnpm add tailwindcss @tailwindcss/vite
```

#### 2. 配置 Vite 插件

**`vite.config.ts`**

```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),  // 添加 Tailwind CSS 插件
    // ... 其他插件
  ]
})
```

#### 3. 导入 Tailwind CSS

**`src/styles/index.css`**

```css
/* Tailwind CSS v4 */
@import 'tailwindcss';

/* 自定义主题 */
@import './tailwind.css';
```

### v4 vs v3 的变化

| 特性 | v3 | v4 |
|------|-----|-----|
| 配置文件 | `tailwind.config.js` | CSS `@theme` |
| PostCSS | 需要 | 不需要 |
| 安装包 | `tailwindcss` + `postcss` + `autoprefixer` | `tailwindcss` + `@tailwindcss/vite` |
| 导入方式 | `@tailwind` 指令 | `@import 'tailwindcss'` |

---

## 3.2 自定义主题配置（颜色、间距、字体）

### 使用 @theme 定义主题

**`src/styles/tailwind.css`**

```css
@theme {
  /* 颜色系统 */
  --color-primary-50: #f0fdf4;
  --color-primary-500: #22c55e;
  --color-primary-600: #16a34a;

  /* 间距系统 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* 字体大小 */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;

  /* 阴影 */
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

### 使用方式

```vue
<template>
  <div class="bg-primary-500 p-md rounded-md shadow-md">
    内容
  </div>
</template>
```

---

## 3.3 响应式断点设计规范

### Tailwind 默认断点

| 断点 | 最小宽度 | CSS |
|------|----------|-----|
| `sm` | 640px | `@media (min-width: 640px)` |
| `md` | 768px | `@media (min-width: 768px)` |
| `lg` | 1024px | `@media (min-width: 1024px)` |
| `xl` | 1280px | `@media (min-width: 1280px)` |
| `2xl` | 1536px | `@media (min-width: 1536px)` |

### 移动端优先

```vue
<!-- 默认移动端，sm 断点及以上应用 -->
<div class="text-sm sm:text-base md:text-lg">
  响应式文字
</div>

<!-- 响应式布局 -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  <!-- 网格内容 -->
</div>
```

### 常用响应式模式

```vue
<!-- 隐藏/显示 -->
<div class="hidden md:block">桌面端显示</div>
<div class="block md:hidden">移动端显示</div>

<!-- 响应式间距 -->
<div class="p-4 md:p-6 lg:p-8">
  响应式内边距
</div>
```

---

## 3.4 Tailwind 与 NaiveUI 样式隔离方案

### 样式隔离原则

1. **Tailwind CSS** - 负责布局、间距、响应式设计
2. **NaiveUI** - 负责复杂交互组件（表格、表单、弹窗）

### 推荐使用方式

```vue
<template>
  <!-- Tailwind 处理布局 -->
  <div class="flex items-center justify-between gap-4 p-4">

    <!-- NaiveUI 处理交互 -->
    <n-button type="primary" class="flex-shrink-0">
      按钮
    </n-button>

    <n-input
      class="flex-1"
      placeholder="输入内容"
    />

  </div>
</template>
```

### 避免冲突

```vue
<!-- ✅ 推荐：Tailwind + NaiveUI 分工明确 -->
<div class="flex gap-4">
  <n-button type="primary">按钮</n-button>
</div>

<!-- ❌ 避免：用 Tailwind 覆盖 NaiveUI 样式 -->
<n-button class="!bg-red-500 !text-white">按钮</n-button>
```

---

## 3.5 常用工具类封装

### 布局相关

```css
/* Tailwind 内置，无需额外封装 */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-4 { gap: 1rem; }
```

### 间距相关

```css
.p-4 { padding: 1rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.m-4 { margin: 1rem; }
.mt-4 { margin-top: 1rem; }
```

### 文字相关

```css
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
```

### 响应式

```css
.sm:text-base { @media (min-width: 640px) { font-size: 1rem; } }
.md:flex { @media (min-width: 768px) { display: flex; } }
```

### 暗黑模式

```css
.bg-white { background-color: white; }
.dark\:bg-gray-800 { /* 暗黑模式下 */ }
```

---

## 项目结构更新

```
src/
├── styles/
│   ├── index.css        # 主样式（包含 Tailwind 导入）
│   ├── tailwind.css     # Tailwind 主题配置
│   └── theme.css        # NaiveUI 主题变量
└── App.vue              # 更新为使用 Tailwind 类名
```

---

## 下一步

**第4章：Axios 请求封装与拦截器**
