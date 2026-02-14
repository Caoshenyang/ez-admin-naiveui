# CLAUDE.md - 专注编码模式

## 项目概述

基于 **Vite + Vue 3 (TS) + Tailwind CSS + NaiveUI** 的高效率后台管理系统。

## 核心行为准则 (重要：Token 节省模式，强制执行)

为了提高响应速度并减少 Token 消耗，请遵循以下原则：

1. **禁止私自提交**: **严禁在没有用户明确指示的情况下执行 `git commit` 或 `git push`**。所有代码提交必须等待用户确认后执行。
2. **禁止自动校验**: 禁止主动运行 `pnpm type-check`、`pnpm lint` 或任何 `build` 命令。
3. **禁止循环修复**: 若代码报错，请立即停止并向用户报告，严禁自行通过重复运行命令尝试修复。
4. **只管生成，用户校验**: 你的职责是根据逻辑需求输出高质量代码。调试、环境纠错与类型检查由用户在本地控制。
5. **包管理约束**: 必须使用 `pnpm`。安装包时使用 `--silent` 以减少终端输出占用上下文空间。
6. **严格类型安全**: **严禁使用 `any` 类型**，**严禁使用 `as xxx` 类型断言**绕开类型约束。必须通过正确的类型设计（继承、泛型、类型守卫等）解决类型问题。
7. **同步更新进度 (Mandatory)**: 每一项子任务完成后，**必须立即修改并保存 `CLAUDE.md` 文件**。将对应任务标记为 `[x]`，并在任务末尾标注完成时间（如：`[x] 任务名 (Done)`）。

## 开发命令

- **启动预览**: `pnpm dev` (由用户手动执行)
- **类型检查**: `pnpm type-check` (由用户手动执行)
- **生产构建**: `pnpm build`
- **代码格式化**: `pnpm format`

## 技术栈规范

- **框架**: Vue 3.5+ (使用 `<script setup>` 语法)。
  - **响应式数据**: **统一使用 `ref`，严禁使用 `reactive`**（避免响应性丢失和代码一致性问题）。
  - **函数定义**:
    - **方法定义**（组件方法、Store actions、对象方法）：使用 `function` 声明，如 `function handleClick() {}`
    - **回调函数**（数组方法、事件监听、定时器）：使用箭头函数，如 `array.map(item => item.value)`
    - **函数表达式**：使用箭头函数，如 `const add = (a, b) => a + b`
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
- **注释规范**: 所有简洁的单行注释**必须写在行尾**，保持代码紧凑（如 `const avatar = computed(() => userStore.avatar || '') // 获取头像`）。只有复杂的多行说明或文档注释才使用块注释形式。
- **组件命名 (Strict)**: **严禁使用 `index.vue` 命名组件**。所有组件文件必须使用具有明确语义(至少包含两个单词)的 PascalCase 命名（例如 `UserManagement.vue`, `AppHeader.vue`）。二次封装的全局组件必须在文件名中包含 `Ez` 前缀（例如 `EzButton.vue`）。
- **NaiveUI API 使用**: **必须使用 `src/hooks/useNaiveApi.ts` 中导出的 API**（如 `message`、`dialog`、`notification`、`loadingBar`、`modal`），严禁直接使用 `window.$message` 或其他全局变量。该 hook 提供了开发环境日志集成等增强功能。

## 当前任务清单 (Todo List)

---

### 已完成任务

- [x] **颜色系统统一重构** (2026-02-10)
  - ✅ 创建 Tailwind CSS 统一主题配置（`@theme` 指令）
  - ✅ 更新 NaiveUI 主题配置（引用 CSS 变量）
  - ✅ 替换布局组件中的硬编码颜色
  - ✅ 替换示例页面中的硬编码颜色
  - ✅ 统一主色为 `#5B6BF0`（亮色）+ `#A78BFA`（暗色）
  - ✅ 恢复标准语义色（成功=绿、警告=橙、错误=红）
  - ✅ 创建颜色系统使用指南（`docs/color-system-guide.md`）
  - ✅ 实现"单一真相源"颜色管理策略

- [x] **专业商务风格布局重构** (2026-02-05)
  - ✅ 升级 CSS 基础系统（Tailwind `@theme` + 动画 + 字体）
  - ✅ 创建 AppSidebar 组件（合并 Logo + Menu）
  - ✅ 创建 AppHeader 组件（重构 TopBar）
  - ✅ 优化 AppWorkTab 标签页样式
  - ✅ 重构 AppLayout 主布局容器（响应式）
  - ✅ 删除旧组件文件（Logo、Menu、TopBar）
  - ✅ 生成完整设计文档（`docs/layout-redesign-2025.md`）
  - ✅ NaiveUI（交互逻辑）+ Tailwind CSS（样式定制）协作模式

- [x] **EzModal 弹窗组件封装** (2026-02-02)
  - ✅ 创建类型定义 (`src/types/modal.ts`)
  - ✅ 实现 EzModal 主组件 (`src/components/EzModal.vue`)
  - ✅ 创建完整示例 (`src/views/examples/components/ModalExample.vue`)
  - ✅ 编写使用指南文档 (`docs/ez-modal-guide.md`)
  - ✅ 整合到示例合集页面
  - ✅ 主页添加快速入口
  - ✅ 优化示例默认尺寸

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

- [x] **API 请求模块（axios 封装）** (2026-01-29)
  - ✅ 创建 Axios 请求封装 (`src/utils/request.ts`)
  - ✅ 实现 Bearer Token 认证机制
  - ✅ 实现完整的请求/响应拦截器
  - ✅ 实现统一的错误处理（HTTP 状态码、网络错误、超时）
  - ✅ 实现 401 自动跳转登录
  - ✅ 封装常用请求方法（GET, POST, PUT, DELETE, PATCH）
  - ✅ 实现文件上传/下载功能
  - ✅ 创建 API 通用类型定义 (`src/types/api.ts`)
  - ✅ 创建 NaiveUI 离散式 API 封装 (`src/hooks/useNaiveApi.ts`)
  - ✅ 集成日志工具（开发环境自动输出）
  - ✅ 创建用户 API 模块示例 (`src/api/user.ts`)
  - ✅ 创建使用指南文档 (`docs/request-module-guide.md`)

- [x] **工具函数库封装（部分）** (2026-01-29)
  - ✅ 创建日期工具 (`src/utils/date.ts`)
  - ✅ 创建验证工具 (`src/utils/validate.ts`)
  - ✅ 创建存储工具 (`src/utils/storage.ts`)
  - 🔄 创建字符串工具 (`src/utils/string.ts`) - 待完成
  - 🔄 创建数组工具 (`src/utils/array.ts`) - 待完成
  - 🔄 创建对象工具 (`src/utils/object.ts`) - 待完成
  - 🔄 创建统一导出 (`src/utils/index.ts`) - 待完成

- [x] **EzForm 表单组件封装** (2026-01-29)
  - ✅ 创建表单类型定义 (`src/types/form.ts`)
  - ✅ 实现 EzForm 主组件 (`src/components/EzForm.vue`)
  - ✅ 实现表单项渲染器 (`src/components/form/EzFormItemRenderer.vue`)
  - ✅ 支持 16+ 种表单项类型
  - ✅ 支持条件显示/禁用、动态加载选项
  - ✅ 支持响应式布局和自定义插槽
  - ✅ 创建使用示例视图 (`src/views/FormExample.vue`)
  - ✅ 创建使用指南文档 (`docs/ez-form-guide.md`)

- [x] **EzTable 表格组件封装** (2026-01-30)
  - ✅ 创建完整类型定义 (`src/types/table.ts`)
  - ✅ 实现 EzTable 主组件 (`src/components/EzTable.vue`)
  - ✅ 实现表格工具栏组件 (`src/components/table/EzTableToolbar.vue`)
  - ✅ 实现列设置组件 (`src/components/table/EzTableColumnSetting.vue`)
  - ✅ 支持选择功能（单选/多选）
  - ✅ 支持排序和筛选（本地/远程）
  - ✅ 支持工具栏（刷新、列设置、密度、全屏）
  - ✅ 支持响应式高度布局
  - ✅ 支持本地存储配置记忆
  - ✅ 创建使用示例视图 (`src/views/examples/components/TableExample.vue`)
  - ✅ 创建使用指南文档 (`docs/ez-table-guide.md`)
  - ✅ 安装依赖包 `@vueuse/core`

- [x] **后台管理系统布局（重构版）** (2026-02-02)
  - ✅ 创建菜单宽度枚举 (`src/enums/menu.ts`)
  - ✅ 创建布局类型定义 (`src/types/layout.ts`)
  - ✅ 创建布局 Store (`src/stores/modules/layout.ts`)
  - ✅ 创建存储工具 (`src/utils/storage.ts`)
  - ✅ 创建菜单配置 (`src/config/menu.ts`)
  - ✅ 实现主布局容器组件 (`src/layouts/AppLayout.vue`)
  - ✅ 实现 Logo 组件 (`src/layouts/components/AppLogo.vue`)
  - ✅ 实现菜单组件 (`src/layouts/components/AppMenu.vue`)
  - ✅ 实现顶部导航栏组件 (`src/layouts/components/AppTopBar.vue`)
  - ✅ 实现标签页组件 (`src/layouts/components/AppWorkTab.vue`)
  - ✅ 更新路由配置（分离 constantRoutes 和 asyncRoutes）
  - ✅ 更新使用指南文档 (`docs/layout-guide.md`)
  - ✅ 支持响应式设计（移动端自动折叠）
  - ✅ 支持侧边栏折叠/展开
  - ✅ 支持菜单状态持久化
  - ✅ 支持标签页系统（切换、关闭、右键菜单）

- [x] **企业级暗夜模式系统** (2026-02-13)
  - ✅ 创建独立主题 Store (`src/stores/modules/theme.ts`)
  - ✅ 实现双态主题模式（light/dark）
  - ✅ 创建 EzThemeToggle 组件 (`src/components/EzThemeToggle.vue`)
  - ✅ 修复 NaiveUI 主题配置 bug（使用 --primary）
  - ✅ 优化暗色主色：#A78BFA → #C4B5FD（满足 WCAG AA 标准）
  - ✅ 添加 300ms 平滑过渡动画（CSS + DOM 类控制）
  - ✅ 添加主题预加载脚本（index.html）
  - ✅ 零闪烁初始化机制
  - ✅ 持久化到 localStorage
  - ✅ 清理旧的主题代码（app.ts）

- [x] **NaiveUI 企业级主题扩展** (2026-02-13)
  - ✅ 扩展 CSS 变量定义（完整色阶 50-900、语义色、中性色、圆角、阴影）
  - ✅ 扩展 NaiveUI 主题配置（15+ 种组件精细化控制）
  - ✅ 更新 Tailwind 主题配置（颜色映射到 utility classes）
  - ✅ 支持完整交互状态（hover、pressed、active、disabled）
  - ✅ 满足 WCAG AA 对比度标准

- [x] **主题架构重构 - 极简化方案** (2026-02-13)
  - ✅ 简化 NaiveUI 主题配置（300+ 行 → 60 行，核心配置 ~40 行）
  - ✅ 移除所有组件级配置，只保留 common 核心颜色
  - ✅ 直接使用 CSS 变量引用（`var(--primary-500)`）
  - ✅ 创建容器组件库（EzPage、EzCard、EzContainer、EzFlex、EzButtonGroup）
  - ✅ 更新颜色系统使用指南（`docs/color-system-guide.md`）
  - ✅ 创建容器组件使用示例（`src/views/ContainerComponentsExample.vue`）
  - ✅ 确立技术栈分工：NaiveUI（交互组件）+ Tailwind（布局工具）+ 容器组件（封装）
  - ✅ 验证架构方案：NaiveUI 主题为主，Tailwind 正常使用

- [x] **Utils 和 Composables 目录规范化重构** (2026-02-14)
  - ✅ 目录重命名：`src/hooks` → `src/composables`（符合 Vue 官方规范）
  - ✅ Utils 文件重命名：统一添加 `Utils` 后缀（7 个文件）
    - `date.ts` → `dateUtils.ts`
    - `storage.ts` → `storageUtils.ts`
    - `validate.ts` → `validateUtils.ts`
    - `icon.ts` → `iconUtils.ts`
    - `route.ts` → `routeUtils.ts`
    - `color-vars.ts` → `colorUtils.ts`
    - `request.ts` → `requestUtils.ts`
  - ✅ 修复 useNaiveApi.ts 内存泄漏：添加 `onUnmounted` 清理 MutationObserver
  - ✅ 创建常用 composables（6 个）
    - `useStorage.ts` - 响应式本地存储（useLocalStorage、useSessionStorage）
    - `useDebounceFn.ts` - 防抖函数
    - `useThrottleFn.ts` - 节流函数
    - `useBreakpoints.ts` - 响应式断点
    - `useClipboard.ts` - 剪贴板操作
    - `useToggle.ts` - 布尔值切换
  - ✅ 移除统一导出入口（删除 `src/utils/index.ts` 和 `src/composables/index.ts`）
  - ✅ 更新所有导入语句：采用直接导入方式（`from '@/utils/dateUtils'`）
  - ✅ 确立导入规范：永远从具体文件导入，不使用统一入口
  - ✅ 架构清晰：utils（纯函数）与 composables（响应式逻辑）分离

### 待办任务

- [ ] 完成工具函数库封装（storage、string、array、object、index）
- [ ] 实现路由权限控制
- [ ] 实现动态菜单生成

---

**注：每次完成重要任务后，请主动更新此清单并建议下一步行动。**
