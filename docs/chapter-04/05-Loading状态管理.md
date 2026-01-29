# 4.5 Loading 状态管理

## 本节目标

- ✅ 实现 Loading 状态管理
- ✅ 请求时自动显示 Loading
- ✅ 防止重复提交

---

## 1. Loading Store

**src/stores/loading.ts**:

```typescript
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    loading: false,
    count: 0,
  }),

  getters: {
    isLoading: (state) => state.loading && state.count > 0,
  },

  actions: {
    show() {
      this.count++
      this.loading = true
    },

    hide() {
      this.count--
      if (this.count <= 0) {
        this.count = 0
        this.loading = false
      }
    },

    reset() {
      this.count = 0
      this.loading = false
    },
  },
})
```

---

## 2. 全局 Loading 组件

**src/components/GlobalLoading.vue**:

```vue
<template>
  <n-spin :show="loadingStore.isLoading">
    <slot />
  </n-spin>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading'

const loadingStore = useLoadingStore()
</script>
```

---

## 3. 集成到请求

**src/utils/request.ts**:

```typescript
import { useLoadingStore } from '@/stores/loading'

service.interceptors.request.use((config) => {
  if (config.showLoading !== false) {
    loadingStore.show()
  }
  return config
})

service.interceptors.response.use(
  (response) => {
    if (response.config.showLoading !== false) {
      loadingStore.hide()
    }
    return response
  },
  (error) => {
    if (error.config?.showLoading !== false) {
      loadingStore.hide()
    }
    throw error
  }
)
```

---

## 4. 防重复提交

**src/composables/useDebounceSubmit.ts**:

```typescript
import { ref } from 'vue'

export function useDebounceSubmit() {
  const submitting = ref(false)

  const submit = async (fn: () => Promise<any>) => {
    if (submitting.value) return

    submitting.value = true
    try {
      await fn()
    } finally {
      submitting.value = false
    }
  }

  return { submit, submitting }
}
```

使用：
```vue
<script setup lang="ts">
import { useDebounceSubmit } from '@/composables/useDebounceSubmit'

const { submit, submitting } = useDebounceSubmit()

const handleSubmit = async () => {
  await submit(async () => {
    await form.submit()
    message.success('提交成功')
  })
}
</script>

<template>
  <n-button :loading="submitting" @click="handleSubmit">
    提交
  </n-button>
</template>
```

---

## 5. 本节小结

✅ 完成的工作：
- 实现了 Loading 状态管理
- 集成到请求拦截器
- 实现了防重复提交

**下一步**: [4.6 工具函数库封装](./06-工具函数库封装.md)
