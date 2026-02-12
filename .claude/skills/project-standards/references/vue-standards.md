# Vue 组件开发规范

## Vue 版本与语法

**框架**: Vue 3.5+ (使用 `<script setup>` 语法)

## 响应式数据规范

**统一使用 `ref`，严禁使用 `reactive`**

```typescript
// ✅ 正确
const count = ref(0)
const user = ref<User>({ name: 'John', age: 30 })

// ❌ 错误
const state = reactive({ count: 0 }) // 禁止
```

## 函数定义规范

### 1. 方法定义（组件方法、Store actions、对象方法）

使用 `function` 声明：

```typescript
// ✅ 正确
function handleSubmit() {
  console.log('submit')
}
```

### 2. 回调函数（数组方法、事件监听、定时器）

使用箭头函数：

```typescript
// ✅ 正确
const doubled = items.map(item => item.value * 2)
watch(() => props.value, (newVal) => {
  console.log(newVal)
})
```

### 3. 函数表达式

使用箭头函数：

```typescript
// ✅ 正确
const add = (a: number, b: number): number => a + b
```

## 组件命名规范

**严禁使用 `index.vue` 命名组件**

所有组件文件必须使用具有明确语义(至少包含两个单词)的 PascalCase 命名：

```bash
# ✅ 正确
UserManagement.vue
AppHeader.vue
DataTable.vue

# ❌ 错误
index.vue
User.vue # 只有一个单词
```

### 全局组件前缀规范

二次封装的全局组件必须在文件名中包含 `Ez` 前缀：

```bash
EzButton.vue
EzTable.vue
EzForm.vue
```

## Props 定义规范

```typescript
interface Props {
  title: string
  count?: number
}
const props = withDefaults(defineProps<Props>(), {
  count: 0
})
```

## Emits 定义规范

```typescript
interface Emits {
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
}
const emit = defineEmits<Emits>()
```

## 组件注释规范

### 简洁的单行注释

**必须写在行尾**：

```typescript
const avatar = computed(() => userStore.avatar || '') // 获取用户头像
const loading = ref(false) // 加载状态
```

### 复杂的多行说明

使用块注释形式：

```typescript
/**
 * 处理表单提交
 * 1. 验证表单数据
 * 2. 调用 API 提交
 */
function handleSubmit() {
  // ...
}
```
