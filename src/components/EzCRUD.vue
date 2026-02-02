<script setup lang="ts" generic="T extends Record<string, unknown>">
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import EzTable from './EzTable.vue'
import EzForm from './EzForm.vue'
import EzModal from './EzModal.vue'
import type { TableColumn } from 'naive-ui/es/data-table/src/interface'
import type { FormOptions, FormValues } from '@/types/form'

/**
 * 定义 API 接口的严格规范
 */
interface CrudApi<T> {
  list: (params: Record<string, unknown>) => Promise<{ items: T[]; total?: number } | T[]>
  create: (data: Record<string, unknown>) => Promise<T>
  update: (id: string | number, data: Record<string, unknown>) => Promise<T>
  delete: (id: string | number) => Promise<void>
}

interface Props<T> {
  title: string
  columns: TableColumn[]
  formSchema: FormOptions
  searchSchema?: FormOptions
  api: CrudApi<T>
}

const props = defineProps<Props<T>>()
const message = useMessage()

// --- 严格类型化的状态 ---
const data = ref<T[]>([]) as Ref<T[]>
const loading = ref(false)
const submitLoading = ref(false)
const modalVisible = ref(false)

// 编辑中的 ID，明确其可能的类型
const editingId = ref<string | number | null>(null)

// 表单数据，使用 FormValues 类型以兼容 EzForm 组件
const formData = ref<FormValues>({})
const searchParams = ref<FormValues>({})

/**
 * 获取列表：处理 Record<string, unknown> 类型的参数
 */
const fetchList = async (): Promise<void> => {
  loading.value = true
  try {
    const res = await props.api.list(searchParams.value)
    // 根据返回结构进行守卫
    if (Array.isArray(res)) {
      data.value = res
    } else {
      data.value = res.items
    }
  } catch {
    message.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

/**
 * 处理新增
 */
const handleAdd = (): void => {
  editingId.value = null
  formData.value = {}
  modalVisible.value = true
}

/**
 * 处理编辑：row 来自表格数据，类型安全由 formSchema 保证
 */
const handleEdit = (row: Record<string, unknown>): void => {
  const id = row.id
  if (id === undefined) return
  // 使用类型守卫确保 id 是 string 或 number
  if (typeof id !== 'string' && typeof id !== 'number') return
  editingId.value = id
  formData.value = { ...row }
  modalVisible.value = true
}

/**
 * 处理删除
 */
const handleDelete = async (id: string | number | undefined): Promise<void> => {
  if (id === undefined) return
  try {
    await props.api.delete(id)
    message.success('删除成功')
    await fetchList()
  } catch {
    message.error('删除操作失败')
  }
}

/**
 * 处理提交
 */
const handleSubmit = async (): Promise<void> => {
  submitLoading.value = true
  try {
    if (editingId.value !== null) {
      await props.api.update(editingId.value, formData.value)
      message.success('更新成功')
    } else {
      await props.api.create(formData.value)
      message.success('创建成功')
    }
    modalVisible.value = false
    await fetchList()
  } catch {
    message.error('保存失败')
  } finally {
    submitLoading.value = false
  }
}

/**
 * 处理重置搜索
 */
const handleReset = (): void => {
  searchParams.value = {}
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<template>
  <div class="ez-crud p-4">
    <div v-if="searchSchema" class="mb-4 p-4 border rounded-md border-gray-200">
      <n-space align="center">
        <EzForm :options="searchSchema" v-model="searchParams" />
        <n-button type="primary" @click="fetchList">查询</n-button>
        <n-button @click="handleReset">重置</n-button>
      </n-space>
    </div>

    <div class="mb-4 flex justify-between">
      <h2 class="text-xl font-medium">{{ title }}管理</h2>
      <n-button type="primary" @click="handleAdd">新增{{ title }}</n-button>
    </div>

    <EzTable :columns="columns" :data="data" :loading="loading">
      <template #actions="{ row }">
        <n-space>
          <n-button size="small" @click="handleEdit(row)">编辑</n-button>
          <n-popconfirm @positive-click="handleDelete(row.id)">
            <template #trigger>
              <n-button size="small" type="error">删除</n-button>
            </template>
            确认删除此条目？
          </n-popconfirm>
        </n-space>
      </template>
    </EzTable>

    <EzModal
      v-model:visible="modalVisible"
      :title="(editingId ? '编辑' : '新增') + title"
      :loading="submitLoading"
      @ok="handleSubmit"
    >
      <EzForm :options="formSchema" v-model="formData" />
    </EzModal>
  </div>
</template>
