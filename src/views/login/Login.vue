<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { NCard, NForm, NFormItem, NInput, NButton, NSpace } from 'naive-ui'
import type { LoginParams } from '@/types/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const appTitle = import.meta.env.VITE_APP_TITLE || 'Easy Admin'
const loading = ref(false)
const formRef = ref()
const formValue = reactive<LoginParams>({
  username: '',
  password: ''
})
const formRules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    loading.value = true

    await authStore.login(formValue)

    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (error: any) {
    console.error('Login error:', error)
    if (error.message) {
      window.$message?.error(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>{{ $t('auth.login') }}</h1>
        <p>{{ appTitle }}</p>
      </div>

      <n-card>
        <n-form ref="formRef" :model="formValue" :rules="formRules" size="large">
          <n-form-item path="username" :label="$t('auth.username')">
            <n-input
              v-model:value="formValue.username"
              :placeholder="$t('auth.usernamePlaceholder')"
              @keyup.enter="handleSubmit"
            />
          </n-form-item>

          <n-form-item path="password" :label="$t('auth.password')">
            <n-input
              v-model:value="formValue.password"
              type="password"
              show-password-on="click"
              :placeholder="$t('auth.passwordPlaceholder')"
              @keyup.enter="handleSubmit"
            />
          </n-form-item>

          <n-form-item>
            <n-space vertical style="width: 100%">
              <n-button
                type="primary"
                block
                :loading="loading"
                @click="handleSubmit"
              >
                {{ $t('auth.login') }}
              </n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </n-card>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
  color: #fff;
}

.login-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
}

.login-header p {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}
</style>
