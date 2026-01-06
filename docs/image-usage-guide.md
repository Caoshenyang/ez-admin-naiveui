# 图片使用指南

## 概述

本文档介绍如何在 VitePress 文档中使用本地图片资源。

## 图片存放位置

### 方法1：Assets 目录（推荐）

将图片放在 `docs/assets/` 目录下（如果不存在，需要创建）：

```
docs/assets/
├── images/
│   ├── screenshots/
│   │   ├── login-page.png
│   │   └── dashboard.png
│   ├── diagrams/
│   │   ├── architecture.png
│   │   └── data-flow.png
│   ├── icons/
│   │   ├── logo.png
│   │   ├── vue-logo.svg
│   │   └── naive-ui-logo.png
│   └── examples/
│       └── example-diagram.png
```

### 方法2：Public 目录

将图片放在 `docs/.vitepress/public/` 目录下：

```
docs/.vitepress/public/
├── images/
│   ├── screenshots/
│   └── diagrams/
```

## 引用方式

### 方式1：相对路径（推荐用于 assets 目录）

```markdown
<!-- 引用 assets 目录下的图片（推荐方式） -->

![登录页面](./assets/images/screenshots/login-page.png)

<!-- 引用子目录中的图片 -->

![架构图](./assets/images/diagrams/architecture.png)

<!-- 引用图标 -->

![Logo](./assets/images/icons/logo.png)

<!-- 首页配置中的图片引用 -->

hero:
image:
src: ./assets/images/icons/logo.png
alt: 项目Logo
```

### 方式2：绝对路径（用于 public 目录）

```markdown
<!-- 引用 public 目录下的图片 -->

![登录页面](/images/screenshots/login-page.png)

<!-- 引用子目录中的图片 -->

![架构图](/images/diagrams/architecture.png)
```

### 方式3：Assets 目录在组件中导入

如果需要在 Vue 组件中使用 assets 目录的图片：

```vue
<script setup>
import architectureImg from '../assets/images/architecture.png'
</script>

<template>
  <img :src="architectureImg" alt="架构图" />
</template>
```

## 最佳实践

### 1. 推荐使用 Assets 目录

- **优先选择**：`docs/assets/` 目录存放图片
- **优势**：Vite 会优化处理，包括更好的缓存策略和路径解析
- **兼容性**：在开发和生产环境中都能正常工作

### 2. 目录结构

建议按照功能分类存放图片：

- `screenshots/` - 页面截图
- `diagrams/` - 流程图、架构图
- `icons/` - 图标文件
- `examples/` - 示例图片

### 2. 命名规范

- 使用英文命名，单词间用连字符 `-` 分隔
- 描述性强，便于理解
- 示例：`user-management-screenshot.png`

### 3. 图片格式

- **优先使用**：WebP、PNG
- **避免使用**：BMP、TIFF（文件过大）
- **特殊情况**：SVG（用于图标和简单图形）

### 4. 图片优化

- 压缩图片以减少文件大小
- 使用适当的分辨率（文档显示一般不需要超高分辨率）
- 考虑响应式图片（为不同屏幕提供不同尺寸）

## 示例

### 项目Logo（首页展示）

将logo放在 `docs/assets/images/icons/`，在首页配置中使用：

```yaml
# docs/index.md
hero:
  name: 'EZ Admin NaiveUI'
  image:
    src: ./assets/images/icons/logo.png
    alt: EZ简洁后台logo
```

### 页面截图

将截图放在 `docs/assets/images/screenshots/`：

```markdown
## 用户管理页面

![用户管理页面](./assets/images/screenshots/user-management.png)

_图1：用户管理页面的界面截图_
```

### 架构图

将架构图放在 `docs/assets/images/diagrams/`：

```markdown
## 系统架构

![系统架构图](./assets/images/diagrams/system-architecture.png)

_图2：系统整体架构设计_
```

### 图标

将图标放在 `docs/assets/images/icons/`：

```markdown
## 技术栈

![Vue Logo](./assets/images/icons/vue-logo.svg)
![Naive UI Logo](./assets/images/icons/naive-ui-logo.png)

_图3：项目使用的核心技术栈_
```

### 内联图片

在文章中直接使用图片：

```markdown
<div style="display: flex; justify-content: center;">
  <img width="256" height="256" alt="EZ简洁后台logo" src="./assets/images/icons/logo.png" />
</div>
```

## 注意事项

1. **推荐Assets目录**：优先使用 `docs/assets/` 目录存放图片，Vite会进行优化处理
2. **路径问题**：确保相对路径正确，区分大小写
3. **构建优化**：Assets目录下的图片会被Vite优化，Public目录的文件直接复制
4. **版本控制**：图片文件通常较大，考虑是否需要纳入版本控制
5. **性能优化**：对于大图片，考虑懒加载或压缩

## 故障排除

### 图片不显示

1. 检查图片文件是否存在于 `docs/assets/images/` 目录
2. 确认相对路径是否正确（以 `./assets/images/` 开头）
3. 检查文件权限和文件名大小写
4. 尝试清除缓存后重新构建：`npm run docs:dev`

### Vite导入错误

如果遇到 "Failed to resolve import" 错误：

1. 确认使用的是相对路径 `./assets/images/xxx.png`
2. 检查 `docs/assets/` 目录是否存在
3. 确保 VitePress 配置中没有错误的 base 路径设置
4. 尝试重启开发服务器

### 路径错误

1. 使用浏览器的开发者工具查看控制台错误
2. **Assets目录**：使用 `./assets/images/xxx.png` 相对路径
3. **Public目录**：使用 `/images/xxx.png` 绝对路径
4. 检查文件名大小写是否正确

## 相关链接

- [VitePress 官方文档](https://vitepress.dev/guide/asset-handling)
- [Markdown 图片语法](https://www.markdownguide.org/basic-syntax/#images)
