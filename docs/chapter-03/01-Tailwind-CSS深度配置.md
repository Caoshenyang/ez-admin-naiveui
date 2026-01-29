# 3.1 Tailwind CSS 深度配置

## 本节目标

- ✅ 自定义颜色系统
- ✅ 配置间距和字体
- ✅ 扩展工具类
- ✅ 配置插件

---

## 1. 颜色系统

### 1.1 定义品牌色

**tailwind.config.js**:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // 品牌色
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // 主色
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // 功能色
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
        info: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
    },
  },
}
```

### 1.2 使用颜色

```vue
<template>
  <!-- 品牌色 -->
  <div class="bg-primary-500">主色背景</div>
  <div class="text-primary-600">主色文字</div>

  <!-- 功能色 -->
  <div class="bg-success-500">成功</div>
  <div class="bg-warning-500">警告</div>
  <div class="bg-danger-500">危险</div>
  <div class="bg-info-500">信息</div>
</template>
```

---

## 2. 间距系统

### 2.1 自定义间距

**tailwind.config.js**:

```javascript
export default {
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      // 最大宽度
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
}
```

### 2.2 使用间距

```vue
<template>
  <div class="p-4">16px 内边距</div>
  <div class="p-18">4.5rem 内边距</div>
  <div class="gap-4">16px 间隙</div>
  <div class="space-y-4">垂直间距</div>
</template>
```

---

## 3. 字体系统

### 3.1 配置字体

**tailwind.config.js**:

```javascript
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        'xxs': '0.625rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
    },
  },
}
```

### 3.2 使用字体

```vue
<template>
  <div class="font-sans">无衬线字体</div>
  <div class="font-mono">等宽字体</div>
  <div class="text-xs">12px</div>
  <div class="text-xxs">10px</div>
</template>
```

---

## 4. 阴影系统

### 4.1 自定义阴影

**tailwind.config.js**:

```javascript
export default {
  theme: {
    extend: {
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'none': '0 0 #0000',
      },
    },
  },
}
```

---

## 5. 圆角系统

**tailwind.config.js**:

```javascript
export default {
  theme: {
    extend: {
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
}
```

---

## 6. 响应式断点

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

## 7. 插件配置

### 7.1 官方插件

**安装**:
```bash
pnpm add -D @tailwindcss/forms @tailwindcss/typography
```

**配置**:
```javascript
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

export default {
  plugins: [
    forms,
    typography,
  ],
}
```

### 7.2 自定义插件

**tailwind.config.js**:

```javascript
export default {
  plugins: [
    function({ addUtilities, addComponents }) {
      // 添加工具类
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
      })

      // 添加组件类
      addComponents({
        '.btn': {
          '@apply px-4 py-2 rounded': {},
        },
        '.btn-primary': {
          '@apply bg-primary-500 text-white hover:bg-primary-600': {},
        },
      })
    },
  ],
}
```

---

## 8. 最佳实践

### 8.1 语义化命名

```javascript
// ✅ 推荐：语义化
colors: {
  brand: { ... },
  success: { ... },
  warning: { ... },
}

// ❌ 避免：无意义
colors: {
  red: { ... },
  green: { ... },
  blue: { ... },
}
```

### 8.2 统一间距比例

```javascript
// ✅ 推荐：遵循 4px 基准
spacing: {
  '1': '0.25rem',  // 4px
  '2': '0.5rem',   // 8px
  '3': '0.75rem',  // 12px
  '4': '1rem',     // 16px
}
```

---

## 9. 本节小结

✅ 完成的工作：
- 自定义了颜色系统
- 配置了间距和字体
- 扩展了工具类

**下一步**: [3.2 全局样式与 CSS 变量](./02-全局样式与CSS变量.md)
