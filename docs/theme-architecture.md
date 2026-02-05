# 主题架构设计 - NaiveUI + Tailwind CSS

## 架构理念

本项目采用 **NaiveUI 主题 + Tailwind CSS 辅助** 的协作模式，确保颜色主题的完整覆盖和代码的可维护性。

---

## 职责分工

### NaiveUI 主题系统

**职责**: 控制所有 NaiveUI 组件的颜色和样式

**优势**:
- ✅ **完整覆盖**: NaiveUI 的主题系统可以覆盖所有组件内部元素，不存在透传失效的问题
- ✅ **类型安全**: TypeScript 类型提示完整，避免魔法字符串
- ✅ **官方支持**: 使用官方推荐的主题定制方式，未来升级有保障
- ✅ **无需 `:deep()`**: 避免使用深层选择器，保持代码简洁

**配置文件**: `src/settings/naiveui-theme.ts`

**应用范围**:
- 所有 NaiveUI 组件（`n-button`, `n-input`, `n-table`, `n-menu` 等）
- 组件内部的所有元素（包括嵌套的子元素）
- 组件的所有状态（hover, active, disabled, focus 等）

**示例**:
```vue
<template>
  <n-config-provider :theme-overrides="lightTheme">
    <!-- 所有 NaiveUI 组件自动应用主题 -->
    <n-button type="primary">按钮</n-button>
    <n-input placeholder="输入框" />
    <n-table :data="data" />
  </n-config-provider>
</template>

<script setup lang="ts">
import { lightTheme } from '@/settings/naiveui-theme'
</script>
```

---

### Tailwind CSS

**职责**: 控制原生 HTML 标签的布局和样式

**优势**:
- ✅ **快速开发**: 原子类样式，无需编写 CSS
- ✅ **响应式设计**: 内置响应式断点系统
- ✅ **布局系统**: 强大的 Flexbox 和 Grid 工具
- ✅ **间距控制**: 统一的间距和尺寸系统

**配置文件**: `src/assets/index.css`

**应用范围**:
- 原生 HTML 标签（`div`, `span`, `header`, `section` 等）
- 布局和间距（`flex`, `grid`, `p-4`, `m-2`, `gap-4` 等）
- 响应式设计（`md:block`, `lg:w-64` 等）
- 动画和过渡（`transition`, `duration`, `ease` 等）

**示例**:
```vue
<template>
  <!-- Tailwind 用于原生标签布局 -->
  <div class="flex h-screen bg-slate-50">
    <header class="w-full p-4 border-b">
      <h1 class="text-2xl font-bold text-slate-900">标题</h1>
    </header>
    <main class="flex-1 p-6">
      <p class="text-slate-600">内容</p>
    </main>
  </div>
</template>
```

---

## 设计原则

### 1. 颜色主题

**由 NaiveUI 控制**:
```typescript
// src/settings/naiveui-theme.ts
export const lightTheme: GlobalThemeOverrides = {
  common: {
    primaryColor: '#0369A1', // 主色调
    successColor: '#10B981', // 成功色
    warningColor: '#F59E0B', // 警告色
    errorColor: '#EF4444', // 错误色
    textColorBase: '#1E293B', // 文字颜色
    bodyColor: '#F8FAFC', // 背景颜色
  },
}
```

**❌ 不推荐**: 在 Tailwind 中定义颜色变量
```css
/* 避免这样做 */
@theme {
  --color-primary-500: #0369A1;
}
```

**✅ 推荐**: 使用 NaiveUI 主题配置
```typescript
// 这样可以确保所有 NaiveUI 组件都正确应用主题
export const lightTheme: GlobalThemeOverrides = {
  common: {
    primaryColor: '#0369A1',
  },
}
```

---

### 2. 布局系统

**由 Tailwind CSS 控制**:
```vue
<template>
  <div class="flex h-screen">
    <!-- 侧边栏 -->
    <aside class="w-64 flex-shrink-0">
      <app-menu />
    </aside>

    <!-- 主内容 -->
    <main class="flex-1 overflow-y-auto">
      <router-view />
    </main>
  </div>
</template>
```

**使用场景**:
- 页面布局（`flex`, `grid`, `block`）
- 间距控制（`p-4`, `m-2`, `gap-4`）
- 响应式设计（`md:flex`, `lg:w-64`）
- 尺寸控制（`w-full`, `h-screen`, `max-w-6xl`）

---

### 3. 组件样式

**NaiveUI 组件**: 使用 NaiveUI 主题配置
```vue
<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-button type="primary">主要按钮</n-button>
    <n-input placeholder="请输入内容" />
    <n-select :options="options" />
  </n-config-provider>
</template>

<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  Button: {
    textColor: '#FFFFFF',
  },
  Input: {
    border: '1px solid #E2E8F0',
  },
}
</script>
```

**原生 HTML 元素**: 使用 Tailwind CSS
```vue
<template>
  <div class="p-4 bg-white rounded-lg shadow">
    <h2 class="text-lg font-semibold text-slate-900">标题</h2>
    <p class="text-slate-600">描述文本</p>
  </div>
</template>
```

---

## 实际应用示例

### 示例 1: 表单页面

```vue
<template>
  <!-- Tailwind 控制布局 -->
  <div class="max-w-2xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow">
      <!-- Tailwind 控制间距 -->
      <div class="p-6 space-y-4">
        <h2 class="text-2xl font-bold text-slate-900">用户信息</h2>

        <!-- NaiveUI 组件应用主题 -->
        <n-form ref="formRef" :model="formValue">
          <n-form-item label="用户名" path="username">
            <n-input v-model:value="formValue.username" placeholder="请输入用户名" />
          </n-form-item>

          <n-form-item label="邮箱" path="email">
            <n-input v-model:value="formValue.email" placeholder="请输入邮箱" />
          </n-form-item>

          <n-form-item>
            <n-button type="primary" @click="handleSubmit">提交</n-button>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>
```

---

### 示例 2: 数据表格

```vue
<template>
  <!-- Tailwind 控制页面布局 -->
  <div class="p-6">
    <!-- Tailwind 控制卡片样式 -->
    <div class="bg-white rounded-lg shadow">
      <!-- Tailwind 控制工具栏布局 -->
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-lg font-semibold text-slate-900">用户列表</h2>
        <n-button type="primary" @click="handleAdd">新增</n-button>
      </div>

      <!-- NaiveUI 表格组件应用主题 -->
      <n-data-table
        :columns="columns"
        :data="data"
        :pagination="pagination"
      />
    </div>
  </div>
</template>
```

---

## 常见问题

### Q1: 为什么不让 Tailwind 控制所有样式？

**A**: NaiveUI 组件有很多内部元素和嵌套结构，如果使用 Tailwind 控制：
- 需要使用 `:deep()` 深层选择器，代码复杂
- 很多样式不支持透传，导致样式不生效
- 维护成本高，未来升级困难

### Q2: 如何确保 NaiveUI 和 Tailwind 的颜色一致？

**A**: 在 NaiveUI 主题配置中定义颜色，Tailwind 使用默认的 slate/blue 色系：
```typescript
// NaiveUI 主题
primaryColor: '#0369A1', // sky-700
bodyColor: '#F8FAFC', // slate-50
textColorBase: '#1E293B', // slate-800
```

### Q3: 如何自定义某个组件的颜色？

**A**: 在 NaiveUI 主题配置中覆盖组件样式：
```typescript
export const lightTheme: GlobalThemeOverrides = {
  Button: {
    textColor: '#FFFFFF',
    colorHover: '#0284C7',
  },
}
```

### Q4: 可以为不同页面使用不同主题吗？

**A**: 可以，使用多个 `n-config-provider` 嵌套：
```vue
<template>
  <n-config-provider :theme-overrides="globalTheme">
    <app-layout>
      <n-config-provider :theme-overrides="pageTheme">
        <router-view />
      </n-config-provider>
    </app-layout>
  </n-config-provider>
</template>
```

---

## 总结

| 层面 | 工具 | 职责 |
|------|------|------|
| **颜色主题** | NaiveUI | 控制所有组件的颜色、边框、背景 |
| **布局系统** | Tailwind CSS | 控制页面布局、间距、响应式 |
| **组件样式** | NaiveUI | 控制组件的内部样式和状态 |
| **原生标签** | Tailwind CSS | 控制原生 HTML 元素的样式 |

**核心原则**:
- ✅ NaiveUI 组件的颜色由 NaiveUI 主题配置控制
- ✅ 原生 HTML 标签的样式由 Tailwind CSS 控制
- ✅ 避免混合使用，保持职责清晰
- ✅ 优先使用主题配置，避免硬编码颜色值

---

## 参考资源

- [NaiveUI 主题定制文档](https://www.naiveui.com/zh-CN/os-theme/docs/customize-theme)
- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [UI/UX Pro Max - Professional SaaS Dashboard](https://ui-ux-pro-max.com)
