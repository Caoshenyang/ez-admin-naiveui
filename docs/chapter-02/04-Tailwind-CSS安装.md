# 2.4 Tailwind CSS 安装

## 本节目标

- ✅ 安装 Tailwind CSS
- ✅ 配置 Tailwind CSS
- ✅ 创建全局样式
- ✅ 使用 Tailwind 工具类

---

## 1. 安装 Tailwind CSS

```bash
pnpm add -D tailwindcss postcss autoprefixer
```

---

## 2. 初始化配置

### 2.1 生成配置文件

```bash
npx tailwindcss init -p
```

这会创建：
- `tailwind.config.js` - Tailwind 配置
- `postcss.config.js` - PostCSS 配置

### 2.2 配置 Tailwind

**tailwind.config.js**:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  plugins: [],
}
```

### 2.3 配置 PostCSS

**postcss.config.js**:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## 3. 创建全局样式

### 3.1 导入基础样式

**src/styles/index.css**:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定义基础样式 */
@layer base {
  * {
    @apply box-border;
  }

  html,
  body,
  #app {
    @apply h-full w-full;
  }

  body {
    @apply font-sans antialiased;
  }
}

/* 自定义组件样式 */
@layer components {
  .btn-primary {
    @apply rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600;
  }

  .card {
    @apply rounded-lg bg-white p-6 shadow-md;
  }
}

/* 自定义工具类 */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### 3.2 在 main.ts 中导入

**src/main.ts**:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.css'

createApp(App).mount('#app')
```

---

## 4. 使用 Tailwind CSS

### 4.1 基础使用

```vue
<template>
  <!-- Flex 布局 -->
  <div class="flex items-center justify-between p-4">
    <h1 class="text-xl font-bold">标题</h1>
    <button class="btn-primary">按钮</button>
  </div>

  <!-- 网格布局 -->
  <div class="grid grid-cols-3 gap-4">
    <div class="card">卡片 1</div>
    <div class="card">卡片 2</div>
    <div class="card">卡片 3</div>
  </div>

  <!-- 响应式 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- ... -->
  </div>
</template>
```

### 4.2 响应式设计

```vue
<template>
  <div class="
    p-4        /* 移动端: 16px */
    md:p-6     /* 中等屏幕: 24px */
    lg:p-8     /* 大屏幕: 32px */
  ">
    响应式内边距
  </div>

  <div class="
    text-sm     /* 移动端: 14px */
    md:text-base /* 中等屏幕: 16px */
    lg:text-lg  /* 大屏幕: 18px */
  ">
    响应式文字
  </div>
</template>
```

### 4.3 悬停和焦点状态

```vue
<template>
  <button class="
    bg-primary-500
    hover:bg-primary-600
    focus:ring-2
    focus:ring-primary-300
  ">
    按钮
  </button>

  <input class="
    border
    border-gray-300
    focus:border-primary-500
    focus:ring-2
    focus:ring-primary-200
  " />
</template>
```

---

## 5. Tailwind 与 NaiveUI 混用

### 5.1 布局用 Tailwind，组件用 NaiveUI

```vue
<template>
  <!-- Tailwind 布局 -->
  <div class="flex gap-4 p-6">
    <!-- NaiveUI 组件 -->
    <n-button type="primary">按钮</n-button>
    <n-input placeholder="输入框" />
  </div>
</template>
```

### 5.2 覆盖 NaiveUI 样式

```vue
<template>
  <!-- 使用 Tailwind 调整 NaiveUI 组件 -->
  <n-button class="w-full md:w-auto">
    按钮
  </n-button>

  <n-card class="shadow-lg hover:shadow-xl transition-shadow">
    卡片内容
  </n-card>
</template>
```

---

## 6. 自定义配置

### 6.1 扩展颜色

**tailwind.config.js**:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          // ...
          900: '#1e3a8a',
        },
      },
    },
  },
}
```

使用：
```vue
<button class="bg-brand-500 hover:bg-brand-600">
  按钮
</button>
```

### 6.2 自定义断点

**tailwind.config.js**:

```javascript
export default {
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
}
```

---

## 7. 最佳实践

### 7.1 组件抽象

```vue
<!-- ❌ 不推荐：重复使用类名 -->
<button class="rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600">
  按钮 1
</button>
<button class="rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600">
  按钮 2
</button>

<!-- ✅ 推荐：使用 @apply -->
<button class="btn-primary">按钮 1</button>
<button class="btn-primary">按钮 2</button>
```

### 7.2 响应式优先

```vue
<!-- ✅ 推荐：移动优先 -->
<div class="w-full md:w-1/2 lg:w-1/3">
  内容
</div>
```

---

## 8. 常见问题

### Q1: Tailwind 样式不生效？

**A**:
1. 确保在 CSS 中导入了 `@tailwind` 指令
2. 确保 `tailwind.config.js` 中 `content` 路径正确
3. 重启开发服务器

### Q2: 如何清除未使用的样式？

**A**: Tailwind CSS 在生产构建时会自动清除未使用的样式，无需额外配置。

---

## 9. 本节小结

✅ 完成的工作：
- 安装并配置了 Tailwind CSS
- 创建了全局样式
- 了解了工具类的使用

**下一步**: [2.5 项目目录结构规范](./05-项目目录结构规范.md)
