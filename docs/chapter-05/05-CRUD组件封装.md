# 5.5 CRUD 组件封装

## 本节目标

- ✅ 封装完整的 CRUD 组件
- ✅ 集成 EzTable、EzForm、EzModal
- ✅ 实现增删改查功能

---

## 1. 组件设计

CRUD 组件整合了 EzTable、EzForm 和 EzModal，提供完整的增删改查功能。

---

## 2. EzCRUD 组件

**src/components/EzCRUD.vue**:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import EzTable from './EzTable.vue'
import EzForm from './EzForm.vue'
import EzModal from './EzModal.vue'
import type { TableColumn, FormSchema } from '@/types'

interface Props {
  /** 表格列配置 */
  columns: TableColumn[]
  /** 表单配置 */
  formSchema: FormSchema
  /** API 方法 */
  api: {
    list: (params: any) => Promise<any>
    create: (data: any) => Promise<any>
    update: (id: any, data: any) => Promise<any>
    delete: (id: any) => Promise<any>
  }
}

const props = defineProps<Props>()

const data = ref([])
const loading = ref(false)
const modalVisible = ref(false)
const formData = ref({})
const editingId = ref<number | null>(null)

/**
 * 获取列表
 */
const fetchList = async () => {
  loading.value = true
  try {
    const res = await props.api.list({})
    data.value = res.items
  } finally {
    loading.value = false
  }
}

/**
 * 新增
 */
const handleAdd = () => {
  editingId.value = null
  formData.value = {}
  modalVisible.value = true
}

/**
 * 编辑
 */
const handleEdit = (row: any) => {
  editingId.value = row.id
  formData.value = { ...row }
  modalVisible.value = true
}

/**
 * 删除
 */
const handleDelete = async (row: any) => {
  await props.api.delete(row.id)
  fetchList()
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (editingId.value) {
    await props.api.update(editingId.value, formData.value)
  } else {
    await props.api.create(formData.value)
  }
  modalVisible.value = false
  fetchList()
}

// 初始化
fetchList()
</script>

<template>
  <div class="ez-crud">
    <div class="mb-4 flex justify-end">
      <n-button type="primary" @click="handleAdd">新增</n-button>
    </div>

    <EzTable :columns="columns" :data="data" :loading="loading">
      <template #actions="{ row }">
        <n-button size="small" @click="handleEdit(row)">编辑</n-button>
        <n-button size="small" type="error" @click="handleDelete(row)">
          删除
        </n-button>
      </template>
    </EzTable>

    <EzModal v-model:visible="modalVisible" :title="editingId ? '编辑' : '新增'" @ok="handleSubmit">
      <EzForm :schema="formSchema" v-model="formData" />
    </EzModal>
  </div>
</template>
```

---

## 3. 使用示例

```vue
<script setup lang="ts">
import EzCRUD from '@/components/EzCRUD.vue'

const columns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
]

const formSchema = {
  items: [
    { prop: 'name', label: '姓名', type: 'input' },
    { prop: 'email', label: '邮箱', type: 'input' },
  ],
}

const api = {
  list: (params) => request.get('/users', { params }),
  create: (data) => request.post('/users', data),
  update: (id, data) => request.put(`/users/${id}`, data),
  delete: (id) => request.delete(`/users/${id}`),
}
</script>

<template>
  <EzCRUD :columns="columns" :form-schema="formSchema" :api="api" />
</template>
```

---

## 4. 本节小结

✅ 完成的工作：
- 封装了完整的 CRUD 组件
- 整合了表单、表格、弹窗
- 实现了增删改查功能

**下一步**: [5.6 布局组件封装](./06-布局组件封装.md)
