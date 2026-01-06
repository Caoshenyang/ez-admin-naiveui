# 图片使用指南

## 概述

本文档介绍如何在 VitePress 文档中使用本地图片资源。

## 图片存放位置

### 方法1：Public 目录（推荐）

将图片放在 `docs/.vitepress/public/` 目录下：

```
docs/.vitepress/public/
├── images/
│   ├── screenshots/
│   │   ├── login-page.png
│   │   └── dashboard.png
│   ├── diagrams/
│   │   ├── architecture.png
│   │   └── data-flow.png
│   └── icons/
│       └── logo.png
```

### 方法2：Assets 目录

将图片放在 `docs/assets/` 目录下（如果不存在，需要创建）：

```
docs/assets/
├── images/
│   ├── screenshots/
│   └── diagrams/
```

## 引用方式

### 方式1：绝对路径（推荐用于 public 目录）

```markdown
<!-- 引用 public 目录下的图片 -->
![登录页面](/images/screenshots/login-page.png)

<!-- 引用子目录中的图片 -->
![架构图](/images/diagrams/architecture.png)

<!-- 引用图标 -->
![Logo](/images/icons/logo.png)
```

### 方式2：相对路径

```markdown
<!-- 在同一目录下的图片 -->
![示例图片](./images/example.png)

<!-- 在上级目录下的图片 -->
![架构图](../images/architecture.png)
```

### 方式3：Assets 目录（需要导入）

如果图片放在 assets 目录，需要在组件中导入：

```vue
<script setup>
import architectureImg from '../assets/images/architecture.png'
</script>

<template>
  <img :src="architectureImg" alt="架构图" />
</template>
```

## 最佳实践

### 1. 目录结构

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

### 页面截图

将截图放在 `docs/.vitepress/public/images/screenshots/`：

```markdown
## 用户管理页面

![用户管理页面](/images/screenshots/user-management.png)

*图1：用户管理页面的界面截图*
```

### 架构图

将架构图放在 `docs/.vitepress/public/images/diagrams/`：

```markdown
## 系统架构

![系统架构图](/images/diagrams/system-architecture.png)

*图2：系统整体架构设计*
```

### 图标

将图标放在 `docs/.vitepress/public/images/icons/`：

```markdown
## 技术栈

![Vue Logo](/images/icons/vue-logo.svg)
![Naive UI Logo](/images/icons/naive-ui-logo.png)

*图3：项目使用的核心技术栈*
```

## 注意事项

1. **路径问题**：确保图片路径正确，区分大小写
2. **构建问题**：Public 目录下的文件会直接复制到根目录
3. **版本控制**：图片文件通常较大，考虑是否需要纳入版本控制
4. **性能优化**：对于大图片，考虑懒加载或压缩

## 故障排除

### 图片不显示

1. 检查图片文件是否存在
2. 确认路径是否正确
3. 检查文件权限
4. 尝试清除缓存后重新构建

### 路径错误

1. 使用浏览器的开发者工具查看控制台错误
2. 确认图片路径是否以 `/` 开头（public 目录）
3. 检查文件名大小写是否正确

## 相关链接

- [VitePress 官方文档](https://vitepress.dev/guide/asset-handling)
- [Markdown 图片语法](https://www.markdownguide.org/basic-syntax/#images)
