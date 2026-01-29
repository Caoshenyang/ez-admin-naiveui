# 5.4 EzModal 弹窗组件

## 本节目标

- ✅ 封装弹窗组件
- ✅ 支持多种尺寸
- ✅ 支持自定义内容

---

## 1. EzModal 组件

**src/components/EzModal.vue**:

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { NModal } from 'naive-ui'

interface Props {
  /** 是否显示 */
  visible: boolean
  /** 标题 */
  title?: string
  /** 宽度 */
  width?: string | number
  /** 确定按钮文字 */
  okText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 是否显示取消按钮 */
  showCancel?: boolean
  /** 是否显示确定按钮 */
  showOk?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '提示',
  width: 520,
  okText: '确定',
  cancelText: '取消',
  showCancel: true,
  showOk: true,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  ok: []
  cancel: []
}>()

const innerVisible = ref(false)

watch(
  () => props.visible,
  (val) => {
    innerVisible.value = val
  },
  { immediate: true }
)

watch(innerVisible, (val) => {
  emit('update:visible', val)
})

/**
 * 确定按钮
 */
const handleOk = () => {
  emit('ok')
  innerVisible.value = false
}

/**
 * 取消按钮
 */
const handleCancel = () => {
  emit('cancel')
  innerVisible.value = false
}
</script>

<template>
  <n-modal
    v-model:show="innerVisible"
    preset="card"
    :title="title"
    :style="{ width: typeof width === 'number' ? `${width}px` : width }"
  >
    <slot />

    <template #footer>
      <div class="flex justify-end gap-2">
        <n-button v-if="showCancel" @click="handleCancel">
          {{ cancelText }}
        </n-button>
        <n-button v-if="showOk" type="primary" @click="handleOk">
          {{ okText }}
        </n-button>
      </div>
    </template>
  </n-modal>
</template>
```

---

## 2. 使用示例

### 2.1 基础使用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import EzModal from '@/components/EzModal.vue'

const visible = ref(false)

const handleOk = () => {
  console.log('确定')
}
</script>

<template>
  <n-button @click="visible = true">打开弹窗</n-button>

  <EzModal v-model:visible="visible" title="提示" @ok="handleOk">
    <p>这是一个弹窗内容</p>
  </EzModal>
</template>
```

### 2.2 表单弹窗

```vue
<template>
  <EzModal v-model:visible="visible" title="新增用户" @ok="handleSubmit">
    <EzForm :schema="formSchema" v-model="formData" />
  </EzModal>
</template>
```

---

## 3. 组合式 API

**src/composables/useModal.ts**:

```typescript
import { ref } from 'vue'

export function useModal() {
  const visible = ref(false)

  const open = () => {
    visible.value = true
  }

  const close = () => {
    visible.value = false
  }

  return {
    visible,
    open,
    close,
  }
}
```

使用：
```vue
<script setup lang="ts">
import { useModal } from '@/composables/useModal'

const { visible, open, close } = useModal()
</script>

<template>
  <EzModal v-model:visible="visible" />
</template>
```

---

## 4. 本节小结

✅ 完成的工作：
- 封装了 EzModal 组件
- 支持多种配置
- 提供了组合式 API

**下一步**: [5.5 CRUD 组件封装](./05-CRUD组件封装.md)
