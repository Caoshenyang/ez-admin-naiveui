# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Vue 3 的后台管理系统（计划使用 Naive UI），使用 Vite 作为构建工具。项目全面使用 TypeScript，并遵循现代 Vue 3 Composition API 开发模式。

## 技术栈

- **框架**: Vue 3 (Composition API + `<script setup>`)
- **UI 组件库**: Naive UI
- **样式方案**: Tailwind CSS 4.1 (优先使用 Tailwind 工具类)
- **构建工具**: Vite 7
- **状态管理**: Pinia (使用 Composition API 风格)
- **路由**: Vue Router 4
- **语言**: TypeScript 5.9 (严格类型检查)
- **包管理器**: pnpm
- **Node 版本**: ^20.19.0 || >=22.12.0

## 开发命令

```bash
# 启动开发服务器
npm run dev

# 生产构建（包含类型检查 + 构建）
npm run build

# 仅构建（跳过类型检查）
npm run build-only

# 类型检查
npm run type-check

# 代码检查并自动修复
npm run lint

# 代码格式化
npm run format

# 预览生产构建
npm run preview
```

## 项目结构

```
src/
├── main.ts          # 应用入口
├── App.vue          # 根组件
├── router/
│   └── index.ts     # Vue Router 配置（当前路由为空）
└── stores/
    └── counter.ts   # Pinia store 示例（Composition API 风格）
```

## 架构说明

### TypeScript 配置

项目使用项目引用（Project References）和增量编译：
- `tsconfig.json` - 根配置，引用 app 和 node 配置
- `tsconfig.app.json` - 应用代码配置（继承 `@vue/tsconfig/tsconfig.dom.json`）
- `tsconfig.node.json` - 构建工具配置（Vite、ESLint 等）

构建信息缓存在 `node_modules/.tmp/` 中以加快重建速度。

### 路径别名

- `@/*` 映射到 `./src/*`（在 Vite 和 TypeScript 中均已配置）

### 代码风格

- **ESLint**: Flat config，使用 Vue + TypeScript 推荐规则
- **Prettier**: 无分号、单引号、100 字符行宽
- 类型导入不单独分离（Vue 3 默认风格）

### 样式规范

**重要：优先使用 Tailwind CSS 工具类！**

项目使用 Tailwind CSS 4.1 作为主要样式方案，Naive UI 提供组件样式。

#### 样式编写原则

1. **优先使用 Tailwind 工具类**：所有布局、间距、颜色、字体等样式优先使用 Tailwind 工具类
   ```vue
   <!-- ✅ 正确 -->
   <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
     <h2 class="text-xl font-semibold text-gray-800">标题</h2>
     <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
       按钮
     </button>
   </div>

   <!-- ❌ 避免：除非必要，不要写 scoped style -->
   <style scoped>
   .container { display: flex; padding: 1rem; }
   </style>
   ```

2. **响应式设计**：使用 Tailwind 响应式前缀
   ```vue
   <div class="px-4 md:px-6 lg:px-8">
     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     </div>
   </div>
   ```

3. **暗色模式**：使用 `dark:` 前缀（项目已配置暗色模式支持）
   ```vue
   <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
     暗色模式支持
   </div>
   ```

4. **动态样式**：使用 Tailwind 的 `@apply` 或 style 绑定
   ```vue
   <script setup lang="ts">
   const isActive = ref(true)
   const colorClass = computed(() => isActive.value ? 'bg-blue-500' : 'bg-gray-300')
   </script>

   <template>
     <div :class="['px-4 py-2 rounded', colorClass]"></div>
   </template>
   ```

#### 允许使用 scoped style 的场景

以下场景可以/应该使用 scoped `<style>`：

- 需要使用 SCSS 变量或 mixin
- 需要编写复杂的动画
- 第三方组件的样式覆盖（但优先尝试通过 props 或 Tailwind 类）
- 需要使用 CSS 特性（如伪元素、特殊选择器）

```vue
<style scoped lang="scss">
.custom-animation {
  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
  animation: slideIn 0.3s ease-out;
}
</style>
```

#### Naive UI 样式定制

- 优先使用 Naive UI 组件的 props 进行样式定制
- 使用 `theme-overrides` 进行全局主题定制
- 避免直接覆盖 Naive UI 的内部样式类

### 状态管理模式

Pinia stores 使用 Composition API setup 语法（而非 options/state 语法）：

```ts
export const useXStore = defineStore('x', () => {
  const refState = ref(initialValue)
  const computedValue = computed(() => refState.value)
  function action() { /* ... */ }
  return { refState, computedValue, action }
})
```

### 命名规范

**重要：禁止使用 index.vue 作为文件名！**

#### 组件文件命名

- ✅ **正确**: 使用语义化的组件名称
  - `Dashboard.vue`
  - `Login.vue`
  - `UserManagement.vue`
  - `RoleManagement.vue`
  - `MenuManagement.vue`
  - `CrudTable.vue`

- ❌ **错误**: 不要使用 `index.vue`
  - `index.vue`
  - `User/index.vue`

#### 命名规则

1. **视图组件** (views/): 使用 PascalCase，表达组件的业务含义
   - 用户管理: `UserManagement.vue`
   - 角色管理: `RoleManagement.vue`
   - 操作日志: `OperationLog.vue`
   - 数据看板: `Dashboard.vue`

2. **通用组件** (components/): 使用 PascalCase，表达组件的功能
   - 表格组件: `CrudTable.vue`
   - 表单组件: `SearchForm.vue`
   - 上传组件: `FileUpload.vue`

3. **布局组件** (layouts/): 使用 PascalCase，以 Layout 结尾
   - `DefaultLayout.vue`
   - `BlankLayout.vue`

### 路由配置

路由器使用 HTML5 history 模式，基于 `import.meta.env.BASE_URL`。

#### 动态路由

- 路由信息由后端接口提供（`/auth/user-info` 返回的 `menus` 字段）
- 根据用户权限动态加载路由
- 前端只配置静态路由（登录页、404 页面）

## 构建系统说明

- Vite 7 + Vue 插件 + DevTools 集成
- Tailwind CSS 4.1 Vite 插件（零配置，自动扫描类名）
- 开发模式启用热模块替换（HMR）
- TypeScript 增量编译加速构建
- ESLint 启用缓存
