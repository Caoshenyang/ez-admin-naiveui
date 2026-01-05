# 快速开始

## 环境准备

### 系统要求

- **Node.js**: >= 20.19.0 或 >= 22.12.0
- **包管理器**: pnpm (推荐) 或 npm
- **操作系统**: Windows / macOS / Linux

### 安装 Node.js

访问 [Node.js 官网](https://nodejs.org/) 下载并安装最新 LTS 版本。

### 安装 pnpm

```bash
npm install -g pnpm
```

## 项目安装

### 克隆项目

```bash
git clone <repository-url>
cd ez-admin-naiveui
```

### 安装依赖

```bash
pnpm install
```

## 运行项目

### 开发环境

```bash
# 启动开发服务器
pnpm dev
```

项目将在 `http://localhost:5173` 启动。

### 文档开发

```bash
# 启动文档开发服务器
pnpm docs:dev
```

文档将在 `http://localhost:4173` 启动。

## 项目构建

### 构建应用

```bash
# 构建生产版本
pnpm build
```

构建产物将输出到 `dist` 目录。

### 构建文档

```bash
# 构建文档
pnpm docs:build
```

文档构建产物将输出到 `docs/.vitepress/dist` 目录。

### 预览构建结果

```bash
# 预览应用构建结果
pnpm preview

# 预览文档构建结果
pnpm docs:preview
```

## 开发命令

### 代码检查

```bash
# 运行 ESLint 检查
pnpm lint

# 格式化代码
pnpm format

# 类型检查
pnpm type-check
```

### 组合命令

```bash
# 构建并预览
pnpm build-only

# 完整构建流程（类型检查 + 构建）
pnpm build
```

## 目录结构

```
ez-admin-naiveui/
├── docs/                 # 项目文档（VitePress）
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── api/            # API 接口
│   ├── components/     # 组件
│   ├── hooks/          # 组合式函数
│   ├── router/         # 路由配置
│   ├── stores/         # 状态管理
│   ├── types/          # 类型定义
│   ├── utils/          # 工具函数
│   ├── views/          # 页面组件
│   └── main.ts         # 入口文件
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript 配置
├── vite.config.ts      # Vite 配置
└── docs/               # 文档配置
```

## 下一步

- 查看[项目架构](./architecture.md)了解项目结构
- 查看[功能模块](./modules/user.md)了解业务功能
- 查看[开发指南](./development/crud.md)开始开发
