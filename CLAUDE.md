# CLAUDE.md - 专注编码模式

## 项目概述

基于 **Vite + Vue 3 (TS) + Tailwind CSS + NaiveUI** 的高效率后台管理系统。

## 核心行为准则 (重要：Token 节省模式，强制执行)

为了提高响应速度并减少 Token 消耗，请遵循以下原则：

1. **禁止自动校验**: 禁止主动运行 `pnpm type-check`、`pnpm lint` 或任何 `build` 命令。
2. **禁止循环修复**: 若代码报错，请立即停止并向用户报告，严禁自行通过重复运行命令尝试修复。
3. **只管生成，用户校验**: 你的职责是根据逻辑需求输出高质量代码。调试、环境纠错与类型检查由用户在本地控制。
4. **包管理约束**: 必须使用 `pnpm`。安装包时使用 `--silent` 以减少终端输出占用上下文空间。
5. **严格类型安全**: **严禁使用 `any` 类型**，**严禁使用 `as xxx` 类型断言**绕开类型约束。必须通过正确的类型设计（继承、泛型、类型守卫等）解决类型问题。
6. **同步更新进度 (Mandatory)**: 每一项子任务完成后，**必须立即修改并保存 `CLAUDE.md` 文件**。将对应任务标记为 `[x]`，并在任务末尾标注完成时间（如：`[x] 任务名 (Done)`）。

## 开发命令

- **启动预览**: `pnpm dev` (由用户手动执行)
- **类型检查**: `pnpm type-check` (由用户手动执行)
- **生产构建**: `pnpm build`
- **代码格式化**: `pnpm format`

## 技术栈规范

- **框架**: Vue 3.5+ (使用 `<script setup>` 语法)。
- **组件库**: **NaiveUI** (负责复杂交互：表格、表单、弹窗)。
- **样式**: **Tailwind CSS 4.x** (负责所有布局、间距、响应式设计)。
  - ✅ 配置方式：使用 `@tailwindcss/vite` 插件（已在 `vite.config.ts` 中配置）
  - ✅ CSS 导入：使用 `@import "tailwindcss"`（已在 `src/assets/index.css` 中配置）
  - 🚫 **严禁使用 `@apply` 指令**（官方已不再推荐）
  - ✅ 推荐直接使用 utility classes
  - ✅ 复杂样式使用 `@utility` 指令或 CSS 变量
  - ✅ 主题自定义使用 `@theme` 指令
  - 📖 详细使用指南：`docs/tailwind-v4-guide.md`
- **状态管理**: Pinia (使用 **Setup Store 模式**，目录结构采用 `modules/` 组织方式)。
- **路由**: Vue Router 4 (集中化路由配置)。
- **代码风格**: 无分号, 单引号, 120 字符行宽, Tailwind 类名顺序遵循标准。
- **组件命名 (Strict)**: **严禁使用 `index.vue` 命名组件**。所有组件文件必须使用具有明确语义(至少包含两个单词)的 PascalCase 命名（例如 `UserManagement.vue`, `AppHeader.vue`）。二次封装的全局组件必须在文件名中包含 `Ez` 前缀（例如 `EzButton.vue`）。

## 当前任务清单 (Todo List)

---

### 已完成任务

- [x] **Tailwind CSS 4.x 集成** (2026-01-29)
  - ✅ 安装 `tailwindcss@4.1.18` 和 `@tailwindcss/vite@4.1.18`
  - ✅ 配置 Vite 插件模式（`vite.config.ts`）
  - ✅ 配置 CSS 导入（`src/assets/index.css`）
  - ✅ 创建使用指南文档 (`docs/tailwind-v4-guide.md`)
  - ✅ 创建迁移方案文档 (`docs/tailwind-v4-migration.md`)

- [x] **Pinia Store 架构设计** (2026-01-29)
  - ✅ 创建 Pinia Store 模式对比文档 (`docs/pinia-store-comparison.md`)
  - ✅ 采用 Setup Store 模式（基于组合式 API）
  - ✅ 实现 modules 目录结构 (`src/stores/modules/`)
  - ✅ 创建类型定义目录 (`src/stores/types/`)
  - ✅ 实现示例模块：`app.ts`（应用配置）、`user.ts`（用户管理）

### 待办任务

- [ ] 实现 API 请求模块（axios 封装）
- [ ] 实现路由权限控制
- [ ] 实现动态菜单生成

---

**注：每次完成重要任务后，请主动更新此清单并建议下一步行动。**
