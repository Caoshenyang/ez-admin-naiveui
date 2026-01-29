# 第二章：核心框架搭建

> **学习目标**: 集成 Vue Router、Pinia、NaiveUI、Tailwind CSS 等核心依赖

## 本章概述

在第一章完成基础项目搭建后，本章将集成核心框架和依赖，建立完整的技术栈。

**本章你将学会**:
- ✅ Vue Router 4 的配置和路由设计
- ✅ Pinia 状态管理的使用
- ✅ NaiveUI 组件库的集成
- ✅ Tailwind CSS 的安装和配置
- ✅ 规范的项目目录结构

**学习时长**: 约 3-4 小时

**难度**: ⭐⭐⭐☆☆

---

## 课程目录

- [2.1 Vue Router 4 配置与路由设计](./01-Vue-Router4配置与路由设计.md)
- [2.2 Pinia 状态管理搭建](./02-Pinia状态管理搭建.md)
- [2.3 NaiveUI 安装与基础配置](./03-NaiveUI安装与基础配置.md)
- [2.4 Tailwind CSS 安装](./04-Tailwind-CSS安装.md)
- [2.5 项目目录结构规范](./05-项目目录结构规范.md)

---

## 核心依赖清单

```json
{
  "dependencies": {
    "vue": "^3.5.13",
    "vue-router": "^4.5.0",
    "pinia": "^2.2.6",
    "naive-ui": "^2.40.1"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20"
  }
}
```

---

## 学习路径

```
1. 安装核心依赖
       ↓
2. 配置路由系统
       ↓
3. 配置状态管理
       ↓
4. 集成 UI 组件库
       ↓
5. 集成样式系统
       ↓
6. 规范目录结构
```

---

## 完成标准

学习完本章后，你应该能够：

1. ✅ 配置和使用 Vue Router 4
2. ✅ 创建和使用 Pinia Store
3. ✅ 使用 NaiveUI 组件
4. ✅ 使用 Tailwind CSS 类名
5. ✅ 理解项目的目录结构

**验收成果**:
- 页面路由切换正常
- Pinia 状态可以正常读写
- NaiveUI 组件正常显示
- Tailwind CSS 样式生效

---

## 常见问题

### Q1: 为什么先装路由和状态管理？

**A**: 路由和状态管理是应用的基础架构，其他功能都依赖它们。先搭建好基础，后续开发会更顺畅。

### Q2: NaiveUI 和 Tailwind CSS 会不会冲突？

**A**: 不会。NaiveUI 使用 scoped 样式，Tailwind CSS 是原子化类名，两者可以完美配合。

### Q3: 必须按顺序学习吗？

**A**: 建议按顺序学习，因为每个章节的内容可能依赖前面的配置。如果你已经熟悉某个技术，可以快速浏览或跳过。

---

**开始学习**: [2.1 Vue Router 4 配置与路由设计](./01-vue-router.md)
