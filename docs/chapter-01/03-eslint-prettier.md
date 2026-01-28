# 1.3 ESLint + Prettier 代码规范配置

## 代码风格规范

本项目遵循以下代码风格：

| 规则 | 值 | 说明 |
|------|-----|------|
| 分号 | 无 | `semi: false` |
| 引号 | 单引号 | `singleQuote: true` |
| 行宽 | 120 字符 | `printWidth: 120` |
| 缩进 | 2 空格 | `tabWidth: 2` |
| 尾随逗号 | ES5 | `trailingComma: "es5"` |
| 箭头函数括号 | 省略 | `arrowParens: "avoid"` |
| 换行符 | LF | `endOfLine: "lf"` |

## Prettier 配置

**`.prettierrc.json`**

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "trailingComma": "es5",
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

## ESLint 配置

**`eslint.config.ts`**

```typescript
import pluginVue from 'eslint-plugin-vue'
import vueTsConfigs from '@vue/eslint-config-typescript'
import skipFormatting from 'eslint-config-prettier/flat'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}']
  },
  {
    name: 'app/ignores',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsConfigs.recommended,
  {
    name: 'app/vue-rules',
    rules: {
      'vue/multi-word-component-names': 'error',
      'vue/require-explicit-emits': 'error'
    }
  },
  skipFormatting // 必须放在最后，禁用与 Prettier 冲突的规则
]
```

## 关键规则说明

### Vue 规则

| 规则 | 级别 | 说明 |
|------|------|------|
| `vue/multi-word-component-names` | error | 组件名必须包含多个单词（禁止 `index.vue`） |
| `vue/require-explicit-emits` | error | 必须显式声明 emits |
| `vue/component-name-in-template-casing` | error | 模板中使用 PascalCase |

### TypeScript 规则

| 规则 | 级别 | 说明 |
|------|------|------|
| `@typescript-eslint/no-unused-vars` | error | 禁止未使用的变量（`_` 前缀除外） |
| `@typescript-eslint/no-explicit-any` | warn | 警告使用 any 类型 |
| `@typescript-eslint/consistent-type-imports` | error | 强制使用 `type` 导入类型 |

### 通用规则

| 规则 | 级别 | 说明 |
|------|------|------|
| `no-console` | warn | 允许 `console.warn` 和 `console.error` |
| `no-debugger` | error | 禁止 debugger 语句 |
| `prefer-const` | error | 优先使用 const |
| `no-var` | error | 禁止使用 var |

## 格式化命令

```bash
pnpm format    # 格式化代码
pnpm lint      # 检查并自动修复问题
```

---

**下一步**：1.4 环境变量管理与模式说明
