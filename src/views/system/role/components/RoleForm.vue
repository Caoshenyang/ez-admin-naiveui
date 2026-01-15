<script setup lang="ts">
import { reactive, watch } from 'vue'
import { NForm, NFormItem, NInput, NSwitch, NTree } from 'naive-ui'
import { useFormModal } from '@/composables/useForm'
import { getMenuTree } from '@/api'

const emit = defineEmits<{
  (e: 'submit', data: any, mode: 'add' | 'edit'): void
}>()

const {
  formRef,
  formData,
  loading,
  visible,
  title,
  mode,
  handleAdd,
  handleEdit,
  handleConfirm,
  handleCancel
} = useFormModal({
  name: '',
  code: '',
  description: '',
  permissionIds: [],
  status: true
})

// 表单验证规则
const rules = {
  name: {
    required: true,
    message: '请输入角色名称',
    trigger: 'blur'
  },
  code: {
    required: true,
    message: '请输入角色编码',
    trigger: 'blur'
  }
}

// 菜单树数据
const menuTree = ref<any[]>([])
const checkedKeys = ref<any[]>([])
const menuTreeData = ref<any[]>([] as any[])

// 加载菜单树
async function loadMenuTree() {
  try {
    const res = await getMenuTree()
    menuTreeData.value = transformToTreeData(res)
  } catch (error) {
    console.error('Load menu tree error:', error)
  }
}

// 转换为树形数据
function transformToTreeData(menus: any[]): any[] {
  return menus.map(menu => ({
    key: menu.id,
    label: menu.meta?.title || menu.name,
    children: menu.children ? transformToTreeData(menu.children) : undefined
  }))
}

// 监听对话框打开
watch(visible, val => {
  if (val) {
    loadMenuTree()
  }
})

// 监听编辑数据变化
watch(
  () => formData.permissionIds,
  val => {
    checkedKeys.value = val || []
  },
  { immediate: true }
)

// 监听选中变化
watch(checkedKeys, val => {
  formData.permissionIds = val
})

// 提交表单
async function handleSubmit() {
  await handleConfirm(async (data, mode) => {
    emit('submit', data, mode)
  })
}

// 暴露方法
defineExpose({
  handleAdd,
  handleEdit
})
</script>

<template>
  <n-modal v-model:show="visible" :title="title" preset="card" style="width: 600px">
    <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="80">
      <n-form-item label="角色名称" path="name">
        <n-input v-model:value="formData.name" placeholder="请输入角色名称" />
      </n-form-item>

      <n-form-item label="角色编码" path="code">
        <n-input v-model:value="formData.code" placeholder="请输入角色编码" />
      </n-form-item>

      <n-form-item label="描述" path="description">
        <n-input
          v-model:value="formData.description"
          type="textarea"
          placeholder="请输入描述"
          :rows="3"
        />
      </n-form-item>

      <n-form-item label="权限" path="permissionIds">
        <n-tree
          v-model:checked-keys="checkedKeys"
          :data="menuTreeData"
          checkable
          cascade
          :show-irrelevant-nodes="false"
        />
      </n-form-item>

      <n-form-item label="状态" path="status">
        <n-switch v-model:value="formData.status" />
      </n-form-item>
    </n-form>

    <template #footer>
      <n-space justify="end">
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" :loading="loading" @click="handleSubmit">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
