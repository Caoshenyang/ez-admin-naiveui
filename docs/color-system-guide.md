# EzAdmin 颜色系统使用指南

## 概述

EzAdmin 采用 **"单一真相源"** 颜色管理策略，所有颜色统一通过 Tailwind CSS `@theme` 定义，NaiveUI 和组件层都引用这套颜色系统。

**设计理念**：
- **主色调**：蓝紫色系 - 现代、专业、科技感
- **语义色**：标准语义 - 符合用户习惯
- **中性色**：slate 色系 - 柔和、层次清晰
- **暗色模式**：GitHub 风格 - 专业、护眼

---

## 颜色定义

所有颜色在 `src/assets/styles/index.css` 中统一定义：

### 主色调（Primary）

```
亮色模式：#5B6BF0（蓝紫色）
暗色模式：#A78BFA（电光紫）
```

**用途**：品牌色、主要按钮、激活状态、链接等

**使用方式**：
```html
<!-- 亮色模式 -->
<div class="bg-primary-500">主色背景</div>
<button class="bg-primary-500 hover:bg-primary-600">主要按钮</button>

<!-- 暗色模式 -->
<div class="bg-primary-500 dark:bg-primary-dark-500">自适应主色</div>
```

### 语义色

#### 成功色（Success）
```
主色：#10B981（绿色）
用途：表示成功、完成、通过等积极状态
```

#### 警告色（Warning）
```
主色：#F59E0B（琥珀色）
用途：表示警告、待处理、需要注意等状态
```

#### 错误色（Error）
```
主色：#EF4444（红色）
用途：表示错误、危险、失败等消极状态
```

#### 信息色（Info）
```
主色：#3B82F6（蓝色）
用途：表示提示、中性信息等
```

**使用方式**：
```html
<div class="text-success-500">操作成功</div>
<div class="text-warning-500">请注意</div>
<div class="text-error-500">操作失败</div>
<div class="text-info-500">提示信息</div>
```

### 中性色（Slate）

```
slate-50 ~ slate-900：从浅灰到深灰
用途：背景、边框、文字等基础场景
```

**常用色值**：
- `slate-50`：浅灰背景（#F8FAFC）
- `slate-200`：边框色（#E2E8F0）
- `slate-400`：次要文字（#94A3B8）
- `slate-600`：正文文字（#475569）
- `slate-900`：标题文字（#0F172A）

### 暗色模式专用色

```
--color-dark-bg: #0D1117        （背景）
--color-dark-sider: #010409      （侧边栏）
--color-dark-card: #161B22       （卡片）
--color-dark-border: #30363D     （边框）
--color-dark-hover: rgba(255, 255, 255, 0.08)  (Hover)
--color-dark-text-primary: #C9D1D9   （主要文字）
--color-dark-text-secondary: #8B949E （次要文字）
--color-dark-text-tertiary: #6E7681   （辅助文字）
```

---

## 使用规范

### ✅ 推荐做法

#### 1. 使用 Tailwind 语义化类名

```html
<!-- ✅ 正确：使用语义化类名 -->
<button class="bg-primary-500 hover:bg-primary-600 text-white">
  主要按钮
</button>

<div class="border border-slate-200 dark:border-dark-border rounded-lg">
  卡片容器
</div>
```

#### 2. 暗色模式适配

```html
<!-- ✅ 正确：使用 dark: 前缀 -->
<div class="bg-white dark:bg-dark-card
            text-slate-900 dark:text-dark-text-primary">
  自适应主题的内容
</div>
```

#### 3. 透明度变体

```html
<!-- ✅ 正确：使用 opacity -->
<button class="bg-primary-500 hover:bg-primary-500/90">
  带透明度的按钮
</button>
```

### ❌ 禁止做法

#### 1. 禁止硬编码颜色

```html
<!-- ❌ 错误：硬编码颜色值 -->
<div class="bg-[#5B6BF0]">主色背景</div>
<div style="color: #3b82f6">蓝色文字</div>

<!-- ✅ 正确：使用语义化类名 -->
<div class="bg-primary-500">主色背景</div>
<div class="text-info-500">信息文字</div>
```

#### 2. 禁止混用不同蓝色系

```html
<!-- ❌ 错误：混用 blue-500 和 primary-500 -->
<div class="bg-blue-500">错误的主色</div>
<div class="bg-primary-500">正确的主色</div>

<!-- ✅ 统一使用 primary-500 作为主色 -->
<div class="bg-primary-500">主色</div>
```

#### 3. 禁止直接使用 NaiveUI 颜色变量

```html
<!-- ❌ 错误：直接使用 NaiveUI 的变量 -->
<n-button style="--primary-color: #5B6BF0">按钮</n-button>

<!-- ✅ 正确：NaiveUI 已自动引用 Tailwind 变量 -->
<n-button type="primary">按钮</n-button>
```

---

## NaiveUI 组件颜色

NaiveUI 组件已自动引用 Tailwind 颜色系统，无需手动配置：

### 按钮

```html
<!-- 主要按钮（自动使用主色） -->
<n-button type="primary">主要按钮</n-button>

<!-- 成功按钮（自动使用成功色） -->
<n-button type="success">成功按钮</n-button>

<!-- 警告按钮（自动使用警告色） -->
<n-button type="warning">警告按钮</n-button>

<!-- 错误按钮（自动使用错误色） -->
<n-button type="error">错误按钮</n-button>
```

### 表单

```html
<!-- 输入框（自动使用边框色、焦点色） -->
<n-input placeholder="请输入内容" />

<!-- 选择器（自动使用主色高亮） -->
<n-select :options="options" />
```

### 反馈组件

```html
<!-- 消息提示（自动使用语义色） -->
<n-message type="success">操作成功</n-message>
<n-message type="error">操作失败</n-message>
<n-message type="warning">请注意</n-message>
<n-message type="info">提示信息</n-message>
```

---

## 自定义场景

### 场景 1：自定义组件样式

```html
<!-- ✅ 使用 Tailwind 类名组合 -->
<div class="
  bg-primary-500
  hover:bg-primary-600
  active:bg-primary-700
  text-white
  rounded-lg
  px-4 py-2
  transition-colors
">
  自定义按钮
</div>
```

### 场景 2：动态颜色

```vue
<script setup lang="ts">
import type { Ref } from 'vue'

const status: Ref<'success' | 'warning' | 'error'> = ref('success')

const statusClass = computed(() => {
  return {
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500'
  }[status.value]
})
</script>

<template>
  <div :class="statusClass">
    状态文本
  </div>
</template>
```

### 场景 3：EzIcon 图标颜色

```html
<!-- ✅ 使用统一主色 -->
<EzIcon icon="mdi:home" :size="20" color="#5B6BF0" />

<!-- ✅ 使用语义色 -->
<EzIcon icon="mdi:check" :size="20" color="#10B981" />
<EzIcon icon="mdi:alert" :size="20" color="#F59E0B" />
<EzIcon icon="mdi:close" :size="20" color="#EF4444" />
```

---

## 主题切换

### 自动适配

系统已内置暗色模式支持，使用 `dark:` 前缀即可：

```html
<div class="bg-white dark:bg-dark-card
            text-slate-900 dark:text-dark-text-primary">
  自动适配主题的内容
</div>
```

### 手动切换

使用 `useTheme` Hook：

```vue
<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button @click="toggleTheme">
    {{ isDark ? '切换到亮色模式' : '切换到暗色模式' }}
  </button>
</template>
```

---

## 修改主题色

如果需要修改主题色，只需修改 `src/assets/styles/index.css`：

```css
@theme {
  /* 修改主色 */
  --color-primary-500: #YOUR_COLOR;

  /* 修改成功色 */
  --color-success-500: #YOUR_COLOR;

  /* 修改其他颜色... */
}
```

**注意**：修改后，所有引用该颜色的地方（NaiveUI 组件、Tailwind 类名）都会自动更新。

---

## 常见问题

### Q1：为什么不用 blue-500 作为主色？

**A**：blue-500（#3B82F6）是纯蓝色，而 primary-500（#5B6BF0）是蓝紫色，更符合现代 SaaS 产品的设计语言。统一使用 primary-500 可以保持品牌一致性。

### Q2：暗色模式下主色为什么不同？

**A**：
- 亮色模式：#5B6BF0（蓝紫色）
- 暗色模式：#A78BFA（电光紫）

暗色背景下，电光紫更醒目、更有质感，符合 GitHub、VS Code 等主流应用的设计。

### Q3：如何添加自定义颜色？

**A**：在 `src/assets/styles/index.css` 中添加：

```css
@theme {
  --color-custom-500: #YOUR_COLOR;
  --color-custom-600: #YOUR_DARKER_COLOR;
}
```

然后使用：`class="bg-custom-500"`

### Q4：为什么成功色不使用主色？

**A**：之前的设计将成功色设为与主色一致（#5B6BF0），这违反了用户习惯（绿色=成功）。新的设计遵循标准语义色：
- ✅ 成功 = 绿色（#10B981）
- ✅ 警告 = 琥珀色（#F59E0B）
- ✅ 错误 = 红色（#EF4444）
- ✅ 主色 = 蓝紫色（#5B6BF0）

---

## 参考资源

- **Tailwind CSS 4.x 文档**：https://tailwindcss.com/docs
- **NaiveUI 主题定制**：https://www.naiveui.com/zh-CN/os-theme/docs/customize-theme
- **GitHub 暗色规范**：https://primer.style/design/themes/dark

---

**最后更新**：2026-02-10
**维护者**：EzAdmin Team
