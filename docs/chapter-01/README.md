# 第一章：项目初始化与基础配置

> **学习目标**: 搭建一个规范、类型安全、代码清晰可维护的开发环境

## 本章概述

本章将带你从零开始搭建一个现代化的前端项目开发环境。我们会详细讲解每个配置文件的作用、每一步的原理，以及为什么这样配置。

**本章你将学会**:
- ✅ 如何使用 Vite 初始化 Vue 3 + TypeScript 项目
- ✅ TypeScript 配置的最佳实践
- ✅ ESLint 和 Prettier 的配置与配合使用
- ✅ 环境变量的管理和使用
- ✅ 路径别名的配置方法

**学习时长**: 约 2-3 小时

**难度**: ⭐⭐☆☆☆

---

## 课程目录

- [1.1 项目规划与技术栈介绍](./01-项目规划与技术栈介绍.md)
- [1.2 Vite + Vue 3 项目初始化](./02-Vite+Vue3项目初始化.md)
- [1.3 TypeScript 配置详解](./03-TypeScript配置详解.md)
- [1.4 ESLint + Prettier 代码规范](./04-ESLint+Prettier代码规范.md)
- [1.5 环境变量配置](./05-环境变量配置.md)
- [1.6 路径别名配置](./06-路径别名配置.md)

---

## 学习前的准备

### 环境要求

开始学习前，请确保你的开发环境满足以下要求：

```bash
# 检查 Node.js 版本（需要 >= 18.0.0）
node --version

# 检查 pnpm 版本（需要 >= 8.0.0）
pnpm --version

# 如果没有安装 pnpm
npm install -g pnpm
```

### 推荐工具

- **IDE**: VS Code
- **VS Code 插件**:
  - Vue - Official (Vue Language Features (Volar))
  - TypeScript Vue Plugin (Volar)
  - ESLint
  - Prettier - Code formatter
  - Tailwind CSS IntelliSense

---

## 本章知识要点

### 1. 为什么选择 Vite？

Vite 是新一代前端构建工具，具有以下优势：

- ⚡️ 极速的开发服务器启动
- 🔥 即时的热模块更新 (HMR)
- 📦 优化的生产构建
- 🛠️ 丰富的插件生态

### 2. TypeScript 的价值

- 🎯 类型安全，减少运行时错误
- 💡 智能提示，提升开发效率
- 📖 自文档化，代码即文档
- 🔧 重构更安全可靠

### 3. 代码规范的重要性

- 👥 团队协作的统一语言
- 🐛 减少低级错误
- 📦 代码可读性提升
- 🚀 降低维护成本

---

## 完成标准

学习完本章后，你应该能够：

1. ✅ 独立创建一个 Vite + Vue 3 + TypeScript 项目
2. ✅ 理解 tsconfig.json 各配置项的含义
3. ✅ 配置并使用 ESLint 和 Prettier
4. ✅ 正确使用环境变量
5. ✅ 配置并使用路径别名

**验收成果**:
- 项目可以正常启动（`pnpm dev`）
- 类型检查通过（`pnpm type-check`）
- 代码格式化正常（`pnpm format`）
- 可以使用 `@/` 别名引入文件

---

## 常见问题

### Q1: 为什么要用 pnpm 而不是 npm 或 yarn？

**A**: pnpm 具有以下优势：
- 更快的安装速度
- 节省磁盘空间（使用硬链接）
- 严格的依赖管理（避免幽灵依赖）
- 支持 monorepo

### Q2: TypeScript 配置那么多，哪些是必须的？

**A**:
- **必须**: `compilerOptions.target`, `compilerOptions.module`, `compilerOptions.strict`
- **推荐**: `compilerOptions.baseUrl`, `compilerOptions.paths`, `compilerOptions.jsx`
- **可选**: 其他配置根据项目需求调整

### Q3: ESLint 和 Prettier 冲突怎么办？

**A**: 使用 `eslint-config-prettier` 和 `eslint-plugin-prettier` 让 ESLint 集成 Prettier 的规则，具体配置在 1.4 节详细讲解。

---

## 下一步

准备好了吗？让我们开始第一节课：[项目规划与技术栈介绍](./01-项目规划与技术栈介绍.md)
