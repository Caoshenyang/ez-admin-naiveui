# Vue 3 开发最佳实践

> 本文档整理自 Vue 官方最佳实践，为团队开发提供统一的编码规范参考。

## 核心原则

- **保持状态可预测**：单一数据源，其他状态均由此派生
- **数据流显式化**：Props down, Events up（大部分场景）
- **优先使用小型、专注的组件**：易于测试、复用和维护
- **避免不必要的重渲染**：合理使用 computed 和 watch
- **可读性优先**：编写清晰、自文档化的代码

## 技术栈默认配置

- ✅ **Composition API**（而非 Options API）
- ✅ **`<script setup lang="ts">`** 语法
- ✅ **TypeScript** 类型支持
- ✅ **Pinia Setup Store** 模式

## 响应式系统

### 1. 优先使用 `ref`，避免 `reactive`

```ts
// ✅ 推荐
const count = ref(0)
const user = ref({ name: 'John' })

// ❌ 避免（容易丢失响应性）
const state = reactive({ count: 0 })
```

### 2. 访问 ref 值需要 `.value`

```ts
const count = ref(0)

console.log(count.value) // ✅ 在脚本中需要 .value
// 模板中自动解包：<template>{{ count }}</template>
```

### 3. 避免解构 reactive 对象

```ts
const state = reactive({ count: 0, name: 'John' })

// ❌ 响应性丢失
const { count, name } = state

// ✅ 使用 toRefs
const { count, name } = toRefs(state)
```

### 4. computed vs watch

```ts
// ✅ 优先使用 computed 派生状态
const doubled = computed(() => count.value * 2)

// ❌ 避免在 computed 中产生副作用
const doubled = computed(() => {
  console.log('side effect') // 不要这样做
  return count.value * 2
})

// ✅ 副作用使用 watch
watch(count, (newVal) => {
  console.log('count changed:', newVal)
})
```

## 组件开发

### 1. 组件命名

```vue
<!-- ✅ 推荐：多单词、PascalCase -->
<UserManagement.vue>
<AppHeader.vue>

<!-- ❌ 避免：单单词 -->
<Header.vue>
<Menu.vue>

<!-- ✅ 二次封装组件加 Ez 前缀 -->
<EzButton.vue>
<EzTable.vue>
```

### 2. Props 和 Emits

```vue
<script setup lang="ts">
// ✅ 使用类型声明定义 props
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// ✅ 使用类型声明定义 emits
interface Emits {
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
}

const emit = defineEmits<Emits>()

// ✅ 事件命名使用 kebab-case（模板中）
emit('update', 'new value')
</script>

<template>
  <!-- ✅ 模板中监听事件使用 kebab-case -->
  <ChildComponent @update="handleUpdate" />
</template>
```

### 3. Props 是只读的

```ts
// ❌ 不要修改 props
function handleClick() {
  props.title = 'New Title' // 错误！
}

// ✅ 发出事件让父组件处理
function handleClick() {
  emit('update', 'New Title')
}
```

## 模板语法

### 1. v-if 和 v-for 不要混用

```vue
<!-- ❌ 错误：v-if 和 v-for 在同一元素 -->
<li v-for="item in items" v-if="item.visible">
  {{ item.name }}
</li>

<!-- ✅ 正确：使用 computed 过滤 -->
<script setup>
const visibleItems = computed(() =>
  items.filter(item => item.visible)
)
</script>

<template>
  <li v-for="item in visibleItems" :key="item.id">
    {{ item.name }}
  </li>
</template>
```

### 2. 列表渲染必须使用 key

```vue
<!-- ✅ 始终为 v-for 添加唯一的 key -->
<li v-for="item in items" :key="item.id">
  {{ item.name }}
</li>

<!-- ❌ 不要使用 index 作为 key（列表会变动时） -->
<li v-for="(item, index) in items" :key="index">
```

### 3. v-if vs v-show

```vue
<!-- ✅ 切换频繁时使用 v-show（CSS 切换） -->
<div v-show="isVisible">Content</div>

<!-- ✅ 条件很少改变时使用 v-if（真正的条件渲染） -->
<div v-if="isVisible">Content</div>
```

## 生命周期

### 1. 同步注册

```ts
// ✅ 生命周期钩子必须同步注册
onMounted(() => {
  console.log('mounted')
})

// ❌ 不要在异步回调中注册
setTimeout(() => {
  onMounted(() => {}) // 错误！不会执行
}, 100)
```

### 2. 访问 DOM

```ts
const elRef = ref<HTMLElement>()

// ✅ 使用 onMounted 访问 DOM
onMounted(() => {
  console.log(elRef.value) // DOM 已挂载
})
```

## Composables

### 1. 命名规范

```ts
// ✅ Composables 以 "use" 开头
// useUser.ts
export function useUser() {
  const user = ref<User | null>(null)

  return { user }
}

// 使用
const { user } = useUser()
```

### 2. 返回响应式引用

```ts
// ✅ 返回 ref/computed
export function useCounter() {
  const count = ref(0)
  const doubled = computed(() => count.value * 2)

  return { count, doubled }
}

// ❌ 避免返回 reactive（解构会丢失响应性）
export function useCounter() {
  const state = reactive({ count: 0 })
  return state // 解构时会丢失响应性
}
```

### 3. 参数使用 MaybeRef

```ts
// ✅ 接受 ref 或普通值
import { toValue } from 'vue'

export function useFetch(url: MaybeRef<string>) {
  const data = ref(null)

  watch(() => toValue(url), (newUrl) => {
    fetch(newUrl).then(res => data.value = res)
  }, { immediate: true })

  return { data }
}

// 使用
const { data } = useFetch('/api/users') // 普通值
const url = ref('/api/users')
const { data } = useFetch(url) // ref
```

## Pinia Store

### 1. 使用 Setup Store 模式

```ts
// stores/modules/user.ts
export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)

  // Computed
  const isLoggedIn = computed(() => !!user.value)

  // Actions
  function setUser(newUser: User) {
    user.value = newUser
  }

  function logout() {
    user.value = null
  }

  return {
    user,
    isLoggedIn,
    setUser,
    logout
  }
})
```

### 2. 返回所有状态

```ts
export const useAppStore = defineStore('app', () => {
  const theme = ref('light')
  const count = ref(0)

  // ✅ 必须返回所有状态
  return {
    theme,
    count
  }
})
```

### 3. 避免解构 Store

```ts
const appStore = useAppStore()

// ❌ 响应性丢失
const { theme, count } = appStore

// ✅ 使用 storeToRefs
import { storeToRefs } from 'pinia'
const { theme, count } = storeToRefs(appStore)

// ✅ actions 可以直接解构
const { setTheme } = appStore
```

## TypeScript

### 1. defineProps 类型声明

```vue
<script setup lang="ts">
// ✅ 使用接口定义 props
interface Props {
  title: string
  count?: number
}

const props = defineProps<Props>()
</script>
```

### 2. 模板引用类型

```ts
// ✅ 正确的类型声明
const inputRef = ref<HTMLInputElement>()
const componentRef = ref<InstanceType<typeof MyComponent>>()

onMounted(() => {
  inputRef.value?.focus()
})
```

### 3. provide/inject 类型安全

```ts
// key.ts
export const ThemeKey = Symbol('theme')

// provider
provide(ThemeKey, ref('dark'))

// inject
const theme = inject<Ref<string>>(ThemeKey)!
```

## 性能优化

### 1. 大列表虚拟滚动

```vue
<!-- 使用虚拟滚动库（如 vue-virtual-scroller） -->
<RecycleScroller
  :items="largeList"
  :item-size="50"
  key-field="id"
>
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
</RecycleScroller>
```

### 2. 静态内容提升

```vue
<!-- ✅ 使用 v-once 只渲染一次 -->
<div v-once>
  <h1>{{ title }}</h1>
  <p>{{ staticContent }}</p>
</div>

<!-- ✅ 使用 v-memo 缓存复杂子树 -->
<div v-memo="[valueA, valueB]">
  ...
</div>
```

### 3. 计算属性缓存

```vue
<script setup>
// ✅ computed 有缓存，只在依赖变化时重新计算
const expensiveValue = computed(() => {
  return heavyCalculation(baseValue.value)
})

// ❌ 方法每次渲染都会执行
function getExpensiveValue() {
  return heavyCalculation(baseValue.value)
}
</script>

<template>
  <!-- ✅ 使用 computed -->
  <div>{{ expensiveValue }}</div>

  <!-- ❌ 避免在模板中调用方法 -->
  <div>{{ getExpensiveValue() }}</div>
</template>
```

## 样式最佳实践

### 1. Scoped CSS

```vue
<style scoped>
/* ✅ 组件作用域样式 */
.header {
  background: var(--color-primary);
}

/* ✅ 深度选择器（修改子组件样式） */
:deep(.child-selector) {
  color: red;
}
</style>
```

### 2. 动态样式

```vue
<script setup>
const isActive = ref(true)
const color = ref('red')
</script>

<template>
  <!-- ✅ 使用对象/数组语法 -->
  <div :class="{ active: isActive }"></div>
  <div :class="[isActive ? 'active' : '']"></div>

  <!-- ✅ 复杂逻辑使用 computed -->
  <div :class="classObject"></div>

  <!-- ✅ 动态样式使用对象语法 -->
  <div :style="{ color: color, fontSize: '16px' }"></div>
</template>
```

## 常见陷阱

### 1. ref 在数组/集合中

```ts
const items = ref([1, 2, 3])

// ❌ 错误
items.value[0] = 10 // 不会触发更新

// ✅ 正确
items.value = [...items.value.slice(0, 0), 10, ...items.value.slice(1)]

// ✅ 或使用数组方法
items.value.splice(0, 1, 10)
```

### 2. watch 陷阱

```ts
// ✅ 监听 reactive 属性需要 getter 函数
watch(() => state.count, (newVal) => {})

// ✅ 深度监听 ref
watch(user, (newVal) => {}, { deep: true })

// ✅ 监听多个值
watch([count, name], ([newCount, newName]) => {})
```

### 3. 异步依赖追踪

```ts
// ❌ await 后的依赖不会被追踪
watchEffect(async () => {
  const data = await fetch(value.value) // ✅ value 被追踪
  const result = await process(data) // ❌ process 中的依赖不会被追踪
})

// ✅ 使用 watch 明确指定依赖
watch(value, async (newVal) => {
  const data = await fetch(newVal)
  const result = await process(data)
})
```

## 参考资料

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Composition API FAQ](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [Style Guide](https://cn.vuejs.org/style-guide/)
- [Reactivity Fundamentals](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)
