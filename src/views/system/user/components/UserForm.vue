<script setup lang="ts">
import { reactive, watch } from 'vue'
import { NForm, NFormItem, NInput, NSelect, NSwitch } from 'naive-ui'
import { useFormModal } from '@/composables/useForm'
import { getAllRoles } from '@/api'

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
  username: '',
  nickname: '',
  password: '',
  email: '',
  phone: '',
  roleIds: [],
  status: true
})

// 表单验证规则
const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  nickname: {
    required: true,
    message: '请输入昵称',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }
}

// 角色选项
const roleOptions = ref<any[]>([])

// 加载角色列表
async function loadRoles() {
  try {
    const res = await getAllRoles()
    roleOptions.value = res.map((role: any) => ({
      label: role.name,
      value: role.id
    }))
  } catch (error) {
    console.error('Load roles error:', error)
  }
}

// 监听对话框打开，加载角色列表
watch(visible, val => {
  if (val) {
    loadRoles()
  }
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
      <n-form-item label="用户名" path="username">
        <n-input v-model:value="formData.username" placeholder="请输入用户名" :disabled="mode === 'edit'" />
      </n-form-item>

      <n-form-item label="昵称" path="nickname">
        <n-input v-model:value="formData.nickname" placeholder="请输入昵称" />
      </n-form-item>

      <n-form-item v-if="mode === 'add'" label="密码" path="password">
        <n-input v-model:value="formData.password" type="password" show-password-on="click" placeholder="请输入密码" />
      </n-form-item>

      <n-form-item label="邮箱" path="email">
        <n-input v-model:value="formData.email" placeholder="请输入邮箱" />
      </n-form-item>

      <n-form-item label="手机号" path="phone">
        <n-input v-model:value="formData.phone" placeholder="请输入手机号" />
      </n-form-item>

      <n-form-item label="角色" path="roleIds">
        <n-select
          v-model:value="formData.roleIds"
          :options="roleOptions"
          multiple
          placeholder="请选择角色"
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
