# 1.2 TypeScript 配置优化

## 配置文件说明

本项目使用三个 TypeScript 配置文件，各司其职：

### tsconfig.json（根配置）

项目根配置，使用 `project references` 引用其他配置：

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.app.json" }
  ]
}
```

### tsconfig.app.json（应用配置）

应用代码的 TypeScript 配置，已优化为：

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    // 路径别名
    "paths": {
      "@/*": ["./src/*"]
    },

    // 严格类型检查
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    // 模块解析
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,

    // Vue JSX
    "jsx": "preserve",
    "jsxImportSource": "vue"
  }
}
```

### tsconfig.node.json（Node 配置）

构建工具（Vite、ESLint）的配置：

```json
{
  "extends": "@tsconfig/node24/tsconfig.json",
  "include": ["vite.config.*", "eslint.config.*"],
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"]
  }
}
```

## 编译选项详解

| 选项 | 值 | 说明 |
|------|-----|------|
| `strict` | `true` | 启用所有严格类型检查选项 |
| `noUnusedLocals` | `true` | 报告未使用的局部变量 |
| `noUnusedParameters` | `true` | 报告未使用的函数参数 |
| `noFallthroughCasesInSwitch` | `true` | switch 语句必须有 break 或 return |
| `moduleResolution` | `"Bundler"` | 使用打包器模式解析模块 |
| `paths` | `{"@/*": ["./src/*"]}` | 路径别名配置 |

## 严格模式的好处

启用 `strict: true` 后，TypeScript 会启用：

1. **noImplicitAny** - 禁止隐式 any 类型
2. **strictNullChecks** - 严格的 null 检查
3. **strictFunctionTypes** - 严格的函数类型检查
4. **strictPropertyInitialization** - 类属性必须初始化

这些设置能在开发阶段捕获更多潜在错误。

---

**下一步**：1.3 ESLint + Prettier 代码规范配置
