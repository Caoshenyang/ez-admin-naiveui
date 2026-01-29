# 1.3 TypeScript 配置详解

## 本节目标

- ✅ 理解 tsconfig.json 的核心配置
- ✅ 配置适合 Vue 3 项目的 TypeScript 选项
- ✅ 设置路径别名和环境变量类型

---

## 1. TypeScript 配置文件

### 1.1 配置文件结构

项目中有两个 TypeScript 配置文件：

```
tsconfig.json          # 应用代码配置
tsconfig.node.json     # Node 环境配置（vite.config.ts）
```

### 1.2 tsconfig.json 核心配置

```json
{
  "compilerOptions": {
    /* 语言与环境 */
    "target": "ES2020",                    // 编译目标
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "useDefineForClassFields": true,       // 使用 class 字段定义

    /* 模块 */
    "module": "ESNext",                    // 模块系统
    "moduleResolution": "bundler",         // 模块解析策略
    "resolveJsonModule": true,             // 允许导入 JSON
    "allowImportingTsExtensions": true,    // 允许导入 .ts 文件

    /* 类型检查 */
    "strict": true,                        // 严格模式
    "noUnusedLocals": true,                // 禁止未使用的局部变量
    "noUnusedParameters": true,            // 禁止未使用的参数
    "noFallthroughCasesInSwitch": true,    // switch 穿透检查

    /* 其他 */
    "esModuleInterop": true,               // ES 模块兼容性
    "skipLibCheck": true,                  // 跳过库文件检查
    "allowJs": true,                       // 允许 JS 文件
    "forceConsistentCasingInFileNames": true // 强制文件名大小写
  },

  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 2. 核心配置详解

### 2.1 target - 编译目标

```json
"target": "ES2020"
```

**可选值**:
- `ES3`: 最老，兼容性最好
- `ES5`: 支持 IE11
- `ES2015`/`ES6`: 现代浏览器
- `ES2020`: 支持最新特性（可选链、空值合并等）
- `ESNext`: 最新提案

**为什么选择 ES2020？**
- Vite 会处理现代浏览器兼容
- 支持可选链 `?.` 和空值合并 `??`
- 支持动态导入 `import()`

### 2.2 module - 模块系统

```json
"module": "ESNext",
"moduleResolution": "bundler"
```

**module 可选值**:
- `CommonJS`: Node.js 默认
- `ESNext` / `ES2022`: 现代浏览器，支持顶层 await

**moduleResolution 可选值**:
- `node`: Node.js 解析规则
- `bundler`: Vite 等构建工具专用（推荐）

### 2.3 strict - 严格模式

```json
"strict": true
```

**启用的检查**:
- `noImplicitAny`: 禁止隐式 any
- `strictNullChecks`: 严格空值检查
- `strictFunctionTypes`: 严格函数类型
- `strictPropertyInitialization`: 严格属性初始化

**示例**:

```typescript
// ❌ 关闭严格模式
function greet(name) {  // name 隐式 any
  return `Hello, ${name}`
}

// ✅ 开启严格模式
function greet(name: string) {  // 必须声明类型
  return `Hello, ${name}`
}
```

### 2.4 路径别名配置

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**使用示例**:

```typescript
// ❌ 相对路径
import { foo } from '../../../utils/helper'

// ✅ 路径别名
import { foo } from '@/utils/helper'
```

---

## 3. Vite 环境变量类型

### 3.1 创建环境变量类型文件

**src/vite-env.d.ts**:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 环境变量类型定义
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_MODE: 'development' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 3.2 使用环境变量

```typescript
const appTitle = import.meta.env.VITE_APP_TITLE
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

**类型提示**: 自动补全和类型检查

---

## 4. Vue 文件类型支持

### 4.1 创建 shim 类型文件

**src/env.d.ts** (Vite 自动生成):

```typescript
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

### 4.2 在 TypeScript 中导入 Vue 文件

```typescript
import type { SetupContext } from 'vue'
import MyComponent from './MyComponent.vue' // ✅ 类型正确
```

---

## 5. 类型声明文件

### 5.1 全局类型声明

**src/types/global.d.ts**:

```typescript
// 全局变量
declare const APP_VERSION: string

// 扩展 Window 接口
declare global {
  interface Window {
    myCustomProperty: string
  }
}

export {} // 必须导出，使其成为模块
```

### 5.2 模块声明

**src/types/shims.d.ts**:

```typescript
// 声明模块
declare module 'my-library' {
  export function doSomething(): void
}

// 声明 CSS 模块
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

// 声明图片模块
declare module '*.png' {
  const src: string
  export default src
}
```

---

## 6. 实用配置建议

### 6.1 完整推荐配置

```json
{
  "compilerOptions": {
    /* 语言和环境 */
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "useDefineForClassFields": true,

    /* 模块 */
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,

    /* 解析 */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },

    /* 类型检查 */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,

    /* 发射 */
    "declaration": false,
    "declarationMap": false,
    "sourceMap": true,
    "removeComments": true,

    /* 互操作 */
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,

    /* 其他 */
    "skipLibCheck": true,
    "allowJs": true,
    "jsx": "preserve"
  },

  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ],

  "exclude": [
    "node_modules",
    "dist"
  ],

  "references": [
    { "path": "./tsconfig.node.json" }
  ]
}
```

### 6.2 严格模式增强

```json
{
  "compilerOptions": {
    // 更严格的检查
    "noImplicitOverride": true,           // 禁止隐式覆盖方法
    "noUnusedLocals": true,               // 禁止未使用的局部变量
    "noUnusedParameters": true,           // 禁止未使用的参数
    "noPropertyAccessFromIndexSignature": true, // 索引签名访问检查
    "noImplicitReturns": true,            // 所有分支必须有返回值
    "noUncheckedIndexedAccess": true      // 索引访问可能为 undefined
  }
}
```

---

## 7. 验证配置

### 7.1 创建类型测试文件

**src/types/test.ts**:

```typescript
// 测试路径别名
import { version } from '@/package.json'

// 测试环境变量
const title = import.meta.env.VITE_APP_TITLE

// 测试类型推断
function add(a: number, b: number): number {
  return a + b
}

// 测试严格模式
function strictTest(param: string) {
  // ❌ noUnusedLocals 会报错
  // const unused = 'test'

  // ❌ noImplicitReturns 会报错
  // if (param) {
  //   return param
  // }

  return param
}
```

### 7.2 运行类型检查

```bash
pnpm type-check
```

应该无错误输出。

---

## 8. 常见问题

### Q1: 路径别名不生效？

**A**: 确保：
1. `tsconfig.json` 和 `vite.config.ts` 都配置了别名
2. 别名路径末尾有 `/*`

### Q2: 环境变量类型报错？

**A**: 检查 `vite-env.d.ts` 中是否正确定义了 `ImportMetaEnv` 接口。

### Q3: Vue 文件导入报错？

**A**: 确保 `src/env.d.ts` 或 `vite-env.d.ts` 中有 `declare module '*.vue'` 声明。

---

## 9. 本节小结

✅ 完成的工作：
- 配置了完整的 TypeScript 选项
- 设置了路径别名
- 配置了环境变量类型
- 创建了类型声明文件

🎯 TypeScript 配置清单：
- ✅ 严格模式启用
- ✅ 路径别名配置
- ✅ 环境变量类型定义
- ✅ Vue 文件支持
- ✅ 类型声明文件

**下一步**: [1.4 ESLint + Prettier 代码规范](./04-ESLint+Prettier代码规范.md)

