<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserInfoStore } from '@/stores/modules/user'
import { message } from '@/hooks/useMessagehook'

const userStore = useUserInfoStore()

// 初始化表单，仅包含用户名和昵称
const form = reactive({
  username: userStore.userInfo.username || '',
  nickname: userStore.userInfo.nickname || '',
  avatar: userStore.userInfo.avatar || '',
})
const isEditing = ref(false)

const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 16, message: '昵称长度为2-16个字符', trigger: 'blur' },
  ],
}

// n-form 实例
const formRef = ref()

// 保存
const handleSave = async () => {
  await formRef.value?.validate()
  // 实际业务中此处应有后端 API
  userStore.userInfo = {
    ...userStore.userInfo,
    ...form,
  }
  message.success('资料已保存')
  isEditing.value = false
}

// 取消
const handleCancel = () => {
  form.nickname = userStore.userInfo.nickname || ''
  form.avatar = userStore.userInfo.avatar || ''
  isEditing.value = false
}
</script>

<template>
  <div class="max-w-xl mx-auto py-12">
    <n-card title="个人资料" bordered>
      <div class="flex flex-col items-center mb-8">
        <n-avatar :size="80" class="mb-3" :src="form.avatar" />
        <div v-if="isEditing" class="mb-2">
          <n-input placeholder="头像链接" v-model:value="form.avatar" style="width: 220px" />
        </div>
      </div>
      <n-form ref="formRef" :model="form" :rules="rules" label-width="80">
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="form.username" disabled />
        </n-form-item>
        <n-form-item label="昵称" path="nickname">
          <n-input v-model:value="form.nickname" :disabled="!isEditing" />
        </n-form-item>
        <n-form-item>
          <n-space>
            <n-button v-if="!isEditing" type="primary" @click="isEditing = true">编辑</n-button>
            <n-button v-if="isEditing" type="primary" @click="handleSave">保存</n-button>
            <n-button v-if="isEditing" @click="handleCancel">取消</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>
