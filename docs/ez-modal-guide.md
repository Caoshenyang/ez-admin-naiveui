# EzModal 弹窗组件使用指南

## 组件概述

`EzModal` 是基于 NaiveUI Modal 的极简封装，提供更简洁的 API 和更好的开发体验。

### 设计理念

- ✅ **零学习成本**：完全兼容 NaiveUI Modal API
- ✅ **最小封装**：只添加常用配置，透传所有原生功能
- ✅ **类型安全**：完整的 TypeScript 类型支持
- ✅ **易于维护**：代码量极小，只有 150 行
- ✅ **简洁易用**：预设常用配置，减少样板代码

### 核心特性

- ✅ **完全透传**：使用 `$attrs` 透传所有 NaiveUI Modal 的 props
- ✅ **尺寸预设**：内置 small/medium/large/huge 四种尺寸
- ✅ **操作按钮**：内置确认和取消按钮配置
- ✅ **插槽支持**：支持自定义头部、内容和操作区域
- ✅ **v-model 支持**：双向绑定显示状态

---

## 技术实现

### 类型方案：使用 `$attrs` 透传

EzTable 不继承 NaiveUI 的 ModalProps 类型，而是只定义自己的常用配置，其他所有 props 通过 `$attrs` 透传。

#### 实际代码（`src/components/EzModal.vue`）

```vue
<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { NModal } from 'naive-ui'
import type { EzModalEmits, EzModalProps } from '@/types/modal'

interface Props extends EzModalProps {
  title?: string
  show?: boolean
  width?: string | number
  size?: 'small' | 'medium' | 'large' | 'huge'
  maskClosable?: boolean
  closable?: boolean
  positiveText?: string
  negativeText?: string
  showAction?: boolean
  positiveType?: 'default' | 'tertiary' | 'success' | 'warning' | 'error'
  negativeType?: 'default' | 'tertiary' | 'success' | 'warning' | 'error'
  class?: string
  style?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  maskClosable: true,
  closable: true,
  positiveText: '确定',
  negativeText: '取消',
  showAction: true,
  positiveType: 'success',
  negativeType: 'default',
})

const emit = defineEmits<EzModalEmits>()

const innerShow = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value),
})

const modalStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = { ...props.style }
  const sizeWidthMap: Record<string, string> = {
    small: '400px',
    medium: '600px',
    large: '800px',
    huge: '1200px',
  }

  if (props.size && !props.width) {
    style.width = sizeWidthMap[props.size]
  } else if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  return style
})
</script>

<template>
  <n-modal
    v-model:show="innerShow"
    :style="modalStyle"
    :mask-closable="maskClosable"
    :closable="closable"
    v-bind="$attrs"
    :class="props.class"
    preset="card"
    :title="title"
    :positive-text="showAction ? positiveText : undefined"
    :negative-text="showAction ? negativeText : undefined"
    :positive-button-props="{ type: positiveType as any }"
    :negative-button-props="{ type: negativeType as any }"
    @positive-click="emit('positiveClick')"
    @negative-click="emit('negativeClick')"
    @close="emit('close')"
  >
    <slot />
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots.action" #action>
      <slot name="action" />
    </template>
    <template v-if="$slots.close" #close>
      <slot name="close" />
    </template>
  </n-modal>
</template>
```

---

## API 文档

### EzModal Props

EzModal 定义了常用的配置 props，其他所有 NaiveUI Modal 的 props 通过 `$attrs` 透传。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `show` | `boolean` | `false` | 是否显示弹窗（v-model） |
| `title` | `string` | - | 弹窗标题 |
| `width` | `string \| number` | - | 弹窗宽度 |
| `size` | `'small' \| 'medium' \| 'large' \| 'huge'` | - | 弹窗尺寸预设 |
| `maskClosable` | `boolean` | `true` | 是否显示遮罩点击关闭 |
| `closable` | `boolean` | `true` | 是否显示关闭图标 |
| `positiveText` | `string` | `'确定'` | 确认按钮文本 |
| `negativeText` | `string` | `'取消'` | 取消按钮文本 |
| `showAction` | `boolean` | `true` | 是否显示底部操作按钮 |
| `positiveType` | `'default' \| 'tertiary' \| 'success' \| 'warning' \| 'error'` | `'success'` | 确认按钮类型 |
| `negativeType` | `'default' \| 'tertiary' \| 'success' \| 'warning' \| 'error'` | `'default'` | 取消按钮类型 |
| `class` | `string` | - | 弹窗容器类名 |
| `style` | `Record<string, string>` | - | 弹窗容器样式 |

### EzModal Emits

| 事件 | 参数 | 说明 |
|------|------|------|
| `update:show` | `value: boolean` | 显示状态变化事件 |
| `positiveClick` | - | 确认按钮点击事件 |
| `negativeClick` | - | 取消按钮点击事件 |
| `close` | - | 弹窗关闭事件 |

### EzModal Slots

| 插槽名 | 说明 |
|--------|------|
| `default` | 弹窗主体内容 |
| `header` | 自定义头部 |
| `action` | 自定义操作按钮 |
| `close` | 自定义关闭图标 |

---

## 快速开始

### 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import EzModal from '@/components/EzModal.vue'

const showModal = ref(false)

const handleConfirm = () => {
  console.log('确认')
  showModal.value = false
}
</script>

<template>
  <div>
    <button @click="showModal = true">打开弹窗</button>

    <EzModal v-model:show="showModal" title="提示" @positive-click="handleConfirm">
      <p>这是一个基础弹窗</p>
    </EzModal>
  </div>
</template>
```

### 确认弹窗

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import EzModal from '@/components/EzModal.vue'

const message = useMessage()
const showConfirm = ref(false)

const handleConfirm = () => {
  message.warning('删除成功')
  showConfirm.value = false
}

const handleCancel = () => {
  message.info('已取消')
}
</script>

<template>
  <EzModal
    v-model:show="showConfirm"
    title="确认删除"
    positive-text="删除"
    negative-text="取消"
    positive-type="error"
    @positive-click="handleConfirm"
    @negative-click="handleCancel"
  >
    <p class="text-red-600">删除后数据将无法恢复，确定要删除吗？</p>
  </EzModal>
</template>
```

### 不同尺寸

```vue
<template>
  <!-- 小尺寸 (400px) -->
  <EzModal v-model:show="showSmall" title="小尺寸" size="small">
    <p>宽度: 400px</p>
  </EzModal>

  <!-- 中尺寸 (600px) -->
  <EzModal v-model:show="showMedium" title="中尺寸" size="medium">
    <p>宽度: 600px</p>
  </EzModal>

  <!-- 大尺寸 (800px) -->
  <EzModal v-model:show="showLarge" title="大尺寸" size="large">
    <p>宽度: 800px</p>
  </EzModal>

  <!-- 超大尺寸 (1200px) -->
  <EzModal v-model:show="showHuge" title="超大尺寸" size="huge">
    <p>宽度: 1200px</p>
  </EzModal>

  <!-- 自定义宽度 -->
  <EzModal v-model:show="showCustom" title="自定义宽度" width="500px">
    <p>宽度: 500px</p>
  </EzModal>
</template>
```

### 表单弹窗

```vue
<script setup lang="ts">
import { ref } from 'vue'
import EzModal from '@/components/EzModal.vue'
import EzForm from '@/components/EzForm.vue'
import type { FormOptions } from '@/types/form'

const showFormModal = ref(false)

const formOptions: FormOptions = {
  layout: 'horizontal',
  labelWidth: 80,
  items: [
    {
      field: 'name',
      label: '用户名',
      type: 'input',
      placeholder: '请输入用户名',
      rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    },
    {
      field: 'email',
      label: '邮箱',
      type: 'input',
      placeholder: '请输入邮箱',
      rules: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
    },
  ],
}

const handleFormSubmit = (values: Record<string, unknown>) => {
  console.log('提交:', values)
  showFormModal.value = false
}
</script>

<template>
  <EzModal v-model:show="showFormModal" title="新建用户" width="600px">
    <EzForm
      :options="formOptions"
      :show-actions="false"
      @submit="handleFormSubmit"
    />
    <template #action>
      <NSpace>
        <NButton @click="showFormModal = false">取消</NButton>
        <NButton type="primary" @click="formRef?.validate()">确定</NButton>
      </NSpace>
    </template>
  </EzModal>
</template>
```

### 禁止关闭弹窗

```vue
<template>
  <EzModal
    v-model:show="showForce"
    title="重要提示"
    :mask-closable="false"
    :closable="false"
  >
    <p>此弹窗必须做出选择才能关闭</p>
  </EzModal>
</template>
```

### 自定义操作按钮

```vue
<template>
  <EzModal v-model:show="showCustom" title="自定义操作" :show-action="false">
    <p>使用自定义操作按钮</p>
    <template #action>
      <NSpace>
        <NButton>保存草稿</NButton>
        <NButton type="primary">发布</NButton>
      </NSpace>
    </template>
  </EzModal>
</template>
```

---

## 完整示例

**文件位置**：`src/views/examples/components/ModalExample.vue`

该示例包含：
- ✅ 基础弹窗
- ✅ 确认弹窗
- ✅ 表单弹窗
- ✅ 自定义内容弹窗
- ✅ 异步操作弹窗
- ✅ 禁止关闭弹窗
- ✅ 不同尺寸弹窗
- ✅ 自定义样式弹窗

访问路径：`/examples/modal`

---

## 最佳实践

### 1. 使用 v-model 控制显示状态

```vue
<script setup lang="ts">
const showModal = ref(false)
</script>

<template>
  <EzModal v-model:show="showModal" title="提示">
    <p>内容</p>
  </EzModal>
</template>
```

### 2. 确认弹窗使用 error 类型

```vue
<template>
  <EzModal
    v-model:show="showConfirm"
    title="确认删除"
    positive-text="删除"
    positive-type="error"
  >
    <p class="text-red-600">删除后无法恢复</p>
  </EzModal>
</template>
```

### 3. 异步操作显示 loading

```vue
<script setup lang="ts">
const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  await asyncOperation()
  loading.value = false
  showModal.value = false
}
</script>

<template>
  <EzModal
    v-model:show="showModal"
    :loading="loading"
    @positive-click="handleSubmit"
  >
    <p>正在处理...</p>
  </EzModal>
</template>
```

### 4. 表单弹窗隐藏默认按钮

```vue
<template>
  <EzModal v-model:show="showModal" title="表单" :show-action="false">
    <EzForm :options="formOptions" :show-actions="false" />
    <template #action>
      <NSpace>
        <NButton @click="showModal = false">取消</NButton>
        <NButton type="primary" @click="handleSubmit">提交</NButton>
      </NSpace>
    </template>
  </EzModal>
</template>
```

---

## 与 NaiveUI Modal 的区别

### EzModal 的改进

1. **更简洁的 API**：
   ```vue
   <!-- EzModal -->
   <EzModal v-model:show="show" title="标题" size="medium">
     内容
   </EzModal>

   <!-- NaiveUI Modal -->
   <n-modal v-model:show="show" :style="{ width: '600px' }">
     <n-card title="标题" :bordered="false" role="dialog">
       内容
     </n-card>
   </n-modal>
   ```

2. **内置操作按钮**：
   - EzModal 内置确认和取消按钮配置
   - 支持自定义按钮文本和类型
   - 可通过 `showAction` 控制显示

3. **尺寸预设**：
   - `small`: 400px
   - `medium`: 600px
   - `large`: 800px
   - `huge`: 1200px

4. **完全透传**：
   - 所有 NaiveUI Modal 的 props 都支持
   - 所有 NaiveUI Modal 的事件都支持
   - 所有 NaiveUI Modal 的插槽都支持

---

## 常见问题

### Q1: EzModal 和 NaiveUI Modal 有什么区别？

A: EzModal 是 NaiveUI Modal 的极简封装，提供了更简洁的 API 和常用配置（如尺寸预设、操作按钮等），同时完全兼容 NaiveUI Modal 的所有功能。

### Q2: 如何自定义操作按钮？

A: 使用 `show-action="false"` 隐藏默认按钮，然后通过 `action` 插槽自定义。

### Q3: 如何实现异步提交？

A: 在 `positive-click` 事件中执行异步操作，使用 `loading` prop 显示加载状态。

### Q4: 如何禁止弹窗关闭？

A: 设置 `:mask-closable="false"` 和 `:closable="false"`。

---

## 相关文件

- **主组件**：`src/components/EzModal.vue` (150 行)
- **类型定义**：`src/types/modal.ts` (75 行)
- **完整示例**：`src/views/examples/components/ModalExample.vue` (450 行)
