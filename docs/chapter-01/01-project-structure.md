# 第1章：项目初始化与环境配置

## 1.1 Vite 项目结构解析

### 项目目录结构

```
ez-admin-naiveui/
├── .claude/                 # Claude AI 配置目录
├── .vscode/                 # VS Code 编辑器配置
│   ├── settings.json        # 项目设置
│   └── extensions.json      # 推荐插件
├── public/                  # 静态资源目录（不经过打包处理）
│   └── favicon.ico          # 网站图标
├── src/                     # 源代码目录
│   ├── assets/              # 资源文件（图片、样式等）
│   ├── components/          # 通用组件
│   ├── composables/         # 组合式函数（Hooks）
│   ├── layouts/             # 布局组件
│   ├── pages/               # 页面组件
│   ├── router/              # 路由配置
│   │   └── index.ts         # 路由入口
│   ├── stores/              # Pinia 状态管理
│   │   └── counter.ts       # 示例 store
│   ├── utils/               # 工具函数
│   ├── types/               # TypeScript 类型定义
│   ├── api/                 # API 请求模块
│   ├── App.vue              # 根组件
│   └── main.ts              # 应用入口文件
├── docs/                    # 项目文档
├── .editorconfig            # 编辑器配置
├── .eslint*                 # ESLint 配置
├── .gitignore               # Git 忽略文件
├── .prettierrc.json         # Prettier 配置
├── CLAUDE.md                # 项目开发指南
├── env.d.ts                 # 环境变量类型声明
├── index.html               # HTML 入口文件
├── package.json             # 项目配置与依赖
├── pnpm-lock.yaml           # 依赖锁定文件
├── tsconfig.json            # TypeScript 配置（根）
├── tsconfig.app.json        # 应用 TypeScript 配置
├── tsconfig.node.json       # Node 环境 TypeScript 配置
└── vite.config.ts           # Vite 配置文件
```

### 核心文件说明

#### 1. 入口文件

**`index.html`** - Vite 项目的 HTML 入口
```html
<div id="app"></div>
<script type="module" src="/src/main.ts"></script>
```

**`src/main.ts`** - JavaScript 入口
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

#### 2. 配置文件

**`vite.config.ts`** - Vite 构建工具配置
```typescript
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

**`tsconfig.app.json`** - 应用 TypeScript 配置
```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### 3. 组件规范

- **禁止使用 `index.vue`** 命名组件
- 组件文件使用 **PascalCase** 命名，至少包含两个单词
- 二次封装的全局组件必须包含 **`Ez`** 前缀

```
# 正确示例
UserManagement.vue
AppHeader.vue
EzTable.vue
EzButton.vue

# 错误示例
index.vue
user.vue
header.vue
```

### 技术栈版本

| 依赖 | 版本 | 说明 |
|------|------|------|
| Vue | ^3.5.26 | 渐进式框架 |
| Vite | ^7.3.1 | 构建工具 |
| TypeScript | ~5.9.3 | 类型系统 |
| Pinia | ^3.0.4 | 状态管理 |
| Vue Router | ^4.6.4 | 路由管理 |
| Node | ^20.19.0 \|\| >=22.12.0 | 运行环境 |

### 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm type-check   # TypeScript 类型检查
pnpm lint         # ESLint 代码检查
pnpm format       # Prettier 代码格式化
```

### 项目初始化状态

当前项目已完成基础 Vue 3 + Vite + TypeScript 环境搭建，包含：
- Vue Router 路由配置
- Pinia 状态管理
- ESLint + Prettier 代码规范
- TypeScript 类型检查
- 路径别名 `@/` 映射

---

**下一步**：1.2 TypeScript 配置优化
