# 1.2 Vite + Vue 3 项目初始化

## 本节目标

- ✅ 使用 Vite 创建 Vue 3 + TypeScript 项目
- ✅ 理解项目生成的文件结构
- ✅ 配置项目基本信息

---

## 1. 创建项目

### 1.1 使用 Vite 脚手架

Vite 提供了快速的项目创建工具，支持多种框架模板。

```bash
# 创建项目
pnpm create vite@latest ez-admin-naiveui -- --template vue-ts

# 进入项目目录
cd ez-admin-naiveui

# 安装依赖
pnpm install --silent
```

**命令解析**:
- `pnpm create vite@latest`: 使用最新版本的 Vite 创建项目
- `--template vue-ts`: 使用 Vue + TypeScript 模板
- `--silent`: 减少安装输出，节省时间

### 1.2 项目初始化过程

执行上述命令后，Vite 会询问以下问题：

```
✔ Select a framework: › Vue
✔ Select a variant: › TypeScript

Scaffolding project in D:\AA\ez-admin-naiveui...
Done. Now run:
  cd ez-admin-naiveui
  pnpm install
  pnpm dev
```

---

## 2. 项目结构解析

### 2.1 初始目录结构

```
ez-admin-naiveui/
├── public/                  # 静态资源（不会被 Vite 处理）
│   └── vite.svg            # 网站图标
├── src/
│   ├── assets/             # 资源文件（会被 Vite 处理）
│   │   └── vue.svg         # Vue logo
│   ├── App.vue             # 根组件
│   ├── main.ts             # 应用入口
│   ├── style.css           # 全局样式
│   └── vite-env.d.ts       # Vite 环境变量类型声明
├── .gitignore              # Git 忽略文件
├── index.html              # HTML 入口
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
├── tsconfig.node.json      # Node 环境 TypeScript 配置
└── vite.config.ts          # Vite 配置
```

### 2.2 核心文件说明

#### `index.html` - HTML 入口

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue + TS</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**关键点**:
- `<div id="app">`: Vue 应用挂载点
- `<script type="module">`: 使用 ES Module
- `src="/src/main.ts"`: 应用入口文件

#### `src/main.ts` - 应用入口

```typescript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
```

**执行流程**:
1. 导入 `createApp` 函数
2. 导入全局样式
3. 导入根组件
4. 创建应用实例并挂载到 DOM

#### `src/App.vue` - 根组件

```vue
<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
/* ... */
</style>
```

**Vue 3 新特性**:
- `<script setup>`: Composition API 的语法糖
- `lang="ts"`: 启用 TypeScript

---

## 3. 修改项目配置

### 3.1 更新 package.json

```json
{
  "name": "ez-admin-naiveui",
  "version": "1.0.0",
  "description": "基于 Vue 3 + TypeScript + Vite + NaiveUI 的后台管理系统",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "typescript": "~5.6.2",
    "vite": "^6.0.5",
    "vue-tsc": "^2.1.10"
  }
}
```

**脚本说明**:
- `dev`: 启动开发服务器
- `build`: 类型检查 + 构建
- `preview`: 预览生产构建
- `type-check`: 仅类型检查（不生成文件）

### 3.2 修改 index.html

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Ez-Admin-NaiveUI 后台管理系统" />
    <title>Ez-Admin-NaiveUI</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**优化点**:
- 添加 `description` 元信息
- 修改 `title` 为项目名称
- `lang` 属性设为 `zh-CN`

---

## 4. 清理默认文件

### 4.1 删除示例文件

```bash
# 删除示例组件和资源
rm -f src/assets/vue.svg
rm -f src/components/HelloWorld.vue
rm -f src/style.css
```

### 4.2 简化 App.vue

```vue
<script setup lang="ts">
// 后续会在这里添加全局配置
</script>

<template>
  <div class="app">
    <h1>Ez-Admin-NaiveUI</h1>
    <p>项目初始化成功！</p>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
}
</style>
```

### 4.3 创建基础样式文件

**src/styles/index.css**:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**在 main.ts 中引入**:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.css'

createApp(App).mount('#app')
```

---

## 5. 项目运行测试

### 5.1 启动开发服务器

```bash
pnpm dev
```

输出示例：
```
  VITE v6.0.5  ready in 328 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h + enter to show help
```

### 5.2 访问项目

打开浏览器访问 `http://localhost:5173/`，应该看到：

```
Ez-Admin-NaiveUI
项目初始化成功！
```

### 5.3 验证类型检查

```bash
pnpm type-check
```

如果输出为空（无错误），说明 TypeScript 配置正确。

---

## 6. 常见问题

### Q1: pnpm create 执行失败？

**A**: 检查 Node.js 版本：
```bash
node --version  # 应该 >= 18.0.0
```

### Q2: 启动后页面空白？

**A**:
1. 检查浏览器控制台是否有错误
2. 确认 `main.ts` 正确挂载到 `#app`
3. 检查 `index.html` 中的 `script` 标签路径

### Q3: 端口被占用怎么办？

**A**: 修改 `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 3000, // 修改端口
  },
})
```

---

## 7. 本节小结

✅ 完成的工作：
- 使用 Vite 创建了 Vue 3 + TypeScript 项目
- 理解了项目的初始结构
- 配置了基本的项目信息
- 清理了示例文件，创建了基础结构

🎯 当前项目状态：
- 项目可以正常启动和访问
- TypeScript 类型检查正常
- 基础样式已配置

**下一步**: [1.3 TypeScript 配置详解](./03-TypeScript配置详解.md)

我们将深入配置 TypeScript，让类型系统更完善。
