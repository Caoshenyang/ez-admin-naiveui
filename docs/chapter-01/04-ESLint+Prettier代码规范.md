# 1.4 ESLint + Prettier 代码规范

## 本节目标

- ✅ 配置 ESLint 进行代码质量检查
- ✅ 配置 Prettier 进行代码格式化
- ✅ 让 ESLint 和 Prettier 和谐共存
- ✅ 集成到项目中

---

## 1. 为什么需要代码规范？

### 1.1 ESLint vs Prettier

| 工具 | 作用 | 示例 |
|------|------|------|
| **ESLint** | 代码质量检查 | 发现未使用的变量、潜在的 bug |
| **Prettier** | 代码格式化 | 统一缩进、引号、分号风格 |

**协作方式**:
- ESLint 负责"对不对"（质量）
- Prettier 负责"美不美"（格式）

### 1.2 规范的价值

```javascript
// ❌ 无规范：团队成员风格各异
const name="admin"
const age = 20;
const user={name,age}

// ✅ 有规范：统一、易读
const name = 'admin'
const age = 20
const user = { name, age }
```

---

## 2. 安装依赖

### 2.1 安装 ESLint

```bash
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-vue eslint-config-prettier eslint-plugin-prettier
```

**依赖说明**:
- `eslint`: ESLint 核心
- `@eslint/js`: ESLint JavaScript 配置
- `typescript-eslint`: TypeScript 支持
- `eslint-plugin-vue`: Vue 文件支持
- `eslint-config-prettier`: 禁用与 Prettier 冲突的规则
- `eslint-plugin-prettier`: 将 Prettier 规则集成到 ESLint

### 2.2 安装 Prettier

```bash
pnpm add -D prettier
```

---

## 3. ESLint 配置

### 3.1 创建配置文件

**eslint.config.js** (ESLint 新格式):

```javascript
import js from '@eslint/js'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier/recommended'

export default [
  // 忽略文件
  {
    ignores: [
      'dist',
      'node_modules',
      '*.config.js',
      '*.config.ts',
    ],
  },

  // 基础 JavaScript 规则
  js.configs.recommended,

  // Vue 规则
  ...vue.configs['flat/recommended'],

  // TypeScript 规则
  ...ts.configs.recommended,

  // Prettier 集成
  prettier,

  // 自定义规则
  {
    rules: {
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],

      // Vue
      'vue/multi-word-component-names': 'error', // 组件名必须多个单词
      'vue/no-v-html': 'warn', // 警告使用 v-html
      'vue/require-default-prop': 'off', // 不要求 prop 默认值
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],

      // 通用
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
]
```

### 3.2 关键规则说明

#### Vue 组件命名规则

```javascript
'vue/multi-word-component-names': 'error'
```

```vue
<!-- ❌ 错误：单个单词 -->
<template>
  <UserProfile />
</template>

<script setup lang="ts">
// 这个文件名不能是 Profile.vue
// 应该是 UserProfile.vue
</script>
```

#### 未使用变量检查

```javascript
'@typescript-eslint/no-unused-vars': [
  'error',
  { argsIgnorePattern: '^_' },
]
```

```typescript
// ✅ 下划线开头表示有意不使用
function fetchUser(id: string, _options?: object) {
  return api.get(id)
}
```

---

## 4. Prettier 配置

### 4.1 创建配置文件

**.prettierrc**:

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 120,
  "trailingComma": "none",
  "arrowParens": "avoid",
  "endOfLine": "auto",
  "tabWidth": 2,
  "useTabs": false
}
```

### 4.2 配置项说明

| 配置项 | 值 | 说明 | 示例 |
|--------|-----|------|------|
| `semi` | `false` | 不使用分号 | `const a = 1` |
| `singleQuote` | `true` | 使用单引号 | `'hello'` |
| `printWidth` | `120` | 每行最大字符数 | 120 字符后换行 |
| `trailingComma` | `"none"` | 不使用尾随逗号 | `{ a, b }` |
| `arrowParens` | `"avoid"` | 箭头函数单参数时省略括号 | `x => x + 1` |
| `endOfLine` | `"auto"` | 换行符自动检测 | 保持系统一致 |
| `tabWidth` | `2` | 缩进宽度 | 2 个空格 |
| `useTabs` | `false` | 使用空格而非 Tab | 空格缩进 |

### 4.3 Prettier 忽略文件

**.prettierignore**:

```
dist
node_modules
*.min.js
pnpm-lock.yaml
package-lock.json
```

---

## 5. 集成到 package.json

### 5.1 添加脚本命令

```json
{
  "scripts": {
    "lint": "eslint . --fix",
    "lint:check": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

**命令说明**:
- `pnpm lint`: ESLint 检查并自动修复
- `pnpm lint:check`: 仅 ESLint 检查
- `pnpm format`: Prettier 格式化所有文件
- `pnpm format:check`: 检查文件是否格式化

### 5.2 组合使用

```json
{
  "scripts": {
    "check": "pnpm lint:check && pnpm type-check",
    "fix": "pnpm lint && pnpm format"
  }
}
```

---

## 6. VS Code 集成

### 6.1 创建工作区配置

**.vscode/settings.json**:

```json
{
  // 编辑器
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  // 文件
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact", "vue"],
  "eslint.useFlatConfig": true,

  // Vue
  "vue.inlayHints.missingProps": true,
  "vue.complete.casing.tags": "pascal",
  "vue.complete.casing.props": "camel",

  // TypeScript
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### 6.2 创建扩展推荐

**.vscode/extensions.json**:

```json
{
  "recommendations": [
    "vue.volar",
    "vue.vscode-typescript-vue-plugin",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

---

## 7. 验证配置

### 7.1 创建测试文件

**src/test.ts**:

```typescript
// 格式化测试
const name='admin'
const age=20
const user={name,age}

// ESLint 测试
const unused='test' // ❌ 未使用变量

console.log(user)
```

### 7.2 运行检查

```bash
# ESLint 检查
pnpm lint:check

# Prettier 格式化
pnpm format
```

**预期结果**:
- ESLint 报告未使用的变量
- Prettier 自动格式化代码

### 7.3 修复后

**src/test.ts**:

```typescript
// 格式化测试
const name = 'admin'
const age = 20
const user = { name, age }

console.log(user)
```

---

## 8. 代码规范最佳实践

### 8.1 组件命名规范

```vue
<!-- ✅ 推荐：多个单词，PascalCase -->
<!-- UserProfile.vue -->
<template>
  <div>User Profile</div>
</template>

<!-- ❌ 避免：单个单词 -->
<!-- Profile.vue -->
```

### 8.2 变量命名规范

```typescript
// ✅ 推荐：camelCase
const userName = 'admin'
const getUserInfo = () => {}

// ✅ 推荐：PascalCase（类/接口/类型）
class UserManager {}
interface UserInfo {}
type UserRole = 'admin' | 'user'

// ✅ 推荐：UPPER_SNAKE_CASE（常量）
const API_BASE_URL = 'https://api.example.com'

// ❌ 避免
const user_name = 'admin'
const getuserinfo = () => {}
```

### 8.3 文件组织规范

```
src/components/
├── EzButton.vue           # 二次封装组件，前缀 Ez
├── UserProfile.vue        # 业务组件，多个单词
└── common/
    └── AppHeader.vue      # 公共组件，多单词
```

---

## 9. 常见问题

### Q1: ESLint 和 Prettier 冲突？

**A**: 使用 `eslint-config-prettier` 禁用冲突规则：
```javascript
import prettier from 'eslint-plugin-prettier/recommended'
export default [prettier]
```

### Q2: 保存时没有自动格式化？

**A**: 检查 VS Code 设置：
- `editor.formatOnSave` 应为 `true`
- `editor.defaultFormatter` 应为 `esbenp.prettier-vscode`

### Q3: Vue 文件中的 `<script>` 不格式化？

**A**: 确保安装了 `eslint-plugin-vue`，并在配置中正确引入。

---

## 10. 本节小结

✅ 完成的工作：
- 配置了 ESLint 进行代码质量检查
- 配置了 Prettier 进行代码格式化
- 集成到 package.json 和 VS Code
- 制定了代码规范

🎯 代码规范清单：
- ✅ ESLint 检查代码质量
- ✅ Prettier 统一代码格式
- ✅ 保存时自动格式化
- ✅ Git 提交前检查（需配置 husky）

**下一步**: [1.5 环境变量配置](./05-环境变量配置.md)

