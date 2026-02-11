# EzAdmin 颜色系统使用指南

## 架构概述

基于 **Vercel/shadcn/ui/Linear** 的行业标准实践，构建"单一真相源"的颜色系统：

```
┌─────────────────────────────────────────────┐
│  Tailwind CSS @theme (唯一真相源)           │
│  src/assets/styles/index.css                │
└─────────────────────────────────────────────┘
              ↓ 运行时提取颜色值
┌─────────────────────────────────────────────┐
│  NaiveUI themeOverrides                     │
│  src/settings/naiveui-theme.ts              │
│  (使用 getColor() 从 CSS 变量提取)           │
└─────────────────────────────────────────────┘
```

## 核心特性

✅ **单一真相源**：所有颜色在 `index.css` 中定义一次
✅ **运行时提取**：NaiveUI 通过 `getColor()` 从 DOM 中提取实际颜色值
✅ **解决 seemly/rgba 问题**：NaiveUI 收到的是实际颜色值，而非 CSS 变量引用
✅ **自动同步**：Tailwind 和 NaiveUI 100% 颜色一致
✅ **暗色模式**：添加 `.dark` 类即可自动切换
✅ **易于维护**：改一处，处处生效

---

## 技术原理

### 问题背景

NaiveUI 的 `themeOverrides` 需要实际的颜色值（如 `#2563EB`），而不是 CSS 变量引用（如 `var(--color-primary-500)`）。这是因为 NaiveUI 内部使用 `seemly/rgba` 库处理颜色透明度，该库无法解析 `var()` 语法。

### 解决方案

**运行时提取方案**：

1. **定义阶段**：在 `index.css` 中使用 Tailwind CSS `@theme` 定义所有颜色变量
2. **提取阶段**：在 `naiveui-theme.ts` 中使用 `getColor()` 函数从 `getComputedStyle()` 提取实际颜色值
3. **应用阶段**：NaiveUI 收到的是实际颜色值，`seemly/rgba` 可以正常处理

```typescript
// color-vars.ts - 提取工具
export function getColor(variable: string): string {
	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(variable)
		.trim()
	return value // 返回 '#2563EB' 而非 'var(--color-primary-500)'
}

// naiveui-theme.ts - 使用示例
export function createLightTheme(): GlobalThemeOverrides {
	return {
		common: {
			primaryColor: getColor('--color-primary-500'), // 提取为 '#2563EB'（亮色模式）
			primaryColorHover: getColor('--color-primary-600') // 提取为 '#1D4ED8'
		}
	}
}
```

---

## 配色方案

### 设计理念

**明暗主题明确区分**，营造完全不同的视觉体验：

| 主题 | 主色系 | 主色值 | 视觉感受 | 适用场景 |
|------|--------|--------|----------|----------|
| **亮色模式** | 深海蓝系 | `#2563EB` | 清新、专业、商务 | 日常办公、企业应用 |
| **暗色模式** | 霓虹紫系 | `#8B5CF6` | 科技感、未来感、赛博朋克 | 夜间使用、开发者工具 |

### 亮色模式（深海蓝）

```
主色调：#2563EB - 稳重、可靠的深海蓝
├─ 背景色系：纯白 + 浅灰 - 明亮通透
├─ 文字色系：深灰 - 清晰易读
└─ 交互色：蓝色渐变 - 专业商务
```

**特点**：
- ✅ 清新明亮，适合长时间工作
- ✅ 商务专业，符合企业应用定位
- ✅ 高对比度，内容可读性强

### 暗色模式（霓虹紫）

```
主色调：#8B5CF6 - 醒目、科技的霓虹紫
├─ 背景色系：GitHub 深色 - 沉稳护眼
├─ 文字色系：浅灰 - 柔和不刺眼
└─ 交互色：紫色渐变 - 未来科技感
```

**特点**：
- ✅ 霓虹紫色在深色背景下非常醒目
- ✅ 科技感十足，适合开发者和高级用户
- ✅ 减少蓝光，夜间使用更舒适

### 视觉对比

```
亮色模式主色：#2563EB（深海蓝）
暗色模式主色：#8B5CF6（霓虹紫）

色相差异：蓝色(217°) vs 紫色(258°) - 相差 41°
明度差异：47% vs 54% - 暗色更醒目
饱和度差异：86% vs 89% - 都比较鲜艳
```

**效果**：两种模式的色调差异明显，用户可以清晰分辨当前主题。

---

## 使用方式

### 1. 在 Vue 组件中使用 Tailwind

```vue
<template>
  <!-- ✅ 使用语义化类名 -->
  <div class="bg-primary-500 text-white p-4 rounded-lg">
    主要按钮
  </div>

  <!-- ✅ 暗色模式自动切换 -->
  <div class="bg-slate-50 dark:bg-slate-900">
    内容
  </div>

  <!-- ✅ 使用透明度变体 -->
  <div class="bg-primary-500/10 text-primary-600">
    半透明背景
  </div>

  <!-- ❌ 禁止硬编码颜色 -->
  <div style="background-color: #5B6BF0">
    不要这样做
  </div>
</template>
```

### 2. 使用 NaiveUI 组件

```vue
<template>
  <!-- ✅ 自动继承主题颜色 -->
  <n-button type="primary">按钮</n-button>
  <n-card>卡片</n-card>
  <n-input placeholder="输入框" />

  <!-- ✅ 颜色自动同步，无需额外配置 -->
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <App />
  </n-config-provider>
</template>
```

---

## 颜色列表

### 主色调（蓝紫色系）

| Tailwind 类 | 亮色值 | 暗色值 | 用途 |
|------------|--------|--------|------|
| `primary-50` to `primary-900` | #EEF2FF → #312E81 | #C4B5FD → #5B21B6 | 背景、边框 |
| **`primary-500`** | **#5B6BF0** | **#A78BFA** | **主色** |
| `primary-600` | #4A57D9 | #8B5CF6 | Hover 状态 |
| `primary-700` | #4338CA | #7C3AED | Active 状态 |

**透明度变体**：
- `primary-500/05` - 极淡背景
- `primary-500/08` - Focus 边框阴影
- `primary-500/10` - 悬停背景
- `primary-500/15` - Active 背景
- `primary-500/20` - 强调背景

### 语义色

| 语义 | Tailwind 类 | 亮色值 | 暗色值 |
|------|------------|--------|--------|
| 成功 | `success-500` | #10B981 | #10B981 |
| 警告 | `warning-500` | #F59E0B | #F59E0B |
| 错误 | `error-500` | #EF4444 | #EF4444 |
| 信息 | `info-500` | #3B82F6 | #3B82F6 |

### 中性色（slate 色系）

| 用途 | Tailwind 类 | 颜色值 |
|------|------------|--------|
| 最浅背景 | `slate-50` | #F8FAFC |
| 卡片背景 | `slate-100` | #F1F5F9 |
| 边框 | `slate-200` | #E2E8F0 |
| 次要文字 | `slate-400` | #94A3B8 |
| 正文 | `slate-600` | #475569 |
| 标题 | `slate-900` | #0F172A |

### 暗色模式专用色

| 用途 | CSS 变量 | 颜色值 |
|------|----------|--------|
| 页面背景 | `--color-dark-bg` | #0D1117 |
| 侧边栏 | `--color-dark-sider` | #010409 |
| 卡片 | `--color-dark-card` | #161B22 |
| 边框 | `--color-dark-border` | #30363D |
| 主要文字 | `--color-dark-text-primary` | #C9D1D9 |
| 次要文字 | `--color-dark-text-secondary` | #8B949E |

---

## 修改主题颜色

### 场景 1: 修改主色

1. 打开 `src/assets/styles/index.css`
2. 找到 `--color-primary-500: #5B6BF0`
3. 修改为新颜色，例如 `--color-primary-500: #FF5722`
4. 同时修改 `.dark` 内的 `--color-primary-500`
5. 完成！Tailwind 和 NaiveUI 自动同步

**示例**：
```css
@theme {
  --color-primary-500: #FF5722;  /* 改为橙色 */
}

.dark {
  @theme {
    --color-primary-500: #FF784E;  /* 暗色模式稍亮 */
  }
}
```

### 场景 2: 修改语义色

直接修改对应变量：
```css
@theme {
  --color-success-500: #00E676;  /* 改为更亮的绿色 */
  --color-warning-500: #FFA726;  /* 改为橙色 */
}
```

### 场景 3: 添加新颜色

在 `@theme` 中添加新变量：
```css
@theme {
  --color-brand-500: #6366F1;  /* 新增品牌色 */
}
```

然后在组件中使用：
```vue
<div class="bg-brand-500">品牌色</div>
```

---

## 最佳实践

### ✅ 推荐做法

1. **使用语义化类名**
   ```vue
   <button class="bg-primary-500 hover:bg-primary-600">
     按钮
   </button>
   ```

2. **利用 Tailwind 的状态修饰符**
   ```vue
   <button class="bg-primary-500 hover:bg-primary-600 active:bg-primary-700">
     按钮
   </button>
   ```

3. **暗色模式自动适配**
   ```vue
   <div class="bg-slate-50 dark:bg-slate-900">
     自动切换背景
   </div>
   ```

4. **使用透明度变体**
   ```vue
   <div class="bg-primary-500/10 text-primary-600">
     淡雅的强调色
   </div>
   ```

### ❌ 避免做法

1. **禁止硬编码颜色**
   ```vue
   <!-- ❌ 错误 -->
   <div style="background-color: #5B6BF0">
   </div>

   <!-- ✅ 正确 -->
   <div class="bg-primary-500">
   </div>
   ```

2. **不要使用动态颜色计算**
   ```vue
   <!-- ❌ 错误：动态计算透明度 -->
   <div :style="{ backgroundColor: `rgba(91, 107, 240, ${opacity})` }">

   <!-- ✅ 正确：使用预定义透明度 -->
   <div class="bg-primary-500/10">
   </div>
   ```

3. **避免过度自定义**
   ```vue
   <!-- ❌ 错误：每个按钮都自定义颜色 -->
   <n-button color="#FF5722">
   </n-button>

   <!-- ✅ 正确：使用 type 或 CSS 变量 -->
   <n-button type="error">
   </n-button>
   ```

---

## 常见问题

### Q1: seemly/rgba 报错如何解决？

**A**: 本方案已通过运行时提取解决。`getColor()` 函数返回实际颜色值（如 `#5B6BF0`），而非 CSS 变量引用（如 `var(--color-primary-500)`），seemly/rgba 可以正常处理。

### Q2: 为什么 NaiveUI 组件颜色不对？

**A**: 确保 `n-config-provider` 正确配置了主题：

```vue
<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'
const { theme, themeOverrides } = useTheme()
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <App />
  </n-config-provider>
</template>
```

### Q3: 暗色模式不生效？

**A**: 检查以下几点：

1. 确保 `html` 或 `body` 标签有 `dark` 类：
   ```typescript
   document.documentElement.classList.add('dark')
   ```

2. 确保 Tailwind CSS 的 `@theme` 在 `.dark` 类中覆盖了颜色

3. 清除浏览器缓存

### Q4: 如何禁用暗色模式？

**A**: 移除 `dark` 类即可：
```typescript
document.documentElement.classList.remove('dark')
```

### Q5: 运行时提取会不会有性能问题？

**A**: 不会。主题创建只在以下时机执行：
1. 应用初始化时（一次）
2. 用户手动切换主题时

提取过程使用浏览器的原生 `getComputedStyle()` API，性能开销可忽略不计。

---

## 技术细节

### 文件结构

```
src/
├── assets/styles/
│   └── index.css                 ← Tailwind @theme（颜色定义）
├── utils/
│   └── color-vars.ts             ← 颜色提取工具
├── settings/
│   └── naiveui-theme.ts          ← NaiveUI 主题（运行时提取）
├── hooks/
│   └── useTheme.ts               ← 主题切换逻辑
```

### CSS 变量引用规则

| 场景 | 示例 | 说明 |
|------|------|------|
| 基础颜色 | `getColor('--color-primary-500')` | 返回 `#5B6BF0` |
| 透明度颜色 | `getColor('--color-primary-500/08')` | 返回 `rgba(91, 107, 240, 0.08)` |
| 纯数值 | `'10px'` | 可以硬编码 |
| 计算 | `'calc(100% - 20px)'` | 可以使用 calc |

### 暗色模式工作原理

```css
/* 亮色模式 */
@theme {
  --color-primary-500: #5B6BF0;  /* 蓝紫色 */
}

/* 暗色模式（.dark 类激活时覆盖） */
.dark {
  @theme {
    --color-primary-500: #A78BFA;  /* 电光紫 */
  }
}
```

当添加 `dark` 类时，浏览器自动使用 `.dark` 内的值，`getColor()` 自动提取新值，NaiveUI 无需修改。

---

## 参考资源

- **Tailwind CSS 4.x 文档**: https://tailwindcss.com/docs
- **NaiveUI 主题配置**: https://www.naiveui.com/en-US/os-theme
- **Vercel 颜色系统**: https://vercel.com/design/color
- **shadcn/ui 最佳实践**: https://ui.shadcn.com/
