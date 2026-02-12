---
name: project-standards
description: EzAdmin 项目开发规范 enforcement skill。用于确保所有代码生成和代码审查严格遵守项目规范。**使用时机**: (1) **代码生成时**: 创建 Vue 组件、编写 Pinia Store、定义 API、创建路由、编写工具函数等任何代码生成场景。(2) **代码审查时**: 审查现有代码是否符合规范，指出违规并提供修复建议。(3) **技术栈决策时**: 选择实现方案时，确保符合 Tailwind CSS 4.x、NaiveUI、Pinia Setup Store、Vue Router 4 的使用规范。**涵盖范围**: Vue 3 Composition API、TypeScript 类型安全、Tailwind CSS 4.x（禁用 @apply）、NaiveUI 组件使用、Pinia Store 架构、路由配置、代码风格（无分号、单引号、120字符行宽）、组件命名（禁用 index.vue）、函数定义风格（方法用 function、回调用箭头函数）、响应式数据（统一使用 ref、禁用 reactive）、注释规范（行尾注释）、核心行为准则（禁止私自提交、禁止自动校验、严格类型安全）。**触发关键词**: "创建组件"、"实现页面"、"编写 Store"、"定义类型"、"审查代码"、"检查规范"、"是否合规"。
---

# Project Standards Skill

## 核心原则

这个 skill 确保 EzAdmin 项目的所有代码都严格遵循项目规范。项目规范文档位于 `references/` 目录，按主题分类。

**重要**: 这些规范是强制性的，不是建议。违反规范会导致代码质量下降、维护困难、技术债务累积。

## 何时使用此 Skill

### 1. 代码生成时

任何创建新代码的场景都必须遵循规范：

- ✅ 创建 Vue 组件（布局组件、页面组件、业务组件、通用组件）
- ✅ 编写 Pinia Store（Setup Store 模式）
- ✅ 定义 TypeScript 类型（接口、类型别名、泛型）
- ✅ 创建 API 模块（使用封装的 request）
- ✅ 配置路由（Vue Router 4）
- ✅ 编写工具函数
- ✅ 编写组合式函数（hooks）
- ✅ 创建 NaiveUI 组件封装

### 2. 代码审查时

审查现有代码时检查：

- ✅ 组件命名是否符合规范（禁止 index.vue，至少两个单词的 PascalCase）
- ✅ 响应式数据是否使用 ref（禁止 reactive）
- ✅ 函数定义风格是否正确（方法用 function，回调用箭头函数）
- ✅ 是否使用 any 类型或 as 类型断言（严格禁止）
- ✅ Tailwind CSS 是否使用 @apply（严格禁止）
- ✅ NaiveUI API 是否通过 useNaiveApi.ts 调用（禁止全局变量）
- ✅ 注释是否写在行尾（简洁注释）
- ✅ 代码风格是否一致（无分号、单引号、120字符行宽）
- ✅ Pinia Store 是否使用 Setup Store 模式
- ✅ Props/Emits 是否有类型定义

### 3. 技术栈决策时

选择实现方案时遵循规范：

- ✅ 样式使用 Tailwind CSS 4.x utility classes（禁 @apply）
- ✅ 复杂交互使用 NaiveUI（表格、表单、弹窗）
- ✅ 简单样式使用 Tailwind（按钮、输入框、布局）
- ✅ 状态管理使用 Pinia Setup Store 模式
- ✅ 响应式数据统一使用 ref
- ✅ 组件通信：Props down, Events up
- ✅ 路由使用 Vue Router 4 集中化配置

## 规范文档快速索引

### 核心行为准则（最高优先级）

**文件**: `references/behavior-rules.md`

这些规则影响开发流程，违反会导致严重问题：

1. **禁止私自提交**: 所有 git commit/push 必须等待用户确认
2. **禁止自动校验**: 不主动运行 type-check、lint、build 命令
3. **禁止循环修复**: 代码报错时立即报告，不要重复尝试修复
4. **只管生成，用户校验**: 你的职责是输出高质量代码，调试和类型检查由用户控制
5. **严格类型安全**: 禁止 any 类型，禁止 as 类型断言
6. **同步更新进度**: 完成任务后立即更新 CLAUDE.md

**何时读取**:
- 开始任何任务前
- 准备提交代码前
- 遇到错误需要报告时
- 完成任务需要更新进度时

### Vue 组件开发规范

**文件**: `references/vue-standards.md`

涵盖：
- Vue 3.5+ `<script setup>` 语法
- 组件结构模板
- Props/Emits 类型定义
- 响应式数据（统一 ref，禁止 reactive）
- 函数定义风格（方法用 function，回调用箭头函数）
- 组件命名（禁止 index.vue，至少两个单词的 PascalCase）
- 全局组件 Ez 前缀
- 生命周期钩子
- 计算属性
- 组件通信模式
- Provide/Inject
- 异步组件

**何时读取**:
- 创建任何 Vue 组件时
- 审查 Vue 组件代码时
- 设计组件架构时

### 技术栈规范

**文件**: `references/tech-stack-standards.md`

涵盖：
- **Tailwind CSS 4.x**: 配置、使用规范（禁 @apply）、类名顺序、响应式设计
- **NaiveUI**: 使用场景、API 调用（必须用 useNaiveApi.ts）、主题定制
- **Pinia**: Setup Store 模式、目录结构、storeToRefs 使用
- **Vue Router 4**: 路由配置、导航守卫、路由 Meta
- **API 请求**: 封装使用、模块化、类型定义
- **工具函数**: 日期、验证、存储工具使用

**何时读取**:
- 使用 Tailwind CSS 时
- 使用 NaiveUI 组件时
- 编写 Pinia Store 时
- 配置路由时
- 创建 API 模块时
- 使用工具函数时

### 代码风格与架构规范

**文件**: `references/code-style-standards.md`

涵盖：
- **基本代码风格**: 无分号、单引号、120字符行宽
- **注释规范**: 简洁注释写行尾，复杂说明用块注释
- **TypeScript 类型**: 类型定义、接口 vs 类型别名、泛型、类型守卫
- **文件组织**: 目录结构、导入顺序、命名规范
- **组件设计**: 单一职责、组件大小、通信模式选择
- **性能优化**: 计算属性缓存、列表渲染优化、懒加载、防抖节流
- **错误处理**: API 错误、表单验证、全局错误处理

**何时读取**:
- 编写任何代码时
- 组织文件结构时
- 设计组件架构时
- 处理错误时
- 优化性能时

## 代码生成工作流程

### 1. 理解需求

明确任务类型：
- 是创建新组件？编写新功能？还是重构现有代码？

### 2. 加载相关规范

根据任务类型读取对应的参考文档：
- 创建组件 → `vue-standards.md` + `tech-stack-standards.md` (Tailwind/NaiveUI 部分)
- 编写 Store → `tech-stack-standards.md` (Pinia 部分)
- 定义 API → `tech-stack-standards.md` (API 部分) + `code-style-standards.md` (类型定义)
- 配置路由 → `tech-stack-standards.md` (Router 部分)

**关键**: 不要一次性读取所有文档，按需读取。

### 3. 生成代码

生成代码时严格遵守规范：

#### Vue 组件检查清单

- [ ] 使用 `<script setup lang="ts">` 语法
- [ ] 组件文件名：至少两个单词的 PascalCase（禁止 index.vue）
- [ ] 全局组件文件名包含 Ez 前缀
- [ ] Props 使用 TypeScript 接口定义
- [ ] Emits 使用 TypeScript 接口定义
- [ ] 响应式数据使用 ref（禁止 reactive）
- [ ] 方法定义使用 function 声明
- [ ] 回调函数使用箭头函数
- [ ] 简洁注释写在行尾
- [ ] 样式使用 Tailwind utility classes（禁止 @apply）
- [ ] NaiveUI API 通过 useNaiveApi.ts 调用
- [ ] 无分号、单引号、120字符行宽

#### Pinia Store 检查清单

- [ ] 使用 Setup Store 模式
- [ ] 文件位于 `src/stores/modules/` 目录
- [ ] State 使用 ref
- [ ] Getters 使用 computed
- [ ] Actions 使用 function 定义
- [ ] 返回所有需要暴露的属性和方法
- [ ] 有明确的 TypeScript 类型定义

#### API 模块检查清单

- [ ] 使用 `src/utils/request.ts` 封装的请求方法
- [ ] 文件位于 `src/api/` 目录
- [ ] 定义明确的请求/响应类型
- [ ] 按功能模块组织 API
- [ ] 统一导出到 `src/api/index.ts`

### 4. 自我检查

生成代码后，对照规范检查：
- 是否有 any 类型？
- 是否有 as 类型断言？
- 是否使用了 reactive？
- 是否使用了 @apply？
- 组件命名是否规范？
- 注释是否在行尾？
- 函数定义风格是否正确？

## 代码审查工作流程

### 1. 理解审查范围

明确要审查的内容：
- 整个文件？
- 特定功能？
- 还是要检查是否符合规范？

### 2. 加载相关规范

根据审查对象读取对应的参考文档。

### 3. 逐项检查

按照检查清单逐项验证：

#### 严格禁止项（发现必须报告）

1. ❌ 使用 `any` 类型
2. ❌ 使用 `as` 类型断言
3. ❌ 使用 `reactive`（应该用 ref）
4. ❌ Tailwind 中使用 `@apply`
5. ❌ 直接使用 `window.$message` 等全局变量
6. ❌ 组件命名为 `index.vue`
7. ❌ 组件命名只有一个单词（如 `User.vue`）
8. ❌ 方法定义使用箭头函数（应该用 function）
9. ❌ 未定义类型即使用

#### 推荐改进项（发现应建议改进）

1. ⚠️ 简洁注释未写在行尾
2. ⚠️ 代码风格不一致（分号、双引号等）
3. ⚠️ 缺少类型定义
4. ⚠️ Props/Emits 未定义类型
5. ⚠️ 组件文件过大（>500 行）
6. ⚠️ 未使用计算属性缓存
7. ⚠️ 列表渲染缺少 key

### 4. 提供审查报告

审查报告格式：

```markdown
## 代码审查报告

### ✅ 符合规范的部分
- [列出符合规范的点]

### ❌ 严重违规（必须修复）
1. **问题**: [问题描述]
   - **位置**: [文件路径:行号]
   - **规范**: [违反的规范]
   - **修复**: [具体修复建议]

### ⚠️ 建议改进（可选）
1. **问题**: [问题描述]
   - **位置**: [文件路径:行号]
   - **建议**: [改进建议]
```

## 常见违规示例

### 1. 使用 reactive（禁止）

```typescript
// ❌ 错误
const state = reactive({
  count: 0,
  user: null
})

// ✅ 正确
const count = ref(0)
const user = ref<User | null>(null)
```

### 2. 使用 @apply（禁止）

```scss
/* ❌ 错误 */
.button {
  @apply bg-blue-500 text-white px-4 py-2;
}

/* ✅ 正确 */
<button class="bg-blue-500 text-white px-4 py-2">Button</button>
```

### 3. 组件命名不规范

```bash
# ❌ 错误
index.vue
User.vue
header.vue

# ✅ 正确
UserManagement.vue
AppHeader.vue
EzButton.vue
```

### 4. 函数定义风格错误

```typescript
// ❌ 错误 - 方法定义使用箭头函数
const handleSubmit = () => {
  // ...
}

// ✅ 正确 - 方法定义使用 function
function handleSubmit() {
  // ...
}

// ✅ 正确 - 回调使用箭头函数
const doubled = items.map(item => item.value * 2)
```

### 5. 注释位置错误

```typescript
// ❌ 错误 - 简洁注释独占一行
const avatar = computed(() => userStore.avatar || '')
// 获取用户头像

// ✅ 正确 - 简洁注释写行尾
const avatar = computed(() => userStore.avatar || '') // 获取用户头像
```

## 快速决策树

```
是否创建 Vue 组件？
├─ 是 → 读取 vue-standards.md + tech-stack-standards.md (Tailwind/NaiveUI)
│
是否编写 Pinia Store？
├─ 是 → 读取 tech-stack-standards.md (Pinia 部分)
│
是否创建 API？
├─ 是 → 读取 tech-stack-standards.md (API 部分) + code-style-standards.md (类型)
│
是否配置路由？
├─ 是 → 读取 tech-stack-standards.md (Router 部分)
│
是否定义类型？
├─ 是 → 读取 code-style-standards.md (TypeScript 部分)
│
是否审查代码？
└─ 是 → 根据审查对象读取对应规范文档
   ├─ Vue 组件 → vue-standards.md
   ├─ Store → tech-stack-standards.md (Pinia)
   ├─ API → tech-stack-standards.md (API)
   └─ 其他 → code-style-standards.md
```

## 记忆要点

为了保持代码一致性，记住以下核心原则：

1. **响应式数据**: 统一使用 ref，禁止 reactive
2. **函数定义**: 方法用 function，回调用箭头函数
3. **组件命名**: 至少两个单词的 PascalCase，禁止 index.vue
4. **样式**: Tailwind utility classes，禁止 @apply
5. **NaiveUI**: 必须通过 useNaiveApi.ts 调用
6. **类型安全**: 禁止 any 和 as，使用正确的类型设计
7. **注释**: 简洁注释写行尾
8. **Store**: Setup Store 模式
9. **代码风格**: 无分号、单引号、120字符行宽
10. **行为准则**: 禁止私自提交、禁止自动校验

这些规范确保了代码质量和项目可维护性。严格遵循规范可以避免很多常见问题，让代码更易读、更易维护。
