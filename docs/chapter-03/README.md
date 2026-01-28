# 第3章：Tailwind CSS 样式系统搭建 - 总结

## 本章回顾

本章完成了 Tailwind CSS v4 的集成，实现了原子化 CSS 样式系统。

### 完成清单

- [x] 3.1 安装 Tailwind CSS 与配置初始化 (Done - 2025-01-28)
- [x] 3.2 自定义主题配置（颜色、间距、字体）(Done - 2025-01-28)
- [x] 3.3 响应式断点设计规范 (Done - 2025-01-28)
- [x] 3.4 Tailwind 与 NaiveUI 样式隔离方案 (Done - 2025-01-28)
- [x] 3.5 常用工具类封装 (Done - 2025-01-28)
- [x] 3.6 第3章总结文章输出 (Done - 2025-01-28)

## 安装的依赖

| 依赖 | 版本 | 说明 |
|------|------|------|
| tailwindcss | ^4.1 | 原子化 CSS 框架 |
| @tailwindcss/vite | ^4.1 | Vite 插件 |

## Tailwind CSS v4 新特性

### 简化的安装流程

**v3 方式**：
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**v4 方式**：
```bash
npm install tailwindcss @tailwindcss/vite
```

### CSS 主题配置

**v3**：使用 `tailwind.config.js`

**v4**：使用 CSS `@theme` 指令

```css
@theme {
  --color-primary-500: #22c55e;
  --spacing-md: 16px;
  --radius-lg: 12px;
}
```

## 样式系统分工

| 技术 | 职责 | 示例 |
|------|------|------|
| Tailwind CSS | 布局、间距、响应式 | `flex`, `p-4`, `sm:text-base` |
| NaiveUI | 复杂交互组件 | `<n-table>`, `<n-form>` |
| CSS 变量 | 主题定制 | `--primary-color` |

## 响应式断点

| 断点 | 宽度 | 设备 |
|------|------|------|
| 默认 | < 640px | 手机 |
| `sm` | ≥ 640px | 平板 |
| `md` | ≥ 768px | 平板横屏 |
| `lg` | ≥ 1024px | 笔记本 |
| `xl` | ≥ 1280px | 台式机 |
| `2xl` | ≥ 1536px | 大屏 |

## 文件变更

### 新增文件

```
src/styles/
└── tailwind.css          # Tailwind 主题配置

docs/chapter-03/
├── 01-tailwind-installation.md
└── README.md
```

### 修改文件

```
vite.config.ts            # 添加 tailwindcss 插件
src/styles/index.css      # 导入 Tailwind CSS
src/App.vue               # 使用 Tailwind 类名
```

## 验证安装

运行 `pnpm dev` 后，访问 http://localhost:5173 应该看到：

1. Ez-Admin 标题
2. NaiveUI 按钮
3. 主题切换按钮
4. 三个卡片（原子化 CSS、暗黑模式、响应式）
5. 响应式布局（移动端单列，桌面端三列）

## 最佳实践

### 1. 移动端优先

```vue
<!-- ✅ 推荐 -->
<div class="grid grid-cols-1 sm:grid-cols-3">
  <!-- 移动端 1 列，平板及以上 3 列 -->
</div>
```

### 2. 暗黑模式

```vue
<!-- ✅ 推荐 -->
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  <!-- 明亮/暗黑模式自适应 -->
</div>
```

### 3. 与 NaiveUI 协作

```vue
<!-- ✅ 推荐：Tailwind 布局，NaiveUI 交互 -->
<div class="flex items-center gap-4">
  <n-button type="primary">按钮</n-button>
  <n-input placeholder="输入" />
</div>
```

## 下一步预告

**第4章：Axios 请求封装与拦截器**

- 安装 Axios 与基础配置
- 请求拦截器实现（Token、Headers）
- 响应拦截器实现（统一格式、错误处理）
- 请求取消与重复请求防御
- Token 刷新机制设计
- API 模块化组织结构

---

**第3章完成！** 🎉 准备进入第4章：Axios 请求封装与拦截器。
