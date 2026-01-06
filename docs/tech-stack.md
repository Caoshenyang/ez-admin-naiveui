# 技术栈

## 前端框架

- **Vue 3**: 采用 Composition API 和 `<script setup>` 语法
- **TypeScript**: 提供完整的类型检查和开发体验
- **Vite**: 快速的构建工具和开发服务器

## UI 组件库

- **Naive UI**: 基于 Vue 3 的高质量组件库
- **Tailwind CSS**: 实用优先的 CSS 框架
- **@vicons**: 统一的图标库（Ionicons + Ant Design Icons）

## 状态管理

- **Pinia**: Vue 3 官方推荐的状态管理库
- **pinia-plugin-persistedstate**: 状态持久化插件

## 网络请求

- **Axios**: HTTP 客户端，支持请求/响应拦截器
- **自定义请求工具**: 统一的 API 调用封装

## 路由管理

- **Vue Router 4**: 官方路由管理器
- **路由权限控制**: 基于路由的权限验证

## 开发工具

- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **TypeScript Compiler**: 类型检查
- **Vite DevTools**: 开发调试工具

## 构建工具

- **Vite**: 快速构建和热重载
- **VitePress**: 项目文档生成
- **npm-run-all2**: 脚本任务管理

## 代码质量

- **ESLint 配置**: Vue 3 + TypeScript 规则
- **Prettier 配置**: 统一的代码风格
- **TypeScript 配置**: 严格的类型检查

## 依赖管理

- **pnpm**: 高效的包管理器
- **auto-imports**: 自动导入 Vue 3 API
- **组件自动导入**: Naive UI 组件自动导入

## 项目结构

```
src/
├── api/          # API 接口定义
├── components/   # 公共组件
├── hooks/        # 组合式函数
├── router/       # 路由配置
├── stores/       # 状态管理
├── types/        # TypeScript 类型定义
├── utils/        # 工具函数
├── views/        # 页面组件
└── main.ts       # 应用入口
```
