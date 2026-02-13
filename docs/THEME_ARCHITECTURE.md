# EzAdmin 主题系统架构（最终方案）

## 核心设计

**NaiveUI 主题为主 + Tailwind CSS 纯布局工具 + 扁平化变量定义（中缀式命名）**

```
┌─────────────────────────────────────────┐
│  theme-variables.css (:root 包裹)   │
│  --primary-500: #5B6BF0             │
│  --primary-dark-500: #A78BFA         │
│  --text-primary: #0F172A               │
│  --text-primary-dark: #F0F6FC          │
└─────────────────────────────────────────┘
           ↓
    ┌──────────────┐
    │ color-vars  │ ← 运行时提取
    │ getColor()   │ ← 读取 --primary-500
    │ getDarkColor()│ ← 读取 --primary-dark-500
    └──────────────┘
           ↓
    ┌──────────────┐
    │ naiveui-theme│ ← 极简配置(~40行)
    │ createNaiveTheme(isDark) │
    │ common only  │ ← 移除组件级配置
    └──────────────┘
           ↓
    ┌──────────────┐
    │ NaiveUI 组件 │ ← 自动应用主题
    │ n-button     │ (无需 dark: 类)
    │ n-table      │
    └──────────────┘

┌─────────────────────────────────────────┐
│  Tailwind CSS (纯布局工具，无颜色配置)    │
│  p-4, flex, gap-4, md:grid-cols-2          │
└─────────────────────────────────────────┘
           ↓
    ┌──────────────┐
    │ 容器组件     │ ← 使用 dark:xxx
    │ EzPage       │ (bg-white dark:bg-gray-900)
    │ EzCard       │
    └──────────────┘
```

---

## 核心特性

✅ **扁平化变量定义**：所有颜色在 `:root {}` 中，一目了然（类似 Sass `_variables.scss`）
✅ **中缀式命名**：`--{name}-dark-{scale}` 清晰标识暗色模式
✅ **极简主题配置**：NaiveUI 从 300+ 行减少到 ~40 行（只配置 common）
✅ **单一真相源**：所有颜色在 `theme-variables.css` 中定义一次
✅ **Tailwind 纯布局化**：不配置颜色，只负责间距、flex/grid、响应式
✅ **暗色模式零配置**：NaiveUI 组件自动切换，容器组件用 `dark:xxx` 处理

---

## 变量命名规范（中缀式）

### 格式定义

**亮色模式**：`--{name}-{scale}`
**暗色模式**：`--{name}-dark-{scale}`
**固定值**：`--{name}`（无 dark 后缀）

### 示例

| 类型 | 亮色变量 | 暗色变量 | 说明 |
|------|---------|---------|------|
| 主色 | `--primary-500` | `--primary-dark-500` | 500 是色阶 |
| 主色 hover | `--primary-600` | `--primary-dark-600` | 600 是 hover 状态 |
| 文字主色 | `--text-primary` | `--text-primary-dark` | 主要文字颜色 |
| 边框 | `--border-default` | `--border-default-dark` | 默认边框颜色 |
| 圆角 | `--radius-md` | (无) | 固定值，不分亮暗 |

### 中缀式命名的优势

1. **✅ 语义层级清晰**：
   ```
   --primary-dark-500
      ↓      ↓      ↓
   颜色  模式   色阶
   ```

2. **✅ IDE 自动补全友好**：
   ```css
   /* 输入 --primary-dark- 可以看到所有暗色色阶 */
   --primary-dark-500: #A78BFA;
   --primary-dark-600: #C4B5FD;
   --primary-dark-700: #DDD6FE;
   ```

3. **✅ 变量紧邻**：亮色和暗色版本挨在一起，便于维护

---

## 技术栈分工

| 层级 | 技术 | 用途 | 是否配置颜色 | 示例 |
|------|------|------|-------------|------|
| **交互组件** | NaiveUI | 表单、表格、弹窗、导航 | ✅ **是**（通过 themeOverrides） | `<n-button>`, `<n-data-table>` |
| **容器组件** | 自定义 | 封装常用布局模式 | ✅ **是**（用 `dark:xxx`） | `<EzPage>`, `<EzCard>` |
| **布局工具** | Tailwind | 间距、响应式、flex/grid | ❌ **否**（纯布局） | `p-4`, `md:flex`, `gap-4` |
| **主题配置** | CSS 变量 | 颜色、圆角、阴影 | - | `var(--primary-500)` |

---

## 文件结构

```
src/
├── assets/styles/
│   ├── theme-variables.css ← CSS 变量定义(:root 包裹，中缀式命名)
│   └── index.css             ← Tailwind 导入 + 过渡动画(无颜色配置)
├── settings/
│   └── naiveui-theme.ts    ← NaiveUI 主题(极简版，~40 行)
├── stores/modules/
│   └── theme.ts             ← 主题切换逻辑(管理 .dark 类)
├── utils/
│   └── color-vars.ts         ← 颜色提取工具
└── components/
    ├── EzPage.vue            ← 页面容器
    ├── EzCard.vue            ← 卡片容器
    ├── EzContainer.vue       ← 内容容器
    ├── EzFlex.vue            ← Flex 布局
    └── EzButtonGroup.vue     ← 按钮组
```

---

## 使用方式

### 1. NaiveUI 组件（优先使用，自动主题）

```vue
<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <!-- 无需任何 dark: 类，自动应用主题 -->
    <n-button type="primary">按钮</n-button>
    <n-input placeholder="输入框" />
    <n-data-table :columns="columns" :data="data" />
  </n-config-provider>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/modules/theme'

const { themeOverrides } = useThemeStore()
</script>
```

**特点**：无需任何 `dark:` 类，NaiveUI 组件自动应用主题

---

### 2. 容器组件（推荐使用，内置暗色模式）

```vue
<template>
  <!-- EzPage：页面容器 -->
  <EzPage padding="24px">
    <EzContainer>
      <!-- EzCard：卡片容器 -->
      <EzCard hoverable>
        <n-form>
          <n-form-item label="用户名">
            <n-input />
          </n-form-item>
          <EzButtonGroup>
            <n-button>取消</n-button>
            <n-button type="primary">确定</n-button>
          </EzButtonGroup>
        </n-form>
      </EzCard>
    </EzContainer>
  </EzPage>
</template>

<script setup lang="ts">
import { EzPage, EzCard, EzContainer, EzButtonGroup } from '@/components'
</script>
```

**特点**：容器组件已内置 `dark:xxx` 支持

---

### 3. Tailwind 布局工具（纯布局，不涉及颜色）

```vue
<template>
  <!-- ✅ 正确：间距、布局、响应式 -->
  <div class="flex items-center gap-4 p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div>列 1</div>
      <div>列 2</div>
      <div>列 3</div>
    </div>
  </div>
</template>
```

**特点**：Tailwind 只用于布局，不涉及颜色

---

### 4. 原生标签（必要时手动处理）

```vue
<template>
  <!-- 使用 Tailwind 的 dark:xxx 修饰符 + 中性色 -->
  <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    内容
  </div>
</template>
```

**特点**：只在必要时使用，优先用 NaiveUI 组件或容器组件

---

## 组件使用优先级

```
1️⃣ NaiveUI 组件（优先，自动主题）
   └─> <n-button>, <n-input>, <n-data-table> 等

2️⃣ 自定义容器组件（推荐，内置暗色模式）
   └─> <EzPage>, <EzCard>, <EzContainer>, <EzFlex> 等

3️⃣ Tailwind 布局类（纯布局，无颜色）
   └─> p-4, md:flex, gap-4, grid-cols-2 等

4️⃣ 原生标签 + Tailwind 中性色 + dark:xxx（必要时）
   └─> <div class="bg-white dark:bg-gray-900">
```

---

## 颜色列表

### 主色调（蓝紫色系）

| CSS 变量 | 亮色值 | 暗色变量 | 暗色值 | 用途 |
|----------|--------|---------|--------|------|
| `--primary-500` | `#5B6BF0` | `--primary-dark-500` | `#A78BFA` | **主色** |
| `--primary-600` | `#4A57D9` | `--primary-dark-600` | `#C4B5FD` | Hover 状态 |
| `--primary-700` | `#4338CA` | `--primary-dark-700` | `#DDD6FE` | Active 状态 |

### 语义色（固定值，不分亮暗）

| 语义 | CSS 变量 | 颜色值 | 用途 |
|------|----------|--------|------|
| 成功 | `--success-500` | `#10B981` | n-tag type="success" |
| 警告 | `--warning-500` | `#F59E0B` | n-tag type="warning" |
| 错误 | `--error-500` | `#EF4444` | n-tag type="error" |
| 信息 | `--info-500` | `#3B82F6` | n-tag type="info" |

### 中性色（用于容器组件）

| 用途 | 亮色变量 | 亮色值 | 暗色变量 | 暗色值 | Tailwind 类 |
|------|----------|--------|---------|--------|------------|
| 主要文字 | `--text-primary` | `#0F172A` | `--text-primary-dark` | `#F0F6FC` | `text-gray-900` / `dark:text-gray-100` |
| 次要文字 | `--text-secondary` | `#475569` | `--text-secondary-dark` | `#8B949E` | `text-gray-600` / `dark:text-gray-400` |
| 边框 | `--border-default` | `#CBD5E1` | `--border-default-dark` | `#484F58` | `border-gray-200` / `dark:border-gray-700` |

### 圆角和阴影

| 用途 | CSS 变量 | 值 |
|------|----------|-----|
| 小圆角 | `--radius-sm` | `4px` |
| 中圆角 | `--radius-md` | `6px` |
| 大圆角 | `--radius-lg` | `8px` |
| 小阴影 | `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| 中阴影 | `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` |
| 大阴影 | `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` |

---

## 修改主题颜色

### 场景 1：修改主色

1. 打开 `src/assets/styles/theme-variables.css`
2. 找到 `--primary-500: #5B6BF0`
3. 修改为新颜色，例如 `--primary-500: #FF5722`
4. 同时修改 `--primary-dark-500`（暗色模式）
5. 完成！NaiveUI 组件自动应用新颜色

**示例**：
```css
:root {
  /* 修改主色为橙色 */
  --primary-500: #FF5722;
  --primary-600: #EA580C;
  --primary-700: #C2410C;

  /* 暗色模式（更亮） */
  --primary-dark-500: #FB923C;
  --primary-dark-600: #F97316;
  --primary-dark-700: #EA580C;
}
```

### 场景 2：修改暗色模式文字颜色

```css
:root {
  /* 修改暗色模式的主要文字颜色 */
  --text-primary-dark: #E2E8F0; /* 更亮的灰色 */
}
```

### 场景 3：修改圆角大小

```css
:root {
  /* 修改默认圆角为 8px */
  --radius-md: 8px;
}
```

---

## 最佳实践

### ✅ 推荐做法

1. **优先使用 NaiveUI 组件**
   ```vue
   <n-button type="primary">按钮</n-button>
   <n-tag type="success">成功</n-tag>
   ```

2. **使用容器组件封装布局**
   ```vue
   <EzCard>
     <n-form>...</n-form>
   </EzCard>
   ```

3. **Tailwind 只用于布局**
   ```vue
   <div class="flex items-center gap-4 p-6">
     <!-- 间距、flex、响应式 -->
   </div>
   ```

4. **容器组件使用中性色 + dark:xxx**
   ```vue
   <!-- ✅ 正确 -->
   <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
   ```

### ❌ 避免做法

1. **禁止使用 Tailwind 主题色**
   ```vue
   <!-- ❌ 错误：Tailwind 没有配置主题色，不会切换 -->
   <div class="bg-primary-500 text-success-500">

   <!-- ✅ 正确：使用 NaiveUI 组件 -->
   <n-button type="primary">按钮</n-button>
   ```

2. **避免在 NaiveUI 组件上加 dark: 类**
   ```vue
   <!-- ❌ 错误：NaiveUI 组件会自动应用主题，无需 dark: -->
   <n-button class="dark:bg-gray-900">

   <!-- ✅ 正确：直接使用，不加 dark: -->
   <n-button type="primary">按钮</n-button>
   ```

3. **不要硬编码颜色**
   ```vue
   <!-- ❌ 错误 -->
   <div style="background-color: #5B6BF0">

   <!-- ✅ 正确：使用 NaiveUI 组件 -->
   <n-button type="primary">按钮</n-button>
   ```

---

## 常见问题

### Q1: 为什么 NaiveUI 组件颜色不对？

**A**: 确保 `n-config-provider` 正确配置了主题：

```vue
<script setup lang="ts">
import { useThemeStore } from '@/stores/modules/theme'

const { themeOverrides } = useThemeStore()
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <App />
  </n-config-provider>
</template>
```

### Q2: 为什么 Tailwind 的 bg-primary-500 不工作？

**A**: **本架构移除了 Tailwind 的颜色配置**，避免与 NaiveUI 主题冲突。

- ❌ 不要用：`bg-primary-500`、`text-success-500` 等
- ✅应该用：NaiveUI 组件（`<n-button type="primary">`）
- ✅或用：Tailwind 中性色：`bg-white dark:bg-gray-900`

### Q3: 暗色模式不生效？

**A**: 检查以下几点：

1. 确保 `html` 或 `body` 标签有 `dark` 类：
   ```typescript
   document.documentElement.classList.add('dark')
   ```

2. NaiveUI 组件会自动应用暗色主题（无需 `dark:` 类）
3. 容器组件需要用 `dark:xxx` 处理（已内置）

### Q4: 如何禁用暗色模式？

**A**: 移除 `dark` 类即可：
```typescript
document.documentElement.classList.remove('dark')
```

### Q5: 容器组件和直接用 Tailwind 有什么区别？

**A**: 容器组件的优势：
- ✅ 封装常用布局模式，减少重复代码
- ✅ 内置暗色模式支持（`dark:xxx`）
- ✅ 统一的设计风格（边框、圆角、阴影）
- ✅ 更好的语义化和可维护性

---

## 技术细节

### 工作原理

**1. 主题变量定义**
```css
/* theme-variables.css */
:root {
  /* 亮色模式 */
  --primary-500: #5B6BF0;
  --text-primary: #0F172A;

  /* 暗色模式（中缀式） */
  --primary-dark-500: #A78BFA;
  --text-primary-dark: #F0F6FC;
}
```

**2. 运行时提取**
```typescript
// color-vars.ts
export function getColor(variable: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable).trim()
}

export function getDarkColor(variable: string): string {
  const cleanVar = variable.replace(/^--/, '')
  const parts = cleanVar.split('-')
  const base = parts[0] // 'primary'
  const scale = parts.slice(1).join('-') // '500'

  return getColor(`--${base}-dark-${scale}`)
}
```

**3. NaiveUI 主题配置**
```typescript
// naiveui-theme.ts (~40 行)
export function createNaiveTheme(isDark: boolean): GlobalThemeOverrides {
  return {
    common: {
      primaryColor: isDark
        ? getDarkColor('primary-500')  // 读取 --primary-dark-500
        : getColor('primary-500'),     // 读取 --primary-500

      textColorBase: isDark
        ? getDarkColor('text-primary')  // 读取 --text-primary-dark
        : getColor('text-primary'),     // 读取 --text-primary

      borderColor: isDark
        ? 'var(--border-default-dark)'
        : 'var(--border-default)',

      borderRadius: 'var(--radius-md)',
    }
    // 移除所有组件级配置
  }
}
```

**4. 主题切换**
```typescript
// theme.ts (Store)
const isDark = ref(document.documentElement.classList.contains('dark'))

const themeOverrides = computed<GlobalThemeOverrides>(() => {
  void isDark.value // 触发重新计算
  return createNaiveTheme(isDark.value) // 传递主题状态
})

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
```

---

## 架构优势总结

| 维度 | 说明 |
|------|------|
| **变量定义** | 扁平化 `:root`，中缀式命名，一目了然 |
| **主题配置** | 300+ 行 → ~40 行（只配置 common） |
| **Tailwind** | 无颜色配置，纯布局工具 |
| **暗色模式** | NaiveUI 自动切换，零配置 |
| **维护成本** | 单一真相源，改一处生效 |
| **开发体验** | 清晰分工，不再拧巴 |
| **类型安全** | getColor/getDarkColor 明确区分 |

---

## 参考资源

- **Tailwind CSS 4.x 文档**: https://tailwindcss.com/docs
- **NaiveUI 主题配置**: https://www.naiveui.com/en-US/os-theme
- **Vercel 颜色系统**: https://vercel.com/design/color
- **shadcn/ui 最佳实践**: https://ui.shadcn.com/
