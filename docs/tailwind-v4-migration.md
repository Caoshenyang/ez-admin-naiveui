# Tailwind CSS 4.x 迁移方案

> 更新时间：2026-01-29
> 官方文档：https://tailwindcss.com/docs/installation/using-vite

## 核心变更对比

### 1. 安装依赖

**旧版 (3.x)**
```bash
pnpm add -D tailwindcss postcss autoprefixer
```

**新版 (4.x)**
```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

---

### 2. Vite 配置

**旧版 (3.x) - 需要 `postcss.config.js`**
```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 无需配置 Tailwind
})
```

**新版 (4.x) - Vite 插件模式**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(), // ✅ 直接作为 Vite 插件
  ],
  // ❌ 不再需要 postcss.config.js
})
```

---

### 3. CSS 导入方式

**旧版 (3.x)**
```css
/* src/style.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**新版 (4.x)**
```css
/* src/style.css */
@import "tailwindcss";
```

---

### 4. 主题配置方式

**旧版 (3.x) - 需要单独配置文件**
```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      },
      spacing: {
        '128': '32rem',
      }
    }
  }
}
```

**新版 (4.x) - CSS 内联配置**
```css
/* src/style.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --spacing-128: 32rem;
}

/* 使用时仍然可以用 utility classes */
/* <div class="bg-primary p-128"> */
```

> **注意**：4.x 仍然支持传统的 `tailwind.config.js`，但官方推荐使用 CSS `@theme` 方式。

---

### 5. 关于 `@apply` 指令

**官方立场变更**
- ❌ **不再推荐使用** `@apply` 指令
- ✅ **推荐**：
  1. 直接在 HTML 中使用 utility classes
  2. 使用 CSS 变量配合原生 CSS
  3. 使用 `@component` 和 `@utility` 指令（4.x 新增）

**替代方案示例**

```css
/* ❌ 旧方式：不推荐 */
.btn {
  @apply px-4 py-2 bg-blue-500 text-white rounded;
}

/* ✅ 新方式 1：直接使用 utility classes */
/* <button class="px-4 py-2 bg-blue-500 text-white rounded">Click</button> */

/* ✅ 新方式 2：使用 @utility (4.x 新增) */
@utility btn {
  padding-inline: 1rem;
  padding-block: 0.5rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.375rem;
}

/* ✅ 新方式 3：使用 CSS 变量 */
.btn {
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
}
```

---

## 迁移步骤建议

### 选项 A：保守升级（推荐用于现有项目）

1. **仅升级到 4.x，保持现有代码结构**
   - 继续使用 `tailwind.config.js`
   - 继续使用 `@apply`（虽然不推荐，但 4.x 仍支持）
   - 仅更新安装方式和配置

**优点**：风险最低，无需重构代码
**缺点**：无法享受 4.x 新特性

### 选项 B：渐进式迁移

1. **更新配置方式**
   - 迁移到 Vite 插件模式
   - 更新 CSS 导入语句

2. **逐步移除 `@apply`**
   - 新组件使用 utility classes
   - 旧组件保持不变，后续重构时再改

**优点**：逐步适应新规范，风险可控
**缺点**：代码风格不统一

### 选项 C：完全迁移（新项目首选）

1. **采用 4.x 全新方案**
   - Vite 插件模式
   - `@theme` CSS 配置
   - 移除所有 `@apply`
   - 使用 `@utility` 和 CSS 变量

**优点**：代码最现代化，性能最优
**缺点**：需要重构现有代码

---

## 当前项目建议

根据项目现状（刚起步，组件较少），建议采用 **选项 B：渐进式迁移**：

### 第一步：更新配置（无风险）
- 安装 `@tailwindcss/vite`
- 更新 `vite.config.ts`
- 更新 CSS 导入语句
- 保持 `tailwind.config.js` 不变

### 第二步：代码规范调整
- **新组件**：直接使用 utility classes，避免 `@apply`
- **复杂样式**：使用 CSS 变量 + 原生 CSS
- **旧代码**：暂不改动，避免引入 bug

### 第三步：后期优化（可选）
- 积累经验后，逐步将配置迁移到 `@theme`
- 按需重构旧代码

---

## 决策参考

| 方案 | 风险等级 | 工作量 | 适用场景 |
|------|---------|--------|---------|
| 保守升级 | 🟢 低 | 1 小时 | 现有项目，求稳 |
| 渐进式迁移 | 🟡 中 | 2-3 小时 | 中小型项目，逐步优化 |
| 完全迁移 | 🔴 高 | 1-2 天 | 新项目，追求最佳实践 |

---

## 注意事项

1. **IDE 支持**：确保 VSCode 的 Tailwind CSS IntelliSense 插件支持 4.x
2. **PostCSS 插件**：如果项目有其他 PostCSS 插件（如 `autoprefixer`），仍需保留 `postcss.config.js`
3. **破坏性变更**：查看 [Tailwind CSS 4.x 升级指南](https://tailwindcss.com/docs/upgrade-guide) 了解完整的破坏性变更列表
4. **性能提升**：4.x 采用新的引擎，构建速度和 HMR 性能有显著提升

---

## 推荐阅读

- [Tailwind CSS 4.x 官方文档](https://tailwindcss.com/docs/installation/using-vite)
- [升级指南](https://tailwindcss.com/docs/upgrade-guide)
- [为什么不再推荐 @apply](https://tailwindcss.com/docs/reusing-styles#avoiding-premature-abstraction)
