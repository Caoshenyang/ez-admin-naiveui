# Project Vue 3 强制规范

本项目使用 Vue 3.5 + TypeScript + Composition API，**必须严格遵守**以下规范：

## 1. 响应式系统（强制）

```vue
<script setup lang="ts">
// ✅ 正确：统一使用 ref
const count = ref(0)
const user = ref<User>({ name: 'John' })
const list = ref<Item[]>([])

// ❌ 禁止：严禁使用 reactive
// const state = reactive({ count: 0 }) // 禁止！
```

## 2. 函数定义规范

```vue
<script setup lang="ts">
// ✅ 方法定义：使用 function 声明
function handleClick() {
  console.log('clicked')
}

function handleSubmit(data: FormData) {
  // ...
}

// ✅ 回调函数：使用箭头函数
const doubled = items.map(item => item.value * 2)
watch(() => count.value, (newVal) => {
  console.log(newVal)
})

// ✅ 函数表达式：使用箭头函数
const add = (a: number, b: number): number => a + b
```

## 3. 组件命名规范

```
✅ 正确：
- UserManagement.vue (至少两个单词，PascalCase)
- EzButton.vue (二次封装组件，带 Ez 前缀)
- AppHeader.vue (布局组件)

❌ 禁止：
- index.vue (严禁使用)
- User.vue (单个单词)
- Header.vue (缺乏语义前缀)
```

## 4. Props 定义规范

```vue
<script setup lang="ts">
interface Props {
  title: string        // 必填
  count?: number       // 可选
  items: string[]      // 数组
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})
</script>
```

## 5. Emits 定义规范

```vue
<script setup lang="ts">
interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'submit', data: FormData): void
}

const emit = defineEmits<Emits>()
</script>
```

## 6. 类型安全（强制）

```typescript
// ❌ 禁止 any
function foo(data: any) { } // 禁止！

// ❌ 禁止 as 断言绕过类型
const value = response as User // 禁止！

// ✅ 正确：使用泛型、类型守卫、继承
function processData<T extends BaseModel>(data: T): T {
  return { ...data, processed: true }
}

function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'name' in data
}
```

## 7. 注释规范

```typescript
// ✅ 单行注释写在行尾
const avatar = computed(() => userStore.avatar || '') // 获取用户头像

// ✅ 只有复杂的多行说明才使用块注释
/**
 * 处理用户登录逻辑
 * 1. 验证表单数据
 * 2. 调用登录 API
 * 3. 保存 token
 */
```

## 8. Import 顺序

```typescript
// 1. Vue 相关
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

// 2. 第三方库
import { isEqual } from 'lodash-es'

// 3. 组件
import EzButton from '@/components/EzButton.vue'

// 4. Stores
import { useUserStore } from '@/stores/modules/user'

// 5. API
import { getUserInfo } from '@/api/user'

// 6. Types
import type { User } from '@/types/user'

// 7. Utils
import { formatDate } from '@/utils/date'
```

## 9. 模板规范

```vue
<template>
  <!-- ✅ 使用简写指令 -->
  <div v-if="visible" />
  <input v-model="inputValue" />
  <button @click="handleClick" />

  <!-- ❌ 避免复杂逻辑，移到 script 中 -->
  <!-- ❌ <div v-if="user && user.profile && user.profile.age > 18"> -->
</template>
```

## 10. 样式规范

```vue
<style scoped>
/* ✅ 优先使用 Tailwind utility classes */
/* 在 template 中直接写：<div class="flex items-center gap-4"> */

/* ❌ 严禁使用 @apply */
/* .my-class { @apply flex items-center; } // 禁止！ */

/* ✅ 复杂样式使用 CSS 变量 */
.custom-button {
  background-color: var(--color-primary);
  transition: background-color 0.2s;
}
</style>
```

---

**生成任何 Vue 代码时，必须遵守以上规范！**
