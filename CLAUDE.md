# CLAUDE.md - 专注编码模式

## 项目概述

基于 **Vite + Vue 3 (TS) + Tailwind CSS + NaiveUI** 的高效率后台管理系统。

## 核心行为准则 (重要：Token 节省模式，强制执行)

为了提高响应速度并减少 Token 消耗，请遵循以下原则：

1. **禁止自动校验**: 禁止主动运行 `pnpm type-check`、`pnpm lint` 或任何 `build` 命令。
2. **禁止循环修复**: 若代码报错，请立即停止并向用户报告，严禁自行通过重复运行命令尝试修复。
3. **只管生成，用户校验**: 你的职责是根据逻辑需求输出高质量代码。调试、环境纠错与类型检查由用户在本地控制。
4. **包管理约束**: 必须使用 `pnpm`。安装包时使用 `--silent` 以减少终端输出占用上下文空间。
5. **同步更新进度 (Mandatory)**: 每一项子任务完成后，**必须立即修改并保存 `CLAUDE.md` 文件**。将对应任务标记为 `[x]`，并在任务末尾标注完成时间（如：`[x] 任务名 (Done)`）。

## 开发命令

- **启动预览**: `pnpm dev` (由用户手动执行)
- **类型检查**: `pnpm type-check` (由用户手动执行)
- **生产构建**: `pnpm build`
- **代码格式化**: `pnpm format`

## 技术栈规范

- **框架**: Vue 3.5+ (使用 `<script setup>` 语法)。
- **组件库**: **NaiveUI** (负责复杂交互：表格、表单、弹窗)。
- **样式**: **Tailwind CSS** (负责所有布局、间距、响应式设计)。
- **状态管理**: Pinia (使用 Setup Store 模式)。
- **路由**: Vue Router 4 (集中化路由配置)。
- **代码风格**: 无分号, 单引号, 120 字符行宽, Tailwind 类名顺序遵循标准。
- **组件命名 (Strict)**: **严禁使用 `index.vue` 命名组件**。所有组件文件必须使用具有明确语义(至少包含两个单词)的 PascalCase 命名（例如 `UserManagement.vue`, `AppHeader.vue`）。二次封装的全局组件必须在文件名中包含 `Ez` 前缀（例如 `EzButton.vue`）。

## 目录架构

- `@/` 映射至 `src/`
- `src/assets/`: 静态资源 (图片、字体等)。
- `src/layout/`: 页面布局组件 (Sidebar, Header, Content)。
- `src/views/`: 业务页面组件 (PascalCase 命名)。
- `src/components/`: 通用 UI 基础组件。
- `src/stores/`: Pinia 模块定义。
- `src/styles/`: 全局样式 (含 Tailwind 指令)。

## 当前任务清单 (Todo List)

- [x] 项目初始化 (Vite + Vue 3 + TS)
- [x] 包管理规范配置 (pnpm)
- [x] 集成 Tailwind CSS
- [x] 集成 NaiveUI 并设置 ConfigProvider (中文语言包)
- [x] 搭建 Admin 基础 Layout 布局
- [x] 封装基础路由系统
- [x] 完善 AppMenu 组件（菜单路由配置）
- [x] 配置图标库（支持 Iconify + 自定义图片）
- [x] 开发图标选择器组件（EzIconPicker）
- [x] 修正组件命名规范（SystemUser, SystemRole, SystemMenu）
- [x] 完善 AppLogo 组件（Logo + 折叠按钮）
- [ ] 完善 AppTopBar 组件（用户信息、全屏、主题切换）
- [ ] 完善 AppWorkTab 组件（多标签页功能）

---

**注：每次完成重要任务后，请主动更新此清单并建议下一步行动。**
